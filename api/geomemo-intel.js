/**
 * GeoMemo Intelligence Data — Vercel serverless proxy
 *
 * Proxies requests to the GeoMemo backend API to fetch intelligence data:
 * conflicts, events, transfers, stability scores, sanctions, country profiles.
 * Caches for 10 minutes.
 *
 * Usage:
 *   GET /api/geomemo-intel?type=conflicts
 *   GET /api/geomemo-intel?type=events
 *   GET /api/geomemo-intel?type=transfers
 *   GET /api/geomemo-intel?type=stability
 *   GET /api/geomemo-intel?type=country&code=IR
 *   GET /api/geomemo-intel?type=sanctions&code=RU
 */

const GEOMEMO_API_URL = process.env.GEOMEMO_API_URL || 'https://api.geomemo.news';

const ENDPOINTS = {
  conflicts: '/intel/conflicts',
  events: '/intel/events',
  transfers: '/intel/transfers',
  'market-signals': '/intel/market-signals',
  'mineral-deposits': '/intel/mineral-deposits',
  stability: '/stability/rankings',
  countries: '/countries',
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { type, code, limit } = req.query;

    if (!type) {
      return res.status(400).json({
        error: 'Missing type parameter',
        available: [...Object.keys(ENDPOINTS), 'country', 'sanctions'],
      });
    }

    let apiUrl;

    if (type === 'country' && code) {
      apiUrl = `${GEOMEMO_API_URL}/country/${code.toUpperCase()}/profile`;
    } else if (type === 'sanctions' && code) {
      apiUrl = `${GEOMEMO_API_URL}/sanctions/country/${code.toUpperCase()}`;
    } else if (type === 'country-stability' && code) {
      apiUrl = `${GEOMEMO_API_URL}/country/${code.toUpperCase()}/stability`;
    } else if (ENDPOINTS[type]) {
      const params = new URLSearchParams();
      if (limit) params.set('limit', Math.min(parseInt(limit) || 50, 500));
      const qs = params.toString();
      apiUrl = `${GEOMEMO_API_URL}${ENDPOINTS[type]}${qs ? '?' + qs : ''}`;
    } else {
      return res.status(400).json({ error: `Unknown type: ${type}` });
    }

    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'GeoMemo-Monitor/1.0',
      },
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      console.error(`GeoMemo Intel API error: ${response.status} for ${type}`);
      return res.status(502).json({ error: 'GeoMemo API unavailable', status: response.status });
    }

    const data = await response.json();

    // Cache for 10 minutes, serve stale for 1 hour
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=3600');
    res.setHeader('Content-Type', 'application/json');

    return res.status(200).json(data);
  } catch (error) {
    console.error('GeoMemo Intel proxy error:', error.message);
    return res.status(502).json({ error: 'GeoMemo API unavailable' });
  }
}
