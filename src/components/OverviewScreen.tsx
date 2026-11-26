import React from 'react';
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
  const fy27 = projections.find((p) => p.fiscalYear === 'FY27');
  const fy40 = projections.find((p) => p.fiscalYear === 'FY40');

  const fy27Central = fy27?.exposureCentralCr || 0;
  const fy27Low = fy27?.exposureLowCr || 0;
  const fy27High = fy27?.exposureHighCr || 0;
  const fy27PctRev = (fy27Central / companyRevenueCr) * 100;

  const fy40Central = fy40?.exposureCentralCr || 0;
  const fy40Low = fy40?.exposureLowCr || 0;
  const fy40High = fy40?.exposureHighCr || 0;

  const totalScope1 = plants.reduce((sum, p) => sum + p.attributed_scope1_kt, 0);
  const totalOutput = plants.reduce((sum, p) => sum + p.output_fy26_mt, 0);
  const groupIntensity = totalScope1 / (totalOutput * 1000);

  return (
    <div className="space-y-3">
      {/* 4-Column Board Metric Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        {/* Metric 1 */}
        <div className="bg-white border border-[#d1d5db] rounded p-2.5 shadow-xs">
          <div className="flex justify-between items-center text-[11px] text-[#6b7280]">
            <span>FY27 Exposure (Central)</span>
            <TagBadge tag="Assumption" />
          </div>
          <div className="text-xl sm:text-2xl font-serif font-bold text-[#8B261E] mt-0.5">
            ₹{Math.round(fy27Central)} crore
          </div>
          <div className="text-[11px] text-[#4b5563] mt-0.5">
            Range: ₹{Math.round(fy27Low)} to ₹{Math.round(fy27High)} cr (₹{assumptions.priceCentralInr}/t)
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-[#d1d5db] rounded p-2.5 shadow-xs">
          <div className="flex justify-between items-center text-[11px] text-[#6b7280]">
            <span>FY26 Revenue Impact</span>
            <TagBadge tag="Data" />
          </div>
          <div className="text-xl sm:text-2xl font-serif font-bold text-[#111827] mt-0.5">
            {fy27PctRev.toFixed(2)}% of Rev
          </div>
          <div className="text-[11px] text-[#4b5563] mt-0.5">
            Based on ₹{companyRevenueCr.toLocaleString()} cr total revenue
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-[#d1d5db] rounded p-2.5 shadow-xs">
          <div className="flex justify-between items-center text-[11px] text-[#6b7280]">
            <span>FY40 Exposure (Horizon)</span>
            <TagBadge tag="Assumption" />
          </div>
          <div className="text-xl sm:text-2xl font-serif font-bold text-[#111827] mt-0.5">
            ₹{Math.round(fy40Central)} crore
          </div>
          <div className="text-[11px] text-[#4b5563] mt-0.5">
            Range: ₹{Math.round(fy40Low)} to ₹{Math.round(fy40High)} cr (+0.5 pts/yr, 8% g)
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-[#d1d5db] rounded p-2.5 shadow-xs">
          <div className="flex justify-between items-center text-[11px] text-[#6b7280]">
            <span>Group Baseline Intensity</span>
            <TagBadge tag="Data" />
          </div>
          <div className="text-xl sm:text-2xl font-serif font-bold text-[#111827] mt-0.5">
            {groupIntensity.toFixed(3)} t/t
          </div>
          <div className="text-[11px] text-[#4b5563] mt-0.5">
            {Math.round(totalScope1).toLocaleString()} kt Scope 1 / {totalOutput.toFixed(2)} Mt cement
          </div>
        </div>
      </div>

      {/* Main Board Visual: Chart & Sensitivity side-by-side on wide screens */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2.5">
        {/* Trend Chart (2 columns wide) */}
        <div className="lg:col-span-2 bg-white border border-[#d1d5db] rounded p-3 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-baseline pb-1.5 border-b border-[#e5e7eb]">
            <h3 className="text-xs font-serif font-bold text-[#111827]">
              CCTS Financial Exposure Range FY27–FY40 (₹ crore)
            </h3>
            <span className="text-[11px] text-[#6b7280]">
              Band = Low (₹{assumptions.priceLowInr}) to High (₹{assumptions.priceHighInr}); Line = Central (₹{assumptions.priceCentralInr})
            </span>
          </div>

          <div className="h-52 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={projections} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="#f3f4f6" />
                <XAxis dataKey="fiscalYear" stroke="#6b7280" fontSize={10} />
                <YAxis stroke="#6b7280" fontSize={10} tickFormatter={(v) => `₹${v}`} />
                <Tooltip
                  formatter={(val: any) => [`₹${Math.round(Number(val))} Cr`, '']}
                  labelFormatter={(l) => `Fiscal Year: ${l}`}
                  contentStyle={{ fontSize: '11px', padding: '3px 6px', borderColor: '#d1d5db' }}
                />
                <Area
                  type="monotone"
                  dataKey="exposureHighCr"
                  stroke="#F3D5D2"
                  fill="#FDF5F4"
                  name="High Penalty (₹2,400/t)"
                />
                <Area
                  type="monotone"
                  dataKey="exposureLowCr"
                  stroke="#e5e7eb"
                  fill="#ffffff"
                  name="Low Scenario (₹600/t)"
                />
                <Line
                  type="monotone"
                  dataKey="exposureCentralCr"
                  stroke="#8B261E"
                  strokeWidth={2.2}
                  dot={false}
                  name="Central Scenario (₹1,200/t)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Target Cut Sensitivity Matrix (1 column wide) */}
        <div className="bg-white border border-[#d1d5db] rounded p-3 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-baseline pb-1.5 border-b border-[#e5e7eb]">
              <h3 className="text-xs font-serif font-bold text-[#111827]">
                Cut Sensitivity Matrix
              </h3>
              <TagBadge tag="Official" />
            </div>
            <p className="text-[11px] text-[#6b7280] mt-1.5">
              Impact of varying FY27 cut percentages across integrated plants (Central @ ₹1,200/t):
            </p>

            <div className="space-y-1.5 mt-2 text-xs">
              {[
                { cut: 2.7, label: 'Official ICAP Factsheet (Default)', cost: fy27Central },
                { cut: 3.5, label: 'Earlier Draft Placeholder', cost: (fy27Central * 3.5) / 2.7 },
                { cut: 4.7, label: 'Other Reported Range Low', cost: (fy27Central * 4.7) / 2.7 },
                { cut: 7.6, label: 'Other Reported Range High', cost: (fy27Central * 7.6) / 2.7 },
              ].map(({ cut, label, cost }) => (
                <div
                  key={cut}
                  className={`flex justify-between items-center p-1.5 rounded border ${
                    assumptions.integratedCutFY27Pct === cut
                      ? 'bg-[#fef2f2] border-[#8B261E] font-bold text-[#8B261E]'
                      : 'bg-[#f9fafb] border-[#e5e7eb] text-[#374151]'
                  }`}
                >
                  <div>
                    <span className="font-mono">{cut}% cut</span>
                    <span className="text-[10px] text-[#6b7280] block font-normal">{label}</span>
                  </div>
                  <span className="font-mono text-xs font-bold">~₹{Math.round(cost)} Cr</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-2 pt-2 border-t border-[#e5e7eb] text-[10px] text-[#6b7280]">
            Sensitivity table as required by CCTS audit guidelines.
          </div>
        </div>
      </div>
    </div>
  );
};
