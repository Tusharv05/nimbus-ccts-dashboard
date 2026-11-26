'use client';

import React, { useState, useMemo } from 'react';
import { Header } from '../components/Header';
import { Scope2WarningBanner } from '../components/Scope2WarningBanner';
import { OverviewScreen } from '../components/OverviewScreen';
import { PlantsScreen } from '../components/PlantsScreen';
import { PhysicalScreen } from '../components/PhysicalScreen';
import { MethodSourcesScreen } from '../components/MethodSourcesScreen';
import { ExportScreen } from '../components/ExportScreen';
import { BenchmarkTargetModal, OfficialBenchmarkTarget } from '../components/BenchmarkTargetModal';
import { IEXHistoricalPriceModal } from '../components/IEXHistoricalPriceModal';
import { AllocationBasis, ModelAssumptions } from '../lib/types';
import { parseAndCalculatePlants } from '../lib/csvParser';
import { projectYears } from '../lib/calculator';

// Embedded plant CSV content ensuring rapid build-time availability and fallback
const DEFAULT_PLANT_CSV = "plant_id,plant_name,town,state,latitude,longitude,plant_type,cement_capacity_mtpa,cement_output_fy2025_26_mt,clinker_produced_fy2025_26_mt,clinker_shipped_fy2025_26_mt,scope1_co2_fy2025_26_kt,water_source,coastal,asset_value_inr_cr,revenue_fy2025_26_inr_cr,employees,notes\nP01,Nimbus Chittorgarh Works,Chittorgarh,Rajasthan,24.8887,74.6269,Integrated,4.0,3.30,3.43,1.12,3125,Groundwater,N,3200,1749,820,Captive limestone mine; 40 MW captive coal power plant (its emissions are in scope1); ships clinker to P07 by rail\nP02,Nimbus Satna Works,Satna,Madhya Pradesh,24.6005,80.8322,Integrated,3.5,2.85,2.05,0,1720,Reservoir,N,2700,1511,760,Captive limestone mine\nP03,Nimbus Chandrapur Works,Chandrapur,Maharashtra,19.9615,79.2961,Integrated,3.0,2.40,1.78,0,1510,River (Wardha),N,2300,1248,690,30 MW waste-heat recovery system\nP04,Nimbus Nalgonda Works,Nalgonda,Telangana,17.0575,79.2671,Integrated,2.5,1.85,1.22,0,1025,Groundwater,N,1800,999,540,\nP05,Nimbus Ariyalur Works,Ariyalur,Tamil Nadu,11.1401,79.0786,Integrated,2.0,1.55,1.12,0,1005,Groundwater,N,1500,868,480,Oldest kiln (1998)\nP06,Nimbus Baloda Bazar Works,Baloda Bazar,Chhattisgarh,21.6566,82.1606,Integrated,3.0,2.55,3.01,1.28,2470,Canal (Mahanadi system),N,2350,1275,700,Newest kiln (2022); ships clinker to P08 (0.68 Mt) and P09 (0.60 Mt)\nP07,Nimbus Mundra Grinding Unit,Mundra,Gujarat,22.8390,69.7219,Grinding unit,2.0,1.60,0,0,32,Desalinated seawater,Y,650,848,210,Gets 1.12 Mt clinker a year from P01 by rail\nP08,Nimbus Paradip Grinding Unit,Paradip,Odisha,20.3165,86.6114,Grinding unit,1.5,1.05,0,0,21,Municipal supply,Y,480,536,180,Gets 0.68 Mt clinker a year from P06; blends fly ash from nearby power plants\nP09,Nimbus Durgapur Grinding Unit,Durgapur,West Bengal,23.5204,87.3119,Grinding unit,1.5,1.20,0,0,24,River (Damodar),N,470,624,170,Gets 0.60 Mt clinker a year from P06; makes slag cement with steel slag\n";

const INITIAL_ASSUMPTIONS: ModelAssumptions = {
  integratedCutFY27Pct: 2.7,
  grindingCutFY27Pct: 6.6,
  annualTargetCutStepPts: 0.5,
  outputGrowthFromFY28Pct: 8.0,
  priceLowInr: 600,
  priceCentralInr: 1200,
  priceHighInr: 2400,
};

