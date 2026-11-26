import { CalculatedPlantRow, ModelAssumptions, YearProjection } from './types';

export function calculatePlantRow(
  plant: {
    plant_id: string;
    plant_name: string;
    town: string;
    state: string;
    plant_type: 'Integrated' | 'Grinding';
    cement_output_fy2025_26_mt: number;
    clinker_produced_fy2025_26_mt: number;
    clinker_shipped_fy2025_26_mt: number;
    scope1_co2_fy2025_26_kt: number;
    water_source: string;
    coastal: 'Yes' | 'No';
    asset_value_inr_cr: number;
    revenue_fy2025_26_inr_cr: number;
    notes: string;
  },
  clinkerReceivedMt: number,
  economicMovedEmissionsKt: number, // positive for grinding (added), negative for kiln (subtracted)
  allocationBasis: 'CCTS' | 'Economic',
  assumptions: ModelAssumptions
): CalculatedPlantRow {
  const outputMt = plant.cement_output_fy2025_26_mt;
  const filedScope1Kt = plant.scope1_co2_fy2025_26_kt;
  
  // Attributed scope 1 in kt
  const attributedScope1Kt = allocationBasis === 'CCTS' 
    ? filedScope1Kt 
    : filedScope1Kt + economicMovedEmissionsKt;

  // Output in tonnes = outputMt * 1,000,000 tonnes = outputMt * 1,000 kt.
  // Emissions in tonnes = Scope1 kt * 1,000.
  // Intensity = (attributedScope1Kt * 1,000) / (outputMt * 1,000,000) = attributedScope1Kt / (outputMt * 1,000)
  // Let's verify: P01 filed: 3,125 kt / (3.30 Mt * 1000) = 3125 / 3300 = 0.946969... = 0.947 tCO2/t cement! Exactly matches PRD!
  const filedIntensity = filedScope1Kt / (outputMt * 1000);
  const attributedIntensity = attributedScope1Kt / (outputMt * 1000);

  // Target FY27 = baseline * (1 - cut)
  // Baseline stand-in is FY26 intensity
  const cutPct = plant.plant_type === 'Integrated' 
    ? assumptions.integratedCutFY27Pct 
    : assumptions.grindingCutFY27Pct;
  
  const cutFraction = cutPct / 100;
  const baselineIntensity = attributedIntensity; // using FY26 stand-in
  const targetIntensity = baselineIntensity * (1 - cutFraction);

  // Gap = Intensity - Target (in tCO2 / t cement)
  const gap = attributedIntensity - targetIntensity;

  // Shortfall in tonnes CO2 = max(0, gap) * (outputMt * 1,000,000 tonnes cement)
  // Shortfall in kt CO2 = shortfall tonnes / 1,000 = max(0, gap) * outputMt * 1,000
  // Convert to ₹ crore: kt × ₹ per tonne ÷ 10,000 (from prompt specification)
  // Let's verify prompt: "Convert to ₹ crore: kt × ₹ per tonne ÷ 10,000."
  // Shortfall kt = max(0, gap) * outputMt * 1000.
  // Exposure Cr = (Shortfall kt * Price) / 10,000
  const shortfallKt = Math.max(0, gap) * outputMt * 1000;
  const surplusKt = Math.max(0, -gap) * outputMt * 1000;

  const exposureCentral = (shortfallKt * assumptions.priceCentralInr) / 10000;
  const exposureLow = (shortfallKt * assumptions.priceLowInr) / 10000;
  const exposureHigh = (shortfallKt * assumptions.priceHighInr) / 10000;

  return {
    plant_id: plant.plant_id,
    plant_name: plant.plant_name,
    town: plant.town,
    state: plant.state,
    plant_type: plant.plant_type,
    output_fy26_mt: outputMt,
    clinker_produced_mt: plant.clinker_produced_fy2025_26_mt,
    clinker_shipped_mt: plant.clinker_shipped_fy2025_26_mt,
    clinker_received_mt: clinkerReceivedMt,
    filed_scope1_kt: filedScope1Kt,
    attributed_scope1_kt: attributedScope1Kt,
    filed_intensity: filedIntensity,
    attributed_intensity: attributedIntensity,
    target_intensity_fy27: targetIntensity,
    gap_fy27: gap,
    exposure_fy27_cr: exposureCentral,
    exposure_low_cr: exposureLow,
    exposure_high_cr: exposureHigh,
    surplus_fy27_mt_co2: surplusKt / 1000,
    asset_value_inr_cr: plant.asset_value_inr_cr,
    water_source: plant.water_source,
    coastal: plant.coastal,
    revenue_fy26_inr_cr: plant.revenue_fy2025_26_inr_cr,
    notes: plant.notes,
    explanation: {
      clinkerTransferredEmissionsKt: economicMovedEmissionsKt,
      formula: `Intensity = Attributed Scope 1 (${attributedScope1Kt.toFixed(1)} kt) ÷ Output (${outputMt.toFixed(2)} Mt) = ${attributedIntensity.toFixed(3)} tCO2/t. Target = Baseline × (1 - ${cutPct}%) = ${targetIntensity.toFixed(3)} tCO2/t. Shortfall = max(0, ${(attributedIntensity - targetIntensity).toFixed(4)}) × ${outputMt.toFixed(2)} Mt = ${shortfallKt.toFixed(1)} kt. Exposure = ${shortfallKt.toFixed(1)} kt × ₹${assumptions.priceCentralInr}/t ÷ 10,000 = ₹${exposureCentral.toFixed(2)} Cr.`
    }
  };
}

