import React from 'react';
import { DATA_SOURCES_REGISTRY } from '../lib/sourcesRegistry';
import { TagBadge } from './TagBadge';

export const SourcesScreen: React.FC = () => {
  return (
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
  );
};
