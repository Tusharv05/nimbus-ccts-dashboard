import { NextResponse } from 'next/server';
import { queryDb } from '@/lib/db';
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

export async function GET() {
  try {
    // 1. If Neon/PostgreSQL is connected, attempt DB fetch
    if (process.env.DATABASE_URL) {
      try {
        const rows = await queryDb('SELECT * FROM nimbus_plants ORDER BY plant_id ASC');
        if (rows && rows.length > 0) {
          return NextResponse.json({ source: 'Neon PostgreSQL Database', data: rows });
        }
      } catch (dbErr) {
        console.warn('PostgreSQL query error, falling back to local file system:', dbErr);
      }
    }

    // 2. Otherwise load directly from server filesystem (/data/nimbus_cement_plants.csv)
    const filePath = path.join(process.cwd(), 'data', 'nimbus_cement_plants.csv');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const parsed = Papa.parse(fileContent, { header: true, skipEmptyLines: true });

    return NextResponse.json({
      source: 'Next.js Backend Server API (data/nimbus_cement_plants.csv)',
      plantCount: parsed.data.length,
      data: parsed.data,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
