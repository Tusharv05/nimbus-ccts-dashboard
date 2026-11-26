import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'official_cement_targets.csv');
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Benchmark targets file not found' }, { status: 404 });
    }
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const parsed = Papa.parse(fileContent, { header: true, skipEmptyLines: true });

    return NextResponse.json({
      source: 'Official Gazette G.S.R. 739(E) Table 2',
      count: parsed.data.length,
      data: parsed.data,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
