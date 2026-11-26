import React from 'react';

export const MethodScreen: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="bg-white border border-[#dde2ea] rounded p-4 shadow-xs text-xs space-y-3">
        <h2 className="text-sm font-serif font-bold text-[#16233b]">
          How the numbers are built (Auditor Guide)
        </h2>
        <ol className="list-decimal pl-4 space-y-1.5 text-[#16233b] leading-relaxed">
          <li>
            <strong>Allocation basis:</strong> Kiln plants&apos; Scope 1 includes the clinker they ship. On the <strong>CCTS basis</strong>, the kiln keeps those emissions (grinding units are separate entities under G.S.R. 739(E)). On the <strong>Economic basis</strong>, emissions moved to each grinding unit = <code>(kiln Scope 1 ÷ clinker produced) × clinker received</code>. Shipped (2.40 Mt) equals received (2.40 Mt), so nothing is counted twice either way.
          </li>
          <li>
            <strong>Intensity:</strong> Attributed Scope 1 (kt) ÷ Cement Output (Mt × 1,000) [tCO₂/t cement].
          </li>
          <li>
            <strong>Target:</strong> Baseline intensity × (1 − cut%). The cut defaults to 2.7% (integrated) and 6.6% (grinding) in FY27, rising +0.5 points a year to FY40.
          </li>
          <li>
            <strong>Exposure (₹ crore):</strong> <code>max(0, Intensity − Target) × Output × Carbon Price ÷ 10,000</code>.
          </li>
          <li>
            <strong>Company total:</strong> Sum of 9 plants, shown across Low (₹600), Central (₹1,200), and High (₹2,400) scenarios.
          </li>
        </ol>

        <h3 className="text-sm font-serif font-bold text-[#16233b] pt-2 border-t border-[#dde2ea]">
          Known limits & open questions
        </h3>
        <ul className="list-disc pl-4 space-y-1 text-[#5a6578]">
          <li><strong>Scope 2 missing:</strong> CCTS counts purchased electricity and heat. The plant file has none, so exposure is legally understated.</li>
          <li><strong>Captive coal power at P01:</strong> Sits inside direct emissions; on the CCTS basis this is direct process emissions, but slight bias in economic view.</li>
          <li><strong>Post-FY27 path:</strong> +0.5 points/year is an assumption until NGFS long-term paths are locked.</li>
        </ul>

        <h3 className="text-sm font-serif font-bold text-[#16233b] pt-2 border-t border-[#dde2ea]">
          Competitor positioning
        </h3>
        <p className="text-[#5a6578]">
          <strong>XDI</strong> and <strong>Jupiter Intelligence</strong> sell asset-level physical risk. We started with transition risk because sovereign damage curves for cement plants do not exist in open data; CCTS compliance represents real legal cash liability today.
        </p>
      </div>
    </div>
  );
};
