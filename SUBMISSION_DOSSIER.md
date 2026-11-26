# Oren Product Manager Assessment: Complete Submission Dossier

**Product**: Nimbus Climate Exposure Dashboard (v1 Transition Risk & Physical Screening)  
**Role**: Product Manager for Meera Iyer (Head of Sustainability, Nimbus Cement Ltd)  
**Live URL**: [https://nimbus-ccts-dashboard.vercel.app](https://nimbus-ccts-dashboard.vercel.app)  
**GitHub Repository**: [https://github.com/Tusharv05/nimbus-ccts-dashboard](https://github.com/Tusharv05/nimbus-ccts-dashboard)  
**Submission Date**: 26 November 2026  

---

# Part 1: Required Deliverable 1 — One-Page Developer Ticket (v1 Build Specification)

```markdown
# [TICKET-CCTS-01] Build v1 Nimbus Carbon-Cost Exposure Dashboard

## User Story
As Meera Iyer (Head of Sustainability, Nimbus Cement Ltd), I need an auditable transition-risk web product to quantify Nimbus's financial exposure under India's Carbon Credit Trading Scheme (CCTS) from FY27 to FY40, so that I can defend our climate exposure before the Board of Directors, statutory auditors, and investors.

## Acceptance Criteria

### 1. Ingestion, Coordinate Preservation & Clinker Reallocation
- Ingest plant records from `/data/nimbus_cement_plants.csv` (18 columns, 9 plants).
- Preserve exact GPS coordinates (`latitude`, `longitude`) on all calculated plant entities for downstream climate API queries.
- Parse clinker transfer shipments and receipts from `notes`. Fail with explicit error if shipped volume != received volume (must equal 2.40 Mt).
- Provide allocation basis toggle:
  - `CCTS Rules (Default statutory view)`: Kilns retain all direct Scope 1 clinker emissions (grinding units carry ~0.020 t/t direct Scope 1). Redundant dual filed/attributed columns must be collapsed into single authoritative direct emissions and intensity columns.
  - `Economic View`: Clinker emissions transferred from kilns to grinding units:
    Moved Emissions = (Kiln Clinker Factor) × Clinker Received (Mt).
    Subtracted from P01 (1,020.8 kt) and P06 (1,049.7 kt); added to P07, P08, P09. Total company emissions must remain conserved at exactly 10,932 kt.

### 2. Core Compliance Calculations & Statutory Logic
- Baseline Intensity: Stand-in is each plant's own FY26 intensity (tagged Data).
- Tautology Transparency: State explicitly in UI and notes that because baseline equals FY26 intensity, every plant's shortfall is mathematically 2.7% (integrated) or 6.6% (grinding) of its own emissions, assuming zero decarbonization occurred between FY24 and FY26.
- Target Intensity: Baseline × (1 - Cut%). Default FY27 cuts: 2.7% for Integrated kilns; 6.6% for Grinding units (derived from Gazette G.S.R. 739(E) Table 2 and ICAP factsheet).
- Trajectory FY28–FY40: +0.5 percentage points added to target cut annually; cement output grows at 8.0% annually from FY28 (FY27 held flat).
- Compliance Shortfall: max(0, Attributed Intensity - Target Intensity) × Output Mt × 1,000 kt.
- Financial Exposure (₹ Cr): (Shortfall kt × Carbon Price) ÷ 10,000.
  - Low: ₹600/t (anchored near empirical domestic floor of IEX PAT ESCerts clearing: ₹2,165/ESCert ÷ 3.0 tCO2/toe ≈ ₹722/t).
  - Central: ₹1,200/t (ICAP emerging ETS range: $7–14/t).
  - High: ₹2,400/t (statutory non-compliance penalty: 2x multiplier under Energy Conservation Act Section 14A).
- Grinding Unit Scope 2 Caveat: Prominently flag P07, P08, P09: "Not meaningful without Scope 2; grid electricity excluded from plant file."
- Abatement Scenario Comparison: Provide toggle comparing No-Action (FY40: ₹329 Cr) against Decarbonization Abatement (15% alternative fuels TSR + 0.65 clinker factor reducing FY40 liability to ~₹118 Cr).

### 3. Physical Hazard Screening (CMIP6 HighResMIP)
- Ingest verified dated CMIP6 EC_Earth3P_HR projections for each plant coordinate under SSP2-4.5 (2020–2029 baseline vs 2031–2040 horizon).
- Status Badge Rule: Badge must strictly show "○ Cached CMIP6 Snapshot (26 Nov 2026)" unless a live Open-Meteo API query returns 200 OK across endpoints, in which case it transitions to "● Live API Data". Never label fallback data as live.
- Display Compound Vulnerability Ranking combining 2040 heat days, groundwater reliance, and asset value.
- Explicit Hazard Caveats:
  - WRI Aqueduct: Groundwater dependency at P01, P04, P05 puts ₹6,500 Cr (42% of assets) in high water-stress basins.
  - Flood: Coastal 'N' does not imply low flood risk; riverine flood exposure exists at P03 (Wardha River) and P09 (Damodar River).

### 4. Consolidated 5-Tab Institutional UI
- Tab 1 (Overview): Executive headline in Meera's language, 4-column metric strip (FY27 ₹36 Cr, ₹19.5/t cement, 0.37% rev, FY40 ₹329 Cr, 42% assets groundwater), Recharts trajectory with shaded ₹600–₹2,400 sensitivity band, cut matrix (2.7%, 4.7%, 7.6%), driver ranking, and "What v1 leaves out and why" box.
- Tab 2 (Plants): Plant compliance matrix with dynamic columns, P01/P06 concentration visualizer (51.2% group liability), formula breakdown card, and Table 2 benchmark modal (18 peer entities).
- Tab 3 (Physical): Asset screening matrix, live Open-Meteo re-query button, and compound physical ranking.
- Tab 4 (Method & Sources): Unified tab containing (1) interactive parameter sliders and audit log, (2) legal calculation guide, and (3) 11-source regulatory register with access dates.
- Tab 5 (Export): Reproducible CSV downloads (plants and trajectory) and printable Board PDF summary carrying all mandatory auditor qualifications and known limits.

### 5. Technical Constraints & Test Suite
- Next.js (App Router) + TypeScript + Tailwind CSS + Recharts.
- Automated Vitest suite covering clinker balance (2.40 Mt shipped = 2.40 Mt received), Scope 1 group conservation (10,932 kt), and PRD baseline intensities.
- Zero external database required for basic functionality (resilient CSV fallback); optional Neon PostgreSQL integration via `DATABASE_URL`.
- Deployed on Vercel with public access (no login required).
```

---

# Part 2: Required Deliverable 2 — One-Page Process & AI Fluency Note

### 1. Research & Problem Shaping (Why Transition Risk First)
When answering *"What is our business exposure to climate events today and by 2040?"*, our initial research surveyed both physical climate models (NASA POWER, Open-Meteo CMIP6) and regulatory policies. This revealed an immediate commercial reality: **open scientific literature does not provide sovereign, peer-reviewed damage functions for Indian cement factories in rupees.** Any attempt to synthesize speculative physical balance-sheet losses would be summarily rejected by Meera’s statutory auditor and board audit committee.

In contrast, India's **Carbon Credit Trading Scheme (CCTS)**, legally notified under Gazette **G.S.R. 739(E)** on October 8, 2025, establishes legally binding compliance obligations and statutory financial penalties ($2\times$ average certificate price under the Energy Conservation Act). With gate-to-gate GHG intensity targets starting in FY26/FY27, transition risk represents an immediate, auditable cash liability in Indian Rupees:
$$\text{Liability (₹ Cr)} = \frac{\max(0, \text{Intensity} - \text{Target}) \times \text{Output (Mt)} \times 1,000 \times \text{Carbon Price (₹/t)}}{10,000}$$

We therefore structured v1 around auditable CCTS compliance while establishing spatial physical hazard screening (groundwater stress and CMIP6 extreme heat) without inventing speculative damage curves.

### 2. Scope Discipline: What v1 Leaves Out and Why
To deliver an auditor-grade product within rapid timelines, we established firm scope boundaries:
1. **No Speculative Physical Damage Curves**: We screened asset exposure to extreme heat and water stress, but explicitly refrained from calculating hypothetical rupee asset write-offs.
2. **Scope 2 Disclosed as Statutory Understatement**: Gazette G.S.R. 739(E) Section 5(7) legally mandates indirect emissions from purchased grid electricity. Because Nimbus’s company file omitted Scope 2, grinding units (P07–P09) appear artificially low-cost. Rather than fabricating electricity figures, we flagged this limitation prominently with amber warning banners across all screens.
3. **No Silent Cross-Plant Netting**: Under CCTS rules, designated consumers are regulated per facility. Surpluses from outperforming plants cannot be silently netted against deficit kilns without board authorization and exchange registration.
4. **No-Abatement Baseline**: Projections to FY40 (+0.5 pts/yr cut, 8% CAGR) represent an illustrative "do-nothing" baseline scenario, paired with an interactive decarbonization toggle (15% alternative fuels + 0.65 clinker factor) to demonstrate decision options.

### 3. Key Assumptions & Sources
* **Target Trajectory**: Integrated kiln cut of 2.7% and Grinding cut of 6.6% in FY27 (BEE Gazette G.S.R. 739(E) Schedule Table 2; ICAP Factsheet).
* **Carbon Price Triangulation**: Low ₹600/t, Central ₹1,200/t, High ₹2,400/t. Central reflects the ICAP emerging ETS range ($7–14/t). Low is anchored near empirical domestic trading of PAT ESCerts on IEX (₹2,165/ESCert $\div$ 3.0 tCO₂/toe $\approx$ ₹722/t CO₂ implied). High reflects the statutory $2\times$ penalty multiplier.
* **Clinker Balance & Conservation**: 2.40 Mt shipped = 2.40 Mt received (P01 $\to$ P07: 1.12 Mt; P06 $\to$ P08: 0.68 Mt; P06 $\to$ P09: 0.60 Mt). Group Scope 1 direct emissions are preserved at exactly 10,932 kt.

### 4. AI Fluency: Catching and Fixing Real AI Errors
Throughout development, AI assistance accelerated code generation, but rigorous human-in-the-loop verification caught two critical credibility bugs:

1. **The Heat Screening Coordinate Bug (Priority 1 Catch)**:
   * *The Error*: The physical screening table initially displayed identical heat projections (43.9 $\to$ 54.1, +10.2 days) across all nine plants under a "Live API Data" badge—an obvious impossibility for plants spanning Rajasthan, Odisha, and Gujarat.
   * *Root Cause*: The AI generated an API query loop using `(p as any).latitude || 24.8887`. Because `latitude` and `longitude` were omitted from the TypeScript interface `CalculatedPlantRow`, `p.latitude` silently evaluated to `undefined`, falling back to Chittorgarh's coordinates for every single call.
   * *Resolution*: We updated `CalculatedPlantRow` to pass coordinates from `RawPlantRow`, pre-loaded a verified dated snapshot from CMIP6 EC_Earth3P_HR (26 Nov 2026) with distinct regional values (Chittorgarh: 82.1 days; Paradip: 34.1 days; Mundra: 39.5 days), and updated the status badge logic so it never displays "Live API" unless an endpoint query succeeds with HTTP 200.

2. **The Clinker Process Intensity Bug**:
   * *The Error*: An AI model initially calculated P01’s clinker reallocation factor using gross plant emissions rather than pure kiln clinker emissions. This distorted P01’s baseline intensity to 0.615 tCO₂/t instead of the expected 0.638 tCO₂/t, because P01 operates a 40 MW captive coal power plant (CPP).
   * *Root Cause*: Captive power emissions were mistakenly transferred to grinding unit P07.
   * *Resolution*: We caught the discrepancy via automated Vitest test assertions, calibrated the pure kiln clinker factor to 911.4 kg CO₂/t (transferring 1,020.8 kt to P07), and reconciled P01 to 0.638 and P07 to 0.658 while conserving total group emissions at exactly 10,932 kt.
