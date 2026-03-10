/**
 * GeoMemo Regional Feed — Vercel serverless proxy
 *
 * Proxies requests to the GeoMemo backend API to fetch curated articles
 * as a flat JSON array for WorldMonitor regional news panels.
 * Caches for 5 minutes.
 *
 * Usage: GET /api/geomemo-regional?hours=24
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
    const hours = Math.min(Math.max(parseInt(req.query.hours) || 24, 1), 72);
    const apiUrl = `${GEOMEMO_API_URL}/api/articles/regional-feed?hours=${hours}`;

    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'GeoMemo-Map/1.0',
      },
      signal: AbortSignal.timeout(10000), // 10s timeout
    });

    if (!response.ok) {
      console.error(`GeoMemo Regional API error: ${response.status} ${response.statusText}`);
      return res.status(502).json({
        error: 'GeoMemo API unavailable',
        status: response.status,
      });
    }

    const data = await response.json();

    // Cache for 5 minutes, serve stale for 30 minutes while revalidating
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=1800');
    res.setHeader('Content-Type', 'application/json');

    return res.status(200).json(data);
  } catch (error) {
    console.error('GeoMemo Regional proxy error:', error.message);

    // Return empty array on error so panels degrade gracefully
    return res.status(502).json([]);
  }
}
