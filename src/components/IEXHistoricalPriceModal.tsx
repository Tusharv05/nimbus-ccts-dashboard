import React, { useState } from 'react';
import { TagBadge } from './TagBadge';

export interface IEXTradeRecord {
  date: string;
  cycle: string;
  tradeVolume: number;
  priceDiscoveredInr: number;
  participants: number;
  impliedCo2PriceInr: number; // calculated at 3.0 tCO2/toe
}

export const IEX_HISTORICAL_DATA: IEXTradeRecord[] = [
  { date: '02-07-2024', cycle: 'PAT Cycle 3', tradeVolume: 6662, priceDiscoveredInr: 2165, participants: 166, impliedCo2PriceInr: 722 },
  { date: '25-06-2024', cycle: 'PAT Cycle 3', tradeVolume: 42914, priceDiscoveredInr: 2165, participants: 168, impliedCo2PriceInr: 722 },
  { date: '18-06-2024', cycle: 'PAT Cycle 3', tradeVolume: 1302, priceDiscoveredInr: 2165, participants: 161, impliedCo2PriceInr: 722 },
  { date: '11-06-2024', cycle: 'PAT Cycle 3', tradeVolume: 6267, priceDiscoveredInr: 2165, participants: 168, impliedCo2PriceInr: 722 },
  { date: '04-06-2024', cycle: 'PAT Cycle 3', tradeVolume: 2273, priceDiscoveredInr: 2165, participants: 156, impliedCo2PriceInr: 722 },
  { date: '28-05-2024', cycle: 'PAT Cycle 3', tradeVolume: 3738, priceDiscoveredInr: 2165, participants: 154, impliedCo2PriceInr: 722 },
  { date: '21-05-2024', cycle: 'PAT Cycle 3', tradeVolume: 1914, priceDiscoveredInr: 2165, participants: 148, impliedCo2PriceInr: 722 },
  { date: '14-05-2024', cycle: 'PAT Cycle 3', tradeVolume: 3958, priceDiscoveredInr: 2165, participants: 152, impliedCo2PriceInr: 722 },
  { date: '07-05-2024', cycle: 'PAT Cycle 3', tradeVolume: 384, priceDiscoveredInr: 2165, participants: 139, impliedCo2PriceInr: 722 },
  { date: '17-10-2023', cycle: 'PAT Cycle 2', tradeVolume: 1650, priceDiscoveredInr: 1840, participants: 205, impliedCo2PriceInr: 613 },
  { date: '10-10-2023', cycle: 'PAT Cycle 2', tradeVolume: 2164, priceDiscoveredInr: 1840, participants: 202, impliedCo2PriceInr: 613 },
  { date: '03-10-2023', cycle: 'PAT Cycle 2', tradeVolume: 2000, priceDiscoveredInr: 1840, participants: 196, impliedCo2PriceInr: 613 },
  { date: '26-09-2023', cycle: 'PAT Cycle 2', tradeVolume: 32716, priceDiscoveredInr: 1840, participants: 190, impliedCo2PriceInr: 613 },
  { date: '20-09-2023', cycle: 'PAT Cycle 2', tradeVolume: 45578, priceDiscoveredInr: 1840, participants: 195, impliedCo2PriceInr: 613 },
  { date: '12-09-2023', cycle: 'PAT Cycle 2', tradeVolume: 16610, priceDiscoveredInr: 1840, participants: 190, impliedCo2PriceInr: 613 },
  { date: '05-09-2023', cycle: 'PAT Cycle 2', tradeVolume: 11345, priceDiscoveredInr: 1840, participants: 190, impliedCo2PriceInr: 613 },
  { date: '01-08-2023', cycle: 'PAT Cycle 2', tradeVolume: 84834, priceDiscoveredInr: 1840, participants: 204, impliedCo2PriceInr: 613 },
  { date: '27-06-2023', cycle: 'PAT Cycle 2', tradeVolume: 138945, priceDiscoveredInr: 1840, participants: 206, impliedCo2PriceInr: 613 },
];

