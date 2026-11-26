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

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="bg-[#FFFFFF] border border-[#E5E5E0] rounded p-6 shadow-sm">
        <h2 className="text-xl font-serif font-bold text-[#1A1A1A]">
          Export & Auditor Compliance Dossier
        </h2>
        <p className="text-xs text-[#737373] mt-1">
          Export verified calculation datasets, parameters, and printable executive summaries for the board and statutory verifier.
        </p>

        {downloadSuccess && (
          <div className="mt-4 p-3 bg-[#E6F4EA] border border-[#CEEAD6] text-[#137333] text-xs rounded font-medium">
            ✓ {downloadSuccess}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-[#FFFFFF] border border-[#E5E5E0] rounded p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="font-mono text-xs uppercase text-[#737373]">Data Extract</div>
            <h3 className="font-serif font-bold text-[#1A1A1A] text-base mt-1">
              Plant Compliance Matrix (CSV)
            </h3>
            <p className="text-xs text-[#555555] mt-2 leading-relaxed">
              Full 9-plant dataset with attributed Scope 1, target intensities, compliance shortfalls, and rupee exposures.
            </p>
          </div>
          <button
            onClick={exportPlantsCSV}
            className="mt-6 w-full py-2 bg-[#8B261E] text-white text-xs font-semibold rounded hover:bg-[#731F18] transition-colors"
          >
            Download Plants CSV
          </button>
        </div>

        <div className="bg-[#FFFFFF] border border-[#E5E5E0] rounded p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="font-mono text-xs uppercase text-[#737373]">Trajectory Model</div>
            <h3 className="font-serif font-bold text-[#1A1A1A] text-base mt-1">
              FY27–FY40 Projections (CSV)
            </h3>
            <p className="text-xs text-[#555555] mt-2 leading-relaxed">
              Annual growth output, tightening regulatory cut steps, and carbon cost scenarios (Low, Central, High).
            </p>
          </div>
          <button
            onClick={exportProjectionsCSV}
            className="mt-6 w-full py-2 bg-[#8B261E] text-white text-xs font-semibold rounded hover:bg-[#731F18] transition-colors"
          >
            Download Projections CSV
          </button>
        </div>

        <div className="bg-[#FFFFFF] border border-[#E5E5E0] rounded p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="font-mono text-xs uppercase text-[#737373]">Board Document</div>
            <h3 className="font-serif font-bold text-[#1A1A1A] text-base mt-1">
              Board PDF / Print Summary
            </h3>
            <p className="text-xs text-[#555555] mt-2 leading-relaxed">
              Clean, formatted document layout designed for Meera to present directly to the Nimbus board and audit committee.
            </p>
          </div>
          <button
            onClick={printReport}
            className="mt-6 w-full py-2 border border-[#D5D5D0] text-[#1A1A1A] text-xs font-semibold rounded hover:bg-[#F5F5F3] transition-colors"
          >
            Generate PDF / Print
          </button>
        </div>
      </div>
    </div>
  );
};
