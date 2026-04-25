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
import { Menu } from 'lucide-react';
import { MobileNav } from '@/components/ui/mobile-nav';
import { KodaxaMark } from '@/components/ui/logo';
import { createClient as createSupabaseClient } from '@/lib/supabase/client';
import { canManageRoster, type CorpRole } from '@/types/corp';

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
  { prefix: '/inventory',   division: 'OPERATIONS',   tool: 'LOGISTICAL MANAGEMENT SUITE',    color: 'text-teal-700' },
  { prefix: '/items',       division: 'INTELLIGENCE', tool: 'DATA TERMINAL',                  color: 'text-cyan-700' },
  { prefix: '/recipes',     division: 'INTELLIGENCE', tool: 'RECIPE DATABASE',                color: 'text-cyan-700' },
  { prefix: '/atlas',       division: 'INTELLIGENCE', tool: 'RESOURCE ATLAS',                 color: 'text-cyan-700' },
  { prefix: '/biome-guide', division: 'INTELLIGENCE', tool: 'BIOME FIELD GUIDE',              color: 'text-cyan-700' },
  { prefix: '/creatures',   division: 'INTELLIGENCE', tool: 'CREATURE DATABASE',              color: 'text-cyan-700' },
  { prefix: '/crafting',    division: 'COMMERCE',     tool: 'MATERIAL ANALYTICS SUITE',       color: 'text-amber-700' },
  { prefix: '/directory',   division: 'COMMERCE',     tool: 'COMMERCE REGISTRY',              color: 'text-amber-700' },
  { prefix: '/trade',       division: 'COMMERCE',     tool: 'COMMERCIAL OPERATIONS TRACKER',  color: 'text-amber-700' },
  { prefix: '/makers',      division: 'COMMERCE',     tool: "MAKER'S MARK",                   color: 'text-amber-700' },
  { prefix: '/market',      division: 'COMMERCE',     tool: 'MARKET PRICES',                  color: 'text-amber-700' },
  { prefix: '/patch-notes', division: 'DISPATCH',     tool: 'KODAXA DISPATCH',                color: 'text-violet-700' },
  { prefix: '/admin/patch-notes', division: 'HQ',       tool: 'PATCH NOTES QUEUE',              color: 'text-amber-700' },
  { prefix: '/admin/feedback',    division: 'HQ',       tool: 'FEEDBACK REVIEW',                color: 'text-amber-700' },
  { prefix: '/corp/hq/admin',     division: 'HQ',       tool: 'ADMIN CONTROL',                  color: 'text-amber-700' },
  { prefix: '/corp/hq/supply',division:'HQ',           tool: 'SUPPLY LOGISTICS BOARD',         color: 'text-amber-700' },
  { prefix: '/corp/hq/skills',division:'HQ',           tool: 'MEMBER SKILL DIRECTORY',         color: 'text-amber-700' },
  { prefix: '/corp/hq',    division: 'HQ',           tool: 'INTERNAL SYSTEMS',               color: 'text-amber-700' },
  { prefix: '/corp/join',  division: 'PERSONNEL',    tool: 'RECRUITMENT',                    color: 'text-violet-700' },
  { prefix: '/terminal',    division: 'PERSONNEL',    tool: 'MY TERMINAL',                    color: 'text-slate-500' },
  { prefix: '/dashboard',   division: 'PERSONNEL',    tool: 'PERSONAL ANALYTICS DASHBOARD',   color: 'text-slate-500' },
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
      { href: '/planner',   label: 'Skill Planner',          status: 'live' as ItemStatus },
      { href: '/building',  label: 'Building Planner',       status: 'live' as ItemStatus },
      { href: '/inventory', label: 'Inventory & Materials',  status: 'new'  as ItemStatus },
      { href: '/xp-timer',  label: 'XP & Atrophy Timer',     status: 'new'  as ItemStatus },
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
      { href: '/directory', label: 'Commerce Registry',      status: 'live' as ItemStatus },
      { href: '/crafting',  label: 'Crafting Calculator',    status: 'live' as ItemStatus },
      { href: '/trade',     label: 'Trade System',           status: 'new'  as ItemStatus },
      { href: '/makers',    label: "Maker's Mark",           status: 'soon' as ItemStatus },
      { href: '/market',    label: 'Market Prices',          status: 'soon' as ItemStatus },
    ],
  },
  {
    label: 'Dispatch',
    items: [
      { href: '/dispatch',    label: 'Transmissions',  status: 'live' as ItemStatus },
      { href: '/patch-notes', label: 'Patch Notes',    status: 'new'  as ItemStatus },
    ],
  },
  {
    label: 'Corp HQ',
    items: [
      { href: '/corp/hq',             label: 'Command Center',    status: 'new' as ItemStatus },
      { href: '/corp/hq/supply',      label: 'Supply Requisitions',status:'new' as ItemStatus },
      { href: '/corp/hq/skills',      label: 'Skill Directory',   status: 'new' as ItemStatus },
      { href: '/corp/hq/dispatch',    label: 'Dispatch Editor',   status: 'new' as ItemStatus },
      { href: '/corp/hq/commissions', label: 'Commission Board',  status: 'new' as ItemStatus },
      { href: '/admin/patch-notes',   label: 'Patch Notes Queue', status: 'new' as ItemStatus },
      { href: '/admin/feedback',      label: 'Feedback Review',   status: 'new' as ItemStatus },
      { href: '/corp/join',           label: 'Apply to Kodaxa'                },
    ],
  },
  {
    label: 'My Terminal',
    items: [
      { href: '/dashboard',   label: 'Analytics Dashboard', status: 'new' as ItemStatus },
      { href: '/inventory',   label: 'Inventory Manager',   status: 'new' as ItemStatus },
      { href: '/trade',       label: 'Trade System',        status: 'new' as ItemStatus },
      { href: '/xp-timer',    label: 'XP & Atrophy Timer',  status: 'new' as ItemStatus },
      { href: '/terminal',    label: 'My Auth Profile' },
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
    <span className={`text-[10px] font-mono font-bold ${styles[status]} shrink-0 tracking-wide`}>
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
    if (!open) return;
    document.addEventListener('mousedown', handleOutside);
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') setOpen(false); }
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', onKey);
    };
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
        aria-expanded={open}
        aria-haspopup="true"
        className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
          isActive ? 'bg-cyan-800/40 text-cyan-200' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
        }`}
      >
        {group.label}
        <svg
          className={`w-2.5 h-2.5 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
          aria-hidden="true"
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
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Auth-aware nav filtering — resolve user + role client-side.
  // isAuthed: true for any signed-in user (even without a profile row).
  // role: only set for corp members with a crafter_profiles entry.
  // While pending, only public groups are shown (no flash of gated links).
  const [isAuthed, setIsAuthed] = useState(false);
  const [role, setRole] = useState<CorpRole | null>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const supabase = createSupabaseClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { setAuthReady(true); return; }
      setIsAuthed(true);
      const { data } = await supabase
        .from('crafter_profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      setRole((data?.role as CorpRole) ?? null);
      setAuthReady(true);
    });
  }, []);

  const visibleGroups = NAV_GROUPS.filter((g) => {
    if (g.label === 'Corp HQ')     return authReady && canManageRoster(role ?? 'client');
    if (g.label === 'My Terminal') return authReady && isAuthed;
    return true;
  });

  return (
    <header className="sticky top-0 z-50 flex flex-col bg-sr-surface border-b border-accent/15 shrink-0">
      {/* Main nav row */}
      <div className="flex items-center justify-between px-4 py-2">
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group" aria-label="Kodaxa Studios — Home">
          <KodaxaMark size={26} className="shrink-0 transition-opacity group-hover:opacity-80" />
          <div className="flex items-baseline gap-1.5">
            <span
              className="text-[13px] font-black tracking-[0.18em] text-sr-text"
              style={{ fontFamily: 'var(--font-display, var(--font-sans))' }}
            >
              KODAXA
            </span>
            <span className="text-[8px] font-mono uppercase tracking-[0.25em] text-sr-muted/50 hidden sm:inline">
              Studios
            </span>
          </div>
          <span className="text-[7px] font-mono tracking-wider text-sr-muted/30 border border-sr-border/40 px-1 py-px hidden sm:inline leading-none">
            α
          </span>
        </Link>

        <nav aria-label="Main navigation" className="hidden md:flex items-center gap-0.5">
          {visibleGroups.map((group) => (
            <DropdownGroup key={group.label} group={group} pathname={pathname} />
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* Auth buttons — only shown to visitors who are not signed in */}
          {authReady && !isAuthed && (
            <>
              <Link
                href="/auth/sign-in"
                className="shrink-0 px-3 py-1 text-[10px] font-mono font-semibold bg-slate-700/20 border border-slate-600/30 text-slate-300 hover:bg-slate-700/40 hover:border-slate-500 hover:text-slate-100 transition-all tracking-wide uppercase hidden sm:inline-flex items-center"
              >
                Sign In
              </Link>
              <Link
                href="/auth/sign-up"
                className="shrink-0 px-3 py-1 text-[10px] font-mono font-semibold bg-teal-900/30 border border-teal-700/50 text-teal-300 hover:bg-teal-800/40 hover:border-teal-600/60 transition-all tracking-wide uppercase hidden sm:inline-flex items-center"
              >
                Create Account
              </Link>
            </>
          )}

          <Link
            href="/feedback"
            className="shrink-0 px-3 py-1 text-[10px] font-mono font-semibold bg-slate-700/20 border border-slate-600/30 text-slate-100 hover:bg-slate-700/40 hover:border-slate-500 transition-all tracking-wide uppercase hidden sm:inline-flex items-center"
            title="Submit feedback"
          >
            <span className="sr-only">Community Feedback</span>
            Feedback
          </Link>

          <a
            href="https://discord.gg/kodaxa"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-3 py-1 text-[10px] font-mono font-semibold bg-amber-800/30 border border-amber-700/40 text-amber-300 hover:bg-amber-800/50 hover:border-amber-600/60 transition-all tracking-wide uppercase hidden sm:inline-flex items-center"
          >
            Open Comms
          </a>

          {/* Hamburger — mobile only */}
          <button
            aria-label="Open navigation menu"
            aria-expanded={mobileNavOpen}
            aria-controls="mobile-nav-drawer"
            onClick={() => setMobileNavOpen(true)}
            className="md:hidden flex items-center justify-center w-11 h-11 rounded-md text-slate-400 hover:text-slate-100 hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-state-available transition-colors"
          >
            <Menu className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Division identity line */}
      {divCtx && (
        <div className="border-t border-sr-border/40 px-4 py-0.5 flex items-center gap-1.5">
          <span className="text-[10px] font-mono text-sr-subtle tracking-widest uppercase">
            Kodaxa Studios
          </span>
          <span className="text-[10px] font-mono text-sr-subtle">·</span>
          <span className={`text-[10px] font-mono tracking-widest uppercase font-semibold ${divCtx.color}`}>
            {divCtx.division}
          </span>
          <span className="text-[10px] font-mono text-sr-subtle">·</span>
          <span className="text-[10px] font-mono text-sr-muted tracking-widest uppercase">
            {divCtx.tool}
          </span>
        </div>
      )}

      <MobileNav
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        pathname={pathname}
        groups={visibleGroups}
        isAuthed={isAuthed}
        authReady={authReady}
      />
    </header>
  );
}
