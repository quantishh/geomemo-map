/**
 * GeoMemo Intelligence — Vercel serverless proxy
 *
 * Proxies requests to the GeoMemo backend API to fetch curated articles
 * as GeoJSON for the map layer. Caches for 15 minutes.
 *
 * Usage: GET /api/geomemo-news?days=7
 */

const GEOMEMO_API_URL = process.env.GEOMEMO_API_URL || 'https://geomemo.news';

export default async function handler(req, res) {
  // Handle CORS preflight
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const days = Math.min(Math.max(parseInt(req.query.days) || 7, 1), 30);
    const apiUrl = `${GEOMEMO_API_URL}/api/articles/map?days=${days}`;

    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'GeoMemo-Map/1.0',
      },
      signal: AbortSignal.timeout(10000), // 10s timeout
    });

    if (!response.ok) {
      console.error(`GeoMemo API error: ${response.status} ${response.statusText}`);
      return res.status(502).json({
        error: 'GeoMemo API unavailable',
        status: response.status,
      });
    }

    const data = await response.json();

    // Cache for 15 minutes, serve stale for 1 hour while revalidating
    res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate=3600');
    res.setHeader('Content-Type', 'application/json');

    return res.status(200).json(data);
  } catch (error) {
    console.error('GeoMemo proxy error:', error.message);

    // Return empty GeoJSON on error so the map layer degrades gracefully
    return res.status(502).json({
      type: 'FeatureCollection',
      features: [],
      error: 'GeoMemo API unavailable',
    });
  }
}
