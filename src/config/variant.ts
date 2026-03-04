export const SITE_VARIANT: string = (() => {
  if (typeof window === 'undefined') return import.meta.env.VITE_VARIANT || 'full';

  const isTauri = '__TAURI_INTERNALS__' in window || '__TAURI__' in window;
  if (isTauri) {
    const stored = localStorage.getItem('worldmonitor-variant');
    if (stored === 'tech' || stored === 'full' || stored === 'finance') return stored;
    return import.meta.env.VITE_VARIANT || 'full';
  }

  const h = location.hostname;

  // GeoMemo fork: all variants live under map.geomemo.news
  // Use localStorage for variant switching (no subdomain detection)
  if (h.includes('geomemo') || h === 'localhost' || h === '127.0.0.1') {
    const stored = localStorage.getItem('worldmonitor-variant');
    if (stored === 'tech' || stored === 'full' || stored === 'finance') return stored;
    return import.meta.env.VITE_VARIANT || 'full';
  }

  // Fallback: subdomain detection for non-GeoMemo deployments
  if (h.startsWith('tech.')) return 'tech';
  if (h.startsWith('finance.')) return 'finance';

  return 'full';
})();