export function projectYears(
  plants: CalculatedPlantRow[],
  assumptions: ModelAssumptions,
  companyRevenueFY26Cr: number = 9658
): YearProjection[] {
  const projections: YearProjection[] = [];

  for (let year = 2027; year <= 2040; year++) {
    const fyLabel = `FY${year.toString().slice(-2)}`;
    const yearsAfter27 = year - 2027;
    
    // Growth: FY27 held at FY26 level; 8% a year from FY28
    const outputMultiplier = year === 2027 ? 1.0 : Math.pow(1 + assumptions.outputGrowthFromFY28Pct / 100, yearsAfter27);

    // Additional cut: +0.5 points per year from FY28
    const extraCutPct = year === 2027 ? 0 : yearsAfter27 * assumptions.annualTargetCutStepPts;

    let totalOutputMt = 0;
    let totalExposureLow = 0;
    let totalExposureCentral = 0;
    let totalExposureHigh = 0;
    let totalSurplusKt = 0;

    for (const plant of plants) {
      const plantOutput = plant.output_fy26_mt * outputMultiplier;
      totalOutputMt += plantOutput;

      const baseCutPct = plant.plant_type === 'Integrated' 
        ? assumptions.integratedCutFY27Pct 
        : assumptions.grindingCutFY27Pct;
      
      const totalCutPct = baseCutPct + extraCutPct;
      const targetIntensity = plant.attributed_intensity * (1 - totalCutPct / 100);
      const gap = plant.attributed_intensity - targetIntensity;

      const shortfallKt = Math.max(0, gap) * plantOutput * 1000;
      const surplusKt = Math.max(0, -gap) * plantOutput * 1000;

      totalExposureLow += (shortfallKt * assumptions.priceLowInr) / 10000;
      totalExposureCentral += (shortfallKt * assumptions.priceCentralInr) / 10000;
      totalExposureHigh += (shortfallKt * assumptions.priceHighInr) / 10000;
      totalSurplusKt += surplusKt;
    }

    projections.push({
      fiscalYear: fyLabel,
      yearNum: year,
      totalOutputMt,
      exposureLowCr: totalExposureLow,
      exposureCentralCr: totalExposureCentral,
      exposureHighCr: totalExposureHigh,
      surplusVolumeKt: totalSurplusKt,
      pctOfFY26RevenueCentral: (totalExposureCentral / companyRevenueFY26Cr) * 100
    });
  }

  return projections;
}
