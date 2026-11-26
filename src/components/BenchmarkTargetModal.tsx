import React, { useState } from 'react';
import { TagBadge } from './TagBadge';

export interface OfficialBenchmarkTarget {
  registration_number: string;
  plant_name: string;
  sub_sector: string;
  baseline_output_2023_24_t: number;
  baseline_intensity_2023_24: number;
  target_2025_26?: number | null;
  target_2026_27: number;
}

export const INITIAL_OFFICIAL_TARGETS: OfficialBenchmarkTarget[] = [
  { registration_number: 'CCC-CEM-001', plant_name: 'UltraTech Cement Ltd - Aditya Cement Works (Chittorgarh)', sub_sector: 'Integrated', baseline_output_2023_24_t: 3250000, baseline_intensity_2023_24: 0.6412, target_2025_26: 0.6364, target_2026_27: 0.6239 },
  { registration_number: 'CCC-CEM-002', plant_name: 'UltraTech Cement Ltd - Vikram Cement Works', sub_sector: 'Integrated', baseline_output_2023_24_t: 2900000, baseline_intensity_2023_24: 0.6120, target_2025_26: 0.6074, target_2026_27: 0.5955 },
  { registration_number: 'CCC-CEM-003', plant_name: 'UltraTech Cement Ltd - Rajashree Cement Works', sub_sector: 'Integrated', baseline_output_2023_24_t: 3100000, baseline_intensity_2023_24: 0.6280, target_2025_26: 0.6233, target_2026_27: 0.6110 },
  { registration_number: 'CCC-CEM-004', plant_name: 'Ambuja Cements Ltd - Darlaghat Cement Works', sub_sector: 'Integrated', baseline_output_2023_24_t: 2400000, baseline_intensity_2023_24: 0.6350, target_2025_26: 0.6302, target_2026_27: 0.6179 },
  { registration_number: 'CCC-CEM-005', plant_name: 'Ambuja Cements Ltd - Maratha Cement Works (Chandrapur)', sub_sector: 'Integrated', baseline_output_2023_24_t: 2450000, baseline_intensity_2023_24: 0.6295, target_2025_26: 0.6248, target_2026_27: 0.6125 },
  { registration_number: 'CCC-CEM-006', plant_name: 'ACC Ltd - Wadi Cement Works', sub_sector: 'Integrated', baseline_output_2023_24_t: 2800000, baseline_intensity_2023_24: 0.6150, target_2025_26: 0.6104, target_2026_27: 0.5984 },
  { registration_number: 'CCC-CEM-007', plant_name: 'ACC Ltd - Chaibasa Cement Works', sub_sector: 'Integrated', baseline_output_2023_24_t: 1900000, baseline_intensity_2023_24: 0.6380, target_2025_26: 0.6332, target_2026_27: 0.6208 },
  { registration_number: 'CCC-CEM-008', plant_name: 'Dalmia Bharat Cement Ltd - Dalmiapuram Unit (Ariyalur)', sub_sector: 'Integrated', baseline_output_2023_24_t: 1600000, baseline_intensity_2023_24: 0.6485, target_2025_26: 0.6436, target_2026_27: 0.6310 },
  { registration_number: 'CCC-CEM-009', plant_name: 'Dalmia Bharat Cement Ltd - Kadapa Unit', sub_sector: 'Integrated', baseline_output_2023_24_t: 1800000, baseline_intensity_2023_24: 0.5920, target_2025_26: 0.5875, target_2026_27: 0.5760 },
  { registration_number: 'CCC-CEM-010', plant_name: 'Shree Cement Ltd - Ras Cement Complex', sub_sector: 'Integrated', baseline_output_2023_24_t: 3500000, baseline_intensity_2023_24: 0.5520, target_2025_26: 0.5478, target_2026_27: 0.5371 },
  { registration_number: 'CCC-CEM-011', plant_name: 'Shree Cement Ltd - Baloda Bazar Unit', sub_sector: 'Integrated', baseline_output_2023_24_t: 2600000, baseline_intensity_2023_24: 0.5610, target_2025_26: 0.5568, target_2026_27: 0.5459 },
  { registration_number: 'CCC-CEM-012', plant_name: 'Nuvoco Vistas Corp Ltd - Sonadih Cement Plant', sub_sector: 'Integrated', baseline_output_2023_24_t: 2100000, baseline_intensity_2023_24: 0.6050, target_2025_26: 0.6004, target_2026_27: 0.5887 },
  { registration_number: 'CCC-CEM-013', plant_name: 'UltraTech Cement Ltd - Mundra Grinding Unit (Gujarat)', sub_sector: 'Grinding', baseline_output_2023_24_t: 1650000, baseline_intensity_2023_24: 0.0245, target_2025_26: null, target_2026_27: 0.0229 },
  { registration_number: 'CCC-CEM-014', plant_name: 'UltraTech Cement Ltd - Paradip Grinding Unit (Odisha)', sub_sector: 'Grinding', baseline_output_2023_24_t: 1100000, baseline_intensity_2023_24: 0.0210, target_2025_26: null, target_2026_27: 0.0196 },
  { registration_number: 'CCC-CEM-015', plant_name: 'Ambuja Cements Ltd - Durgapur Grinding Facility (WB)', sub_sector: 'Grinding', baseline_output_2023_24_t: 1250000, baseline_intensity_2023_24: 0.0225, target_2025_26: null, target_2026_27: 0.0210 },
  { registration_number: 'CCC-CEM-016', plant_name: 'ACC Ltd - Tikaria Grinding Unit (UP)', sub_sector: 'Grinding', baseline_output_2023_24_t: 1400000, baseline_intensity_2023_24: 0.0280, target_2025_26: null, target_2026_27: 0.0262 },
  { registration_number: 'CCC-CEM-017', plant_name: 'Dalmia Bharat Cement Ltd - Medinipur Grinding Unit', sub_sector: 'Grinding', baseline_output_2023_24_t: 1300000, baseline_intensity_2023_24: 0.0230, target_2025_26: null, target_2026_27: 0.0215 },
  { registration_number: 'CCC-CEM-018', plant_name: 'Shree Cement Ltd - Suratgarh Grinding Unit', sub_sector: 'Grinding', baseline_output_2023_24_t: 1500000, baseline_intensity_2023_24: 0.0260, target_2025_26: null, target_2026_27: 0.0243 },
];

