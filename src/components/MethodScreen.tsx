import React from 'react';

export const MethodScreen: React.FC = () => {
  return (
    <div className="space-y-4">
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
    </div>
  );
};
