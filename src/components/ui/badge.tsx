/**
 * badge.tsx
 * Unified badge/status chip for Kodaxa Studios.
 * One concern: status, contract lifecycle, and division badges — all variants.
 *
 * Hard-edged (no border-radius) by design: terminal UI language, not SaaS UI.
 * Import this instead of writing inline badge classes anywhere in the app.
 */

import { type HTMLAttributes } from 'react';

// ── Variant types ──────────────────────────────────────────────────────

export type DeployStatus  = 'live' | 'new' | 'soon' | 'beta' | 'wip';
export type ContractState =
  | 'queued' | 'under-review' | 'claimed' | 'in-fabrication'
  | 'awaiting-transit' | 'fulfilled' | 'flagged';
export type DivisionName  = 'operations' | 'intelligence' | 'commerce' | 'dispatch' | 'personnel';

export type BadgeVariant = DeployStatus | ContractState | DivisionName;

// ── Style map ──────────────────────────────────────────────────────────

const STYLES: Record<BadgeVariant, string> = {
  // Deploy status
  live:               'bg-teal-950 text-teal-400 border-teal-700/50',
  new:                'bg-cyan-950 text-cyan-400 border-cyan-700/50',
  soon:               'bg-slate-900 text-slate-500 border-slate-700/50',
  beta:               'bg-amber-950 text-amber-400 border-amber-700/50',
  wip:                'bg-purple-950 text-purple-400 border-purple-700/50',
  // Contract lifecycle
  queued:             'bg-slate-900 text-slate-400 border-slate-700/50',
  'under-review':     'bg-amber-950 text-amber-400 border-amber-700/50',
  claimed:            'bg-cyan-950 text-cyan-400 border-cyan-700/50',
  'in-fabrication':   'bg-teal-950 text-teal-400 border-teal-700/50',
  'awaiting-transit': 'bg-sky-950 text-sky-400 border-sky-700/50',
  fulfilled:          'bg-emerald-950 text-emerald-400 border-emerald-700/50',
  flagged:            'bg-red-950 text-red-400 border-red-700/50',
  // Division
  operations:         'bg-teal-950 text-teal-500 border-teal-800/60',
  intelligence:       'bg-cyan-950 text-cyan-500 border-cyan-800/60',
  commerce:           'bg-amber-950 text-amber-500 border-amber-800/60',
  dispatch:           'bg-violet-950 text-violet-500 border-violet-800/60',
  personnel:          'bg-slate-900 text-slate-500 border-slate-700/60',
};

const DEFAULT_LABELS: Record<BadgeVariant, string> = {
  live:               '● LIVE',
  new:                '● NEW',
  soon:               '○ SOON',
  beta:               '◐ BETA',
  wip:                '◌ WIP',
  queued:             'QUEUED',
  'under-review':     'UNDER REVIEW',
  claimed:            'CLAIMED',
  'in-fabrication':   'IN FABRICATION',
  'awaiting-transit': 'AWAITING TRANSIT',
  fulfilled:          '✓ FULFILLED',
  flagged:            '⚑ FLAGGED',
  operations:         'OPERATIONS',
  intelligence:       'INTELLIGENCE',
  commerce:           'COMMERCE',
  dispatch:           'DISPATCH',
  personnel:          'PERSONNEL',
};

// ── Component ──────────────────────────────────────────────────────────

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant: BadgeVariant;
  label?: string;
}

export function Badge({ variant, label, className = '', ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center text-[8px] font-mono font-bold uppercase tracking-wide px-1.5 py-0.5 border ${STYLES[variant]} ${className}`}
      {...props}
    >
      {label ?? DEFAULT_LABELS[variant]}
    </span>
  );
}
