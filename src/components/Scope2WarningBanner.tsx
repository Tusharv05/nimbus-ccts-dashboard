import React from 'react';

export const Scope2WarningBanner: React.FC = () => {
  return (
    <div className="bg-[#fff6e8] border border-[#f0d9b0] text-[#7a4100] px-3.5 py-2.5 rounded text-xs mb-3">
      <strong>Known limits:</strong> Scope 2 is not in the plant file, but CCTS counts it, so financial exposure is understated. Prices and the FY28+ path are assumptions. Change them in Assumptions.
    </div>
  );
};
