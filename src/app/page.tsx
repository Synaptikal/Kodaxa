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
import { Crosshair, Database, Scale, Radio } from 'lucide-react';
import { SKILL_CAP, TOOL_CAP } from '@/lib/skill-engine';
import { getProfessionSummaries, getNodeMap } from '@/data/professions/index';
import { getCraftingStats } from '@/data/crafting/index';
import { getAllItems } from '@/data/items/index';
import { getLatestPosts } from '@/data/dispatch/index';
import { CATEGORY_LABELS, CATEGORY_COLORS } from '@/types/dispatch';
import type { DispatchPost } from '@/types/dispatch';
import { NavHeader } from '@/components/ui/nav-header';
import { Badge } from '@/components/ui/badge';
import { SectionLabel } from '@/components/ui/section-label';
import { RelayTicker } from '@/components/ui/relay-ticker';
import { NAV_LINKS, SOON, buildTools, type ToolCardProps } from './landing-config';

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
const latestPosts  = getLatestPosts(4);
const featuredPost = latestPosts[0];
const recentPosts  = latestPosts.slice(1, 3);

const TOOLS = buildTools({
  skillCap: SKILL_CAP, toolCap: TOOL_CAP, totalProf, liveNodes,
  totalRecipes:   craftStats.totalRecipes,
  totalResources: craftStats.totalResources,
  totalStations:  craftStats.totalStations,
  totalItems,
});

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
  },
  {
    label: 'Intelligence', name: 'Data Terminal',
    href: '/items',        div: 'intelligence' as const,
    tools: ['Material Registry', 'Schematics Archive', 'Resource Atlas'],
    borderColor: 'border-l-cyan-600',
    hoverStyle: 'hover:bg-cyan-950/30 hover:border-cyan-800/60',
    labelColor: 'text-cyan-400',
    Icon: Database,
  },
  {
    label: 'Commerce',     name: 'Market & Registry',
    href: '/directory',    div: 'commerce'     as const,
    tools: ['Commerce Registry', 'Material Analytics', "Maker's Mark"],
    borderColor: 'border-l-amber-600',
    hoverStyle: 'hover:bg-amber-950/30 hover:border-amber-800/60',
    labelColor: 'text-amber-400',
    Icon: Scale,
  },
  {
    label: 'Dispatch',     name: 'Field Reports',
    href: '/patch-notes',  div: 'dispatch'     as const,
    tools: ['Patch Notes', 'Division Briefs', 'Recruitment Calls'],
    borderColor: 'border-l-violet-600',
    hoverStyle: 'hover:bg-violet-950/30 hover:border-violet-800/60',
    labelColor: 'text-violet-400',
    Icon: Radio,
  },
];

const PHASE_COLORS: Record<string, string> = {
  'IN BUILD':  'text-amber-400 border-amber-700/60',
  'IN DESIGN': 'text-violet-400 border-violet-700/60',
  'IN TEST':   'text-cyan-400 border-cyan-700/60',
};