export const IEXHistoricalPriceModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onApplyPrice: (priceInr: number) => void;
}> = ({ isOpen, onClose, onApplyPrice }) => {
  const [filterCycle, setFilterCycle] = useState<'All' | 'PAT Cycle 3' | 'PAT Cycle 2'>('All');

  if (!isOpen) return null;

  const filtered = IEX_HISTORICAL_DATA.filter((r) => filterCycle === 'All' || r.cycle === filterCycle);

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[85vh] flex flex-col overflow-hidden border border-[#D5D5D0]">
        <div className="p-5 border-b border-[#E5E5E0] flex justify-between items-start bg-[#FAFAF8]">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold uppercase text-[#1967D2] bg-[#E8F0FE] px-2 py-0.5 rounded border border-[#C2D7FA]">
                IEX Exchange Trade Data
              </span>
              <TagBadge tag="Official" />
            </div>
            <h3 className="text-lg font-serif font-bold text-[#1A1A1A] mt-1">
              Indian Energy Exchange (IEX) ESCerts Discovered Prices
            </h3>
            <p className="text-xs text-[#555555] mt-0.5">
              Discovered market-clearing prices under PAT Cycle 2 & Cycle 3, converted to implied ₹/tCO₂ (1 toe ≈ 3.0 tCO₂).
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-xl font-bold px-2 py-1">
            ✕
          </button>
        </div>

        {/* Conversion Formula Info Box */}
        <div className="p-4 bg-[#F5F5F3] border-b border-[#E5E5E0] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
          <div>
            <span className="font-semibold text-[#1A1A1A]">Bridge Formula:</span>{' '}
            <span className="font-mono text-[#555555]">
              Implied Carbon Price (₹/tCO₂) = Discovered ESCert Price ÷ 3.0 tCO₂/toe
            </span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                onApplyPrice(722);
                onClose();
              }}
              className="px-3 py-1 bg-[#8B261E] text-white rounded text-xs font-semibold hover:bg-[#731F18]"
            >
              Apply PAT Cycle 3 Price (₹722/t)
            </button>
            <button
              onClick={() => {
                onApplyPrice(613);
                onClose();
              }}
              className="px-3 py-1 border border-[#D5D5D0] text-[#1A1A1A] bg-white rounded text-xs font-semibold hover:bg-[#FAFAF8]"
            >
              Apply PAT Cycle 2 Price (₹613/t)
            </button>
          </div>
        </div>

        {/* Filter buttons */}
        <div className="p-3 border-b border-[#F0F0EB] flex justify-between items-center bg-white text-xs">
          <span className="text-[#737373]">Showing {filtered.length} trading sessions</span>
          <div className="flex space-x-2">
            {(['All', 'PAT Cycle 3', 'PAT Cycle 2'] as const).map((cycle) => (
              <button
                key={cycle}
                onClick={() => setFilterCycle(cycle)}
                className={`px-3 py-1 rounded text-xs font-medium border ${
                  filterCycle === cycle
                    ? 'bg-[#8B261E] text-white border-[#8B261E]'
                    : 'bg-[#FAFAF8] text-[#555555] border-[#D5D5D0] hover:bg-[#F5F5F3]'
                }`}
              >
                {cycle}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-y-auto p-4">
          <table className="min-w-full text-xs divide-y divide-[#E5E5E0]">
            <thead className="bg-[#FAFAF8] text-[#555555] font-semibold sticky top-0">
              <tr>
                <th className="py-2.5 px-3 text-left">Trade Date</th>
                <th className="py-2.5 px-3 text-left">Trading Segment</th>
                <th className="py-2.5 px-3 text-right">Volume (ESCerts)</th>
                <th className="py-2.5 px-3 text-right">Discovered Price (₹/ESCert)</th>
                <th className="py-2.5 px-3 text-right font-bold text-[#8B261E]">Implied Carbon Price (₹/t)</th>
                <th className="py-2.5 px-3 text-center">Participants</th>
                <th className="py-2.5 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F0EB]">
              {filtered.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#FDF5F4]">
                  <td className="py-2.5 px-3 font-mono font-medium text-[#1A1A1A]">{row.date}</td>
                  <td className="py-2.5 px-3 text-[#555555]">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-[#E8F0FE] text-[#1967D2]">
                      {row.cycle}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-[#555555]">
                    {row.tradeVolume.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-semibold text-[#1A1A1A]">
                    ₹{row.priceDiscoveredInr.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-[#8B261E]">
                    ₹{row.impliedCo2PriceInr}/t
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono text-[#737373]">{row.participants}</td>
                  <td className="py-2.5 px-3 text-center">
                    <button
                      onClick={() => {
                        onApplyPrice(row.impliedCo2PriceInr);
                        onClose();
                      }}
                      className="px-2 py-1 bg-[#8B261E] text-white rounded text-[11px] hover:bg-[#731F18]"
                    >
                      Use Price
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-[#FAFAF8] border-t border-[#E5E5E0] text-[11px] text-[#737373] flex justify-between items-center">
          <span>Source: Indian Energy Exchange (IEX) — Energy Saving Certificates Segment</span>
          <span className="font-mono">Real Discovered Market Clearing Records</span>
        </div>
      </div>
    </div>
  );
};
