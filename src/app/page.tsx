/**
 * page.tsx (root)
 * Kodaxa Studios — Operations Grid. Corporate terminal entry point.
 * One concern: organization leads, tools follow. Featured transmission above the fold.
 *
 * Server component: all data at build time. No JS shipped for core layout.
 * Starfield and scanline defined in globals.css. Search uses native GET form.
 * Layout: Hero (2-col) → Divisions Grid → Transmission+Dispatches → Tool Suite → Pending
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { SKILL_CAP, TOOL_CAP } from '@/lib/skill-engine';
import { getProfessionSummaries, getNodeMap } from '@/data/professions/index';
import { getCraftingStats } from '@/data/crafting/index';
import { getAllItems } from '@/data/items/index';
import { getAllPostsMerged } from '@/data/dispatch/merged';
import { NavHeader } from '@/components/ui/nav-header';
import { Badge } from '@/components/ui/badge';
import { SectionLabel } from '@/components/ui/section-label';
import { RelayTicker } from '@/components/ui/relay-ticker';
import { FeaturedTransmission, DispatchCard, ToolCard } from '@/components/landing/cards';
import { NAV_LINKS, SOON, buildTools, DIVISIONS, PHASE_COLORS, buildTickerMessages } from './landing-config';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Kodaxa Studios — Stars Reach Data & Tools',
  description:
    'Skill planner, crafting calculator, crafter directory, and item database for Stars Reach. Built by crafters, for crafters.',
};

// ── Build-time data ────────────────────────────────────────────────────
const totalProf  = getProfessionSummaries().length;
const liveNodes  = Array.from(getNodeMap().values()).filter((n) => n.implemented).length;
const craftStats = getCraftingStats();
const totalItems = getAllItems().length;
const TOOLS = buildTools({
  skillCap: SKILL_CAP, toolCap: TOOL_CAP, totalProf, liveNodes,
  totalRecipes:   craftStats.totalRecipes,
  totalResources: craftStats.totalResources,
  totalStations:  craftStats.totalStations,
  totalItems,
});

// Derived from TOOLS array — stays accurate as tools are added or removed.
const ONLINE_COUNT = TOOLS.length;
const TICKER_MESSAGES = buildTickerMessages(totalProf, SKILL_CAP);

// ── Page ───────────────────────────────────────────────────────────────
export default async function LandingPage() {
  const allPosts    = await getAllPostsMerged();
  const featuredPost = allPosts[0] ?? null;
  const recentPosts  = allPosts.slice(1, 3);

  return (
    <div className="min-h-dvh flex flex-col bg-sr-bg text-sr-text">
      <NavHeader />

      <main className="flex-1 max-w-6xl mx-auto w-full border-x border-sr-border/40">
        <div className="px-6 py-8 space-y-8">

          {/* ── Hero ─────────────────────────────────────────────── */}
          <section className="relative overflow-hidden border border-sr-border">
            <Image
              src="/divisions/hero-space.jpg"
              alt="" fill priority
              className="object-cover opacity-35 pointer-events-none"
              aria-hidden="true"
            />
            <div className="starfield absolute inset-0 opacity-25" aria-hidden="true" />
            <div className="relative z-10 px-8 py-14 flex flex-col gap-6 max-w-2xl">
              <div className="space-y-2">
                <p className="text-xs font-mono uppercase tracking-[0.3em] text-accent/80">
                  Stars Reach · Community Tools
                </p>
                <h1 className="text-3xl sm:text-4xl font-black font-mono leading-tight">
                  KODAXA STUDIOS
                </h1>
                <p className="text-sm font-mono text-sr-muted leading-relaxed max-w-lg">
                  Skill planner, crafting calculator, crafter directory, and more — built for Stars Reach players.
                </p>
              </div>
              <form action="/recipes" method="GET" className="flex items-center w-full max-w-md">
                <input
                  type="search" name="q"
                  placeholder="Search recipes, items, crafters…"
                  className="flex-1 px-4 py-2.5 bg-sr-bg/80 border border-sr-border text-sm font-mono text-sr-text placeholder-sr-subtle focus:outline-none focus:border-accent/60 transition-colors"
                />
                <button type="submit" className="px-5 py-2.5 bg-accent/20 border border-l-0 border-accent/40 text-accent text-xs font-mono font-semibold hover:bg-accent/30 transition-all tracking-[0.1em] shrink-0">
                  SEARCH
                </button>
              </form>
              <div className="flex flex-wrap gap-3">
                <Link href="/planner"
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono font-semibold text-accent border border-accent/40 bg-accent/10 hover:bg-accent/20 transition-all tracking-[0.12em] uppercase">
                  Skill Planner →
                </Link>
                <Link href="/crafting"
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono text-sr-muted border border-sr-border hover:border-sr-muted hover:text-sr-text transition-all tracking-[0.12em] uppercase">
                  Crafting →
                </Link>
                <Link href="/directory"
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono text-sr-muted border border-sr-border hover:border-sr-muted hover:text-sr-text transition-all tracking-[0.12em] uppercase">
                  Crafter Directory →
                </Link>
              </div>
            </div>
            <RelayTicker messages={TICKER_MESSAGES} />
          </section>

          {/* ── System announcement band ─────────────────────── */}
          <div className="border-y border-sr-border/40 bg-sr-surface/20 divide-y divide-sr-border/30">
            <div className="px-4 py-2 flex items-center gap-3 flex-wrap">
              <span className="text-xs font-mono text-teal-600 tracking-[0.15em] uppercase shrink-0">SYSTEM NOTE</span>
              <span className="text-sr-border" aria-hidden="true">·</span>
              <p className="text-xs font-mono text-sr-muted leading-relaxed">
                Kodaxa is an in-universe ops console for Stars Reach roleplayers and crafters —
                plan builds, prepare your operative profile, and coordinate your fabrication network.
              </p>
            </div>
            <div className="px-4 py-2 flex items-center gap-3 flex-wrap">
              <span className="text-xs font-mono text-amber-700 tracking-[0.15em] uppercase shrink-0">FOUNDATION PHASE</span>
              <span className="text-sr-border" aria-hidden="true">·</span>
              <p className="text-xs font-mono text-sr-muted leading-relaxed">
                Kodaxa is currently a solo-built command terminal — maintained by a single systems architect
                to map game data, prototype guild infrastructure, and prepare for expanded operations at beta.
                Network scaffold is live. Operative roster forms at early access.
              </p>
            </div>
          </div>

          {/* ── Divisions Grid ────────────────────────────────── */}
          <section className="space-y-4">
            <div className="flex items-baseline justify-between">
              <SectionLabel text="Divisions" sub="League-aligned operational branches" />
            </div>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              {DIVISIONS.map(({ label, name, href, tools, borderColor, hoverStyle, labelColor, Icon, imgSrc }) => (
                <Link key={label} href={href}
                  className={`group relative block overflow-hidden border border-sr-border border-l-2 ${borderColor} bg-sr-surface/30 px-4 py-3 transition-all ${hoverStyle}`}>
                  <Image src={imgSrc} alt="" fill className="object-cover opacity-[0.08] group-hover:opacity-[0.15] transition-opacity pointer-events-none" aria-hidden="true" />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <Icon className={`w-4 h-4 ${labelColor} opacity-50 group-hover:opacity-100 transition-opacity`} aria-hidden="true" />
                      <span className={`text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity ${labelColor}`}>→</span>
                    </div>
                    <p className={`text-xs font-mono font-semibold uppercase tracking-[0.2em] ${labelColor}`}>{label}</p>
                    <p className="mt-1.5 text-sm font-bold font-mono text-slate-100">{name}</p>
                    <ul className="mt-2 space-y-0.5">
                      {tools.map((t) => (
                        <li key={t} className="text-xs font-mono text-sr-muted pl-2 border-l border-sr-border/40">{t}</li>
                      ))}
                    </ul>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* ── Transmission + Recent Dispatches ──────────────── */}
          {featuredPost && (
            <section className="grid gap-4 lg:grid-cols-[1.3fr,1fr]">
              <FeaturedTransmission post={featuredPost} />
              {recentPosts.length > 0 && (
                <aside className="border border-sr-border bg-sr-surface/30 p-4">
                  <div className="flex items-center justify-between border-b border-sr-border/40 pb-3">
                    <SectionLabel text="Recent Dispatches" />
                    <Link href="/dispatch" className="text-xs font-mono text-sr-subtle hover:text-slate-400 uppercase tracking-[0.12em] transition-colors">
                      View All →
                    </Link>
                  </div>
                  <div className="mt-2 divide-y divide-sr-border/20">
                    {recentPosts.map((post) => <DispatchCard key={post.slug} post={post} />)}
                  </div>
                </aside>
              )}
            </section>
          )}

          {/* ── Active Tool Suite ─────────────────────────────── */}
          <section className="space-y-4">
            <div className="flex items-baseline justify-between">
              <SectionLabel text="Active Tool Suite" sub={`${ONLINE_COUNT} systems online`} />
              <span className="text-xs font-mono text-teal-500 tracking-[0.15em] uppercase flex items-center gap-1.5">
                <span className="status-dot-live">●</span> {ONLINE_COUNT} ONLINE
              </span>
            </div>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {TOOLS.map((tool) => <ToolCard key={tool.href} {...tool} />)}
            </div>
          </section>

          {/* ── Pending Deployment ────────────────────────────── */}
          <section className="space-y-4">
            <SectionLabel text="Pending Deployment" sub="Systems in active development" />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {SOON.map((s) => (
                <div key={s.href} className="border border-sr-border/50 bg-sr-surface/20 p-3 space-y-1.5 opacity-60">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="soon" label="PENDING" />
                    <span className={`text-[10px] font-mono font-bold border px-1.5 py-0.5 tracking-wide ${PHASE_COLORS[s.phase]}`}>
                      {s.phase}
                    </span>
                  </div>
                  <p className="text-xs font-bold font-mono text-slate-400">{s.label}</p>
                  <p className="text-xs font-mono text-sr-muted leading-relaxed">{s.sub}</p>
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="border-t border-sr-border bg-sr-surface/30">
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold font-mono text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">KODAXA</span>
              <span className="text-xs font-mono text-sr-subtle uppercase tracking-[0.15em]">Studios · Alpha Build</span>
            </div>
            <p className="text-xs font-mono text-sr-subtle leading-relaxed">
              Unofficial fan project. Not affiliated with Playable Worlds.
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {NAV_LINKS.map(({ href, label }) => (
              <Link key={href} href={href} className="text-xs text-sr-subtle hover:text-slate-400 font-mono transition-colors uppercase tracking-[0.12em]">{label}</Link>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}

