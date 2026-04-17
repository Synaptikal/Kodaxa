/**
 * dispatch.ts
 * Types for the Dispatch — in-universe newsroom of Kodaxa Studios.
 * One concern: post structure and typed content blocks.
 *
 * Content is authored as structured blocks (not freeform markdown) so we
 * avoid pulling in a markdown pipeline. Each block renders to a specific
 * React component — same pattern used for creatures/biomes.
 */

export type DispatchCategory =
  | 'charter'          // Corporate announcements
  | 'field_report'     // Scouting / intel reports
  | 'patch_recap'      // Game update summaries
  | 'division_brief'   // Division-level news
  | 'recruitment';     // Recruitment + onboarding

export const CATEGORY_LABELS: Record<DispatchCategory, string> = {
  charter:        'Charter',
  field_report:   'Field Report',
  patch_recap:    'Patch Recap',
  division_brief: 'Division Brief',
  recruitment:    'Recruitment',
};

export const CATEGORY_COLORS: Record<DispatchCategory, string> = {
  charter:        'text-amber-400 bg-amber-900/30 border-amber-800/40',
  field_report:   'text-violet-400 bg-violet-900/30 border-violet-800/40',
  patch_recap:    'text-cyan-400 bg-cyan-900/30 border-cyan-800/40',
  division_brief: 'text-teal-400 bg-teal-900/30 border-teal-800/40',
  recruitment:    'text-emerald-400 bg-emerald-900/30 border-emerald-800/40',
};

// ── Content blocks ────────────────────────────────────────────────

export type Block =
  | { kind: 'heading'; level: 2 | 3; text: string }
  | { kind: 'paragraph'; text: string }
  | { kind: 'quote'; text: string; cite?: string }
  | { kind: 'list'; ordered?: boolean; items: string[] }
  | { kind: 'callout'; tone: 'info' | 'warn' | 'success'; text: string }
  | { kind: 'link_card'; href: string; title: string; description: string };

// ── Post ──────────────────────────────────────────────────────────

export interface DispatchPost {
  slug: string;
  title: string;
  category: DispatchCategory;
  /** ISO date (YYYY-MM-DD) */
  published_at: string;
  /** Author division or associate name */
  author: string;
  /** Short summary, shown on the index */
  summary: string;
  /** Display tags */
  tags: string[];
  /** Hero eyebrow line (e.g. "Intelligence Division // Field Report #007") */
  eyebrow?: string;
  /** Main content, as a list of typed blocks */
  content: Block[];
}
