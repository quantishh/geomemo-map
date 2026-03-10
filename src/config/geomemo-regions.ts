/**
 * GeoMemo Regional Feed → WorldMonitor Panel Mapping
 *
 * Maps each WorldMonitor panel category key to the filtering criteria
 * used to route GeoMemo articles into the correct panel.
 *
 * - countryCodes: article must have at least one matching country_code
 * - categories: article.category must match one of these GeoMemo categories
 * - If neither is set, all articles pass (used for "World News" / politics)
 */

export interface RegionFilter {
  /** ISO 3166-1 alpha-2 country codes (upper-case). Article matches if any code overlaps. */
  countryCodes?: Set<string>;
  /** GeoMemo article categories. Article matches if its category is in this set. */
  categories?: Set<string>;
}

// ── Country code sets ─────────────────────────────────────────────

const EUROPE_CODES = new Set([
  'GB', 'FR', 'DE', 'IT', 'ES', 'NL', 'BE', 'LU', 'PT', 'IE',
  'AT', 'CH', 'SE', 'NO', 'DK', 'FI', 'IS',
  'PL', 'CZ', 'SK', 'HU', 'RO', 'BG', 'HR', 'SI', 'RS', 'BA',
  'ME', 'MK', 'AL', 'XK', 'MD', 'UA', 'BY',
  'LT', 'LV', 'EE', 'GR', 'CY', 'MT',
]);

const MIDDLE_EAST_CODES = new Set([
  'IL', 'PS', 'SA', 'IR', 'IQ', 'SY', 'JO', 'LB', 'YE',
  'AE', 'QA', 'KW', 'BH', 'OM', 'TR', 'EG',
]);

const AFRICA_CODES = new Set([
  'DZ', 'AO', 'BJ', 'BW', 'BF', 'BI', 'CV', 'CM', 'CF', 'TD',
  'KM', 'CG', 'CD', 'CI', 'DJ', 'GQ', 'ER', 'SZ', 'ET', 'GA',
  'GM', 'GH', 'GN', 'GW', 'KE', 'LS', 'LR', 'LY', 'MG', 'MW',
  'ML', 'MR', 'MU', 'MA', 'MZ', 'NA', 'NE', 'NG', 'RW', 'ST',
  'SN', 'SC', 'SL', 'SO', 'ZA', 'SS', 'SD', 'TZ', 'TG', 'TN',
  'UG', 'ZM', 'ZW',
]);

const LATAM_CODES = new Set([
  'MX', 'GT', 'BZ', 'HN', 'SV', 'NI', 'CR', 'PA',
  'CU', 'HT', 'DO', 'JM', 'TT', 'BB', 'BS',
  'CO', 'VE', 'EC', 'PE', 'BO', 'CL', 'AR', 'UY', 'PY',
  'BR', 'GY', 'SR',
]);

const ASIA_PACIFIC_CODES = new Set([
  'CN', 'JP', 'KR', 'KP', 'TW', 'MN',
  'IN', 'PK', 'BD', 'LK', 'NP', 'AF',
  'TH', 'VN', 'MM', 'KH', 'LA', 'PH', 'ID', 'MY', 'SG', 'BN', 'TL',
  'AU', 'NZ', 'PG', 'FJ',
  'KZ', 'UZ', 'TM', 'KG', 'TJ',
]);

// ── Panel → Filter mapping ───────────────────────────────────────

/**
 * Maps WorldMonitor panel category keys to their GeoMemo article filters.
 * Only panels we actively populate are listed here.
 */
export const GEOMEMO_REGION_MAP: Record<string, RegionFilter> = {
  // Regional panels — filtered by country codes
  politics: {},  // World News — all articles, no filter
  us: { countryCodes: new Set(['US']) },
  europe: { countryCodes: EUROPE_CODES },
  middleeast: { countryCodes: MIDDLE_EAST_CODES },
  africa: { countryCodes: AFRICA_CODES },
  latam: { countryCodes: LATAM_CODES },
  asia: { countryCodes: ASIA_PACIFIC_CODES },

  // Topic panels — filtered by GeoMemo category
  energy: { categories: new Set(['Geopolitical Economics', 'Global Markets']) },
  gov: { categories: new Set(['Geopolitical Politics']) },

  // thinktanks: DEFERRED — needs source-level classification
};

/**
 * Check if a GeoMemo article matches a region filter.
 */
export function matchesRegionFilter(
  filter: RegionFilter,
  articleCountryCodes: string[],
  articleCategory: string,
): boolean {
  const hasCountryFilter = filter.countryCodes && filter.countryCodes.size > 0;
  const hasCategoryFilter = filter.categories && filter.categories.size > 0;

  // No filters = match all (World News)
  if (!hasCountryFilter && !hasCategoryFilter) return true;

  // Country code match
  if (hasCountryFilter) {
    for (const code of articleCountryCodes) {
      if (filter.countryCodes!.has(code)) return true;
    }
  }

  // Category match
  if (hasCategoryFilter) {
    if (filter.categories!.has(articleCategory)) return true;
  }

  return false;
}
