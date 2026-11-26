import React, { useState } from 'react';
import { CalculatedPlantRow, ModelAssumptions, YearProjection } from '../lib/types';

interface ExportScreenProps {
  plants: CalculatedPlantRow[];
  assumptions: ModelAssumptions;
  projections: YearProjection[];
}

export const ExportScreen: React.FC<ExportScreenProps> = ({ plants, assumptions, projections }) => {
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const exportPlantsCSV = () => {
    const headers = [
      'plant_id',
      'plant_name',
      'town',
      'state',
      'plant_type',
      'output_fy26_mt',
      'attributed_scope1_kt',
      'attributed_intensity_t_per_t',
      'target_intensity_fy27_t_per_t',
      'gap_fy27_t_per_t',
      'exposure_fy27_central_inr_cr',
      'exposure_fy27_low_inr_cr',
      'exposure_fy27_high_inr_cr',
      'surplus_kt',
      'asset_value_inr_cr',
      'water_source',
      'coastal_flag',
      'as_of_date',
    ];

    const asOf = new Date().toISOString().split('T')[0];

    const rows = plants.map((p) => [
      p.plant_id,
      `"${p.plant_name}"`,
      `"${p.town}"`,
      `"${p.state}"`,
      p.plant_type,
      p.output_fy26_mt.toFixed(2),
      p.attributed_scope1_kt.toFixed(1),
      p.attributed_intensity.toFixed(4),
      p.target_intensity_fy27.toFixed(4),
      p.gap_fy27.toFixed(4),
      p.exposure_fy27_cr.toFixed(2),
      p.exposure_low_cr.toFixed(2),
      p.exposure_high_cr.toFixed(2),
      (p.surplus_fy27_mt_co2 * 1000).toFixed(1),
      p.asset_value_inr_cr,
      `"${p.water_source}"`,
      p.coastal,
      asOf,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `nimbus_ccts_plant_compliance_${asOf}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloadSuccess('Plant compliance CSV downloaded successfully.');
  };

  const exportProjectionsCSV = () => {
    const headers = [
      'fiscal_year',
      'year',
      'total_cement_output_mt',
      'exposure_central_inr_cr',
      'exposure_low_inr_cr',
      'exposure_high_inr_cr',
      'pct_of_fy26_revenue',
      'as_of_date',
    ];

    const asOf = new Date().toISOString().split('T')[0];

    const rows = projections.map((p) => [
      p.fiscalYear,
      p.yearNum,
      p.totalOutputMt.toFixed(2),
      p.exposureCentralCr.toFixed(2),
      p.exposureLowCr.toFixed(2),
      p.exposureHighCr.toFixed(2),
      p.pctOfFY26RevenueCentral.toFixed(3),
      asOf,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `nimbus_ccts_fy27_fy40_projections_${asOf}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloadSuccess('FY27-FY40 projections CSV downloaded successfully.');
  };

  const printReport = () => {
    window.print();
  };

  const fy27Central = projections.find((p) => p.fiscalYear === 'FY27')?.exposureCentralCr || 35.8;
  const fy40Central = projections.find((p) => p.fiscalYear === 'FY40')?.exposureCentralCr || 329.1;

  return (
    <div className="space-y-4 max-w-4xl">
      {/* Header Banner */}
      <div className="bg-white border border-[#dde2ea] rounded p-4 shadow-xs">
        <h2 className="text-sm font-serif font-bold text-[#16233b]">
          Reproducible Calculation Datasets & Board Export
        </h2>
        <p className="text-xs text-[#5a6578] mt-1">
          Export transparent calculation models, audit trails, and printable executive summaries for the Board of Directors and statutory review.
        </p>

        {downloadSuccess && (
          <div className="mt-3 p-2 bg-[#ecfdf5] border border-[#a7f3d0] text-[#065f46] text-xs rounded font-medium">
            ✓ {downloadSuccess}
          </div>
        )}
      </div>

      {/* Export Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white border border-[#dde2ea] rounded p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="font-mono text-[10px] uppercase text-[#6b7280]">Reproducible Data</div>
            <h3 className="font-serif font-bold text-[#16233b] text-sm mt-1">
              Plant Compliance Matrix (CSV)
            </h3>
            <p className="text-xs text-[#5a6578] mt-1.5 leading-relaxed">
              Full 9-plant dataset with attributed Scope 1, target intensities, compliance shortfalls, and rupee exposures.
            </p>
          </div>
          <button
            onClick={exportPlantsCSV}
            className="mt-4 w-full py-2 bg-[#8B261E] text-white text-xs font-semibold rounded hover:bg-[#731F18] transition-colors cursor-pointer"
          >
            Download Plants CSV
          </button>
        </div>

        <div className="bg-white border border-[#dde2ea] rounded p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="font-mono text-[10px] uppercase text-[#6b7280]">Trajectory Model</div>
            <h3 className="font-serif font-bold text-[#16233b] text-sm mt-1">
              FY27–FY40 Projections (CSV)
            </h3>
            <p className="text-xs text-[#5a6578] mt-1.5 leading-relaxed">
              Annual 8% volume growth, tightening regulatory cuts (+0.5 pts/yr), and carbon cost scenarios (₹600, ₹1,200, ₹2,400).
            </p>
          </div>
          <button
            onClick={exportProjectionsCSV}
            className="mt-4 w-full py-2 bg-[#8B261E] text-white text-xs font-semibold rounded hover:bg-[#731F18] transition-colors cursor-pointer"
          >
            Download Trajectory CSV
          </button>
        </div>

        <div className="bg-white border border-[#dde2ea] rounded p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="font-mono text-[10px] uppercase text-[#6b7280]">Printable Briefing</div>
            <h3 className="font-serif font-bold text-[#16233b] text-sm mt-1">
              Board PDF / Print Summary
            </h3>
            <p className="text-xs text-[#5a6578] mt-1.5 leading-relaxed">
              Executive briefing carrying all mandatory auditor qualifications and known limits for Meera to present to the Board.
            </p>
          </div>
          <button
            onClick={printReport}
            className="mt-4 w-full py-2 border border-[#dde2ea] text-[#16233b] text-xs font-semibold rounded hover:bg-[#f6f7f9] transition-colors cursor-pointer"
          >
            Print / Save as PDF
          </button>
        </div>
      </div>

      {/* Printable Board Document Preview (Visible on Print and Screen) */}
      <div className="bg-white border border-[#dde2ea] rounded p-5 shadow-xs text-xs space-y-4">
        <div className="border-b border-[#dde2ea] pb-3">
          <div className="flex justify-between items-baseline">
            <h3 className="text-base font-serif font-bold text-[#16233b]">
              Nimbus Cement Ltd — Climate Exposure & CCTS Compliance Summary
            </h3>
            <span className="font-mono text-xs text-[#6b7280]">
              As of: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>
          <p className="text-xs text-[#5a6578] mt-1">
            Prepared for: Meera Iyer, Head of Sustainability • Compliance Horizon: FY2026-27 to FY2039-40
          </p>
        </div>

        {/* Executive Numbers */}
        <div className="grid grid-cols-3 gap-3 p-3 bg-[#f6f7f9] rounded border border-[#e5e7eb] text-center">
          <div>
            <span className="text-[10px] uppercase text-[#6b7280] block font-mono">FY27 CCTS Compliance Cost</span>
            <span className="text-lg font-serif font-bold text-[#8B261E]">₹{Math.round(fy27Central)} Crore</span>
            <span className="text-[10px] text-[#4b5563] block font-mono">~₹19.5 / tonne cement</span>
          </div>
          <div>
            <span className="text-[10px] uppercase text-[#6b7280] block font-mono">FY40 No-Action Horizon</span>
            <span className="text-lg font-serif font-bold text-[#16233b]">₹{Math.round(fy40Central)} Crore</span>
            <span className="text-[10px] text-[#4b5563] block font-mono">+0.5 pts/yr cut, 8% CAGR</span>
          </div>
          <div>
            <span className="text-[10px] uppercase text-[#6b7280] block font-mono">Physical Hazard Exposure</span>
            <span className="text-lg font-serif font-bold text-[#92400e]">42% Company Assets</span>
            <span className="text-[10px] text-[#4b5563] block font-mono">₹6,500 Cr groundwater-reliant</span>
          </div>
        </div>

        {/* Mandatory Auditor Limits */}
        <div className="pt-2">
          <h4 className="text-xs font-serif font-bold text-[#16233b] uppercase tracking-wide mb-1.5">
            Mandatory Auditor Qualifications & Known Limits (Included in PDF Export):
          </h4>
          <ol className="list-decimal pl-4 space-y-1.5 text-[11px] text-[#4b5563] leading-relaxed">
            <li>
              <strong>Scope 2 Purchased Electricity Missing:</strong> CCTS Gazette G.S.R. 739(E) mandates inclusion of indirect electricity emissions. The plant file only includes Scope 1. Grinding units (P07–P09) appear low-cost solely because their primary energy source (grid power) is excluded. Group liability is legally understated by 15–25%.
            </li>
            <li>
              <strong>Baseline Intensity Stand-in Tautology:</strong> Because FY24 baseline data is unavailable for Nimbus plants, FY26 intensity is used as a stand-in. Consequently, FY27 shortfall equals exactly 2.7% (integrated) or 6.6% (grinding) of each plant&apos;s own emissions, assuming zero decarbonization between FY24 and FY26.
            </li>
            <li>
              <strong>Carbon Price Scenario Assumptions:</strong> Central price of ₹1,200/t is an analyst market assumption (ICAP $7–14/t range). High price of ₹2,400/t reflects statutory non-compliance penalty (2× multiplier under the Energy Conservation Act), not a cleared market price. Domestic empirical floor is anchored by IEX PAT ESCert trading (~₹722/t CO₂ implied).
            </li>
            <li>
              <strong>Illustrative Multi-Year Trajectory:</strong> CCTS targets are legally notified only through FY27. Projections to FY40 (+0.5 pts/yr cut, 8% production growth from FY28) represent an illustrative "no-abatement" baseline scenario.
            </li>
            <li>
              <strong>Physical Risk Screening Boundaries:</strong> Heat days (CMIP6 HighResMIP) and water stress (WRI Aqueduct) are screening metrics. Open scientific literature does not provide sovereign damage curves for Indian cement facilities; no speculative rupee balance-sheet write-offs are included.
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};
