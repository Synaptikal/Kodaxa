/**
 * terminal-panels.tsx
 * Subcomponents for /terminal — stat cards, profile panel, quick actions.
 * One concern: extract panel UI so terminal/page.tsx stays under the line limit.
 *
 * Server-safe — pure components, no client state.
 */

import Link from 'next/link';
import type { CrafterProfileFull } from '@/types/directory';
import { COMMISSION_COLORS, COMMISSION_LABELS } from '@/types/directory';

// ── Stat card ────────────────────────────────────────────────────────

export interface StatCardProps {
  label: string;
  value: number | string;
  hint: string;
  href: string;
  accent: 'amber' | 'violet' | 'emerald' | 'cyan';
}

export function StatCard({ label, value, hint, href, accent }: StatCardProps) {
  const tone: Record<StatCardProps['accent'], string> = {
    amber:   'text-amber-400',
    violet:  'text-violet-400',
    emerald: 'text-emerald-400',
    cyan:    'text-cyan-400',
  };
  return (
    <Link
      href={href}
      className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 hover:border-slate-700 transition-colors group"
    >
      <p className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
        {label}
      </p>
      <p className={`text-2xl font-bold font-mono ${tone[accent]}`}>{value}</p>
      <p className="text-[10px] text-slate-600 mt-1">{hint}</p>
    </Link>
  );
}

// ── Profile panel ────────────────────────────────────────────────────

export interface ProfilePanelProps {
  profile: CrafterProfileFull | null;
  email: string | null;
}

export function ProfilePanel({ profile, email }: ProfilePanelProps) {
  if (!profile) {
    return (
      <section className="rounded-xl border border-amber-800/50 bg-amber-900/10 p-5 space-y-3">
        <h2 className="text-sm font-bold text-amber-200">Profile not set up</h2>
        <p className="text-xs text-amber-100/70 leading-relaxed">
          You&apos;re signed in as <span className="font-mono">{email ?? 'unknown'}</span>,
          but haven&apos;t claimed a Directory profile yet. Do it now to register
          a maker mark, set your home planet, and start contributing to the
          open data feeds.
        </p>
        <Link
          href="/directory/me"
          className="inline-block text-xs px-3 py-1.5 rounded-md bg-amber-800/40 text-amber-200 border border-amber-700/50 hover:bg-amber-800/60 transition-colors"
        >
          Set up my profile →
        </Link>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-3">
      <header className="flex items-start justify-between gap-2">
        <div>
          <h2 className="text-sm font-bold text-slate-100">Profile</h2>
          <p className="text-[10px] font-mono text-slate-500">
            @{profile.in_game_name}
          </p>
        </div>
        <span
          className={`text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded border ${COMMISSION_COLORS[profile.commission_status]}`}
        >
          {COMMISSION_LABELS[profile.commission_status]}
        </span>
      </header>

      {profile.maker_mark && (
        <p className="text-[11px]">
          <span className="text-slate-600 font-mono uppercase tracking-wider">Mark:</span>{' '}
          <span className="text-amber-400 font-mono">{profile.maker_mark}</span>
        </p>
      )}

      {profile.home_planet && (
        <p className="text-[11px] font-mono text-slate-400">
          {profile.home_planet}
          {profile.home_sector && <> · {profile.home_sector}</>}
        </p>
      )}

      {profile.bio && (
        <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
          {profile.bio}
        </p>
      )}

      {profile.specializations.length > 0 && (
        <div className="flex flex-wrap gap-1 pt-1">
          {profile.specializations.slice(0, 6).map((s) => (
            <span
              key={s.profession_id}
              className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300"
            >
              {s.profession_name}
            </span>
          ))}
        </div>
      )}

      <Link
        href="/directory/me"
        className="inline-block text-[10px] font-mono uppercase tracking-wider text-cyan-400 hover:text-cyan-300 pt-1"
      >
        Edit profile →
      </Link>
    </section>
  );
}

// ── Contributions panel ──────────────────────────────────────────────

export interface ContributionRow {
  id: string;
  primary: string;
  secondary: string;
  timestamp: string;
}

export interface ContributionsPanelProps {
  title: string;
  items: ContributionRow[];
  emptyLabel: string;
  emptyHref: string;
  emptyHrefLabel: string;
  accent: string;
}

export function ContributionsPanel({
  title,
  items,
  emptyLabel,
  emptyHref,
  emptyHrefLabel,
  accent,
}: ContributionsPanelProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-2">
      <h3 className={`text-sm font-bold ${accent}`}>{title}</h3>
      {items.length === 0 ? (
        <div className="text-xs text-slate-500 space-y-1">
          <p>{emptyLabel}</p>
          <Link
            href={emptyHref}
            className="text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            {emptyHrefLabel}
          </Link>
        </div>
      ) : (
        <ul className="space-y-1.5">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-baseline justify-between gap-2 text-xs"
            >
              <div className="min-w-0 flex-1">
                <p className="text-slate-200 truncate">{item.primary}</p>
                <p className="text-[10px] font-mono text-slate-500">
                  {item.secondary}
                </p>
              </div>
              <span className="text-[10px] font-mono text-slate-600 shrink-0">
                {item.timestamp.slice(0, 10)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ── Quick actions ────────────────────────────────────────────────────

export function QuickActions({ hasProfile }: { hasProfile: boolean }) {
  return (
    <aside className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-2">
      <h2 className="text-sm font-bold text-slate-100">Quick Actions</h2>
      <ActionLink href="/atlas" label="File Atlas reading" tone="amber" />
      <ActionLink href="/market" label="Report market price" tone="violet" />
      <ActionLink href="/makers" label="Edit maker portfolio" tone="emerald" />
      <ActionLink href="/directory" label="Browse directory" tone="slate" />
      {!hasProfile && (
        <ActionLink href="/directory/me" label="Set up my profile" tone="amber-cta" />
      )}
    </aside>
  );
}

type ActionTone = 'amber' | 'violet' | 'emerald' | 'slate' | 'amber-cta';

function ActionLink({
  href,
  label,
  tone,
}: {
  href: string;
  label: string;
  tone: ActionTone;
}) {
  const toneCls: Record<ActionTone, string> = {
    amber:       'text-amber-300 hover:bg-amber-900/30',
    violet:      'text-violet-300 hover:bg-violet-900/30',
    emerald:     'text-emerald-300 hover:bg-emerald-900/30',
    slate:       'text-slate-300 hover:bg-slate-800/60',
    'amber-cta': 'text-amber-100 bg-amber-800/40 border border-amber-700/50 hover:bg-amber-800/60',
  };
  return (
    <Link
      href={href}
      className={`block text-xs px-2.5 py-1.5 rounded transition-colors font-mono ${toneCls[tone]}`}
    >
      → {label}
    </Link>
  );
}
