/**
 * terminal-panels.tsx
 * Subcomponents for /terminal — stat cards, profile panel, contributions, quick actions.
 * One concern: extract panel UI so terminal/page.tsx stays under the line limit.
 *
 * Server-safe — pure components, no client state.
 * Hard-edge terminal aesthetic — no rounded borders.
 */

import Link from 'next/link';
import type { CrafterProfileFull } from '@/types/directory';
import { COMMISSION_COLORS, COMMISSION_LABELS } from '@/types/directory';

// ── Stat card ─────────────────────────────────────────────────────────

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
    <Link href={href}
      className="border border-sr-border bg-sr-surface/30 p-4 hover:border-slate-600 hover:bg-sr-surface/60 transition-colors group">
      <p className="text-xs font-mono uppercase tracking-[0.2em] text-sr-muted">{label}</p>
      <p className={`text-2xl font-black font-mono mt-1 ${tone[accent]}`}>{value}</p>
      <p className="text-xs font-mono text-sr-subtle mt-1">{hint}</p>
    </Link>
  );
}

// ── Profile panel ─────────────────────────────────────────────────────

export interface ProfilePanelProps {
  profile: CrafterProfileFull | null;
  email: string | null;
}

export function ProfilePanel({ profile, email }: ProfilePanelProps) {
  if (!profile) {
    return (
      <section className="border border-amber-800/40 bg-amber-900/10 p-5 space-y-3">
        <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-amber-400">
          ● No Operative Profile
        </p>
        <p className="text-xs font-mono text-amber-100/70 leading-relaxed">
          Signed in as <span className="font-bold">{email ?? 'unknown'}</span> but no
          directory profile is linked. Register to claim a maker mark, set your home
          planet, and start contributing to the open data feeds.
        </p>
        <Link href="/directory/me"
          className="inline-block text-[9px] font-mono uppercase tracking-[0.15em] px-3 py-1.5 border border-amber-700/50 bg-amber-800/30 text-amber-200 hover:bg-amber-800/50 transition-colors">
          Register Operative →
        </Link>
      </section>
    );
  }

  return (
    <section className="border border-sr-border bg-sr-surface/30">
      {/* Header bar */}
      <div className="border-b border-sr-border/50 px-4 py-2.5 flex items-center justify-between">
        <div>
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-sr-muted">Operative Profile</p>
          <p className="text-xs font-mono text-slate-500 mt-0.5">@{profile.in_game_name}</p>
        </div>
        <span className={`text-[9px] font-mono uppercase tracking-[0.15em] px-2 py-0.5 border ${COMMISSION_COLORS[profile.commission_status]}`}>
          {COMMISSION_LABELS[profile.commission_status]}
        </span>
      </div>

      <div className="px-4 py-4 space-y-3">
        {profile.maker_mark && (
          <div>
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-sr-muted">Maker's Mark</p>
            <p className="text-xs font-mono text-amber-400 mt-0.5">{profile.maker_mark}</p>
          </div>
        )}
        {profile.home_planet && (
          <div>
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-sr-muted">Home Planet</p>
            <p className="text-xs font-mono text-slate-300 mt-0.5">
              {profile.home_planet}{profile.home_sector && ` · ${profile.home_sector}`}
            </p>
          </div>
        )}
        {profile.bio && (
          <p className="text-[10px] font-mono text-slate-500 leading-relaxed line-clamp-3">
            {profile.bio}
          </p>
        )}
        {profile.specializations.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {profile.specializations.slice(0, 8).map((s) => (
              <span key={s.profession_id}
                className="text-[9px] font-mono px-1.5 py-0.5 border border-sr-border bg-sr-surface text-slate-400">
                {s.profession_name}
              </span>
            ))}
            {profile.specializations.length > 8 && (
              <span className="text-xs font-mono text-sr-muted">
                +{profile.specializations.length - 8} more
              </span>
            )}
          </div>
        )}
        <Link href="/directory/me"
          className="inline-block text-[9px] font-mono uppercase tracking-[0.15em] text-cyan-500 hover:text-cyan-300 transition-colors pt-1">
          Edit Dossier →
        </Link>
      </div>
    </section>
  );
}

// ── Contributions panel ───────────────────────────────────────────────

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
  title, items, emptyLabel, emptyHref, emptyHrefLabel, accent,
}: ContributionsPanelProps) {
  return (
    <div className="border border-sr-border bg-sr-surface/30 p-4 space-y-3">
      <p className={`text-[9px] font-mono uppercase tracking-[0.2em] ${accent}`}>{title}</p>
      {items.length === 0 ? (
        <div className="space-y-1">
          <p className="text-xs font-mono text-sr-muted">{emptyLabel}</p>
          <Link href={emptyHref} className="text-[10px] font-mono text-cyan-500 hover:text-cyan-300 transition-colors">
            {emptyHrefLabel}
          </Link>
        </div>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.id} className="flex items-baseline justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-mono text-slate-300 truncate">{item.primary}</p>
                <p className="text-xs font-mono text-sr-muted mt-0.5">{item.secondary}</p>
              </div>
              <span className="text-xs font-mono text-sr-subtle shrink-0">
                {item.timestamp.slice(0, 10)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ── Quick actions ─────────────────────────────────────────────────────

export function QuickActions({ hasProfile }: { hasProfile: boolean }) {
  return (
    <aside className="border border-sr-border bg-sr-surface/30 p-4 space-y-2">
      <p className="text-xs font-mono uppercase tracking-[0.2em] text-sr-muted border-b border-sr-border/40 pb-2 mb-3">
        Quick Actions
      </p>
      <ActionLink href="/atlas"        label="File Atlas reading"     tone="amber"   />
      <ActionLink href="/market"       label="Report market price"    tone="violet"  />
      <ActionLink href="/makers"       label="Edit maker portfolio"   tone="emerald" />
      <ActionLink href="/directory"    label="Browse directory"       tone="slate"   />
      {!hasProfile && (
        <ActionLink href="/directory/me" label="Register operative profile" tone="cta" />
      )}
    </aside>
  );
}

type ActionTone = 'amber' | 'violet' | 'emerald' | 'slate' | 'cta';

function ActionLink({ href, label, tone }: { href: string; label: string; tone: ActionTone }) {
  const cls: Record<ActionTone, string> = {
    amber:   'text-amber-400 hover:bg-amber-900/20',
    violet:  'text-violet-400 hover:bg-violet-900/20',
    emerald: 'text-emerald-400 hover:bg-emerald-900/20',
    slate:   'text-slate-400 hover:bg-sr-surface/60',
    cta:     'text-amber-200 border border-amber-700/50 bg-amber-900/20 hover:bg-amber-900/40',
  };
  return (
    <Link href={href}
      className={`block text-xs font-mono px-2.5 py-1.5 transition-colors ${cls[tone]}`}>
      → {label}
    </Link>
  );
}
