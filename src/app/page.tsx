/**
 * page.tsx (root)
 * Kodaxa Studios — Operations Grid. Corporate terminal entry point.
 * One concern: 3-zone console layout — sidebar, tool queue, status rail.
 *
 * Server component: all data at build time. No JS shipped for core layout.
 * Starfield defined in globals.css. Search uses native GET form.
 * Static config lives in landing-config.ts.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { SKILL_CAP, TOOL_CAP } from '@/lib/skill-engine';
import { getProfessionSummaries, getNodeMap } from '@/data/professions/index';
import { getCraftingStats } from '@/data/crafting/index';
import { getAllItems } from '@/data/items/index';
import { NavHeader } from '@/components/ui/nav-header';
import { Badge } from '@/components/ui/badge';
import { Panel } from '@/components/ui/panel';
import { SectionLabel } from '@/components/ui/section-label';
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

const TOOLS = buildTools({
  skillCap: SKILL_CAP, toolCap: TOOL_CAP, totalProf, liveNodes,
  totalRecipes:   craftStats.totalRecipes,
  totalResources: craftStats.totalResources,
  totalStations:  craftStats.totalStations,
  totalItems,
});

const STATS = [
  { value: String(totalProf),               label: 'Professions indexed' },
  { value: `${liveNodes}+`,                 label: 'Skill nodes mapped' },
  { value: String(craftStats.totalRecipes), label: 'Schematics archived' },
  { value: String(totalItems),              label: 'Material records' },
  { value: String(SKILL_CAP),               label: 'Operative skill cap' },
  { value: String(TOOL_CAP),                label: 'Tool slot limit' },
];

// ── Page ───────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="min-h-dvh flex flex-col bg-sr-bg text-sr-text">
      <NavHeader />

      {/* ── Hero band ─────────────────────────────────────────────── */}
      <div className="relative w-full border-b border-sr-border overflow-hidden">
        <div className="starfield" aria-hidden="true" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 100% 100% at 50% 0%, transparent 40%, #0a0e14 100%)' }}
          aria-hidden="true"
        />
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-16 flex flex-col gap-4">
          <p className="text-[8px] font-mono uppercase tracking-[0.4em] text-slate-700">
            Kodaxa Studios · Multi-Planetary Data &amp; Software Systems · Alpha Build
          </p>
          <h1 className="text-4xl sm:text-6xl font-black font-mono tracking-tight leading-none">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">
              OPERATIONS
            </span>
            <span className="text-slate-700 ml-4 text-3xl sm:text-5xl">GRID</span>
          </h1>
          <p className="text-sm text-sr-muted max-w-lg leading-relaxed">
            Galaxy-scale data infrastructure for Stars Reach crafters, builders, and miners.
            Access the full tool suite below.
          </p>
          {/* Search */}
          <form action="/recipes" method="GET" className="flex items-center max-w-lg mt-2">
            <span className="px-3 py-2.5 text-[10px] font-mono text-slate-700 border border-r-0 border-sr-border bg-sr-surface shrink-0">
              QUERY
            </span>
            <input
              type="search"
              name="q"
              placeholder="Search schematics, materials, operatives…"
              className="flex-1 px-4 py-2.5 bg-sr-surface border border-sr-border text-xs font-mono text-sr-text placeholder-slate-700 focus:outline-none focus:border-cyan-700 transition-colors"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-cyan-600/20 border border-l-0 border-cyan-700/60 text-cyan-400 text-xs font-mono font-semibold hover:bg-cyan-600/30 hover:border-cyan-600 transition-all shrink-0 tracking-wide"
            >
              SEARCH
            </button>
          </form>
        </div>
      </div>

      {/* ── 3-zone console ────────────────────────────────────────── */}
      <div className="flex flex-1 max-w-6xl mx-auto w-full gap-0 border-x border-sr-border/40">

        {/* ── Zone 1: Left sidebar ──────────────────────────────── */}
        <aside className="hidden lg:flex flex-col w-52 shrink-0 border-r border-sr-border/40">
          {/* Division nav */}
          <div className="border-b border-sr-border/40 px-4 py-3">
            <SectionLabel text="Divisions" />
          </div>
          {([
            { label: 'Operations',   href: '/planner',    div: 'operations'   as const, tools: ['Skill Planner', 'Building Planner', 'XP Timer'] },
            { label: 'Intelligence', href: '/items',      div: 'intelligence' as const, tools: ['Material Registry', 'Schematics Archive', 'Resource Atlas'] },
            { label: 'Commerce',     href: '/directory',  div: 'commerce'     as const, tools: ['Commerce Registry', 'Material Analytics', "Maker's Mark"] },
            { label: 'Dispatch',     href: '/patch-notes',div: 'dispatch'     as const, tools: ['Patch Notes'] },
          ]).map(({ label, href, div, tools }) => (
            <div key={label} className="border-b border-sr-border/30">
              <Link href={href} className="flex items-center justify-between px-4 py-2.5 hover:bg-sr-surface/40 transition-colors group">
                <span className="text-[10px] font-mono text-slate-400 group-hover:text-slate-200 transition-colors uppercase tracking-wider">{label}</span>
                <Badge variant={div} className="opacity-60 group-hover:opacity-100 transition-opacity" />
              </Link>
              <div className="px-4 pb-2 space-y-0.5">
                {tools.map((t) => (
                  <p key={t} className="text-[9px] font-mono text-slate-700 pl-2 border-l border-sr-border/40">{t}</p>
                ))}
              </div>
            </div>
          ))}
          {/* Corp link */}
          <div className="mt-auto border-t border-sr-border/40 px-4 py-3 space-y-2">
            <Link href="/corporation" className="block text-[9px] font-mono text-slate-600 hover:text-slate-400 transition-colors uppercase tracking-wider">
              Corporation Registry →
            </Link>
            <a href="https://discord.gg/kodaxa" target="_blank" rel="noopener noreferrer"
              className="block text-[9px] font-mono text-amber-700 hover:text-amber-500 transition-colors uppercase tracking-wider">
              Join Discord →
            </a>
          </div>
        </aside>

        {/* ── Zone 2: Center — tool queue ───────────────────────── */}
        <main className="flex-1 min-w-0">
          {/* Tool grid header */}
          <div className="border-b border-sr-border/40 px-6 py-3 flex items-center justify-between">
            <SectionLabel text="Active Tool Suite" sub="6 systems online" />
            <Badge variant="live" label="● 6 ONLINE" />
          </div>

          {/* Tool cards */}
          <div className="divide-y divide-sr-border/30">
            {TOOLS.map((tool) => <ToolRow key={tool.href} {...tool} />)}
          </div>

          {/* Pending deployment */}
          <div className="border-t border-sr-border/40 px-6 py-3">
            <SectionLabel text="Pending Deployment" sub="Systems in active development" />
          </div>
          <div className="divide-y divide-sr-border/20">
            {SOON.map((s) => (
              <div key={s.href} className="flex items-center gap-4 px-6 py-3 opacity-50">
                <Badge variant="soon" label="PENDING" />
                <span className="text-xs font-mono text-slate-500 flex-1">{s.label}</span>
                <span className="text-[9px] font-mono text-slate-700 max-w-xs text-right hidden sm:block">{s.sub}</span>
              </div>
            ))}
          </div>
        </main>

        {/* ── Zone 3: Right — status rail ───────────────────────── */}
        <aside className="hidden xl:flex flex-col w-56 shrink-0 border-l border-sr-border/40">
          {/* Data index stats */}
          <div className="border-b border-sr-border/40 px-4 py-3">
            <SectionLabel text="Data Index" />
          </div>
          <div className="divide-y divide-sr-border/20">
            {STATS.map(({ value, label }) => (
              <div key={label} className="px-4 py-3 flex items-baseline justify-between gap-2">
                <span className="text-[9px] font-mono text-slate-600 leading-tight">{label}</span>
                <span className="text-sm font-bold font-mono text-cyan-400 tabular-nums shrink-0">{value}</span>
              </div>
            ))}
          </div>

          {/* System notices */}
          <div className="border-t border-sr-border/40 px-4 py-3 mt-2">
            <SectionLabel text="System Advisories" />
          </div>
          <div className="px-4 space-y-3 pb-4">
            <Panel variant="inset" className="p-3 space-y-1">
              <p className="text-[8px] font-mono text-amber-500 uppercase tracking-wider">● Advisory</p>
              <p className="text-[9px] font-mono text-slate-500 leading-relaxed">
                Stars Reach is in pre-alpha. Data may change with each patch.
              </p>
            </Panel>
            <Panel variant="inset" className="p-3 space-y-1">
              <p className="text-[8px] font-mono text-teal-600 uppercase tracking-wider">● Data Pipeline</p>
              <p className="text-[9px] font-mono text-slate-500 leading-relaxed">
                Schematics sourced from OCR pipeline. Submit corrections via Discord.
              </p>
            </Panel>
          </div>

          {/* About footer */}
          <div className="mt-auto border-t border-sr-border/40 px-4 py-3 space-y-1">
            <p className="text-[8px] font-mono text-slate-700 leading-relaxed">
              Unofficial fan project. Not affiliated with Playable Worlds.
            </p>
            <Link href="/system" className="text-[8px] font-mono text-slate-800 hover:text-slate-600 transition-colors">
              Design System →
            </Link>
          </div>
        </aside>

      </div>

      {/* ── Footer ────────────────────────────────────────────────── */}
      <footer className="border-t border-sr-border bg-sr-surface/30">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold font-mono text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">
              KODAXA
            </span>
            <span className="text-[8px] font-mono text-slate-700 uppercase tracking-widest">Studios · Alpha Build</span>
          </div>
          <nav className="flex flex-wrap justify-center gap-6">
            {NAV_LINKS.map(({ href, label }) => (
              <Link key={href} href={href} className="text-[9px] text-slate-700 hover:text-slate-400 font-mono transition-colors uppercase tracking-wider">
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}

// ── Tool row component ─────────────────────────────────────────────────

function ToolRow({ href, codexName, realName, description, stats, accent, cta, deployStatus, division }: ToolCardProps) {
  return (
    <Link
      href={href}
      className={`group flex items-start gap-5 px-6 py-4 hover:bg-sr-surface/40 transition-colors ${accent}`}
    >
      {/* Division + status */}
      <div className="flex flex-col gap-1.5 shrink-0 pt-0.5 w-28">
        <Badge variant={deployStatus} />
        <Badge variant={division} />
      </div>

      {/* Main info */}
      <div className="flex-1 min-w-0 space-y-1">
        <p className="text-[8px] font-mono uppercase tracking-widest text-slate-600">{codexName}</p>
        <h2 className="text-sm font-bold font-mono text-slate-200 group-hover:text-slate-100 transition-colors">{realName}</h2>
        <p className="text-[11px] text-sr-muted leading-relaxed">{description}</p>
      </div>

      {/* Stats */}
      <div className="hidden sm:flex flex-col gap-2 shrink-0 text-right">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col items-end">
            <span className={`text-sm font-bold font-mono tabular-nums ${cta}`}>{s.value}</span>
            <span className="text-[8px] font-mono text-slate-700 uppercase tracking-wider">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Arrow */}
      <span className={`hidden lg:block text-xs font-mono ${cta} opacity-0 group-hover:opacity-100 transition-opacity self-center shrink-0`}>
        →
      </span>
    </Link>
  );
}
