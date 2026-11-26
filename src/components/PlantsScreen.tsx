import React, { useState } from 'react';
import { CalculatedPlantRow, AllocationBasis } from '../lib/types';
import { TagBadge } from './TagBadge';

interface PlantsScreenProps {
  plants: CalculatedPlantRow[];
  allocationBasis: AllocationBasis;
  onOpenBenchmarkModal?: () => void;
  officialBenchmarkCount?: number;
}

export const PlantsScreen: React.FC<PlantsScreenProps> = ({
  plants,
  allocationBasis,
  onOpenBenchmarkModal,
  officialBenchmarkCount = 18,
}) => {
  const [selectedPlantId, setSelectedPlantId] = useState<string | null>('P01');

  const selectedPlant = plants.find((p) => p.plant_id === selectedPlantId) || plants[0];

  const totalOutput = plants.reduce((sum, p) => sum + p.output_fy26_mt, 0);
  const totalScope1 = plants.reduce((sum, p) => sum + p.attributed_scope1_kt, 0);
  const totalExposureFY27 = plants.reduce((sum, p) => sum + p.exposure_fy27_cr, 0);

  // Group FY40 exposure at central price (+0.5*13 = 6.5 extra cut, 8% growth)
  const totalExposureFY40 = plants.reduce((sum, p) => {
    const out40 = p.output_fy26_mt * Math.pow(1.08, 13);
    const cut40 = (p.plant_type === 'Integrated' ? 2.7 : 6.6) + 6.5;
    const shortfallKt = (p.attributed_intensity * (cut40 / 100)) * out40 * 1000;
    return sum + (shortfallKt * 1200) / 10000;
  }, 0);

  // Concentration metrics: P01 + P06
  const p01 = plants.find((p) => p.plant_id === 'P01');
  const p06 = plants.find((p) => p.plant_id === 'P06');
  const top2Exposure = (p01?.exposure_fy27_cr || 0) + (p06?.exposure_fy27_cr || 0);
  const top2Pct = (top2Exposure / totalExposureFY27) * 100;

  return (
    <div className="space-y-3">
      {/* Concentration Strip */}
      <div className="bg-white border border-[#dde2ea] rounded p-3 shadow-xs">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2 pb-1.5 border-b border-[#e5e7eb]">
          <div>
            <h3 className="text-xs font-serif font-bold text-[#16233b]">
              Emissions & Compliance Concentration Analysis
            </h3>
            <p className="text-[11px] text-[#5a6578]">
              Two mega-kilns — <strong>P01 Chittorgarh</strong> and <strong>P06 Baloda Bazar</strong> — generate <strong>5,595 kt CO₂ (51.2% of group Scope 1)</strong> and drive <strong>{top2Pct.toFixed(1)}% of total FY27 compliance liability (₹{top2Exposure.toFixed(1)} Cr)</strong>.
            </p>
          </div>
          <span className="text-[10px] font-mono bg-[#fef2f2] text-[#991b1b] border border-[#fecaca] px-2 py-0.5 rounded font-bold">
            Key Board Takeaway: Decarbonizing P01 & P06 solves &gt;50% of CCTS liability
          </span>
        </div>

        {/* Visual Concentration Mini Bars */}
        <div className="space-y-1.5 mt-2">
          {plants.map((p) => {
            const pctOfTotal = (p.exposure_fy27_cr / totalExposureFY27) * 100;
            const isTop2 = p.plant_id === 'P01' || p.plant_id === 'P06';
            return (
              <div key={p.plant_id} className="flex items-center text-xs">
                <span className="w-24 font-mono font-medium text-[11px] text-[#16233b] truncate">
                  {p.plant_id} {p.plant_name.replace('Nimbus ', '')}
                </span>
                <div className="flex-1 bg-[#f3f4f6] h-3 rounded overflow-hidden mx-2">
                  <div
                    className={`h-full ${isTop2 ? 'bg-[#8B261E]' : 'bg-[#9ca3af]'}`}
                    style={{ width: `${Math.max(1, pctOfTotal)}%` }}
                  />
                </div>
                <span className="w-16 text-right font-mono text-[11px] font-bold text-[#16233b]">
                  ₹{p.exposure_fy27_cr.toFixed(2)} Cr
                </span>
                <span className="w-12 text-right font-mono text-[10px] text-[#6b7280]">
                  ({pctOfTotal.toFixed(1)}%)
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white border border-[#dde2ea] rounded p-3 shadow-xs">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline gap-2 mb-2 pb-1.5 border-b border-[#e5e7eb]">
          <div>
            <h2 className="text-xs sm:text-sm font-serif font-bold text-[#16233b]">
              Plant Compliance & Financial Exposure Table (FY27 & FY40)
            </h2>
            <div className="text-[11px] text-[#5a6578] mt-0.5">
              Basis: <strong>{allocationBasis === 'CCTS' ? 'CCTS Rules (Default: Kiln retains direct clinker emissions)' : 'Economic View (Clinker emissions reassigned to grinding units)'}</strong>
              <span className="mx-1.5 text-[#9ca3af]">|</span>
              <span className="italic text-[#991b1b]">Tautology Note: Baseline is FY26 intensity stand-in, so FY27 gap is exactly 2.7% (or 6.6%) of baseline.</span>
            </div>
          </div>

          {onOpenBenchmarkModal && (
            <button
              onClick={onOpenBenchmarkModal}
              className="text-xs bg-[#1967D2] text-white font-semibold px-2.5 py-1 rounded hover:bg-[#1557B0] transition-colors flex items-center space-x-1 cursor-pointer"
            >
              <span>🏛 Official Gazette G.S.R. 739(E) Benchmarks ({officialBenchmarkCount} Peers)</span>
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="text-xs w-full">
            <thead>
              <tr className="bg-[#f6f7f9] border-b border-[#e5e7eb]">
                <th className="text-left py-2 px-2">Plant</th>
                <th className="text-left py-2 px-1.5">Type</th>
                <th className="text-right py-2 px-1.5">Output (Mt)</th>
                
                {/* Dynamic columns based on allocation basis */}
                {allocationBasis === 'CCTS' ? (
                  <>
                    <th className="text-right py-2 px-2 font-medium">Scope 1 Direct (kt)</th>
                    <th className="text-right py-2 px-2 font-medium">Intensity (t/t)</th>
                  </>
                ) : (
                  <>
                    <th className="text-right py-2 px-1.5">Filed (kt)</th>
                    <th className="text-right py-2 px-1.5">Transferred (kt)</th>
                    <th className="text-right py-2 px-1.5 font-bold text-[#16233b]">Econ Scope 1 (kt)</th>
                    <th className="text-right py-2 px-1.5 font-bold text-[#16233b]">Econ Intensity (t/t)</th>
                  </>
                )}

                <th className="text-right py-2 px-1.5">Target (t/t)</th>
                <th className="text-right py-2 px-1.5">Gap (t/t)</th>
                <th className="text-right py-2 px-2 font-bold text-[#8B261E]">FY27 Central (₹ Cr)</th>
                <th className="text-right py-2 px-2 font-bold text-[#16233b]">FY40 Horizon (₹ Cr)</th>
              </tr>
            </thead>
            <tbody>
              {plants.map((p) => {
                const isSelected = p.plant_id === selectedPlantId;
                const out40 = p.output_fy26_mt * Math.pow(1.08, 13);
                const cut40 = (p.plant_type === 'Integrated' ? 2.7 : 6.6) + 6.5;
                const shortfallKt = (p.attributed_intensity * (cut40 / 100)) * out40 * 1000;
                const exp40 = (shortfallKt * 1200) / 10000;
                const gap = p.attributed_intensity - p.target_intensity_fy27;
                const isGrinding = p.plant_type === 'Grinding';

                return (
                  <tr
                    key={p.plant_id}
                    onClick={() => setSelectedPlantId(p.plant_id)}
                    className={`cursor-pointer transition-colors border-b border-[#f3f4f6] ${
                      isSelected ? 'bg-[#fef2f2] font-semibold' : 'hover:bg-[#f9fafb]'
                    }`}
                  >
                    <td className="py-2 px-2 font-mono text-left">
                      <span className="font-bold text-[#16233b]">{p.plant_id}</span>{' '}
                      <span className="text-[#4b5563]">{p.plant_name}</span>
                      {isGrinding && allocationBasis === 'CCTS' && (
                        <span className="block text-[10px] text-[#b45309] font-normal">
                          ⚠️ Understated (Scope 2 missing)
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-1.5 text-left">
                      <span className={`inline-block px-1 py-0.2 rounded text-[10px] ${
                        p.plant_type === 'Integrated' ? 'bg-[#e0e7ff] text-[#3730a3]' : 'bg-[#ecfdf5] text-[#065f46]'
                      }`}>
                        {p.plant_type}
                      </span>
                    </td>
                    <td className="py-2 px-1.5 text-right font-mono">{p.output_fy26_mt.toFixed(2)}</td>

                    {/* Dynamic columns */}
                    {allocationBasis === 'CCTS' ? (
                      <>
                        <td className="py-2 px-2 text-right font-mono">{Math.round(p.filed_scope1_kt).toLocaleString()}</td>
                        <td className="py-2 px-2 text-right font-mono font-bold text-[#16233b]">{p.filed_intensity.toFixed(3)}</td>
                      </>
                    ) : (
                      <>
                        <td className="py-2 px-1.5 text-right font-mono text-[#6b7280]">{Math.round(p.filed_scope1_kt).toLocaleString()}</td>
                        <td className="py-2 px-1.5 text-right font-mono text-[#6b7280]">
                          {p.explanation.clinkerTransferredEmissionsKt > 0 ? `+${Math.round(p.explanation.clinkerTransferredEmissionsKt)}` : p.explanation.clinkerTransferredEmissionsKt < 0 ? `${Math.round(p.explanation.clinkerTransferredEmissionsKt)}` : '—'}
                        </td>
                        <td className="py-2 px-1.5 text-right font-mono font-bold text-[#16233b]">{Math.round(p.attributed_scope1_kt).toLocaleString()}</td>
                        <td className="py-2 px-1.5 text-right font-mono font-bold text-[#16233b]">{p.attributed_intensity.toFixed(3)}</td>
                      </>
                    )}

                    <td className="py-2 px-1.5 text-right font-mono text-[#6b7280]">{p.target_intensity_fy27.toFixed(3)}</td>
                    <td className="py-2 px-1.5 text-right font-mono text-[#8B261E]">+{gap.toFixed(4)}</td>
                    <td className="py-2 px-2 text-right font-mono font-bold text-[#8B261E]">
                      ₹{p.exposure_fy27_cr.toFixed(2)}
                    </td>
                    <td className="py-2 px-2 text-right font-mono text-[#16233b]">
                      ₹{exp40.toFixed(1)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-[#f3f4f6] font-bold border-t-2 border-[#dde2ea]">
                <td className="py-2 px-2 text-left" colSpan={2}>Company Total</td>
                <td className="py-2 px-1.5 text-right font-mono">{totalOutput.toFixed(2)}</td>
                
                {allocationBasis === 'CCTS' ? (
                  <>
                    <td className="py-2 px-2 text-right font-mono">{Math.round(totalScope1).toLocaleString()}</td>
                    <td className="py-2 px-2 text-right font-mono">{(totalScope1 / (totalOutput * 1000)).toFixed(3)}</td>
                  </>
                ) : (
                  <>
                    <td className="py-2 px-1.5 text-right font-mono">{Math.round(totalScope1).toLocaleString()}</td>
                    <td className="py-2 px-1.5 text-right font-mono text-[#6b7280]">0 (Balanced)</td>
                    <td className="py-2 px-1.5 text-right font-mono">{Math.round(totalScope1).toLocaleString()}</td>
                    <td className="py-2 px-1.5 text-right font-mono">{(totalScope1 / (totalOutput * 1000)).toFixed(3)}</td>
                  </>
                )}

                <td className="py-2 px-1.5 text-right font-mono text-[#6b7280]">—</td>
                <td className="py-2 px-1.5 text-right font-mono text-[#6b7280]">—</td>
                <td className="py-2 px-2 text-right font-mono text-[#8B261E]">₹{totalExposureFY27.toFixed(2)}</td>
                <td className="py-2 px-2 text-right font-mono text-[#16233b]">₹{totalExposureFY40.toFixed(1)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Selected Plant Auditor Drilldown Card */}
      {selectedPlant && (
        <div className="bg-white border border-[#dde2ea] rounded p-3 shadow-xs text-xs">
          <div className="flex justify-between items-baseline pb-1.5 border-b border-[#e5e7eb]">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-[#16233b]">{selectedPlant.plant_id} {selectedPlant.plant_name}</span>
              <span className="text-[#6b7280]">({selectedPlant.town}, {selectedPlant.state})</span>
              <TagBadge tag="Data" />
            </div>
            <span className="font-mono font-bold text-[#8B261E]">
              FY27 Central Compliance Cost: ₹{selectedPlant.exposure_fy27_cr.toFixed(2)} Cr (@ ₹1,200/t)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
            <div>
              <span className="text-[#6b7280] font-semibold block mb-0.5">Auditor Formula Verification:</span>
              <div className="bg-[#f9fafb] p-2 rounded border border-[#e5e7eb] font-mono text-[11px] leading-relaxed text-[#16233b]">
                {selectedPlant.explanation.formula}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1.5 text-[11px] bg-[#f9fafb] p-2 rounded border border-[#e5e7eb]">
              <div>Output: <strong>{selectedPlant.output_fy26_mt.toFixed(2)} Mt</strong></div>
              <div>Gross Block: <strong>₹{selectedPlant.asset_value_inr_cr} Cr</strong></div>
              <div>Water Source: <strong>{selectedPlant.water_source}</strong></div>
              <div>Coastal Zone: <strong>{selectedPlant.coastal === 'Yes' ? 'Yes (Cyclone/Salinity)' : 'No (Inland)'}</strong></div>
              <div>Clinker Shipped: <strong>{selectedPlant.clinker_shipped_mt} Mt</strong></div>
              <div>Clinker Received: <strong>{selectedPlant.clinker_received_mt} Mt</strong></div>
              <div className="col-span-2 text-[10px] text-[#6b7280] italic">
                Notes: &ldquo;{selectedPlant.notes}&rdquo;
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