export default function Home() {
  const [activeScreen, setActiveScreen] = useState<string>('overview');
  const [allocationBasis, setAllocationBasis] = useState<AllocationBasis>('CCTS');
  const [assumptions, setAssumptions] = useState<ModelAssumptions>(INITIAL_ASSUMPTIONS);
  const [auditLog, setAuditLog] = useState<{ timestamp: string; field: string; prev: number; next: number }[]>([]);
  const [isBenchmarkModalOpen, setIsBenchmarkModalOpen] = useState(false);
  const [isIEXModalOpen, setIsIEXModalOpen] = useState(false);

  // Calculation memo
  const calculationData = useMemo(() => {
    return parseAndCalculatePlants(DEFAULT_PLANT_CSV, allocationBasis, assumptions);
  }, [allocationBasis, assumptions]);

  const projections = useMemo(() => {
    return projectYears(calculationData.plants, assumptions, calculationData.totalRevenueCr || 9658);
  }, [calculationData.plants, assumptions, calculationData.totalRevenueCr]);

  const handleUpdateAssumption = (key: keyof ModelAssumptions, value: number) => {
    const prev = assumptions[key];
    setAssumptions((old) => ({ ...old, [key]: value }));
    const timeStr = new Date().toLocaleTimeString('en-IN', { hour12: false });
    setAuditLog((prevLog) => [...prevLog, { timestamp: timeStr, field: key, prev, next: value }]);
  };

  const handleResetAssumptions = () => {
    setAssumptions(INITIAL_ASSUMPTIONS);
    const timeStr = new Date().toLocaleTimeString('en-IN', { hour12: false });
    setAuditLog((prevLog) => [...prevLog, { timestamp: timeStr, field: 'Reset defaults', prev: 0, next: 0 }]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF8]">
      <Header
        activeScreen={activeScreen}
        setActiveScreen={setActiveScreen}
        allocationBasis={allocationBasis}
        setAllocationBasis={setAllocationBasis}
        assumptionCount={4}
      />

      <main className="flex-1 max-w-[1240px] w-full mx-auto px-3 sm:px-4 py-4">
        {/* Scope 2 Mandatory Auditor Warning Banner */}
        <Scope2WarningBanner />

        {/* Validation Errors if any */}
        {calculationData.errors.length > 0 && (
          <div className="mb-4 p-3 bg-[#FCE8E6] border-l-4 border-[#C5221F] rounded-r text-xs">
            <h4 className="font-mono font-bold text-[#C5221F] uppercase">CSV Validation Report (Errors)</h4>
            <ul className="list-disc pl-5 mt-1 text-[#5C100E] space-y-0.5">
              {calculationData.errors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {/* 1. Executive Overview */}
        {activeScreen === 'overview' && (
          <OverviewScreen
            plants={calculationData.plants}
            projections={projections}
            assumptions={assumptions}
            companyRevenueCr={calculationData.totalRevenueCr || 9658}
          />
        )}

        {/* 2. Plant Compliance Breakdown */}
        {activeScreen === 'plants' && (
          <PlantsScreen
            plants={calculationData.plants}
            allocationBasis={allocationBasis}
            onOpenBenchmarkModal={() => setIsBenchmarkModalOpen(true)}
            officialBenchmarkCount={18}
          />
        )}

        {/* 3. Physical Risk Screening */}
        {activeScreen === 'physical' && <PhysicalScreen plants={calculationData.plants} />}

        {/* 4. Unified Method & Sources (Parameters, Legal Guide & Data Register) */}
        {activeScreen === 'method' && (
          <MethodSourcesScreen
            assumptions={assumptions}
            onUpdateAssumption={handleUpdateAssumption}
            onReset={handleResetAssumptions}
            auditLog={auditLog}
            onOpenIEXModal={() => setIsIEXModalOpen(true)}
          />
        )}

        {/* 5. Board Report & CSV Export */}
        {activeScreen === 'export' && (
          <ExportScreen
            plants={calculationData.plants}
            assumptions={assumptions}
            projections={projections}
          />
        )}

        {/* Official BEE Table 2 Benchmark Modal */}
        <BenchmarkTargetModal
          isOpen={isBenchmarkModalOpen}
          onClose={() => setIsBenchmarkModalOpen(false)}
          onSelectPlantBenchmark={(bench) => {
            alert(`Selected ${bench.plant_name} (FY24 Baseline: ${bench.baseline_intensity_2023_24} t/t, FY27 Target: ${bench.target_2026_27} t/t)`);
          }}
        />

        {/* Real IEX Discovered Trades Modal */}
        <IEXHistoricalPriceModal
          isOpen={isIEXModalOpen}
          onClose={() => setIsIEXModalOpen(false)}
          onApplyPrice={(price) => {
            handleUpdateAssumption('priceCentralInr', price);
            handleUpdateAssumption('priceHighInr', price * 2);
          }}
        />
      </main>

      <footer className="border-t border-[#E5E5E0] bg-[#FFFFFF] py-3 text-center text-xs text-[#737373] mt-8">
        <div className="max-w-[1240px] mx-auto px-4">
          Nimbus Cement Ltd — Carbon Credit Trading Scheme Compliance & Climate Exposure Dashboard (v1.0). Prepared for Meera Iyer (Head of Sustainability).
        </div>
      </footer>
    </div>
  );
}
