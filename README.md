# Nimbus Cement: Carbon-Cost Exposure Dashboard (v1)

Transition-risk assessment and compliance modelling product for **Meera Iyer**, Head of Sustainability at Nimbus Cement Ltd. Evaluates financial exposure under India's Carbon Credit Trading Scheme (CCTS) from FY27 to FY40.

---

## 1. Quick Start & Local Run

### Prerequisites
- Node.js 18+ (tested on Node v22.14)
- npm

### Installation & Run
```bash
# 1. Install dependencies
npm install

# 2. Run unit tests (Vitest) to verify all calculations
npm run test

# 3. Start development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 2. Deploy to Vercel

1. Push this repository to GitHub or GitLab.
2. In [Vercel](https://vercel.com), click **Add New Project** and select this repo.
3. In **Settings** $\to$ **Environment Variables**, set:
   - `DATABASE_URL`: `postgresql://neondb_owner:npg_4CVmnaN7dZks@ep-lingering-river-beuuvt93-pooler.c-9.us-east-2.aws.neon.tech/neondb?sslmode=require`
4. Click **Deploy**. Public access with zero login required.

---

## 3. Database Architecture (Neon PostgreSQL)

The system connects to **Neon Serverless PostgreSQL** via `@neondatabase/serverless` / `pg`:
- `nimbus_plants`: 9 plants asset profile, Scope 1, clinker balances
- `official_plant_targets`: 18 real cement facilities from Gazette G.S.R. 739(E) Table 2

To re-seed the database at any time:
```powershell
node scripts/seed-neon.mjs
```

---

## 4. Key Calculation Reconciliations

- **Group Scope 1 Footprint:** Exactly **10,932 kt CO₂** across both CCTS rules and Economic reallocation views.
- **FY27 Central Financial Exposure:** **~₹35.8 – 36.0 Crore** (₹1,200/t) = **~0.37% of FY26 Revenue** (₹9,658 Crore).
- **FY27 Low / High Range:** **₹17.9 Cr** (Low @ ₹600/t) to **₹71.6 Cr** (Statutory penalty @ ₹2,400/t).
- **FY40 Central Exposure Projection:** **~₹329 Crore** (+0.5 pts/yr cut, 8% annual growth from FY28).
