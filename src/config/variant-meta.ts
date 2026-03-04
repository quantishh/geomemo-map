export interface VariantMeta {
  title: string;
  description: string;
  keywords: string;
  url: string;
  siteName: string;
  shortName: string;
  subject: string;
  classification: string;
  categories: string[];
  features: string[];
}

export const VARIANT_META: { full: VariantMeta; [k: string]: VariantMeta } = {
  full: {
    title: 'GeoMemo — Global Intelligence Monitor',
    description: 'Real-time global intelligence dashboard with live geopolitical news, markets, military tracking, infrastructure monitoring, and curated intelligence from GeoMemo.',
    keywords: 'geopolitical intelligence, global news, geomemo, world monitor, market data, military tracking, conflict zones, OSINT, situation awareness, geopolitics, intelligence dashboard',
    url: 'https://map.geomemo.news/',
    siteName: 'GeoMemo',
    shortName: 'GeoMemo',
    subject: 'Real-Time Geopolitical Intelligence and Situation Awareness',
    classification: 'Intelligence Dashboard, OSINT Tool, News Aggregator',
    categories: ['news', 'productivity'],
    features: [
      'Real-time news aggregation',
      'GeoMemo curated intelligence',
      'Stock market tracking',
      'Military flight monitoring',
      'Ship AIS tracking',
      'Earthquake alerts',
      'Protest tracking',
      'Power outage monitoring',
      'Oil price analytics',
      'Government spending data',
      'Prediction markets',
      'Infrastructure monitoring',
      'Geopolitical intelligence',
    ],
  },
  tech: {
    title: 'GeoMemo Tech — AI & Tech Industry Dashboard',
    description: 'Real-time AI and tech industry dashboard tracking tech giants, AI labs, startup ecosystems, funding rounds, and tech events worldwide.',
    keywords: 'tech dashboard, AI industry, startup ecosystem, geomemo, tech companies, AI labs, venture capital, tech events, tech conferences, cloud infrastructure, datacenters, funding rounds',
    url: 'https://map.geomemo.news/',
    siteName: 'GeoMemo Tech',
    shortName: 'GeoMemoTech',
    subject: 'AI, Tech Industry, and Startup Ecosystem Intelligence',
    classification: 'Tech Dashboard, AI Tracker, Startup Intelligence',
    categories: ['news', 'business'],
    features: [
      'Tech news aggregation',
      'GeoMemo curated intelligence',
      'AI lab tracking',
      'Startup ecosystem mapping',
      'Tech HQ locations',
      'Conference & event calendar',
      'Cloud infrastructure monitoring',
      'Datacenter mapping',
      'Tech layoff tracking',
      'Funding round analytics',
      'Tech stock tracking',
      'Service status monitoring',
    ],
  },
  finance: {
    title: 'GeoMemo Finance — Real-Time Markets & Trading Dashboard',
    description: 'Real-time finance and trading dashboard tracking global markets, stock exchanges, central banks, commodities, forex, crypto, and economic indicators.',
    keywords: 'finance dashboard, trading dashboard, geomemo, stock market, forex, commodities, central banks, crypto, economic indicators, market news, financial centers, stock exchanges',
    url: 'https://map.geomemo.news/',
    siteName: 'GeoMemo Finance',
    shortName: 'GeoMemoFinance',
    subject: 'Global Markets, Trading, and Financial Intelligence',
    classification: 'Finance Dashboard, Market Tracker, Trading Intelligence',
    categories: ['finance', 'news'],
    features: [
      'Real-time market data',
      'GeoMemo curated intelligence',
      'Stock exchange mapping',
      'Central bank monitoring',
      'Commodity price tracking',
      'Forex & currency news',
      'Crypto & digital assets',
      'Economic indicator alerts',
      'IPO & earnings tracking',
      'Financial center mapping',
      'Sector heatmap',
      'Market radar signals',
    ],
  },
};