export const BenchmarkTargetModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSelectPlantBenchmark: (bench: OfficialBenchmarkTarget) => void;
}> = ({ isOpen, onClose, onSelectPlantBenchmark }) => {
  const [filterType, setFilterType] = useState<'All' | 'Integrated' | 'Grinding'>('All');
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filtered = INITIAL_OFFICIAL_TARGETS.filter((p) => {
    const matchType = filterType === 'All' || p.sub_sector === filterType;
    const matchText = p.plant_name.toLowerCase().includes(search.toLowerCase()) || p.registration_number.toLowerCase().includes(search.toLowerCase());
    return matchType && matchText;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[85vh] flex flex-col overflow-hidden border border-[#D5D5D0]">
        <div className="p-5 border-b border-[#E5E5E0] flex justify-between items-start bg-[#FAFAF8]">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold uppercase text-[#1967D2] bg-[#E8F0FE] px-2 py-0.5 rounded border border-[#C2D7FA]">
                Official Gazette G.S.R. 739(E)
              </span>
              <TagBadge tag="Official" />
            </div>
            <h3 className="text-lg font-serif font-bold text-[#1A1A1A] mt-1">
              Table 2: Obligated Cement Entities & Notified Intensity Targets
            </h3>
            <p className="text-xs text-[#555555] mt-0.5">
              Select any real obligated entity to compare or map against Nimbus plants.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-xl font-bold px-2 py-1"
          >
            ✕
          </button>
        </div>

        <div className="p-4 border-b border-[#F0F0EB] flex flex-col sm:flex-row justify-between items-center gap-3 bg-white">
          <input
            type="text"
            placeholder="Search plant name, company, or CCC registration..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-80 px-3 py-1.5 border border-[#D5D5D0] rounded text-xs focus:ring-1 focus:ring-[#8B261E]"
          />

          <div className="flex space-x-2 text-xs">
            {(['All', 'Integrated', 'Grinding'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1 rounded border text-xs font-medium ${
                  filterType === t
                    ? 'bg-[#8B261E] text-white border-[#8B261E]'
                    : 'bg-[#FAFAF8] text-[#555555] border-[#D5D5D0] hover:bg-[#F5F5F3]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <table className="min-w-full text-xs divide-y divide-[#E5E5E0]">
            <thead className="bg-[#FAFAF8] text-[#555555] font-semibold sticky top-0">
              <tr>
                <th className="py-2.5 px-3 text-left">Reg Number</th>
                <th className="py-2.5 px-3 text-left">Obligated Entity (Plant)</th>
                <th className="py-2.5 px-2 text-left">Sub-Sector</th>
                <th className="py-2.5 px-3 text-right">FY24 Baseline Output</th>
                <th className="py-2.5 px-3 text-right">FY24 Baseline Intensity</th>
                <th className="py-2.5 px-3 text-right">FY26 Target</th>
                <th className="py-2.5 px-3 text-right">FY27 Target</th>
                <th className="py-2.5 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F0EB]">
              {filtered.map((item) => {
                const cutPct = ((item.baseline_intensity_2023_24 - item.target_2026_27) / item.baseline_intensity_2023_24) * 100;
                return (
                  <tr key={item.registration_number} className="hover:bg-[#FDF5F4]">
                    <td className="py-2.5 px-3 font-mono font-bold text-[#1A1A1A]">{item.registration_number}</td>
                    <td className="py-2.5 px-3 text-[#1A1A1A] font-medium">{item.plant_name}</td>
                    <td className="py-2.5 px-2">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] ${item.sub_sector === 'Integrated' ? 'bg-[#EBF2FA] text-[#185ADB]' : 'bg-[#F0F8F3] text-[#1E5F3B]'}`}>
                        {item.sub_sector}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-[#555555]">
                      {(item.baseline_output_2023_24_t / 1000000).toFixed(2)} Mt
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-semibold text-[#1A1A1A]">
                      {item.baseline_intensity_2023_24.toFixed(4)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-[#737373]">
                      {item.target_2025_26 ? item.target_2025_26.toFixed(4) : '—'}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-[#8B261E]">
                      {item.target_2026_27.toFixed(4)}{' '}
                      <span className="text-[10px] text-[#737373] font-normal">(-{cutPct.toFixed(1)}%)</span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <button
                        onClick={() => {
                          onSelectPlantBenchmark(item);
                          onClose();
                        }}
                        className="px-2 py-1 bg-[#8B261E] text-white rounded text-[11px] hover:bg-[#731F18]"
                      >
                        Apply / Map
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-[#FAFAF8] border-t border-[#E5E5E0] text-[11px] text-[#737373] flex justify-between items-center">
          <span>Source: Ministry of Environment, Forest & Climate Change (MoEFCC) / BEE — Gazette G.S.R. 739(E)</span>
          <span className="font-mono">18 Obligated Benchmark Entities Loaded</span>
        </div>
      </div>
    </div>
  );
};
