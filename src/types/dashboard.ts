/**
 * dashboard.ts
 * Types for the Personal Analytics Dashboard.
 * One concern: defining the shape of session logs, Klaatu ledger, and skill progress.
 *
 * All data is localStorage-persisted — same pattern as the XP Timer.
 * No server/Supabase dependency for personal analytics.
 *
 * Key game mechanics modeled:
 *   - Klaatu is the in-game currency earned through missions
 *   - Session activity maps to profession XP categories
 *   - Skill progression tracks cumulative XP per profession tree
 */

// ── Activity Types ──────────────────────────────────────────────────

/** Activity categories that map to in-game actions */
export type ActivityType =
  | 'mining'
  | 'crafting'
  | 'trading'
  | 'combat'
  | 'building'
  | 'exploring'
  | 'farming'
  | 'hunting'
  | 'fishing'
  | 'cooking'
  | 'medical'
  | 'other';

export const ACTIVITY_LABELS: Record<ActivityType, string> = {
  mining:     'Mining',
  crafting:   'Crafting',
  trading:    'Trading',
  combat:     'Combat',
  building:   'Building',
  exploring:  'Exploring',
  farming:    'Farming',
  hunting:    'Hunting',
  fishing:    'Fishing',
  cooking:    'Cooking',
  medical:    'Medical',
  other:      'Other',
};

export const ACTIVITY_COLORS: Record<ActivityType, string> = {
  mining:     'text-amber-400   bg-amber-900/30   border-amber-800/40',
  crafting:   'text-teal-400    bg-teal-900/30    border-teal-800/40',
  trading:    'text-emerald-400 bg-emerald-900/30 border-emerald-800/40',
  combat:     'text-red-400     bg-red-900/30     border-red-800/40',
  building:   'text-orange-400  bg-orange-900/30  border-orange-800/40',
  exploring:  'text-violet-400  bg-violet-900/30  border-violet-800/40',
  farming:    'text-green-400   bg-green-900/30   border-green-800/40',
  hunting:    'text-rose-400    bg-rose-900/30    border-rose-800/40',
  fishing:    'text-sky-400     bg-sky-900/30     border-sky-800/40',
  cooking:    'text-orange-300  bg-orange-900/30  border-orange-800/40',
  medical:    'text-cyan-400    bg-cyan-900/30    border-cyan-800/40',
  other:      'text-slate-400   bg-slate-800/30   border-slate-700/40',
};

// ── Session Logs ────────────────────────────────────────────────────

/** A single activity entry within a session */
export interface ActivityEntry {
  type: ActivityType;
  detail: string;
  planet?: string;
}

/** A complete play session log */
export interface SessionLog {
  /** Unique ID */
  id: string;
  /** ISO date of the session */
  date: string;
  /** Duration in minutes */
  duration_minutes: number;
  /** Activities performed during this session */
  activities: ActivityEntry[];
  /** Klaatu earned this session */
  klaatu_earned: number;
  /** Klaatu spent this session */
  klaatu_spent: number;
  /** XP gained per profession (professionId → XP amount) */
  xp_gained: Record<string, number>;
  /** Optional notes */
  notes?: string;
}

// ── Klaatu Ledger ───────────────────────────────────────────────────

/** Categories for Klaatu transactions */
export type KlaatuCategory =
  | 'mission'
  | 'sale'
  | 'listing_fee'
  | 'skill_upgrade'
  | 'purchase'
  | 'commission'
  | 'other';

export const KLAATU_CATEGORY_LABELS: Record<KlaatuCategory, string> = {
  mission:       'Mission Reward',
  sale:          'Item Sale',
  listing_fee:   'Listing Fee',
  skill_upgrade: 'Skill Upgrade',
  purchase:      'Purchase',
  commission:    'Commission',
  other:         'Other',
};

export const KLAATU_CATEGORY_COLORS: Record<KlaatuCategory, string> = {
  mission:       'text-emerald-400',
  sale:          'text-teal-400',
  listing_fee:   'text-amber-400',
  skill_upgrade: 'text-violet-400',
  purchase:      'text-red-400',
  commission:    'text-cyan-400',
  other:         'text-slate-400',
};

/** A single Klaatu transaction */
export interface KlaatuEntry {
  /** Unique ID */
  id: string;
  /** ISO date of the transaction */
  date: string;
  /** Amount — positive = income, negative = expense */
  amount: number;
  /** Category */
  category: KlaatuCategory;
  /** Description */
  description: string;
  /** Optional link to a session log */
  session_id?: string;
}

// ── Skill Progress ──────────────────────────────────────────────────

/** Tracked XP progress for a single profession */
export interface SkillProgress {
  /** Profession ID (matches data/professions/*.json) */
  profession_id: string;
  /** Display name (cached for rendering without re-importing profession data) */
  profession_name: string;
  /** Cumulative XP recorded */
  current_xp: number;
  /** Number of sessions where this profession gained XP */
  sessions_logged: number;
  /** ISO date of last XP gain */
  last_active: string;
}

// ── Helpers ─────────────────────────────────────────────────────────

/** Format Klaatu amount with sign and thousands separators */
export function formatKlaatu(n: number): string {
  if (!Number.isFinite(n)) return '—';
  const sign = n >= 0 ? '+' : '';
  return `${sign}${Math.round(n).toLocaleString()} K`;
}

/** Format Klaatu amount without sign */
export function formatKlaatuAbs(n: number): string {
  if (!Number.isFinite(n)) return '—';
  return `${Math.abs(Math.round(n)).toLocaleString()} K`;
}

/** Format duration in minutes to "Xh Ym" */
export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}
