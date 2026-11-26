import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { parseAndCalculatePlants } from '../src/lib/csvParser';
import { projectYears } from '../src/lib/calculator';

describe('Nimbus Cement Calculation Engine', () => {
  const csvPath = path.resolve(__dirname, '../data/nimbus_cement_plants.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf-8');

  it('parses CSV and validates clinker transfers (2.40 Mt shipped = 2.40 Mt received)', () => {
    const result = parseAndCalculatePlants(csvContent, 'CCTS');
    expect(result.errors).toHaveLength(0);
    expect(result.plants).toHaveLength(9);
    expect(result.totalOutputMt).toBeCloseTo(18.35, 2);
    expect(result.totalScope1Kt).toBeCloseTo(10932, 1);
    expect(result.totalRevenueCr).toBeCloseTo(9658, 1);
  });

  it('reconciles total company emissions to exactly 10,932 kt on both CCTS and Economic bases', () => {
    const cctsResult = parseAndCalculatePlants(csvContent, 'CCTS');
    const economicResult = parseAndCalculatePlants(csvContent, 'Economic');

    const cctsTotalEmissions = cctsResult.plants.reduce((sum, p) => sum + p.attributed_scope1_kt, 0);
    const econTotalEmissions = economicResult.plants.reduce((sum, p) => sum + p.attributed_scope1_kt, 0);

    expect(cctsTotalEmissions).toBeCloseTo(10932, 1);
    expect(econTotalEmissions).toBeCloseTo(10932, 1);
  });

  it('matches expected intensities on the Economic allocation basis from PRD', () => {
    // Expected intensities (tCO2/t cement):
    // P01 0.638, P02 0.604, P03 0.629, P04 0.554, P05 0.648, P06 0.557, P07 0.658, P08 0.551, P09 0.430; group 0.596
    const expectedIntensities: Record<string, number> = {
      P01: 0.638,
      P02: 0.604,
      P03: 0.629,
      P04: 0.554,
      P05: 0.648,
      P06: 0.557,
      P07: 0.658,
      P08: 0.551,
      P09: 0.430,
    };

    const economicResult = parseAndCalculatePlants(csvContent, 'Economic');
    for (const plant of economicResult.plants) {
      const expected = expectedIntensities[plant.plant_id];
      // Expected PRD values are rounded to 3 decimal places (e.g. 0.658 vs 0.65725)
      expect(Math.round(plant.attributed_intensity * 1000) / 1000).toBeCloseTo(expected, 3);
    }

    const groupIntensity = economicResult.totalScope1Kt / (economicResult.totalOutputMt * 1000);
    expect(groupIntensity).toBeCloseTo(0.596, 3);
  });

  it('reconciles default FY27 CCTS exposure: ~₹35.8-36 crore Central, ~₹18 crore Low, ~₹72 crore High', () => {
    const cctsResult = parseAndCalculatePlants(csvContent, 'CCTS');
    const totalExposureCentral = cctsResult.plants.reduce((sum, p) => sum + p.exposure_fy27_cr, 0);
    const totalExposureLow = cctsResult.plants.reduce((sum, p) => sum + p.exposure_low_cr, 0);
    const totalExposureHigh = cctsResult.plants.reduce((sum, p) => sum + p.exposure_high_cr, 0);

    expect(totalExposureCentral).toBeCloseTo(35.8, 0);
    expect(totalExposureLow).toBeCloseTo(17.9, 0);
    expect(totalExposureHigh).toBeCloseTo(71.6, 0);
  });

  it('reconciles FY40 Central exposure projection: ~₹329 crore with flat prices and 8% growth from FY28', () => {
    const cctsResult = parseAndCalculatePlants(csvContent, 'CCTS');
    const assumptions = {
      integratedCutFY27Pct: 2.7,
      grindingCutFY27Pct: 6.6,
      annualTargetCutStepPts: 0.5,
      outputGrowthFromFY28Pct: 8.0,
      priceLowInr: 600,
      priceCentralInr: 1200,
      priceHighInr: 2400
    };
    const projections = projectYears(cctsResult.plants, assumptions, 9658);
    const fy40 = projections.find(p => p.fiscalYear === 'FY40');
    expect(fy40).toBeDefined();
    // PRD Section 8 reference sanity check: FY40 Central about ₹329 crore
    expect(fy40!.exposureCentralCr).toBeCloseTo(329, -1);
  });
});
