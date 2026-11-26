export interface RawPlantRow {
  plant_id: string;
  plant_name: string;
  town: string;
  state: string;
  latitude: number;
  longitude: number;
  plant_type: 'Integrated' | 'Grinding';
  cement_capacity_mtpa: number;
  cement_output_fy2025_26_mt: number;
  clinker_produced_fy2025_26_mt: number;
  clinker_shipped_fy2025_26_mt: number;
  scope1_co2_fy2025_26_kt: number;
  water_source: string;
  coastal: 'Yes' | 'No';
  asset_value_inr_cr: number;
  revenue_fy2025_26_inr_cr: number;
  employees: number;
  notes: string;
}

export type AllocationBasis = 'CCTS' | 'Economic';

export type TagType = 'Official' | 'Data' | 'Assumption';

export interface AssumptionItem {
  id: string;
  name: string;
  value: number;
  unit: string;
  source: string;
  sourceUrl: string;
  tag: TagType;
  description: string;
}

export interface PlantTargetOfficialRow {
  registration_number: string;
  plant_name: string;
  sub_sector: string;
  baseline_output_2023_24_t: number;
  baseline_intensity_2023_24: number;
  target_2025_26?: number | null;
  target_2026_27: number;
}

export interface CalculatedPlantRow {
  plant_id: string;
  plant_name: string;
  town: string;
  state: string;
  plant_type: 'Integrated' | 'Grinding';
  output_fy26_mt: number;
  clinker_produced_mt: number;
  clinker_shipped_mt: number;
  clinker_received_mt: number;
  filed_scope1_kt: number;
  attributed_scope1_kt: number;
  filed_intensity: number; // tCO2 / t cement
  attributed_intensity: number; // tCO2 / t cement
  target_intensity_fy27: number;
  gap_fy27: number; // intensity - target (positive is shortfall, negative is surplus)
  exposure_fy27_cr: number; // under chosen or central carbon price
  exposure_low_cr: number;
  exposure_high_cr: number;
  surplus_fy27_mt_co2: number; // if gap < 0, |gap| * output
  asset_value_inr_cr: number;
  water_source: string;
  coastal: 'Yes' | 'No';
  revenue_fy26_inr_cr: number;
  notes: string;
  explanation: {
    clinkerTransferredEmissionsKt: number;
    kilnFactor?: number;
    formula: string;
  };
}

export interface ModelAssumptions {
  integratedCutFY27Pct: number; // default 2.7
  grindingCutFY27Pct: number; // default 6.6
  annualTargetCutStepPts: number; // default 0.5 points per year from FY28
  outputGrowthFromFY28Pct: number; // default 8.0 %
  priceLowInr: number; // default 600
  priceCentralInr: number; // default 1200
  priceHighInr: number; // default 2400
}

export interface YearProjection {
  fiscalYear: string; // "FY27", "FY28", ..., "FY40"
  yearNum: number; // 2027 to 2040
  totalOutputMt: number;
  exposureLowCr: number;
  exposureCentralCr: number;
  exposureHighCr: number;
  surplusVolumeKt: number;
  pctOfFY26RevenueCentral: number;
}
