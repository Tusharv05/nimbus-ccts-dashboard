import React, { useState } from 'react';
import { ModelAssumptions } from '../lib/types';
import { TagBadge } from './TagBadge';
import { DATA_SOURCES_REGISTRY } from '../lib/sourcesRegistry';

interface MethodSourcesScreenProps {
  assumptions: ModelAssumptions;
  onUpdateAssumption: (key: keyof ModelAssumptions, value: number) => void;
  onReset: () => void;
  auditLog: { timestamp: string; field: string; prev: number; next: number }[];
  onOpenIEXModal?: () => void;
}

export const MethodSourcesScreen: React.FC<MethodSourcesScreenProps> = ({
  assumptions,
  onUpdateAssumption,
  onReset,
  auditLog,
  onOpenIEXModal,
}) => {
  const [activeSection, setActiveSection] = useState<'parameters' | 'methodology' | 'register'>('parameters');

  return (
    <div className="space-y-4">
      {/* Sub-navigation tabs */}
      <div className="flex border-b border-[#dde2ea] space-x-1">
        <button
          onClick={() => setActiveSection('parameters')}
          className={`py-2 px-3 text-xs font-medium border-b-2 cursor-pointer transition-colors ${
            activeSection === 'parameters'
              ? 'border-[#8B261E] text-[#8B261E] font-bold'
              : 'border-transparent text-[#5a6578] hover:text-[#16233b]'
          }`}
        >
          1. Model Parameters & Live Sliders
        </button>
        <button
          onClick={() => setActiveSection('methodology')}
          className={`py-2 px-3 text-xs font-medium border-b-2 cursor-pointer transition-colors ${
            activeSection === 'methodology'
              ? 'border-[#8B261E] text-[#8B261E] font-bold'
              : 'border-transparent text-[#5a6578] hover:text-[#16233b]'
          }`}
        >
          2. Statutory Calculation Guide
        </button>
        <button
          onClick={() => setActiveSection('register')}
          className={`py-2 px-3 text-xs font-medium border-b-2 cursor-pointer transition-colors ${
            activeSection === 'register'
              ? 'border-[#8B261E] text-[#8B261E] font-bold'
              : 'border-transparent text-[#5a6578] hover:text-[#16233b]'
          }`}
        >
          3. Regulatory & Scientific Data Register
        </button>
      </div>

      {/* Section 1: Parameters & Sliders */}
      {activeSection === 'parameters' && (
        <div className="space-y-4">
          <div className="bg-white border border-[#dde2ea] rounded p-4 shadow-xs">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline gap-2 mb-3 pb-2 border-b border-[#e5e7eb]">
              <div>
                <h2 className="text-sm font-serif font-bold text-[#16233b]">
                  Interactive Parameters & Scenario Sliders
                </h2>
                <p className="text-xs text-[#5a6578]">
                  Adjust carbon prices, statutory cuts, or volume growth rates. All calculations recompute across the dashboard instantly.
                </p>
              </div>
              <div className="flex gap-2">
                {onOpenIEXModal && (
                  <button
                    onClick={onOpenIEXModal}
                    className="text-xs text-[#1967D2] hover:underline font-medium cursor-pointer"
                  >
                    IEX & PXIL ESCert trades table ↗
                  </button>
                )}
                <button
                  onClick={onReset}
                  className="text-xs px-2.5 py-1 bg-white border border-[#dde2ea] rounded text-[#16233b] hover:bg-[#f6f7f9] cursor-pointer"
                >
                  Reset defaults
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="text-[#5a6578] block mb-1">
                  Low carbon price, ₹/t <TagBadge tag="Assumption" />
                </label>
                <input
                  type="number"
                  step="50"
                  value={assumptions.priceLowInr}
                  onChange={(e) => onUpdateAssumption('priceLowInr', parseFloat(e.target.value) || 0)}
                  className="w-full p-1.5 border border-[#dde2ea] rounded font-mono"
                />
              </div>

              <div>
                <label className="text-[#5a6578] block mb-1">
                  Central carbon price, ₹/t <TagBadge tag="Assumption" />
                </label>
                <input
                  type="number"
                  step="50"
                  value={assumptions.priceCentralInr}
                  onChange={(e) => onUpdateAssumption('priceCentralInr', parseFloat(e.target.value) || 0)}
                  className="w-full p-1.5 border border-[#dde2ea] rounded font-mono font-bold text-[#16233b]"
                />
              </div>

              <div>
                <label className="text-[#5a6578] block mb-1">
                  High carbon price, ₹/t <TagBadge tag="Assumption" />
                </label>
                <input
                  type="number"
                  step="50"
                  value={assumptions.priceHighInr}
                  onChange={(e) => onUpdateAssumption('priceHighInr', parseFloat(e.target.value) || 0)}
                  className="w-full p-1.5 border border-[#dde2ea] rounded font-mono"
                />
                <span className="text-[10px] text-[#6b7280]">2× central (statutory penalty)</span>
              </div>

              <div>
                <label className="text-[#5a6578] block mb-1">
                  FY27 cut, integrated % <TagBadge tag="Data" />
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={assumptions.integratedCutFY27Pct}
                  onChange={(e) => onUpdateAssumption('integratedCutFY27Pct', parseFloat(e.target.value) || 0)}
                  className="w-full p-1.5 border border-[#dde2ea] rounded font-mono"
                />
                <span className="text-[10px] text-[#6b7280]">ICAP / Gazette Table 2</span>
              </div>

              <div>
                <label className="text-[#5a6578] block mb-1">
                  FY27 cut, grinding % <TagBadge tag="Data" />
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={assumptions.grindingCutFY27Pct}
                  onChange={(e) => onUpdateAssumption('grindingCutFY27Pct', parseFloat(e.target.value) || 0)}
                  className="w-full p-1.5 border border-[#dde2ea] rounded font-mono"
                />
              </div>

              <div>
                <label className="text-[#5a6578] block mb-1">
                  Post-FY27 cut step, % pts/yr <TagBadge tag="Assumption" />
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={assumptions.annualTargetCutStepPts}
                  onChange={(e) => onUpdateAssumption('annualTargetCutStepPts', parseFloat(e.target.value) || 0)}
                  className="w-full p-1.5 border border-[#dde2ea] rounded font-mono"
                />
              </div>

              <div>
                <label className="text-[#5a6578] block mb-1">
                  Annual output growth from FY28, % <TagBadge tag="Assumption" />
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={assumptions.outputGrowthFromFY28Pct}
                  onChange={(e) => onUpdateAssumption('outputGrowthFromFY28Pct', parseFloat(e.target.value) || 0)}
                  className="w-full p-1.5 border border-[#dde2ea] rounded font-mono"
                />
              </div>
            </div>
          </div>

          {/* Audit Log Card */}
          <div className="bg-white border border-[#dde2ea] rounded p-4 shadow-xs">
            <h3 className="text-xs font-serif font-bold text-[#16233b] mb-1">
              Live Auditor Parameter Change Log
            </h3>
            <p className="text-[11px] text-[#5a6578] mb-2">
              Every parameter change in this session is recorded with a timestamp:
            </p>

            {auditLog.length === 0 ? (
              <div className="text-xs text-[#6b7280] italic p-2 bg-[#f9fafb] rounded border border-[#e5e7eb]">
                No parameter overrides yet. Dashboard is running on default gazette and market assumptions.
              </div>
            ) : (
              <div className="max-h-40 overflow-y-auto border border-[#e5e7eb] rounded">
                <table className="text-xs w-full">
                  <thead className="bg-[#f6f7f9] text-[#5a6578] text-left">
                    <tr>
                      <th className="py-1 px-2 font-mono">Time</th>
                      <th className="py-1 px-2">Parameter</th>
                      <th className="py-1 px-2 text-right">Previous</th>
                      <th className="py-1 px-2 text-right">New Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLog.map((log, idx) => (
                      <tr key={idx} className="border-t border-[#f3f4f6]">
                        <td className="py-1 px-2 font-mono text-[#6b7280]">{log.timestamp}</td>
                        <td className="py-1 px-2 font-medium text-[#16233b]">{log.field}</td>
                        <td className="py-1 px-2 text-right font-mono text-[#6b7280]">{log.prev}</td>
                        <td className="py-1 px-2 text-right font-mono font-bold text-[#8B261E]">{log.next}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Section 2: Statutory Methodology */}
      {activeSection === 'methodology' && (
        <div className="bg-white border border-[#dde2ea] rounded p-4 shadow-xs text-xs space-y-4">
          <div>
            <h2 className="text-sm font-serif font-bold text-[#16233b]">
              Statutory & Legal Methodology Guide (Auditor Manual)
            </h2>
            <p className="text-xs text-[#5a6578] mt-0.5">
              Calculation mechanics, boundary definitions, and statutory reconciliation under Gazette G.S.R. 739(E) (Oct 8, 2025).
            </p>
          </div>

          <ol className="list-decimal pl-4 space-y-2 text-[#16233b] leading-relaxed">
            <li>
              <strong>Entity Boundary & Allocation Toggle:</strong>
              <br />
              Kiln plants&apos; direct Scope 1 includes process decarbonation from the clinker they produce and ship.
              <ul className="list-disc pl-4 mt-1 space-y-1 text-[#4b5563]">
                <li>
                  <strong>CCTS Rules (Default statutory view):</strong> Kilns retain direct emissions because grinding units are legally distinct Designated Consumers under Gazette G.S.R. 739(E). Grinding units carry minimal direct Scope 1 (0.019–0.020 t/t).
                </li>
                <li>
                  <strong>Economic Reallocation View:</strong> Clinker-embodied emissions follow transfers to grinding units:
                  <br />
                  <code>Moved Emissions (kt) = (Kiln Clinker Factor) × Clinker Received (Mt)</code>.
                  <br />
                  Subtracted from kilns (P01: 1,020.8 kt; P06: 1,049.7 kt) and added to receiving grinding units (P07, P08, P09). Total clinker shipped (2.40 Mt) equals clinker received (2.40 Mt), conserving company Scope 1 at exactly 10,932 kt.
                </li>
              </ul>
            </li>

            <li>
              <strong>Specific GHG Emission Intensity:</strong>
              <br />
              <code>Intensity = Attributed Scope 1 (kt) ÷ [Cement Output (Mt) × 1,000] (tCO₂/t cement)</code>.
            </li>

            <li>
              <strong>Baseline Stand-in & The Tautology:</strong>
              <br />
              Because Nimbus&apos;s plant file only provides FY26 data, each plant&apos;s baseline is set to its own FY26 intensity as a stand-in for the official FY24 gazette baseline.
              <br />
              <em className="text-[#991b1b]">
                Auditor Note: Because baseline equals FY26 intensity, every plant&apos;s FY27 shortfall is mathematically equal to exactly 2.7% (integrated) or 6.6% (grinding) of its own emissions. This assumes zero decarbonization occurred between FY24 and FY26.
              </em>
            </li>

            <li>
              <strong>Target Setting & Trajectory:</strong>
              <br />
              <code>Target Intensity (FY27) = Baseline × (1 − Target Cut %)</code>.
              <br />
              Default FY27 cuts: 2.7% for Integrated kilns; 6.6% for Grinding units (derived from BEE Schedule Table 2 and ICAP). Multi-year trajectory FY28–FY40 assumes +0.5 percentage points annual tightening and 8.0% production CAGR from FY28.
            </li>

            <li>
              <strong>Financial Exposure Formula:</strong>
              <br />
              <code>Shortfall (kt) = max(0, Attributed Intensity − Target Intensity) × Output (Mt) × 1,000</code>.
              <br />
              <code>Financial Exposure (₹ Cr) = (Shortfall kt × Carbon Price ₹/t) ÷ 10,000</code>.
            </li>

            <li>
              <strong>Carbon Price Scenarios & Statutory Penalties:</strong>
              <ul className="list-disc pl-4 mt-1 space-y-1 text-[#4b5563]">
                <li>
                  <strong>Central (₹1,200/t):</strong> Modeled early CCTS market clearing price, consistent with the ICAP $7–14/t range for emerging ETS systems.
                </li>
                <li>
                  <strong>Low (₹600/t):</strong> Domestic empirical floor anchored by IEX PAT Scheme ESCert market auctions (₹2,165/ESCert ÷ 3.0 tCO₂/toe ≈ ₹722/t CO₂ implied).
                </li>
                <li>
                  <strong>High (₹2,400/t):</strong> Statutory non-compliance penalty scenario ($2\times$ central market price multiplier under Section 14A of the Energy Conservation (Amendment) Act, 2022).
                </li>
              </ul>
            </li>
          </ol>

          <div className="pt-3 border-t border-[#dde2ea]">
            <h3 className="text-xs font-serif font-bold text-[#16233b] mb-2 uppercase tracking-wide">
              Known Limitations & Auditor Qualifications
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] text-[#4b5563]">
              <div className="p-2.5 bg-[#fef2f2] border border-[#fecaca] rounded">
                <strong className="text-[#991b1b] block">1. Scope 2 Purchased Electricity Missing</strong>
                Gazette G.S.R. 739(E) Section 5(7) explicitly includes indirect emissions from purchased grid electricity and heat. Nimbus&apos;s plant file contains only Scope 1. Grinding unit exposures (P07–P09) appear artificially low (&lt;₹0.2 Cr) because their primary energy input (grid electricity ~75 kWh/t) is uncounted.
              </div>
              <div className="p-2.5 bg-[#fffbeb] border border-[#fde68a] rounded">
                <strong className="text-[#92400e] block">2. Captive Coal Power Plant at P01</strong>
                P01 operates a 40 MW captive coal power plant whose fuel combustion sits inside Scope 1. Under statutory CCTS gate-to-gate rules, this is retained at P01. In the economic clinker reallocation, clinker transfer factors are calibrated to process clinker emissions (911.4 kg CO₂/t) to avoid transferring power plant emissions to grinding units.
              </div>
              <div className="p-2.5 bg-[#f9fafb] border border-[#e5e7eb] rounded">
                <strong className="text-[#16233b] block">3. FY28–FY40 Illustrative Path</strong>
                CCTS intensity targets are legally notified only through FY27. Projections beyond FY27 (+0.5 pts/yr cut, 8% growth, flat ₹1,200 price) represent an illustrative "no-abatement" baseline scenario.
              </div>
              <div className="p-2.5 bg-[#f9fafb] border border-[#e5e7eb] rounded">
                <strong className="text-[#16233b] block">4. Physical Hazard Boundaries</strong>
                Physical climate risks (CMIP6 heat screening, WRI groundwater stress, coastal flags) are screening indicators. No peer-reviewed sovereign damage curves exist to convert cement factory heat days into audited financial balance-sheet loss.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section 3: Data Sources Register */}
      {activeSection === 'register' && (
        <div className="space-y-4">
          <div className="bg-white border border-[#dde2ea] rounded p-4 shadow-xs">
            <h2 className="text-sm font-serif font-bold text-[#16233b]">
              Data Sources & Regulatory Register
            </h2>
            <p className="text-xs text-[#5a6578] mt-1 leading-relaxed">
              All baseline operational activity and regulatory formulas trace directly to statutory gazettes and company records. Carbon price paths and multi-year trajectories are modeled scenarios with explicit source attribution and sensitivity bounds.
            </p>
          </div>

          <div className="bg-white border border-[#dde2ea] rounded shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#dde2ea] text-xs">
                <thead className="bg-[#f6f7f9] text-[#16233b] font-semibold text-left">
                  <tr>
                    <th className="py-2.5 px-3">Source & Institution</th>
                    <th className="py-2.5 px-2">Status</th>
                    <th className="py-2.5 px-2">Audit Tag</th>
                    <th className="py-2.5 px-3">Used For</th>
                    <th className="py-2.5 px-2">Licence</th>
                    <th className="py-2.5 px-2">Access Date</th>
                    <th className="py-2.5 px-3 text-right">Reference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f3f4f6] bg-white">
                  {DATA_SOURCES_REGISTRY.map((src) => (
                    <tr key={src.id} className="hover:bg-[#f9fafb]">
                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-[#16233b]">{src.name}</div>
                        <div className="text-[11px] text-[#6b7280] mt-0.5">{src.notes}</div>
                      </td>
                      <td className="py-2.5 px-2">
                        <span className="inline-block px-1.5 py-0.5 rounded text-[10px] bg-[#f3f4f6] text-[#374151] font-mono font-medium">
                          {src.v1Status}
                        </span>
                      </td>
                      <td className="py-2.5 px-2">
                        <TagBadge tag={src.tag} />
                      </td>
                      <td className="py-2.5 px-3 text-[#4b5563] max-w-xs">{src.usedFor}</td>
                      <td className="py-2.5 px-2 text-[11px] text-[#6b7280]">{src.licence}</td>
                      <td className="py-2.5 px-2 font-mono text-[11px] text-[#6b7280]">{src.accessDate}</td>
                      <td className="py-2.5 px-3 text-right font-mono">
                        <a
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#8B261E] hover:underline"
                        >
                          Open Link ↗
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
