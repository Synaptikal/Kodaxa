'use client';

import Link from 'next/link';
import type { HQStats, Commission, CorpRole } from '@/types/corp';
import { COMMISSION_STATUS_LABELS, COMMISSION_STATUS_COLORS, ROLE_LABELS, canManageRoster, canAdminister } from '@/types/corp';

interface HQDashboardProps {
  stats: HQStats;
  recentCommissions: Commission[];
  userRole: CorpRole;
  displayName: string;
}

export function HQDashboard({ stats, recentCommissions, userRole, displayName }: HQDashboardProps) {
  return (
    <div className="p-6 space-y-8 max-w-4xl">

      {/* Welcome */}
      <div className="space-y-1">
        <p className="text-xs font-mono text-sr-muted uppercase tracking-[0.3em]">
          Corp HQ // Command Center
        </p>
        <h1 className="text-xl font-bold font-mono text-slate-100">
          Welcome back, <span className="text-cyan-400">{displayName}</span>
        </h1>
        <p className="text-xs text-slate-500">
          {ROLE_LABELS[userRole]} — Kodaxa Studios Internal Systems
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          label="Open Commissions"
          value={stats.openCommissions}
          sub="pending + in progress"
          color="text-amber-400"
          href="/corp/hq/commissions"
        />
        <StatCard
          label="Active Members"
          value={stats.activeMembers}
          sub="operatives on roster"
          color="text-teal-400"
          href={canManageRoster(userRole) ? '/corp/hq/roster' : undefined}
        />
        <StatCard
          label="Delivered This Month"
          value={stats.completedThisMonth}
          sub="completed commissions"
          color="text-cyan-400"
          href="/corp/hq/commissions?status=completed"
        />
        {canAdminister(userRole) && (
          <StatCard
            label="Pending Applications"
            value={stats.pendingApplications}
            sub="awaiting review"
            color={stats.pendingApplications > 0 ? 'text-violet-400' : 'text-slate-500'}
            href="/corp/hq/admin"
          />
        )}
      </div>

      {/* Quick actions */}
      <div className="space-y-2">
        <p className="text-xs font-mono text-sr-muted uppercase tracking-widest">Quick Access</p>
        <div className="flex flex-wrap gap-2">
          <QuickLink href="/corp/hq/commissions" label="Commission Board" />
          {canManageRoster(userRole) && <QuickLink href="/corp/hq/roster" label="Roster Manifest" />}
          {canAdminister(userRole) && <QuickLink href="/corp/hq/admin" label="Admin Control" />}
          <QuickLink href="/directory" label="Commerce Registry" external />
          <QuickLink href="/corporation" label="Corp Public Page" external />
        </div>
      </div>

      {/* Recent commissions */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <p className="text-xs font-mono text-sr-muted uppercase tracking-widest shrink-0">Recent Commissions</p>
          <div className="h-px flex-1 bg-sr-border" />
          <Link href="/corp/hq/commissions" className="text-xs font-mono text-cyan-700 hover:text-cyan-500 transition-colors">
            View all →
          </Link>
        </div>

        {recentCommissions.length === 0 ? (
          <p className="text-xs text-sr-muted font-mono py-4 text-center border border-sr-border">
            No commissions on file
          </p>
        ) : (
          <div className="space-y-1.5">
            {recentCommissions.map((c) => (
              <div key={c.id} className="flex items-center gap-3 px-3 py-2 border border-sr-border bg-sr-surface/40 hover:bg-sr-surface/80 transition-colors">
                <span className={`text-xs font-mono font-bold px-1.5 py-0.5 border shrink-0 ${COMMISSION_STATUS_COLORS[c.status]}`}>
                  {COMMISSION_STATUS_LABELS[c.status]}
                </span>
                <span className="text-xs text-slate-300 font-mono flex-1 truncate">{c.title}</span>
                <span className="text-xs font-mono text-sr-muted shrink-0">
                  {c.assignee?.in_game_name ?? '—'}
                </span>
                <span className="text-xs font-mono text-sr-subtle shrink-0">
                  {new Date(c.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label, value, sub, color, href,
}: {
  label: string; value: number; sub: string; color: string; href?: string;
}) {
  const inner = (
    <div className="border border-sr-border bg-sr-surface/60 p-4 space-y-1 hover:border-slate-600 transition-colors">
      <p className={`text-2xl font-bold font-mono ${color}`}>{value}</p>
      <p className="text-xs font-mono text-slate-300 uppercase tracking-wider">{label}</p>
      <p className="text-xs font-mono text-sr-muted">{sub}</p>
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : <div>{inner}</div>;
}

function QuickLink({ href, label, external }: { href: string; label: string; external?: boolean }) {
  const cls = 'px-3 py-1.5 text-xs font-mono font-semibold uppercase tracking-wider border border-sr-border text-slate-400 hover:text-cyan-300 hover:border-cyan-800 bg-sr-surface/40 hover:bg-cyan-900/10 transition-colors';
  return external
    ? <a href={href} className={cls}>{label}</a>
    : <Link href={href} className={cls}>{label}</Link>;
}
