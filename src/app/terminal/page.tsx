/**
 * terminal/page.tsx
 * My Terminal — authenticated operative dashboard.
 * One concern: aggregate profile, data contributions, and quick-actions.
 *
 * Unauthenticated visitors see a sign-in CTA. Subcomponents live in
 * @/components/terminal/terminal-panels.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { NavHeader } from '@/components/ui/nav-header';
import { SectionLabel } from '@/components/ui/section-label';
import { createClient } from '@/lib/supabase/server';
import { getOwnProfile } from '@/lib/directory/queries';
import { getMyRecentReadings } from '@/lib/atlas/queries';
import { getMyRecentReports } from '@/lib/market/queries';
import { getOwnPortfolio } from '@/lib/makers/queries';
import { getLatestPosts } from '@/data/dispatch';
import { formatCredits } from '@/types/market';
import {
  StatCard,
  ProfilePanel,
  ContributionsPanel,
  QuickActions,
} from '@/components/terminal/terminal-panels';

export const metadata: Metadata = {
  title: 'My Terminal — Kodaxa Studios',
  description:
    'Your Kodaxa operative terminal: dossier, data contributions, portfolio, and division quick-links.',
};

export const dynamic = 'force-dynamic';

export default async function TerminalPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return <SignInView />;

  const [profile, atlasRecent, marketRecent, portfolio] = await Promise.all([
    getOwnProfile(),
    getMyRecentReadings(user.id, 5),
    getMyRecentReports(user.id, 5),
    getOwnPortfolio(),
  ]);

  const latestDispatch = getLatestPosts(3);
  const displayName = profile?.display_name ?? user.email?.split('@')[0] ?? 'Associate';

  return (
    <div className="flex flex-col min-h-dvh bg-sr-bg text-sr-text">
      <NavHeader />

      {/* Terminal header */}
      <div className="border-b border-sr-border bg-sr-surface/40">
        <div className="max-w-6xl mx-auto px-6 py-5 space-y-1">
          <p className="text-[9px] font-mono uppercase tracking-[0.3em] text-slate-600">
            Personnel · My Terminal · {new Date().toISOString().slice(0, 10)}
          </p>
          <div className="flex items-baseline gap-3 flex-wrap">
            <h1 className="text-2xl font-black font-mono text-slate-100">
              {displayName}
            </h1>
            {profile?.is_kodaxa_member && (
              <span className="text-[9px] font-mono uppercase tracking-[0.15em] px-2 py-0.5 border border-amber-700/50 bg-amber-900/20 text-amber-400">
                ● Kodaxa Member
              </span>
            )}
          </div>
          <p className="text-[10px] font-mono text-slate-600">
            {profile
              ? `@${profile.in_game_name}${profile.home_planet ? ` · ${profile.home_planet}` : ''}${profile.maker_mark ? ` · Mark: ${profile.maker_mark}` : ''}`
              : 'No operative profile linked — set one up to register your maker mark and home planet.'}
          </p>
        </div>
      </div>

      <main className="flex-1 max-w-6xl mx-auto w-full border-x border-sr-border/40 px-6 py-6 space-y-6">

        {/* Stats strip */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard label="Atlas Readings"  value={atlasRecent.length}                     hint="Recent PQRV submissions"         href="/atlas"        accent="amber"   />
          <StatCard label="Price Reports"   value={marketRecent.length}                    hint="Recent market observations"      href="/market"       accent="violet"  />
          <StatCard label="Portfolio Items" value={portfolio.length}                       hint="Registered signature works"      href="/makers"       accent="emerald" />
          <StatCard
            label="Reputation"
            value={profile ? profile.average_rating.toFixed(1) : '—'}
            hint={profile ? `${profile.total_reviews} field report${profile.total_reviews === 1 ? '' : 's'}` : 'No field reports yet'}
            href="/directory/me"
            accent="cyan"
          />
        </div>

        {/* Profile + contributions */}
        <div className="grid lg:grid-cols-2 gap-4">
          <ProfilePanel profile={profile} email={user.email ?? null} />
          <section className="space-y-4">
            <ContributionsPanel
              title="Recent Atlas Readings"
              emptyLabel="No PQRV readings filed yet."
              emptyHref="/atlas"
              emptyHrefLabel="File your first reading →"
              items={atlasRecent.map((r) => ({
                id: r.id,
                primary: `${r.resource_name} @ ${r.planet}`,
                secondary: `P${r.potential} · Q${r.quality} · R${r.resilience} · V${r.versatility}`,
                timestamp: r.created_at,
              }))}
              accent="text-amber-400"
            />
            <ContributionsPanel
              title="Recent Market Reports"
              emptyLabel="No price reports filed yet."
              emptyHref="/market"
              emptyHrefLabel="File a price observation →"
              items={marketRecent.map((r) => ({
                id: r.id,
                primary: `${r.item_name} @ ${r.planet}`,
                secondary: `${r.side.toUpperCase()} · ${formatCredits(r.unit_price)} / unit · ${r.quantity} qty`,
                timestamp: r.observed_at,
              }))}
              accent="text-violet-400"
            />
          </section>
        </div>

        {/* Latest dispatch + quick actions */}
        <div className="grid lg:grid-cols-[1fr,280px] gap-4">
          <section className="border border-sr-border bg-sr-surface/30 p-5 space-y-3">
            <div className="flex items-baseline justify-between border-b border-sr-border/40 pb-3">
              <SectionLabel text="Latest Dispatch" />
              <Link href="/dispatch"
                className="text-[9px] font-mono uppercase tracking-[0.15em] text-cyan-500 hover:text-cyan-300 transition-colors">
                All posts →
              </Link>
            </div>
            <ul className="space-y-2 pt-1">
              {latestDispatch.map((p) => (
                <li key={p.slug}>
                  <Link href={`/dispatch/${p.slug}`}
                    className="block px-2 py-2 hover:bg-sr-surface/60 transition-colors">
                    <p className="text-[9px] font-mono text-slate-600 uppercase tracking-[0.1em]">
                      {p.published_at} · {p.author}
                    </p>
                    <p className="text-sm font-bold font-mono text-slate-200 mt-0.5">{p.title}</p>
                    <p className="text-[10px] font-mono text-sr-muted line-clamp-2 mt-0.5 leading-relaxed">{p.summary}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <QuickActions hasProfile={!!profile} />
        </div>

      </main>
    </div>
  );
}

// ── Unauthenticated view ───────────────────────────────────────────────

function SignInView() {
  return (
    <div className="flex flex-col min-h-dvh bg-sr-bg text-sr-text">
      <NavHeader />
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="max-w-md w-full border border-sr-border bg-sr-surface/40 p-8 text-center space-y-4">
          <p className="text-[9px] font-mono uppercase tracking-[0.35em] text-slate-600">
            Personnel · My Terminal
          </p>
          <h1 className="text-xl font-black font-mono text-slate-100">Uplink Required</h1>
          <p className="text-sm font-mono text-slate-400 leading-relaxed">
            Your terminal aggregates your operative dossier, PQRV data contributions, and
            division quick-actions into a single operations surface. Authenticate to access.
          </p>
          <Link href="/auth/sign-in?next=/terminal"
            className="inline-block text-xs px-5 py-2.5 bg-cyan-600/20 border border-cyan-700/60 text-cyan-300 font-mono font-semibold uppercase tracking-wide hover:bg-cyan-600/30 hover:border-cyan-600 transition-all">
            Establish Uplink →
          </Link>
          <p className="text-[10px] font-mono text-slate-600 pt-2">
            No personnel file?{' '}
            <Link href="/auth/sign-up" className="text-cyan-500 hover:text-cyan-400">
              Request Access
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
