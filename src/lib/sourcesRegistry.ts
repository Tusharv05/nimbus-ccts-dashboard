import { TagType } from './types';

export interface DataSourceRegistryItem {
  id: string;
  name: string;
  url: string;
  usedFor: string;
  v1Status: 'Used now (Official)' | 'Used now (Data)' | 'Used now (Assumption)' | 'Live screening' | 'Snapshot' | 'Scaffold' | 'Link only';
  tag: TagType;
  licence: string;
  notes: string;
}

export const DATA_SOURCES_REGISTRY: DataSourceRegistryItem[] = [
  {
    id: 'nimbus-plant-file',
    name: 'Nimbus Plant File (CSV)',
    url: '/data/nimbus_cement_plants.csv',
    usedFor: 'Output, clinker produced/shipped, Scope 1 emissions, asset value, revenue, water source, coastal flag, coordinates',
    v1Status: 'Used now (Data)',
    tag: 'Data',
    licence: 'Proprietary Company File (Nimbus Cement Ltd)',
    notes: '9 plants, 18.35 Mt output, 10,932 kt Scope 1. Clinker transfer quantities received parsed from notes column.'
  },
  {
    id: 'bee-ccts-rules',
    name: 'Bureau of Energy Efficiency (BEE): Gazette G.S.R. 739(E)',
    url: 'https://beeindia.gov.in',
    usedFor: 'Sector: Cement Schedule Table 2 with 186 real cement units (131 kilns, 55 grinding units), FY24 baselines, and FY26/FY27 targets',
    v1Status: 'Scaffold',
    tag: 'Official',
    licence: 'Government of India Open Access Gazette',
    notes: 'BEE draft (G.S.R. 234(E)) & final rules (G.S.R. 739(E)). UI provides an official Table 2 CSV upload slot.'
  },
  {
    id: 'icap-ets-factsheet',
    name: 'ICAP ETS Map Factsheet (Indian CCTS)',
    url: 'https://icapcarbonaction.com/en/ets/indian-carbon-credit-trading-scheme',
    usedFor: 'Default sector targets to FY27 (Integrated 2.7%, Grinding 6.6%), compliance rules, gate-to-gate boundary, 2x credit penalty',
    v1Status: 'Used now (Official)',
    tag: 'Official',
    licence: 'Public International Research (ICAP Secretariat)',
    notes: 'Primary benchmark for sector average intensity reduction rates.'
  },
  {
    id: 'icap-news-targets',
    name: 'ICAP Target Notification News Article',
    url: 'https://icapcarbonaction.com/en/news/india-notifies-emission-intensity-targets-nine-sectors-under-carbon-credit-trading-scheme',
    usedFor: 'Sensitivity checks on reported cut ranges (3.5%, 4.7%, 7.6%) and scheme timeline',
    v1Status: 'Used now (Official)',
    tag: 'Official',
    licence: 'Public News & Analysis',
    notes: 'Reports 4.7% to 7.6% cement cut range which does not reconcile with factsheet; used exclusively in sensitivity analysis.'
  },
  {
    id: 'bee-detailed-procedure',
    name: 'BEE Detailed Procedure for Compliance Mechanism v1.0',
    url: 'https://beeindia.gov.in',
    usedFor: 'Scope 2 counting rules (section 5(7)), frozen baseline grid factors, captive power export rules, banking provisions',
    v1Status: 'Used now (Official)',
    tag: 'Official',
    licence: 'Ministry of Power / BEE Regulatory Guidance',
    notes: 'Mandates CEA grid factor of baseline year (default 1.19 tCO2/MWh). Highlights Scope 2 absence in plant file.'
  },
  {
    id: 'ngfs-scenarios',
    name: 'NGFS Scenarios Portal (IIASA Scenario Explorer)',
    url: 'https://www.ngfs.net/ngfs-scenarios-portal/',
    usedFor: 'FY28–FY40 carbon price paths (Current Policies = Low, NDCs = Central, Net Zero 2050 = High)',
    v1Status: 'Scaffold',
    tag: 'Assumption',
    licence: 'NGFS / IIASA Academic & Financial License',
    notes: 'Variable Price|Carbon in US$/t. Flat prices used in v1 (₹600, ₹1,200, ₹2,400) tagged Assumption.'
  },
  {
    id: 'world-bank-carbon-pricing',
    name: 'World Bank Carbon Pricing Dashboard',
    url: 'https://carbonpricingdashboard.worldbank.org/',
    usedFor: 'International price cross-checks (EU ETS, UK ETS, California, China)',
    v1Status: 'Snapshot',
    tag: 'Official',
    licence: 'World Bank Open Data',
    notes: 'Provides global reference lines on Overview comparison charts.'
  },
  {
    id: 'climate-trace',
    name: 'Climate TRACE Facility Level Emissions',
    url: 'https://climatetrace.org/',
    usedFor: 'Independent satellite-observed emission intensity benchmark for Indian cement kilns',
    v1Status: 'Scaffold',
    tag: 'Official',
    licence: 'CC BY 4.0 Open Data',
    notes: 'Asset-level facility database through September 2026.'
  },
  {
    id: 'open-meteo-climate',
    name: 'Open-Meteo Climate API (CMIP6 HighResMIP)',
    url: 'https://climate-api.open-meteo.com/v1/climate',
    usedFor: 'Days at or above 40°C per coordinate, early decade (2025-35) vs late decade (2035-45)',
    v1Status: 'Live screening',
    tag: 'Official',
    licence: 'Non-commercial free tier (CC BY CMIP6 & Open-Meteo)',
    notes: 'Live endpoint query with automated fallback to dated snapshot.'
  },
  {
    id: 'open-meteo-flood',
    name: 'Open-Meteo Flood API (GloFAS v4)',
    url: 'https://flood-api.open-meteo.com/v1/flood',
    usedFor: 'River discharge m3/s for river plants P03 Chandrapur (Wardha) and P09 Durgapur (Damodar)',
    v1Status: 'Scaffold',
    tag: 'Official',
    licence: 'Non-commercial Open Data',
    notes: 'Typed client available in /lib/physical/flood.ts.'
  },
  {
    id: 'wri-aqueduct',
    name: 'WRI Aqueduct 4.0 Water Risk Atlas',
    url: 'https://www.wri.org/data/aqueduct-global-maps-40-data',
    usedFor: 'Water stress and drought risk for groundwater plants P01, P04, P05',
    v1Status: 'Scaffold',
    tag: 'Official',
    licence: 'Creative Commons (CC BY 4.0)',
    notes: 'High priority for v2 since 42% of Nimbus assets (₹6,500 Cr) rely on groundwater.'
  },
  {
    id: 'isro-bhuvan',
    name: 'ISRO Bhuvan Disaster Services',
    url: 'https://bhuvan-app1.nrsc.gov.in/disaster/disaster.php',
    usedFor: 'Cyclone and coastal flood hazard screening for P07 Mundra & P08 Paradip',
    v1Status: 'Link only',
    tag: 'Official',
    licence: 'ISRO National Remote Sensing Centre Open Access',
    notes: 'Context for ₹1,130 Cr of coastal grinding assets.'
  }
];
