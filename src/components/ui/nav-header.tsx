/**
 * nav-header.tsx
 * Kodaxa Studios — site-wide navigation header.
 * One concern: navigation, division identity context, and auth-gated links.
 *
 * Division groups mirror the corporate structure:
 *   Operations  — active tools (Skill Planner, Building Planner, XP Timer)
 *   Intelligence — reference data (Items, Recipes, Atlas, Biome, Creatures)
 *   Commerce     — trade network (Crafting Calc, Directory, Makers, Market)
 *   Dispatch     — comms (Patch Notes)
 *   My Terminal  — auth-gated personal dashboard
 *
 * Division identity line renders below the nav bar on all tool pages.
 * Each division has a consistent accent color applied throughout the site.
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect, useCallback } from 'react';

// ── Types ────────────────────────────────────────────────────────────

type ItemStatus = 'live' | 'new' | 'soon';

interface NavItem {
  href: string;
  label: string;
  status?: ItemStatus;
}

interface NavGroup {
  label: string;
  href?: string;
  items?: NavItem[];
}

// ── Division identity context ─────────────────────────────────────────
// Maps pathname prefixes → { division, tool, color }

const DIVISION_CTX = [
  { prefix: '/planner',     division: 'OPERATIONS',   tool: 'WORKFORCE INTELLIGENCE SYSTEM',  color: 'text-teal-700' },
  { prefix: '/building',    division: 'OPERATIONS',   tool: 'ARCHITECTURAL DESIGN INTERFACE', color: 'text-teal-700' },
  { prefix: '/xp-timer',    division: 'OPERATIONS',   tool: 'XP & ATROPHY TRACKER',           color: 'text-teal-700' },
  { prefix: '/items',       division: 'INTELLIGENCE', tool: 'DATA TERMINAL',                  color: 'text-cyan-700' },
  { prefix: '/recipes',     division: 'INTELLIGENCE', tool: 'RECIPE DATABASE',                color: 'text-cyan-700' },
  { prefix: '/atlas',       division: 'INTELLIGENCE', tool: 'RESOURCE ATLAS',                 color: 'text-cyan-700' },
  { prefix: '/biome-guide', division: 'INTELLIGENCE', tool: 'BIOME FIELD GUIDE',              color: 'text-cyan-700' },
  { prefix: '/creatures',   division: 'INTELLIGENCE', tool: 'CREATURE DATABASE',              color: 'text-cyan-700' },
  { prefix: '/crafting',    division: 'COMMERCE',     tool: 'MATERIAL ANALYTICS SUITE',       color: 'text-amber-700' },
  { prefix: '/directory',   division: 'COMMERCE',     tool: 'COMMERCE REGISTRY',              color: 'text-amber-700' },
  { prefix: '/makers',      division: 'COMMERCE',     tool: "MAKER'S MARK",                   color: 'text-amber-700' },
  { prefix: '/market',      division: 'COMMERCE',     tool: 'MARKET PRICES',                  color: 'text-amber-700' },
  { prefix: '/patch-notes', division: 'DISPATCH',     tool: 'KODAXA DISPATCH',                color: 'text-violet-700' },
  { prefix: '/corporation', division: 'HQ',           tool: 'CORPORATION REGISTRY',           color: 'text-cyan-700' },
  { prefix: '/corp/hq',    division: 'HQ',           tool: 'INTERNAL SYSTEMS',               color: 'text-amber-700' },
  { prefix: '/corp/join',  division: 'PERSONNEL',    tool: 'RECRUITMENT',                    color: 'text-violet-700' },
  { prefix: '/terminal',    division: 'PERSONNEL',    tool: 'MY TERMINAL',                    color: 'text-slate-500' },
  { prefix: '/auth',        division: 'PERSONNEL',    tool: 'ACCOUNT SERVICES',               color: 'text-slate-500' },
] as const;

function getDivisionCtx(pathname: string) {
  return DIVISION_CTX.find((d) => pathname.startsWith(d.prefix)) ?? null;
}

// ── Nav configuration ─────────────────────────────────────────────────

const NAV_GROUPS: NavGroup[] = [
  { label: 'HQ', href: '/' },
  { label: 'Corporation', href: '/corporation' },
  {
    label: 'Operations',
    items: [
      { href: '/planner',  label: 'Skill Planner',          status: 'live' },
      { href: '/building', label: 'Building Planner',        status: 'live' },
      { href: '/xp-timer', label: 'XP & Atrophy Timer',      status: 'new'  },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { href: '/items',       label: 'Item Database',    status: 'live' },
      { href: '/recipes',     label: 'Recipe Database',  status: 'live' },
      { href: '/atlas',       label: 'Resource Atlas',   status: 'soon' },
      { href: '/biome-guide', label: 'Biome Field Guide',status: 'soon' },
      { href: '/creatures',   label: 'Creature Database',status: 'soon' },
    ],
  },
  {
    label: 'Commerce',
    items: [
      { href: '/directory', label: 'Commerce Registry',      status: 'live' },
      { href: '/crafting',  label: 'Crafting Calculator',    status: 'live' },
      { href: '/makers',    label: "Maker's Mark",           status: 'soon' },
      { href: '/market',    label: 'Market Prices',          status: 'soon' },
    ],
  },
  {
    label: 'Dispatch',
    items: [
      { href: '/patch-notes', label: 'Patch Notes', status: 'new' },
    ],
  },
  {
    label: 'Corp HQ',
    items: [
      { href: '/corp/hq',             label: 'Command Center',   status: 'new' as ItemStatus },
      { href: '/corp/hq/commissions', label: 'Commission Board', status: 'new' as ItemStatus },
      { href: '/corp/join',           label: 'Apply to Kodaxa'               },
    ],
  },
  {
    label: 'My Terminal',
    items: [
      { href: '/xp-timer',    label: 'XP & Atrophy Timer', status: 'new' as ItemStatus },
      { href: '/terminal',    label: 'My Profile' },
    ],
  },
];

function groupIsActive(group: NavGroup, pathname: string): boolean {
  if (group.href) return pathname === group.href || (group.href !== '/' && pathname.startsWith(group.href));
  return group.items?.some((item) => pathname.startsWith(item.href)) ?? false;
}

// ── Sub-components ────────────────────────────────────────────────────

function StatusDot({ status }: { status?: ItemStatus }) {
  if (!status) return null;
  const styles: Record<ItemStatus, string> = {
    live: 'text-teal-500',
    new:  'text-cyan-500',
    soon: 'text-slate-600',
  };
  const labels: Record<ItemStatus, string> = {
    live: '● LIVE',
    new:  '● NEW',
    soon: '○ SOON',
  };
  return (
    <span className={`text-[8px] font-mono font-bold ${styles[status]} shrink-0 tracking-wide`}>
      {labels[status]}
    </span>
  );
}

function DropdownGroup({ group, pathname }: { group: NavGroup; pathname: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isActive = groupIsActive(group, pathname);

  const handleOutside = useCallback((e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
  }, []);

  useEffect(() => {
    if (open) document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [open, handleOutside]);

  if (group.href) {
    return (
      <Link
        href={group.href}
        className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
          isActive ? 'bg-cyan-800/40 text-cyan-200' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
        }`}
      >
        {group.label}
      </Link>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
          isActive ? 'bg-cyan-800/40 text-cyan-200' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
        }`}
      >
        {group.label}
        <svg
          className={`w-2.5 h-2.5 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 z-50 min-w-[200px] border border-sr-border bg-sr-surface/98 backdrop-blur-sm shadow-xl py-1">
          {group.items?.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`flex items-center justify-between gap-3 px-3 py-2 text-xs transition-colors ${
                pathname.startsWith(item.href)
                  ? 'text-cyan-300 bg-cyan-800/20'
                  : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800'
              }`}
            >
              {item.label}
              <StatusDot status={item.status} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────

export function NavHeader() {
  const pathname = usePathname();
  const divCtx = getDivisionCtx(pathname);

  return (
    <header className="sticky top-0 z-50 flex flex-col bg-sr-surface border-b border-sr-border shrink-0">
      {/* Main nav row */}
      <div className="flex items-center justify-between px-4 py-2">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400 font-mono tracking-wide">
            KODAXA
          </span>
          <span className="text-[9px] text-slate-600 font-mono uppercase tracking-wider hidden sm:inline">
            Studios
          </span>
          <span className="text-[9px] text-slate-700 font-mono uppercase tracking-wider">
            Alpha
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-0.5">
          {NAV_GROUPS.map((group) => (
            <DropdownGroup key={group.label} group={group} pathname={pathname} />
          ))}
        </nav>

        <a
          href="https://discord.gg/kodaxa"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 px-3 py-1 text-[10px] font-mono font-semibold bg-amber-800/30 border border-amber-700/40 text-amber-300 hover:bg-amber-800/50 hover:border-amber-600/60 transition-all tracking-wide uppercase"
        >
          Open Comms
        </a>
      </div>

      {/* Division identity line */}
      {divCtx && (
        <div className="border-t border-sr-border/40 px-4 py-0.5 flex items-center gap-1.5">
          <span className="text-[8px] font-mono text-slate-700 tracking-widest uppercase">
            Kodaxa Studios
          </span>
          <span className="text-[8px] font-mono text-slate-800">·</span>
          <span className={`text-[8px] font-mono tracking-widest uppercase font-semibold ${divCtx.color}`}>
            {divCtx.division}
          </span>
          <span className="text-[8px] font-mono text-slate-800">·</span>
          <span className="text-[8px] font-mono text-slate-700 tracking-widest uppercase">
            {divCtx.tool}
          </span>
        </div>
      )}
    </header>
  );
}