// ── Page ───────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="min-h-dvh flex flex-col bg-sr-bg text-sr-text">
      <NavHeader />

      <main className="flex-1 max-w-6xl mx-auto w-full border-x border-sr-border/40">
        <div className="px-6 py-8 space-y-8">

          {/* ── Hero: Operations Grid Console ─────────────────── */}
          <section className="relative overflow-hidden border border-sr-border bg-sr-surface/30">
            <div className="starfield absolute inset-0 opacity-30" aria-hidden="true" />
            <div className="relative z-10 grid lg:grid-cols-[2fr,1.2fr] divide-y lg:divide-y-0 lg:divide-x divide-sr-border/60">

              {/* Left panel: console metrics + search */}
              <div className="px-6 py-6 space-y-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-mono uppercase tracking-[0.3em] text-sr-muted">
                    Operations Grid
                  </p>
                  <span className="flex items-center gap-1.5 text-xs font-mono text-teal-600 tracking-[0.15em] uppercase">
                    <span className="status-dot-live text-teal-500">●</span>6 Systems Online
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
                    <p className="mt-1 text-2xl font-black font-mono text-teal-300 tabular-nums">6</p>
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
                    chains, and register operatives for Stars Reach.
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
          <div className="border-y border-sr-border/40 bg-sr-surface/20 px-4 py-2 flex items-center gap-3 flex-wrap">
            <span className="text-xs font-mono text-teal-600 tracking-[0.15em] uppercase shrink-0">SYSTEM NOTE</span>
            <span className="text-sr-border" aria-hidden="true">·</span>
            <p className="text-xs font-mono text-sr-muted leading-relaxed">
              Kodaxa is an in-universe ops console for Stars Reach roleplayers and crafters —
              plan builds, log your operatives, and coordinate your fabrication network.
            </p>
          </div>

          {/* ── Divisions Grid ────────────────────────────────── */}
          <section className="space-y-4">
            <div className="flex items-baseline justify-between">
              <SectionLabel text="Divisions" sub="League-aligned operational branches" />
            </div>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              {DIVISIONS.map(({ label, name, href, tools, borderColor, hoverStyle, labelColor, Icon }) => (
                <Link key={label} href={href}
                  className={`group block border border-sr-border border-l-2 ${borderColor} bg-sr-surface/30 px-4 py-3 transition-all ${hoverStyle}`}>
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
              <SectionLabel text="Active Tool Suite" sub="6 systems online" />
              <span className="text-xs font-mono text-teal-500 tracking-[0.15em] uppercase flex items-center gap-1.5">
                <span className="status-dot-live">●</span> 6 ONLINE
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

// ── Featured Transmission ──────────────────────────────────────────────

function FeaturedTransmission({ post }: { post: DispatchPost }) {
  return (
    <Link href={`/dispatch/${post.slug}`} className="group block border border-sr-border bg-sr-surface/30 hover:bg-sr-surface/50 transition-colors">
      <div className="px-4 py-3 border-b border-sr-border/40 bg-sr-surface/40">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <span className="text-xs font-mono text-sr-muted tracking-[0.2em] uppercase">Transmission · Kodaxa Dispatch</span>
          {post.ref_id && <span className="text-xs font-mono text-sr-subtle tracking-[0.15em] uppercase">Ref: {post.ref_id}</span>}
        </div>
        <div className="flex items-center gap-4 mt-1 flex-wrap">
          <span className="text-xs font-mono text-sr-subtle">Filed: {post.published_at}</span>
          <span className="text-xs font-mono text-sr-subtle uppercase">Division: {post.author}</span>
          <span className="text-xs font-mono text-sr-subtle">Classification: Public</span>
          {post.tag && (
            <span className="text-[10px] font-mono text-cyan-600 bg-cyan-950/40 px-1.5 py-0.5 uppercase tracking-wide">● {post.tag}</span>
          )}
        </div>
      </div>
      <div className="px-4 py-5 space-y-3">
        <span className={`text-xs font-mono uppercase tracking-[0.15em] px-2 py-0.5 border ${CATEGORY_COLORS[post.category]}`}>
          {CATEGORY_LABELS[post.category]}
        </span>
        <h2 className="text-base font-bold font-mono text-slate-100 group-hover:text-white transition-colors leading-snug tracking-wide">
          {post.title}
        </h2>
        <p className="text-xs font-mono text-sr-muted leading-relaxed">{post.summary}</p>
        <span className="text-xs font-mono text-cyan-700 group-hover:text-cyan-400 transition-colors tracking-[0.15em] uppercase border-b border-cyan-900/40 group-hover:border-cyan-700/60">
          Read Full Dispatch →
        </span>
      </div>
    </Link>
  );
}

// ── Dispatch card — compact, for recent list ───────────────────────────

function DispatchCard({ post }: { post: DispatchPost }) {
  return (
    <Link href={`/dispatch/${post.slug}`} className="group flex flex-col gap-1.5 py-3 px-1 hover:bg-sr-surface/40 transition-colors">
      <div className="flex items-center gap-2 flex-wrap">
        <span className={`text-xs font-mono uppercase tracking-[0.15em] px-1.5 py-0.5 border ${CATEGORY_COLORS[post.category]}`}>
          {CATEGORY_LABELS[post.category]}
        </span>
        <span className="text-xs font-mono text-sr-subtle">{post.published_at} · {post.author.toUpperCase()}</span>
      </div>
      <h3 className="text-xs font-bold font-mono text-slate-300 group-hover:text-slate-100 transition-colors tracking-wide">{post.title}</h3>
      <p className="text-[10px] font-mono text-sr-muted leading-relaxed line-clamp-2">{post.summary}</p>
    </Link>
  );
}

// ── Tool card ──────────────────────────────────────────────────────────

function ToolCard({ href, codexName, realName, description, stats, accent, cta, deployStatus, division }: ToolCardProps) {
  return (
    <Link href={href} className={`group flex flex-col border border-sr-border bg-sr-surface/30 p-4 hover:bg-sr-surface/60 transition-colors ${accent}`}>
      <div className="flex items-center justify-between gap-2 mb-3">
        <Badge variant={deployStatus} />
        <Badge variant={division} />
      </div>
      <p className="text-xs font-mono uppercase tracking-[0.15em] text-sr-muted">{codexName}</p>
      <h3 className="mt-1 text-sm font-bold font-mono text-slate-200 group-hover:text-slate-100 transition-colors">{realName}</h3>
      <p className="mt-2 flex-1 text-xs font-mono text-sr-muted leading-relaxed">{description}</p>
      <div className="mt-4 flex items-center justify-between border-t border-sr-border/30 pt-3">
        <div className="flex gap-4">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col">
              <span className={`text-sm font-bold font-mono tabular-nums ${cta}`}>{s.value}</span>
              <span className="text-xs font-mono text-sr-subtle uppercase tracking-[0.1em]">{s.label}</span>
            </div>
          ))}
        </div>
        <span className={`text-sm font-mono ${cta} opacity-0 group-hover:opacity-100 transition-opacity`}>→</span>
      </div>
    </Link>
  );
}
