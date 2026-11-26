import React from 'react';
import { DATA_SOURCES_REGISTRY } from '../lib/sourcesRegistry';
import { TagBadge } from './TagBadge';

export const SourcesScreen: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="bg-[#FFFFFF] border border-[#E5E5E0] rounded p-6 shadow-sm">
        <h2 className="text-xl font-serif font-bold text-[#1A1A1A]">
          Data Sources & Regulatory Register
        </h2>
        <p className="text-xs text-[#737373] mt-1">
          Every figure, formula, and scenario in this product traces directly to the official regulatory and scientific registers below.
          Invented numbers are strictly prohibited under the audit rules.
        </p>
      </div>

      <div className="bg-[#FFFFFF] border border-[#E5E5E0] rounded shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#E5E5E0] text-xs">
            <thead className="bg-[#FAFAF8] text-[#555555] font-semibold text-left">
              <tr>
                <th className="py-3 px-4">Source & Institution</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Audit Tag</th>
                <th className="py-3 px-4">Used For</th>
                <th className="py-3 px-3">Licence & Access</th>
                <th className="py-3 px-3 text-right">Reference Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F0EB] bg-white">
              {DATA_SOURCES_REGISTRY.map((src) => (
                <tr key={src.id} className="hover:bg-[#FAFAF8]">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-[#1A1A1A]">{src.name}</div>
                    <div className="text-[11px] text-[#737373] mt-0.5">{src.notes}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] bg-[#F5F5F3] text-[#555555] font-mono font-medium">
                      {src.v1Status}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <TagBadge tag={src.tag} />
                  </td>
                  <td className="py-3 px-4 text-[#555555] max-w-xs">{src.usedFor}</td>
                  <td className="py-3 px-3 text-[11px] text-[#737373]">{src.licence}</td>
                  <td className="py-3 px-3 text-right font-mono">
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
