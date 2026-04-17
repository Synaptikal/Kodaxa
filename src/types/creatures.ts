/**
 * creatures.ts
 * Core types for the Stars Reach Creature Database.
 * One concern: creature taxonomy, threat tiers, and drop tables.
 *
 * Sources confirmed from Stars Reach dev blog (Twilight update, Brave New Worlds)
 * and Massively OP coverage. All unnamed variants and unconfirmed stats are
 * explicitly marked `confirmed: false`.
 */

// ── Enums ────────────────────────────────────────────────────────────

export type CreatureClass =
  | 'mammal'
  | 'avian'
  | 'reptile'
  | 'aquatic'
  | 'insectoid'
  | 'flora_fauna'   // plant-like creatures
  | 'hybrid'
  | 'unknown';

export type CreatureSize =
  | 'tiny'    // < 0.5m
  | 'small'   // 0.5–1.5m
  | 'medium'  // 1.5–3m
  | 'large'   // 3–6m
  | 'huge';   // > 6m

export type CreatureBehavior =
  | 'docile'       // No aggro
  | 'skittish'     // Flees on sight
  | 'defensive'    // Aggro only if attacked
  | 'territorial'  // Aggro within range
  | 'aggressive'   // Active hunter
  | 'flocking';    // Group aggro

/** 1 = easily killed by starter; 5 = apex, kill-mission tier avoided */
export type ThreatTier = 1 | 2 | 3 | 4 | 5;

export type TamingStatus =
  | 'tameable'
  | 'untameable'
  | 'unknown';

// ── Core type ────────────────────────────────────────────────────────

export interface Creature {
  /** URL-safe slug (snake_case) */
  id: string;
  /** Display name */
  name: string;
  /** Other names / nicknames */
  aliases?: string[];

  classification: CreatureClass;
  size: CreatureSize;
  behavior: CreatureBehavior;
  threatTier: ThreatTier;

  /** One-paragraph description / flavor */
  description: string;

  /** Biome IDs where this creature is known to spawn */
  biomes: string[];
  /** Planet IDs where confirmed (empty = unknown / any) */
  planets?: string[];

  /** Known drops (item IDs from items DB) */
  drops: string[];

  /** Taming data */
  taming: {
    status: TamingStatus;
    /** Food items known to work for taming */
    foods?: string[];
    /** Freeform notes on taming process */
    notes?: string;
  };

  /** Special abilities / attacks (e.g., "flocking charge", "cold breath") */
  abilities?: string[];

  /** Whether this entry is confirmed from official sources */
  confirmed: boolean;
  /** Source references (patch note IDs, dev blog URLs) */
  sources?: string[];
}

// ── Display helpers ──────────────────────────────────────────────────

export const CLASS_LABELS: Record<CreatureClass, string> = {
  mammal:       'Mammal',
  avian:        'Avian',
  reptile:      'Reptile',
  aquatic:      'Aquatic',
  insectoid:    'Insectoid',
  flora_fauna:  'Flora-Fauna',
  hybrid:       'Hybrid',
  unknown:      'Unclassified',
};

export const BEHAVIOR_LABELS: Record<CreatureBehavior, string> = {
  docile:       'Docile',
  skittish:     'Skittish',
  defensive:    'Defensive',
  territorial:  'Territorial',
  aggressive:   'Aggressive',
  flocking:     'Flocking',
};

export const BEHAVIOR_COLORS: Record<CreatureBehavior, string> = {
  docile:       'text-emerald-400 bg-emerald-900/30 border-emerald-800/40',
  skittish:     'text-sky-400 bg-sky-900/30 border-sky-800/40',
  defensive:    'text-amber-400 bg-amber-900/30 border-amber-800/40',
  territorial:  'text-orange-400 bg-orange-900/30 border-orange-800/40',
  aggressive:   'text-red-400 bg-red-900/30 border-red-800/40',
  flocking:     'text-violet-400 bg-violet-900/30 border-violet-800/40',
};

export const SIZE_LABELS: Record<CreatureSize, string> = {
  tiny:   'Tiny',
  small:  'Small',
  medium: 'Medium',
  large:  'Large',
  huge:   'Huge',
};

export const THREAT_LABELS: Record<ThreatTier, string> = {
  1: 'T1 — Trivial',
  2: 'T2 — Low',
  3: 'T3 — Moderate',
  4: 'T4 — High',
  5: 'T5 — Apex',
};

export const THREAT_COLORS: Record<ThreatTier, string> = {
  1: 'text-slate-400',
  2: 'text-green-400',
  3: 'text-amber-400',
  4: 'text-orange-400',
  5: 'text-red-400',
};
