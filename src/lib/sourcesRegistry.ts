import { TagType } from './types';

export interface DataSourceRegistryItem {
  id: string;
  name: string;
  url: string;
  usedFor: string;
  v1Status: 'Used now (Official)' | 'Used now (Data)' | 'Used now (Assumption)' | 'Screening Dataset' | 'Reference Context';
  tag: TagType;
  licence: string;
  accessDate: string;
  notes: string;
}

export const DATA_SOURCES_REGISTRY: DataSourceRegistryItem[] = [
  {
    id: 'nimbus-plant-file',
    name: 'Nimbus Plant File (CSV)',
    url: '/data/nimbus_cement_plants.csv',
    usedFor: 'Output, clinker produced/shipped, Scope 1 direct emissions, asset values, revenues, water sources, coastal status, and GPS coordinates',
    v1Status: 'Used now (Data)',
    tag: 'Data',
    licence: 'Proprietary Company File (Nimbus Cement Ltd)',
    accessDate: '2026-11-26',
    notes: '9 plants, 18.35 Mt output, 10,932 kt Scope 1. Clinker transfer quantities received parsed from notes column.'
  },
  {
    id: 'bee-ccts-rules',
    name: 'MoEFCC / BEE: Gazette G.S.R. 739(E) (Oct 8, 2025)',
    url: 'https://beeindia.gov.in',
    usedFor: 'Statutory compliance rules, gate-to-gate GHG intensity metric, and Schedule Table 2 peer benchmarks',
    v1Status: 'Used now (Official)',
    tag: 'Official',
    licence: 'Government of India Open Access Gazette',
    accessDate: '2026-11-26',
    notes: 'Statutory framework for CCTS. Loaded 18 representative peer cement benchmarks from Table 2 (186 total cement units notified).'
  },
  {
    id: 'icap-ets-factsheet',
    name: 'ICAP ETS Map Factsheet (Indian CCTS)',
    url: 'https://icapcarbonaction.com/en/ets/indian-carbon-credit-trading-scheme',
    usedFor: 'Default sector targets to FY27 (Integrated 2.7%, Grinding 6.6%), compliance structure, and $7–14/t market scenario context',
    v1Status: 'Used now (Official)',
    tag: 'Official',
    licence: 'Public International Research (ICAP Secretariat)',
    accessDate: '2026-11-26',
    notes: 'Independent benchmark for sector average intensity reduction rates and international ETS comparisons.'
  },
  {
    id: 'icap-news-targets',
    name: 'ICAP Target Notification Analysis (News)',
    url: 'https://icapcarbonaction.com/en/news/india-notifies-emission-intensity-targets-nine-sectors-under-carbon-credit-trading-scheme',
    usedFor: 'Scenario sensitivity checks on reported cut ranges (3.5%, 4.7%, 7.6%) and scheme timeline',
    v1Status: 'Used now (Data)',
    tag: 'Data',
    licence: 'Public News & Industry Commentary',
    accessDate: '2026-11-26',
    notes: 'Reports 4.7% to 7.6% cement cut ranges; maintained strictly in scenario sensitivity matrix.'
  },
  {
    id: 'iex-pxil-escerts',
    name: 'Indian Energy Exchange (IEX) & PXIL ESCerts Market Clearing',
    url: 'https://www.iexindia.com',
    usedFor: 'Empirical domestic carbon price floor cross-check (₹2,165/ESCert ÷ 3.0 tCO2/toe ≈ ₹722/t CO2)',
    v1Status: 'Used now (Data)',
    tag: 'Data',
    licence: 'Power Market Public Trade Bulletins',
    accessDate: '2026-11-26',
    notes: 'PAT Scheme historical ESCert auction prices provide domestic empirical anchoring for carbon certificate valuation.'
  },
  {
    id: 'bee-detailed-procedure',
    name: 'BEE Detailed Procedure for Compliance Mechanism v1.0',
    url: 'https://beeindia.gov.in',
    usedFor: 'Scope 2 counting rules (section 5(7)), frozen baseline grid factors, captive power export rules, banking provisions',
    v1Status: 'Used now (Official)',
    tag: 'Official',
    licence: 'Ministry of Power / BEE Regulatory Guidance',
    accessDate: '2026-11-26',
    notes: 'Mandates CEA grid factor of baseline year. Highlights Scope 2 absence in plant file as statutory understatement.'
  },
  {
    id: 'ngfs-scenarios',
    name: 'NGFS Scenarios Portal (IIASA Scenario Explorer)',
    url: 'https://www.ngfs.net/ngfs-scenarios-portal/',
    usedFor: 'FY28–FY40 carbon price sensitivity ranges (Current Policies = ₹600, NDCs = ₹1,200, High Sensitivity = ₹2,400)',
    v1Status: 'Used now (Assumption)',
    tag: 'Assumption',
    licence: 'NGFS / IIASA Academic & Financial License',
    accessDate: '2026-11-26',
    notes: 'Modeled carbon price trajectories for India. High scenario (₹2,400) reflects Energy Conservation Act 2x penalty upper bound.'
  },
  {
    id: 'open-meteo-climate',
    name: 'Open-Meteo Climate API (CMIP6 HighResMIP)',
    url: 'https://climate-api.open-meteo.com/v1/climate',
    usedFor: 'Extreme heat days (daily max temp ≥ 40°C) per plant coordinate: 2020–2029 baseline vs 2031–2040 horizon (EC_Earth3P_HR highres-future experiment)',
    v1Status: 'Screening Dataset',
    tag: 'Data',
    licence: 'Non-commercial free tier (CC BY CMIP6 & Open-Meteo)',
    accessDate: '2026-11-26',
    notes: 'HighResMIP EC_Earth3P_HR model. Evaluates heat stress on refractory life, cooling efficiency, and labor hours.'
  },
  {
    id: 'wri-aqueduct',
    name: 'WRI Aqueduct 4.0 Water Risk Atlas',
    url: 'https://www.wri.org/data/aqueduct-global-maps-40-data',
    usedFor: 'Baseline water stress classification for groundwater-dependent plants (P01, P04, P05)',
    v1Status: 'Screening Dataset',
    tag: 'Data',
    licence: 'Creative Commons (CC BY 4.0)',
    accessDate: '2026-11-26',
    notes: 'Identifies ₹6,500 Cr of assets (42% of company total) located in High and Extremely High baseline water-stress basins.'
  },
  {
    id: 'cerc-ccts-regulations',
    name: 'Central Electricity Regulatory Commission (CERC) CCTS Regulations',
    url: 'https://cercind.gov.in',
    usedFor: 'Trading procedures, exchange registration, and market stability mechanism principles',
    v1Status: 'Used now (Official)',
    tag: 'Official',
    licence: 'Government of India Regulatory Order',
    accessDate: '2026-11-26',
    notes: 'Confirms procedural market rules are in place; numerical floor/ceiling prices await the first compliance trading window.'
  },
  {
    id: 'isro-bhuvan',
    name: 'ISRO Bhuvan Disaster Services',
    url: 'https://bhuvan-app1.nrsc.gov.in/disaster/disaster.php',
    usedFor: 'Coastal storm surge and cyclone tracking for grinding units P07 Mundra & P08 Paradip',
    v1Status: 'Reference Context',
    tag: 'Data',
    licence: 'ISRO National Remote Sensing Centre Open Access',
    accessDate: '2026-11-26',
    notes: 'Identifies ₹1,130 Cr of coastal assets (7.3%) vulnerable to Arabian Sea & Bay of Bengal cyclone landfall.'
  }
];
