/**
 * biomes.ts
 * Core types for the Stars Reach Biome Field Guide.
 * One concern: biome taxonomy — temperature × moisture grid + specialty biomes.
 *
 * Sources:
 *   - Twilight Update patch notes (temperature/moisture terrain system)
 *   - Brave New Worlds Update (biome gameplay impact, gas pocket zones)
 *   - Creature database cross-reference (src/data/creatures/index.ts)
 *
 * Stars Reach uses a procedural biome system on every planet driven by
 * temperature bands (cold / temperate / hot) and moisture bands (arid / humid),
 * plus special overlay biomes (volcanic, coastal/tidal). Biome IDs used here
 * are the canonical slugs already referenced by creature entries.
 */

// ── Enums ────────────────────────────────────────────────────────────

export type BiomeTemperature = 'cold' | 'temperate' | 'hot';
export type BiomeMoisture = 'arid' | 'humid';

/**
 * Canonical biome IDs.
 *
 * The 6 `<temp>_<moisture>` biomes are the procedural grid biomes that
 * show up on almost every terrestrial planet. The remaining IDs are
 * overlay biomes that appear conditionally.
 */
export type BiomeId =
  | 'cold_arid'
  | 'cold_humid'
  | 'temperate_arid'
  | 'temperate_humid'
  | 'hot_arid'
  | 'hot_humid'
  | 'volcanic'
  | 'coastal'
  | 'subterranean';

export type HazardLevel = 'none' | 'low' | 'moderate' | 'high' | 'extreme';

// ── Core type ────────────────────────────────────────────────────────

export interface Biome {
  /** URL-safe slug */
  id: BiomeId;
  /** Display name */
  name: string;
  /** Alternate / community names */
  aliases?: string[];

  /** Nullable for overlay biomes (volcanic, coastal, subterranean) */
  temperature: BiomeTemperature | null;
  moisture: BiomeMoisture | null;

  /** One-paragraph flavor / field notes */
  description: string;

  /** Notable terrain & vegetation features */
  terrain: string[];
  /** Typical flora found here (item IDs or readable names) */
  flora: string[];
  /** Creature IDs commonly spawning here (should match /data/creatures ids) */
  creatures: string[];
  /** Raw resources / deposits commonly surfaced (hand-readable) */
  resources: string[];

  /** Environmental hazard rating (general threat to unprepared players) */
  hazard: HazardLevel;
  /** Specific hazard callouts (gas pockets, blizzards, heatstroke, etc.) */
  hazards?: string[];

  /** Recommended equipment / preparation notes */
  preparation?: string[];

  /** Path to biome art in /public/biomes/ — null until art is sourced */
  image: string | null;

  /** Whether the entry is confirmed from official sources */
  confirmed: boolean;
  /** Source IDs or URLs */
  sources?: string[];
}

// ── Display helpers ──────────────────────────────────────────────────

export const TEMPERATURE_LABELS: Record<BiomeTemperature, string> = {
  cold:      'Cold',
  temperate: 'Temperate',
  hot:       'Hot',
};

export const MOISTURE_LABELS: Record<BiomeMoisture, string> = {
  arid:  'Arid',
  humid: 'Humid',
};

export const TEMPERATURE_COLORS: Record<BiomeTemperature, string> = {
  cold:      'text-sky-400 bg-sky-900/30 border-sky-800/40',
  temperate: 'text-emerald-400 bg-emerald-900/30 border-emerald-800/40',
  hot:       'text-orange-400 bg-orange-900/30 border-orange-800/40',
};

export const MOISTURE_COLORS: Record<BiomeMoisture, string> = {
  arid:  'text-amber-400 bg-amber-900/30 border-amber-800/40',
  humid: 'text-teal-400 bg-teal-900/30 border-teal-800/40',
};

export const HAZARD_LABELS: Record<HazardLevel, string> = {
  none:     'None',
  low:      'Low',
  moderate: 'Moderate',
  high:     'High',
  extreme:  'Extreme',
};

export const HAZARD_COLORS: Record<HazardLevel, string> = {
  none:     'text-slate-500',
  low:      'text-green-400',
  moderate: 'text-amber-400',
  high:     'text-orange-400',
  extreme:  'text-red-400',
};
