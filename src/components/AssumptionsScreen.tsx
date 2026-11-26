import React from 'react';
import { ModelAssumptions } from '../lib/types';
import { TagBadge } from './TagBadge';

interface AssumptionsScreenProps {
  assumptions: ModelAssumptions;
  onUpdateAssumption: (key: keyof ModelAssumptions, value: number) => void;
  onReset: () => void;
  auditLog: { timestamp: string; field: string; prev: number; next: number }[];
  onOpenIEXModal?: () => void;
}

export const AssumptionsScreen: React.FC<AssumptionsScreenProps> = ({
  assumptions,
  onUpdateAssumption,
  onReset,
  auditLog,
  onOpenIEXModal,
}) => {
  return (
    <div className="space-y-4">
      {/* Inputs Form */}
      <div className="bg-white border border-[#dde2ea] rounded p-4 shadow-xs">
        <div className="flex justify-between items-baseline mb-3">
          <h2 className="text-sm font-serif font-bold text-[#16233b]">
            Model inputs & parameters
          </h2>
          <div className="flex gap-2">
            {onOpenIEXModal && (
              <button
                onClick={onOpenIEXModal}
                className="text-xs text-[#2a5fb0] hover:underline font-medium"
              >
                IEX & PXIL trades table ↗
              </button>
            )}
            <button
              onClick={onReset}
              className="text-xs px-2.5 py-1 bg-white border border-[#dde2ea] rounded text-[#16233b] hover:bg-[#f6f7f9] cursor-pointer"
            >
              Reset to defaults
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="text-[#5a6578] block mb-1">
              Low price, ₹/t <TagBadge tag="Assumption" />
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
              Central price, ₹/t <TagBadge tag="Assumption" />
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
              High price (2×), ₹/t <TagBadge tag="Assumption" />
            </label>
            <input
              type="number"
              step="50"
              value={assumptions.priceHighInr}
              onChange={(e) => onUpdateAssumption('priceHighInr', parseFloat(e.target.value) || 0)}
              className="w-full p-1.5 border border-[#dde2ea] rounded font-mono"
            />
          </div>

          <div>
            <label className="text-[#5a6578] block mb-1">
              FY27 cut, integrated % <TagBadge tag="Official" />
            </label>
            <input
              type="number"
              step="0.1"
              value={assumptions.integratedCutFY27Pct}
              onChange={(e) => onUpdateAssumption('integratedCutFY27Pct', parseFloat(e.target.value) || 0)}
              className="w-full p-1.5 border border-[#dde2ea] rounded font-mono"
            />
          </div>

          <div>
            <label className="text-[#5a6578] block mb-1">
              FY27 cut, grinding % <TagBadge tag="Official" />
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
              Extra cut/yr post-FY27, pts <TagBadge tag="Assumption" />
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
              Output growth/yr from FY28, % <TagBadge tag="Assumption" />
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

      {/* Assumptions Basis Register */}
      <div className="bg-white border border-[#dde2ea] rounded p-4 shadow-xs">
        <h3 className="text-sm font-serif font-bold text-[#16233b] mb-2">
          Assumptions & Source Register
        </h3>
        <div className="overflow-x-auto">
          <table className="text-xs">
            <thead>
              <tr className="bg-[#f6f7f9]">
                <th className="text-left py-1.5 px-3">Input</th>
                <th className="text-left py-1.5 px-3">Basis & Evidence</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 px-3 font-semibold text-[#16233b]">
                  Plant output, clinker, Scope 1, revenue <TagBadge tag="Data" />
                </td>
                <td className="py-2 px-3 text-[#5a6578]">
                  Uploaded plant file (nimbus_cement_plants.csv), treated as given for this exercise.
                </td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold text-[#16233b]">
                  FY27 cut: 2.7% integrated, 6.6% grinding <TagBadge tag="Official" />
                </td>
                <td className="py-2 px-3 text-[#5a6578]">
                  Sector averages of notified targets to FY27 from ICAP factsheet based on Gazette G.S.R. 739(E).
                </td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold text-[#16233b]">
                  Carbon Prices: ₹600, ₹1,200, ₹2,400 <TagBadge tag="Assumption" />
                </td>
                <td className="py-2 px-3 text-[#5a6578]">
                  Analyst early-phase estimate range ($7 to $14/t). High is 2× Central (statutory CPCB shortfall penalty). Cross-checked with IEX PAT trading (₹722/t).
                </td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold text-[#16233b]">
                  Baseline stand-in <TagBadge tag="Assumption" />
                </td>
                <td className="py-2 px-3 text-[#5a6578]">
                  FY26 intensity stands in until official FY24 plant baselines are loaded.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Log */}
      {auditLog.length > 0 && (
        <div className="bg-white border border-[#dde2ea] rounded p-3 text-xs">
          <span className="font-semibold text-[#16233b]">Audit log:</span>{' '}
          <span className="text-[#5a6578]">
            {auditLog.slice(-3).map((a, i) => `${a.field} changed from ${a.prev} to ${a.next} (${a.timestamp})`).join('; ')}
          </span>
        </div>
      )}
    </div>
  );
};
