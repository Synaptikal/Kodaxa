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
import { Crosshair, Database, Scale, Radio } from 'lucide-react';
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
import { NAV_LINKS, SOON, buildTools } from './landing-config';

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

const TICKER_MESSAGES = [
  'RELAY UPLINK STABLE',
  `${totalProf} PROFESSIONS INDEXED`,
  'CRAFTER DIRECTORY OPEN',
  'SCHEMATICS ARCHIVE CURRENT',
  `${SKILL_CAP}-SKILL CAP CONFIRMED`,
  'OCR PIPELINE ACTIVE',
  'PRE-ALPHA · DATA SUBJECT TO CHANGE',
  'BUILDING PLANNER DEPLOYED',
  'SECTOR DATA NOMINAL',
];

const DIVISIONS = [
  {
    label: 'Operations',   name: 'Workforce Intelligence',
    href: '/planner',      div: 'operations'   as const,
    tools: ['Skill Planner', 'Building Planner', 'XP Timer'],
    borderColor: 'border-l-teal-600',
    hoverStyle: 'hover:bg-teal-950/30 hover:border-teal-800/60',
    labelColor: 'text-teal-400',
    Icon: Crosshair,
    imgSrc: '/divisions/ops-lathe.jpg',
  },
  {
    label: 'Intelligence', name: 'Data Terminal',
    href: '/items',        div: 'intelligence' as const,
    tools: ['Material Registry', 'Schematics Archive', 'Resource Atlas'],
    borderColor: 'border-l-cyan-600',
    hoverStyle: 'hover:bg-cyan-950/30 hover:border-cyan-800/60',
    labelColor: 'text-cyan-400',
    Icon: Database,
    imgSrc: '/divisions/intel-pyromycis.jpg',
  },
  {
    label: 'Commerce',     name: 'Market & Registry',
    href: '/directory',    div: 'commerce'     as const,
    tools: ['Commerce Registry', 'Material Analytics', "Maker's Mark"],
    borderColor: 'border-l-amber-600',
    hoverStyle: 'hover:bg-amber-950/30 hover:border-amber-800/60',
    labelColor: 'text-amber-400',
    Icon: Scale,
    imgSrc: '/divisions/commerce-beach.jpg',
  },
  {
    label: 'Dispatch',     name: 'Field Reports',
    href: '/patch-notes',  div: 'dispatch'     as const,
    tools: ['Patch Notes', 'Division Briefs', 'Recruitment Calls'],
    borderColor: 'border-l-violet-600',
    hoverStyle: 'hover:bg-violet-950/30 hover:border-violet-800/60',
    labelColor: 'text-violet-400',
    Icon: Radio,
    imgSrc: '/divisions/dispatch-portal.jpg',
  },
];

const PHASE_COLORS: Record<string, string> = {
  'IN BUILD':  'text-amber-400 border-amber-700/60',
  'IN DESIGN': 'text-violet-400 border-violet-700/60',
  'IN TEST':   'text-cyan-400 border-cyan-700/60',
};

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

          {/* ── Hero: Operations Grid Console ─────────────────── */}
          <section className="relative overflow-hidden border border-sr-border bg-sr-surface/30">
            <Image
              src="/divisions/hero-space.jpg"
              alt="" fill priority
              className="object-cover opacity-20 pointer-events-none"
              aria-hidden="true"
            />
            <div className="starfield absolute inset-0 opacity-20" aria-hidden="true" />
            <div className="relative z-10 grid lg:grid-cols-[2fr,1.2fr] divide-y lg:divide-y-0 lg:divide-x divide-sr-border/60">

              {/* Left panel: console metrics + search */}
              <div className="px-6 py-6 space-y-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-mono uppercase tracking-[0.3em] text-sr-muted">
                    Operations Grid
                  </p>
                  <span className="flex items-center gap-1.5 text-xs font-mono text-teal-600 tracking-[0.15em] uppercase">
                    <span className="status-dot-live text-teal-500">●</span>{ONLINE_COUNT} Systems Online
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs font-mono uppercase tracking-wide text-sr-muted">Professions Indexed</p>
                    <p className="mt-1 text-2xl font-black font-mono text-amber-300 tabular-nums">{totalProf}</p>
                  </div>
                  <div>
                    <p className="text-xs font-mono uppercase tracking-wide text-sr-muted">Skills Mapped</p>
                    <p className="mt-1 text-2xl font-black font-mono text-cyan-300 tabular-nums">{liveNodes}+</p>
                  </div>
                  <div>
                    <p className="text-xs font-mono uppercase tracking-wide text-sr-muted">Operative Systems</p>
                    <p className="mt-1 text-2xl font-black font-mono text-teal-300 tabular-nums">{ONLINE_COUNT}</p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <p className="text-xs font-mono uppercase tracking-[0.2em] text-sr-muted">Query Registry</p>
                  <form action="/recipes" method="GET" className="flex items-center">
                    <span className="px-3 py-2 text-xs font-mono text-sr-subtle border border-r-0 border-sr-border bg-sr-surface shrink-0 tracking-[0.15em]">
                      QUERY
                    </span>
                    <input
                      type="search" name="q"
                      placeholder="Search schematics, materials, operatives…"
                      className="flex-1 px-3 py-2 bg-sr-surface border border-sr-border text-xs font-mono text-sr-text placeholder-slate-700 focus:outline-none focus:border-cyan-700 transition-colors"
                    />
                    <button type="submit" className="px-4 py-2 bg-cyan-600/20 border border-l-0 border-cyan-700/60 text-cyan-400 text-xs font-mono font-semibold hover:bg-cyan-600/30 transition-all shrink-0 tracking-[0.15em]">
                      SEARCH
                    </button>
                  </form>
                </div>

                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'Workforce Intelligence', href: '/planner' },
                    { label: 'Material Analytics',     href: '/crafting' },
                    { label: 'Data Terminal',           href: '/items'   },
                  ].map(({ label, href }) => (
                    <Link key={href} href={href}
                      className="text-xs font-mono text-slate-500 border border-sr-border px-3 py-1 hover:text-slate-300 hover:border-slate-600 transition-colors tracking-[0.1em]">
                      {label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Right panel: identity + CTAs */}
              <div className="px-6 py-6 flex flex-col justify-between gap-6 bg-sr-surface/40">
                <div className="space-y-3">
                  <p className="text-xs font-mono uppercase tracking-[0.3em] text-sr-muted">
                    TransPlanetary League · Alpha Build
                  </p>
                  <h1 className="text-2xl font-black font-mono leading-tight tracking-wide">
                    KODAXA{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">
                      OPERATIONS
                    </span>
                    {' '}CONSOLE
                  </h1>
                  <p className="text-xs font-mono text-sr-muted leading-relaxed">
                    Galaxy-scale data. Crafter-scale precision. Plan builds, model fabrication
                    chains, and prepare your operative profile for Stars Reach.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link href="/planner"
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono font-semibold text-cyan-300 border border-cyan-700/60 bg-cyan-600/10 hover:bg-cyan-600/20 transition-all tracking-[0.15em] uppercase">
                    Access Skill Planner →
                  </Link>
                  <Link href="/directory"
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono text-slate-400 border border-sr-border hover:border-slate-600 hover:text-slate-200 transition-all tracking-[0.15em] uppercase">
                    Crafter Registry →
                  </Link>
                </div>
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

