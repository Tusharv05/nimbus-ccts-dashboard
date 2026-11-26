import React, { useState } from 'react';
import { CalculatedPlantRow, ModelAssumptions, YearProjection } from '../lib/types';
import { TagBadge } from './TagBadge';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
} from 'recharts';

interface OverviewScreenProps {
  plants: CalculatedPlantRow[];
  projections: YearProjection[];
  assumptions: ModelAssumptions;
  companyRevenueCr: number;
}

export const OverviewScreen: React.FC<OverviewScreenProps> = ({
  plants,
  projections,
  assumptions,
  companyRevenueCr,
}) => {
  const [showAbatement, setShowAbatement] = useState<boolean>(false);

  const fy27 = projections.find((p) => p.fiscalYear === 'FY27');
  const fy40 = projections.find((p) => p.fiscalYear === 'FY40');

  const fy27Central = fy27?.exposureCentralCr || 35.8;
  const fy27Low = fy27?.exposureLowCr || 17.9;
  const fy27High = fy27?.exposureHighCr || 71.6;
  const fy27PctRev = (fy27Central / companyRevenueCr) * 100;

  const totalScope1 = plants.reduce((sum, p) => sum + p.attributed_scope1_kt, 0);
  const totalOutput = plants.reduce((sum, p) => sum + p.output_fy26_mt, 0);
  const groupIntensity = totalScope1 / (totalOutput * 1000);

  // Per-tonne framing: ₹35.8 Cr / 18.35 Mt = ~₹19.52/t
  const costPerTonneFY27 = (fy27Central * 10000000) / (totalOutput * 1000000);

  // FY40 Projections
  const fy40CentralBaseline = fy40?.exposureCentralCr || 329.1;
  const fy40Low = fy40?.exposureLowCr || 164.6;
  const fy40High = fy40?.exposureHighCr || 658.2;

  // With Abatement Scenario:
  // Assumes alternative fuel thermal substitution (TSR) to 15% and clinker factor reduced from 0.72 to 0.65 by 2040.
  // Reduces specific emission intensity by ~22%, lowering FY40 liability by ~64%
  const fy40CentralAbated = fy40CentralBaseline * 0.36;

  // Build chart data incorporating abatement toggle
  const chartData = projections.map((p) => {
    const yearIndex = p.yearNum - 2027; // 0 in FY27, 13 in FY40
    const abatementFactor = 1 - (yearIndex / 13) * 0.64; // progresses toward 64% reduction
    return {
      ...p,
      exposureAbatedCr: p.exposureCentralCr * (yearIndex > 0 ? abatementFactor : 1),
    };
  });

  return (
    <div className="space-y-3">
      {/* Executive Headline in Meera's Language */}
      <div className="bg-[#16233b] text-white p-3.5 rounded shadow-sm border border-[#0d1624]">
        <div className="text-[11px] font-mono uppercase tracking-wider text-[#93c5fd] font-semibold mb-1">
          Executive Climate Exposure Briefing • Head of Sustainability
        </div>
        <p className="text-xs sm:text-sm font-serif leading-relaxed text-[#f1f5f9]">
          <strong>CCTS compliance liability</strong> could cost Nimbus <strong>₹{Math.round(fy27Central)} Cr in FY27</strong> (<strong>{fy27PctRev.toFixed(2)}% of base revenue</strong>; <strong>₹{costPerTonneFY27.toFixed(1)}/t of cement</strong>), rising to <strong>₹{Math.round(fy40CentralBaseline)} Cr by FY40</strong> under an illustrative no-abatement scenario. 
          <span className="text-[#fed7aa] ml-1">
            <strong>Physical climate exposure is acute:</strong> Chittorgarh (P01) faces 82 days ≥40°C by 2040 (+18 days), and 42% of company assets (₹6,500 Cr) rely on high-stress groundwater basins.
          </span>
        </p>
      </div>

      {/* 4-Column Board Metric Strip with Per-Tonne & Physical Line */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        {/* Metric 1: FY27 Central + Per Tonne */}
        <div className="bg-white border border-[#dde2ea] rounded p-2.5 shadow-xs">
          <div className="flex justify-between items-center text-[11px] text-[#5a6578]">
            <span>FY27 Carbon Cost (Central)</span>
            <TagBadge tag="Assumption" />
          </div>
          <div className="text-xl sm:text-2xl font-serif font-bold text-[#8B261E] mt-0.5">
            ₹{Math.round(fy27Central)} crore
          </div>
          <div className="text-[11px] font-mono text-[#16233b] font-medium mt-0.5">
            ₹{costPerTonneFY27.toFixed(1)} / tonne cement <span className="text-[#6b7280] font-normal">(@ ₹{assumptions.priceCentralInr}/t)</span>
          </div>
        </div>

        {/* Metric 2: Revenue Context */}
        <div className="bg-white border border-[#dde2ea] rounded p-2.5 shadow-xs">
          <div className="flex justify-between items-center text-[11px] text-[#5a6578]">
            <span>FY27 Cost vs Base Revenue</span>
            <TagBadge tag="Data" />
          </div>
          <div className="text-xl sm:text-2xl font-serif font-bold text-[#16233b] mt-0.5">
            {fy27PctRev.toFixed(2)}% of Rev
          </div>
          <div className="text-[11px] text-[#5a6578] mt-0.5">
            On ₹{companyRevenueCr.toLocaleString()} Cr base turnover (FY26)
          </div>
        </div>

        {/* Metric 3: FY40 Horizon + Abatement Potential */}
        <div className="bg-white border border-[#dde2ea] rounded p-2.5 shadow-xs">
          <div className="flex justify-between items-center text-[11px] text-[#5a6578]">
            <span>FY40 Exposure (Horizon)</span>
            <TagBadge tag="Assumption" />
          </div>
          <div className="text-xl sm:text-2xl font-serif font-bold text-[#16233b] mt-0.5">
            ₹{Math.round(showAbatement ? fy40CentralAbated : fy40CentralBaseline)} Cr
          </div>
          <div className="text-[11px] text-[#5a6578] mt-0.5">
            {showAbatement ? (
              <span className="text-[#15803d] font-bold">With Abatement (-₹{Math.round(fy40CentralBaseline - fy40CentralAbated)} Cr saved)</span>
            ) : (
              <span>No-Action: +0.5 pts/yr cut, 8% CAGR</span>
            )}
          </div>
        </div>

        {/* Metric 4: Physical Exposure Snapshot */}
        <div className="bg-white border border-[#dde2ea] rounded p-2.5 shadow-xs">
          <div className="flex justify-between items-center text-[11px] text-[#5a6578]">
            <span>Physical Hazard Concentration</span>
            <TagBadge tag="Data" />
          </div>
          <div className="text-xl sm:text-2xl font-serif font-bold text-[#92400e] mt-0.5">
            42% Assets
          </div>
          <div className="text-[11px] text-[#5a6578] mt-0.5">
            ₹6,500 Cr on groundwater; worst kiln 82 heat days
          </div>
        </div>
      </div>

      {/* Main Board Visual: Chart & Sensitivity Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2.5">
        {/* Trend Chart (2 columns wide) */}
        <div className="lg:col-span-2 bg-white border border-[#dde2ea] rounded p-3 shadow-xs flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-1.5 border-b border-[#e5e7eb]">
            <div>
              <h3 className="text-xs font-serif font-bold text-[#16233b]">
                CCTS Financial Exposure Range FY27–FY40 (₹ crore)
              </h3>
              <p className="text-[11px] text-[#5a6578]">
                Carbon price sensitivity band (₹{assumptions.priceLowInr} to ₹{assumptions.priceHighInr}/t) under constant trajectory (+0.5 pts/yr cut, 8% CAGR).
              </p>
            </div>

            {/* Abatement Scenario Toggle */}
            <button
              onClick={() => setShowAbatement(!showAbatement)}
              className={`text-xs px-2.5 py-1 rounded border transition-colors flex items-center space-x-1 cursor-pointer font-medium ${
                showAbatement
                  ? 'bg-[#ecfdf5] text-[#065f46] border-[#a7f3d0]'
                  : 'bg-[#f3f4f6] text-[#374151] border-[#d1d5db] hover:bg-[#e5e7eb]'
              }`}
            >
              <span>{showAbatement ? '✓ Showing Abatement Scenario' : '+ Compare with Decarbonization'}</span>
            </button>
          </div>

          <div className="h-56 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#f3f4f6" />
                <XAxis dataKey="fiscalYear" stroke="#6b7280" fontSize={10} />
                <YAxis
                  stroke="#6b7280"
                  fontSize={10}
                  tickFormatter={(v) => `₹${v}`}
                  domain={[0, 700]}
                />
                <Tooltip
                  formatter={(val: any, name: any) => [`₹${Math.round(Number(val))} Cr`, name]}
                  labelFormatter={(l) => `Fiscal Year: ${l}`}
                  contentStyle={{ fontSize: '11px', padding: '4px 8px', borderColor: '#d1d5db' }}
                />
                {/* Shaded Price Sensitivity Band */}
                <Area
                  type="monotone"
                  dataKey="exposureHighCr"
                  stroke="#fca5a5"
                  fill="#fee2e2"
                  fillOpacity={0.6}
                  name="High Penalty (₹2,400/t)"
                />
                <Area
                  type="monotone"
                  dataKey="exposureLowCr"
                  stroke="#cbd5e1"
                  fill="#ffffff"
                  fillOpacity={0.9}
                  name="Low Scenario (₹600/t)"
                />
                {/* Central Baseline Line */}
                <Line
                  type="monotone"
                  dataKey="exposureCentralCr"
                  stroke="#8B261E"
                  strokeWidth={3}
                  dot={{ r: 2 }}
                  name="No-Action Central (₹1,200/t)"
                />
                {/* Optional Abatement Scenario Line */}
                {showAbatement && (
                  <Line
                    type="monotone"
                    dataKey="exposureAbatedCr"
                    stroke="#15803d"
                    strokeWidth={2.5}
                    strokeDasharray="4 4"
                    dot={{ r: 2 }}
                    name="With Abatement (TSR 15% + 0.65 clinker)"
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap justify-between items-center text-[10px] text-[#6b7280] pt-2 border-t border-[#f3f4f6]">
            <span>Solid Red: Central ₹1,200/t • Shaded Band: ₹600 to ₹2,400/t</span>
            {showAbatement && (
              <span className="text-[#15803d] font-semibold">
                Dashed Green: Decarbonization reduces FY40 cost from ₹329 Cr to ~₹118 Cr
              </span>
            )}
          </div>
        </div>

        {/* Target Cut Sensitivity Matrix (1 column wide) */}
        <div className="bg-white border border-[#dde2ea] rounded p-3 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-baseline pb-1.5 border-b border-[#e5e7eb]">
              <h3 className="text-xs font-serif font-bold text-[#16233b]">
                FY27 Cut Sensitivity Matrix
              </h3>
              <TagBadge tag="Data" />
            </div>
            <p className="text-[11px] text-[#5a6578] mt-1.5 leading-relaxed">
              Company-wide cost impact of varying FY27 cut rates across kilns (Central @ ₹1,200/t):
            </p>

            <div className="space-y-1.5 mt-2 text-xs">
              {[
                { cut: 2.7, label: 'Notified Benchmark (Gazette Table 2 & ICAP Factsheet)', cost: fy27Central },
                { cut: 4.7, label: 'Reported Industry Tier (Alternate Lower Bound)', cost: (fy27Central * 4.7) / 2.7 },
                { cut: 7.6, label: 'Reported Industry Tier (Alternate Upper Bound)', cost: (fy27Central * 7.6) / 2.7 },
              ].map(({ cut, label, cost }) => (
                <div
                  key={cut}
                  className={`flex justify-between items-center p-2 rounded border ${
                    assumptions.integratedCutFY27Pct === cut
                      ? 'bg-[#fef2f2] border-[#8B261E] font-bold text-[#8B261E]'
                      : 'bg-[#f9fafb] border-[#e5e7eb] text-[#374151]'
                  }`}
                >
                  <div>
                    <span className="font-mono text-xs">{cut}% cut</span>
                    <span className="text-[10px] text-[#6b7280] block font-normal">{label}</span>
                  </div>
                  <span className="font-mono text-xs font-bold">~₹{Math.round(cost)} Cr</span>
                </div>
              ))}
            </div>
          </div>

          {/* Driver Ranking Widget */}
          <div className="mt-3 pt-2 border-t border-[#e5e7eb]">
            <span className="text-[11px] font-bold text-[#16233b] block mb-1">
              Key Exposure Drivers (Ranked by Model Sensitivity):
            </span>
            <ul className="text-[10px] text-[#5a6578] space-y-0.5">
              <li><strong>1. Production Growth (+172% by FY40):</strong> Output scales from 18.35 to 49.90 Mt (8% CAGR), inflating FY40 exposure from ₹121 Cr (flat output) to ₹329 Cr (+₹208 Cr).</li>
              <li><strong>2. Carbon Price (−50% / +100%):</strong> Price swings from central ₹1,200/t (₹35.8 Cr) down to ₹600/t (₹17.9 Cr) and up to ₹2,400/t (₹71.6 Cr).</li>
              <li><strong>3. FY27 Target Cut Rate (+74% at 4.7%):</strong> Tightening the integrated cut from the notified 2.7% to 4.7% raises FY27 cost from ₹35.8 Cr to ₹62.3 Cr.</li>
              <li><strong>4. Scope 2 Exclusion:</strong> BEE PAT data shows grinding draws 70–85 kWh/t. At CEA&apos;s 0.716 kg CO₂/kWh factor, Scope 2 adds ~0.053 tCO₂/t, understating grinding unit liability by 3–4×.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* "What v1 Leaves Out and Why" Disclosure Box */}
      <div className="bg-[#f8fafc] border border-[#cbd5e1] rounded p-3.5 text-xs text-[#334155]">
        <div className="flex items-center space-x-2 mb-1.5">
          <span className="font-serif font-bold text-sm text-[#0f172a]">
            Product Scope Discipline: What v1 Leaves Out and Why
          </span>
          <span className="text-[10px] font-mono bg-[#e2e8f0] text-[#475569] px-1.5 py-0.5 rounded">
            Auditor & PM Boundaries
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px] leading-relaxed">
          <div className="p-2 bg-white rounded border border-[#e2e8f0]">
            <strong className="text-[#0f172a] block">1. No Sovereign Damage Curves</strong>
            Open scientific literature does not provide peer-reviewed rupee damage functions for Indian cement kilns. Translating heat days into speculative rupee write-offs would be rejected by statutory auditors. We provide spatial screening flags instead.
          </div>
          <div className="p-2 bg-white rounded border border-[#e2e8f0]">
            <strong className="text-[#0f172a] block">2. Scope 2 Purchased Grid Power</strong>
            CCTS Gazette G.S.R. 739(E) Section 5(7) legally includes indirect emissions. Because Nimbus&apos;s plant file only provided Scope 1 direct emissions, grinding unit exposure (P07–P09) is legally understated. Flagged prominently on all tables.
          </div>
          <div className="p-2 bg-white rounded border border-[#e2e8f0]">
            <strong className="text-[#0f172a] block">3. No Flood or Cyclone Rupee Losses</strong>
            While coastal (P07, P08) and riverine (P03, P09) plants carry physical hazard vulnerability, precise financial loss requires local elevation, flood wall engineering, and insurance data unavailable in public records.
          </div>
        </div>
      </div>
    </div>
  );
};
