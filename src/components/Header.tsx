import React from 'react';
import { AllocationBasis } from '../lib/types';

interface HeaderProps {
  activeScreen: string;
  setActiveScreen: (screen: string) => void;
  allocationBasis: AllocationBasis;
  setAllocationBasis: (basis: AllocationBasis) => void;
  assumptionCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeScreen,
  setActiveScreen,
  allocationBasis,
  setAllocationBasis,
  assumptionCount,
}) => {
  const navTabs = [
    { id: 'overview', label: '1. Executive Overview' },
    { id: 'plants', label: '2. Plant Breakdown' },
    { id: 'assumptions', label: '3. Assumptions & Sensitivities' },
    { id: 'method', label: '4. Auditor Method' },
    { id: 'physical', label: '5. Physical Risk Flags' },
    { id: 'sources', label: '6. Data Register' },
    { id: 'export', label: '7. Board Export' },
  ];

  return (
    <header className="bg-white border-b border-[#d1d5db] sticky top-0 z-50">
      <div className="max-w-[1240px] mx-auto px-3 sm:px-4 pt-2.5 pb-0">
        {/* Title Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 pb-2">
          <div className="flex items-baseline space-x-2.5">
            <h1 className="text-lg sm:text-xl font-serif font-bold text-[#111827] tracking-tight">
              Nimbus Cement Ltd: Climate Exposure Dashboard
            </h1>
            <span className="text-[11px] font-mono font-bold uppercase px-1.5 py-0.2 bg-[#8B261E] text-white rounded">
              v1 Transition Risk
            </span>
            <span className="text-xs text-[#6b7280] hidden md:inline">
              Board Briefing for Meera Iyer (Head of Sustainability) • FY27–FY40
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            {/* Assumption Count */}
            <span className="text-[11px] px-2 py-0.5 rounded border border-[#b7660a] text-[#b7660a] bg-[#fff8ef] font-mono">
              <strong>{assumptionCount}</strong> model assumptions
            </span>

            {/* Allocation Selector */}
            <div className="flex items-center bg-[#f3f4f6] border border-[#d1d5db] rounded px-1 py-0.5">
              <span className="text-[11px] text-[#6b7280] mr-1.5 hidden sm:inline">Basis:</span>
              <select
                value={allocationBasis}
                onChange={(e) => setAllocationBasis(e.target.value as AllocationBasis)}
                className="text-xs bg-transparent font-medium text-[#111827] focus:outline-none cursor-pointer"
              >
                <option value="CCTS">CCTS Rules (Default)</option>
                <option value="Economic">Economic Clinker Reallocation</option>
              </select>
            </div>
          </div>
        </div>

        {/* Condensed Tabs Strip */}
        <nav className="flex space-x-0.5 border-t border-[#e5e7eb] overflow-x-auto" role="tablist">
          {navTabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveScreen(t.id)}
              className={`px-3 py-1.5 text-xs font-medium border-b-2 whitespace-nowrap transition-colors ${
                activeScreen === t.id
                  ? 'border-[#8B261E] text-[#8B261E] font-bold bg-[#fef2f2]'
                  : 'border-transparent text-[#4b5563] hover:text-[#111827] hover:bg-[#f9fafb]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};
