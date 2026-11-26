import React from 'react';

export const Scope2WarningBanner: React.FC = () => {
  return (
    <div className="bg-[#fff6e8] border border-[#f0d9b0] text-[#7a4100] px-3.5 py-2.5 rounded text-xs mb-3">
      <strong>Known limits:</strong> Scope 2 is not in the company plant file, but CCTS legally counts it, so financial exposure is understated. Carbon prices and the FY28+ path are modeled scenario assumptions. You can adjust all parameters in <strong>Method & Sources (Tab 4)</strong>.
    </div>
  );
};
