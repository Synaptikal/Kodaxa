/**
 * atlas.ts
 * Core types for the Resource Atlas — crowdsourced PQRV readings.
 * One concern: type shapes shared across queries, actions, and UI.
 *
 * Maps 1:1 to the resource_readings table + resource_stats view
 * declared in supabase/migrations/006_resource_atlas.sql.
 */

// ── Enums ────────────────────────────────────────────────────────────

export const RESOURCE_CATEGORIES = [
  'ore',
  'wood',
  'fiber',
  'gas',
  'creature_drop',
  'flora',
  'stone',
  'crystal',
  'liquid',
  'other',
] as const;
export type ResourceCategory = typeof RESOURCE_CATEGORIES[number];

export const RESOURCE_CATEGORY_LABELS: Record<ResourceCategory, string> = {
  ore:           'Ore',
  wood:          'Wood',
  fiber:         'Fiber',
  gas:           'Gas',
  creature_drop: 'Creature Drop',
  flora:         'Flora',
  stone:         'Stone',
  crystal:       'Crystal',
  liquid:        'Liquid',
  other:         'Other',
};

export const RESOURCE_CATEGORY_COLORS: Record<ResourceCategory, string> = {
  ore:           'text-amber-400 bg-amber-900/30 border-amber-800/40',
  wood:          'text-emerald-400 bg-emerald-900/30 border-emerald-800/40',
  fiber:         'text-green-400 bg-green-900/30 border-green-800/40',
  gas:           'text-violet-400 bg-violet-900/30 border-violet-800/40',
  creature_drop: 'text-rose-400 bg-rose-900/30 border-rose-800/40',
  flora:         'text-teal-400 bg-teal-900/30 border-teal-800/40',
  stone:         'text-slate-300 bg-slate-800/60 border-slate-700',
  crystal:       'text-cyan-400 bg-cyan-900/30 border-cyan-800/40',
  liquid:        'text-sky-400 bg-sky-900/30 border-sky-800/40',
  other:         'text-slate-400 bg-slate-800/60 border-slate-700',
};

// ── Core PQRV stats ──────────────────────────────────────────────────

export interface PQRV {
  potential:   number;
  quality:     number;
  resilience:  number;
  versatility: number;
}

export const PQRV_LABELS: Record<keyof PQRV, string> = {
  potential:   'Potential',
  quality:     'Quality',
  resilience:  'Resilience',
  versatility: 'Versatility',
};

export const PQRV_SHORT: Record<keyof PQRV, string> = {
  potential:   'P',
  quality:     'Q',
  resilience:  'R',
  versatility: 'V',
};

// ── DB row types ─────────────────────────────────────────────────────

export interface ResourceReading {
  id: string;
  submitter_id: string;

  resource_name: string;
  resource_category: ResourceCategory | null;

  planet: string;
  planet_key: string;
  biome_id: string | null;
  coords_hint: string | null;

  potential:   number;
  quality:     number;
  resilience:  number;
  versatility: number;

  notes: string | null;
  confirmations: number;

  created_at: string;
  updated_at: string;
}

/**
 * Aggregated row from the `resource_stats` view — one row per
 * (resource_name, planet_key) tuple.
 */
export interface ResourceStat {
  resource_name: string;
  resource_category: ResourceCategory | null;
  planet_key: string;
  planet: string;
  sample_count: number;

  max_potential:   number;
  max_quality:     number;
  max_resilience:  number;
  max_versatility: number;

  avg_potential:   number;
  avg_quality:     number;
  avg_resilience:  number;
  avg_versatility: number;

  last_reported_at: string;
}

// ── Input types (action payloads) ────────────────────────────────────

export interface SubmitReadingInput {
  resource_name: string;
  resource_category: ResourceCategory | null;
  planet: string;
  biome_id: string | null;
  coords_hint: string | null;

  potential:   number;
  quality:     number;
  resilience:  number;
  versatility: number;

  notes: string | null;
}

// ── Helpers ──────────────────────────────────────────────────────────

/** Clamp a PQRV value into the 0–1000 game range */
export function clampPQRV(n: number): number {
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(1000, Math.round(n)));
}

/** Human-readable PQRV summary, e.g. "P 820 · Q 640 · R 500 · V 730" */
export function formatPQRV(p: PQRV): string {
  return [
    `P ${p.potential}`,
    `Q ${p.quality}`,
    `R ${p.resilience}`,
    `V ${p.versatility}`,
  ].join(' · ');
}

/** Colour band for a single stat value (0–1000) */
export function pqrvTier(n: number): 'low' | 'mid' | 'high' | 'peak' {
  if (n >= 900) return 'peak';
  if (n >= 700) return 'high';
  if (n >= 400) return 'mid';
  return 'low';
}

export const PQRV_TIER_COLORS: Record<'low' | 'mid' | 'high' | 'peak', string> = {
  low:  'text-slate-500',
  mid:  'text-slate-300',
  high: 'text-emerald-400',
  peak: 'text-amber-400 font-bold',
};
