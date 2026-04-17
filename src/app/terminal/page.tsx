/**
 * terminal/page.tsx
 * My Terminal — authenticated associate dashboard.
 * One concern: aggregate the associate's profile, recent contributions,
 * and quick-action links into a single landing surface.
 *
 * Unauthenticated visitors see a sign-in CTA instead.
 * Subcomponents live in @/components/terminal/terminal-panels.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { NavHeader } from '@/components/ui/nav-header';
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
    'Your Kodaxa associate terminal: profile, contributions, portfolio, and division quick-links.',
};

export const dynamic = 'force-dynamic';

export default async function TerminalPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return <SignInView />;

  // Parallel fetch everything needed for the dashboard
  const [profile, atlasRecent, marketRecent, portfolio] = await Promise.all([
    getOwnProfile(),
    getMyRecentReadings(user.id, 5),
    getMyRecentReports(user.id, 5),
    getOwnPortfolio(),
  ]);

  const latestDispatch = getLatestPosts(3);
  const displayName =
    profile?.display_name ?? user.email?.split('@')[0] ?? 'Associate';

  return (
    <div className="flex flex-col min-h-dvh">
      <NavHeader />

      {/* Hero */}
      <header className="border-b border-slate-800 bg-slate-900/40">
        <div className="max-w-6xl mx-auto px-4 py-6 space-y-1">
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500">
            Associate Terminal // {new Date().toISOString().slice(0, 10)}
          </p>
          <h1 className="text-2xl font-bold text-slate-100">
            Welcome back, {displayName}.
            {profile?.is_kodaxa_member && (
              <span className="ml-2 text-[10px] font-mono text-amber-400 bg-amber-900/40 border border-amber-700/50 px-1.5 py-0.5 rounded align-middle">
                KODAXA
              </span>
            )}
          </h1>
          <p className="text-xs text-slate-500">
            {profile
              ? `@${profile.in_game_name}${profile.home_planet ? ` · ${profile.home_planet}` : ''}${profile.maker_mark ? ` · ${profile.maker_mark}` : ''}`
              : 'Your profile is not set up yet — claim your maker mark and home planet below.'}
          </p>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6 space-y-6">
        {/* Quick stats strip */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard label="Atlas readings" value={atlasRecent.length} hint="Recent PQRV submissions"  href="/atlas"         accent="amber" />
          <StatCard label="Price reports"  value={marketRecent.length} hint="Recent market observations" href="/market"      accent="violet" />
          <StatCard label="Portfolio items" value={portfolio.length}   hint="Registered signature works" href="/makers"      accent="emerald" />
          <StatCard
            label="Reputation"
            value={profile ? profile.average_rating.toFixed(1) : '—'}
            hint={profile ? `${profile.total_reviews} review${profile.total_reviews === 1 ? '' : 's'}` : 'No reviews yet'}
            href="/directory/me"
            accent="cyan"
          />
        </div>

        {/* Main grid: profile + contributions */}
        <div className="grid lg:grid-cols-[1fr_1fr] gap-6">
          <ProfilePanel profile={profile} email={user.email ?? null} />

          <section className="space-y-4">
            <ContributionsPanel
              title="Recent Atlas Readings"
              emptyLabel="No readings filed yet."
              emptyHref="/atlas"
              emptyHrefLabel="File your first PQRV reading →"
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

        {/* Dispatch + quick actions */}
        <div className="grid lg:grid-cols-[1fr_minmax(280px,340px)] gap-6">
          <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-3">
            <header className="flex items-baseline justify-between">
              <h2 className="text-sm font-bold text-slate-100">Latest Dispatch</h2>
              <Link
                href="/dispatch"
                className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 hover:text-cyan-300"
              >
                All posts →
              </Link>
            </header>
            <ul className="space-y-2">
              {latestDispatch.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/dispatch/${p.slug}`}
                    className="block p-2 -mx-2 rounded hover:bg-slate-800/40 transition-colors"
                  >
                    <p className="text-[10px] font-mono text-slate-500">
                      {p.published_at} · {p.author}
                    </p>
                    <p className="text-sm text-slate-200 font-medium">{p.title}</p>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">{p.summary}</p>
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

function SignInView() {
  return (
    <div className="flex flex-col min-h-dvh">
      <NavHeader />
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="max-w-md border border-sr-border bg-sr-surface/40 p-8 text-center space-y-4">
          <p className="text-[8px] font-mono uppercase tracking-[0.35em] text-slate-600">
            Personnel · My Terminal
          </p>
          <h1 className="text-xl font-bold font-mono text-slate-100">Uplink Required</h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            Your terminal aggregates your commerce profile, data contributions, and division
            quick-actions into a single operations surface. Authenticate to access it.
          </p>
          <Link
            href="/auth/sign-in?next=/terminal"
            className="inline-block text-xs px-5 py-2.5 bg-cyan-600/20 border border-cyan-700/60 text-cyan-300 font-mono font-semibold uppercase tracking-wide hover:bg-cyan-600/30 hover:border-cyan-600 transition-all"
          >
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
