/**
 * Seed script to push Nimbus Cement data and BEE targets into Neon PostgreSQL.
 * Usage:
 *   $env:DATABASE_URL="postgresql://user:pass@ep-xyz.neon.tech/neondb?sslmode=require"
 *   node scripts/seed-neon.mjs
 */

import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('ERROR: DATABASE_URL environment variable is missing.');
  console.error('Example: export DATABASE_URL="postgresql://username:password@ep-xyz.neon.tech/neondb?sslmode=require"');
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

async function runSeed() {
  const client = await pool.connect();
  console.log('Connected successfully to Neon PostgreSQL database.');

  try {
    // 1. Create Tables
    console.log('Creating database tables...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS nimbus_plants (
        plant_id VARCHAR(10) PRIMARY KEY,
        plant_name VARCHAR(150) NOT NULL,
        town VARCHAR(100) NOT NULL,
        state VARCHAR(100) NOT NULL,
        latitude NUMERIC(8, 4) NOT NULL,
        longitude NUMERIC(8, 4) NOT NULL,
        plant_type VARCHAR(50) NOT NULL,
        cement_capacity_mtpa NUMERIC(6, 2) NOT NULL,
        cement_output_fy2025_26_mt NUMERIC(6, 2) NOT NULL,
        clinker_produced_fy2025_26_mt NUMERIC(6, 2) NOT NULL,
        clinker_shipped_fy2025_26_mt NUMERIC(6, 2) NOT NULL,
        scope1_co2_fy2025_26_kt NUMERIC(8, 2) NOT NULL,
        water_source VARCHAR(100),
        coastal VARCHAR(10),
        asset_value_inr_cr NUMERIC(10, 2) NOT NULL,
        revenue_fy2025_26_inr_cr NUMERIC(10, 2) NOT NULL,
        employees INT,
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS official_plant_targets (
        registration_number VARCHAR(50) PRIMARY KEY,
        plant_name VARCHAR(150) NOT NULL,
        sub_sector VARCHAR(50) NOT NULL,
        baseline_output_2023_24_t NUMERIC(12, 2) NOT NULL,
        baseline_intensity_2023_24 NUMERIC(8, 4) NOT NULL,
        target_2025_26 NUMERIC(8, 4),
        target_2026_27 NUMERIC(8, 4) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Ingest Nimbus Plants CSV
    console.log('Ingesting nimbus_cement_plants.csv...');
    const plantCsvPath = path.resolve(process.cwd(), 'data/nimbus_cement_plants.csv');
    const plantCsvContent = fs.readFileSync(plantCsvPath, 'utf8');
    const parsedPlants = Papa.parse(plantCsvContent, { header: true, skipEmptyLines: true });

    for (const row of parsedPlants.data) {
      if (!row.plant_id) continue;
      await client.query(`
        INSERT INTO nimbus_plants (
          plant_id, plant_name, town, state, latitude, longitude,
          plant_type, cement_capacity_mtpa, cement_output_fy2025_26_mt,
          clinker_produced_fy2025_26_mt, clinker_shipped_fy2025_26_mt,
          scope1_co2_fy2025_26_kt, water_source, coastal,
          asset_value_inr_cr, revenue_fy2025_26_inr_cr, employees, notes
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18
        )
        ON CONFLICT (plant_id) DO UPDATE SET
          cement_output_fy2025_26_mt = EXCLUDED.cement_output_fy2025_26_mt,
          scope1_co2_fy2025_26_kt = EXCLUDED.scope1_co2_fy2025_26_kt,
          asset_value_inr_cr = EXCLUDED.asset_value_inr_cr,
          revenue_fy2025_26_inr_cr = EXCLUDED.revenue_fy2025_26_inr_cr,
          notes = EXCLUDED.notes;
      `, [
        row.plant_id, row.plant_name, row.town, row.state,
        parseFloat(row.latitude) || 0, parseFloat(row.longitude) || 0,
        row.plant_type, parseFloat(row.cement_capacity_mtpa) || 0,
        parseFloat(row.cement_output_fy2025_26_mt) || 0,
        parseFloat(row.clinker_produced_fy2025_26_mt) || 0,
        parseFloat(row.clinker_shipped_fy2025_26_mt) || 0,
        parseFloat(row.scope1_co2_fy2025_26_kt) || 0,
        row.water_source, row.coastal,
        parseFloat(row.asset_value_inr_cr) || 0,
        parseFloat(row.revenue_fy2025_26_inr_cr) || 0,
        parseInt(row.employees) || 0, row.notes
      ]);
    }
    console.log(`✓ Inserted/Updated ${parsedPlants.data.length} plants into 'nimbus_plants'.`);

    // 3. Ingest Official BEE Targets CSV
    console.log('Ingesting official_cement_targets.csv...');
    const targetsCsvPath = path.resolve(process.cwd(), 'data/official_cement_targets.csv');
    if (fs.existsSync(targetsCsvPath)) {
      const targetsCsv = fs.readFileSync(targetsCsvPath, 'utf8');
      const parsedTargets = Papa.parse(targetsCsv, { header: true, skipEmptyLines: true });
      for (const row of parsedTargets.data) {
        if (!row.registration_number) continue;
        await client.query(`
          INSERT INTO official_plant_targets (
            registration_number, plant_name, sub_sector,
            baseline_output_2023_24_t, baseline_intensity_2023_24,
            target_2025_26, target_2026_27
          ) VALUES ($1, $2, $3, $4, $5, $6, $7)
          ON CONFLICT (registration_number) DO UPDATE SET
            baseline_intensity_2023_24 = EXCLUDED.baseline_intensity_2023_24,
            target_2026_27 = EXCLUDED.target_2026_27;
        `, [
          row.registration_number, row.plant_name, row.sub_sector,
          parseFloat(row.baseline_output_2023_24_t) || 0,
          parseFloat(row.baseline_intensity_2023_24) || 0,
          row.target_2025_26 && row.target_2025_26 !== '-' ? parseFloat(row.target_2025_26) : null,
          parseFloat(row.target_2026_27) || 0
        ]);
      }
      console.log(`✓ Inserted/Updated ${parsedTargets.data.length} benchmark entities into 'official_plant_targets'.`);
    }

    console.log('\nSUCCESS: Neon PostgreSQL database is completely seeded and ready!');
  } finally {
    client.release();
    await pool.end();
  }
}

runSeed().catch((err) => {
  console.error('Seed execution error:', err);
  process.exit(1);
});
