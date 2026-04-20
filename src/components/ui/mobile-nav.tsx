'use client';

/**
 * mobile-nav.tsx
 * Full-screen slide-in navigation drawer for mobile viewports.
 * One concern: mobile nav structure, keyboard accessibility, and focus trap.
 *
 * WCAG 2.2 AA: 44×44px touch targets, visible focus ring, Escape to close,
 * aria-expanded on trigger, aria-modal + role="dialog" on drawer.
 */

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';

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

// ── Static nav data (mirrors nav-header.tsx) ──────────────────────

const STATUS_STYLES: Record<ItemStatus, string> = {
  live: 'text-teal-500',
  new:  'text-cyan-500',
  soon: 'text-slate-600',
};
const STATUS_LABELS: Record<ItemStatus, string> = {
  live: '● LIVE',
  new:  '● NEW',
  soon: '○ SOON',
};

const NAV_GROUPS: NavGroup[] = [
  { label: 'HQ', href: '/' },
  { label: 'Corporation', href: '/corporation' },
  {
    label: 'Operations',
    items: [
      { href: '/planner',  label: 'Skill Planner',      status: 'live' },
      { href: '/building', label: 'Building Planner',    status: 'live' },
      { href: '/xp-timer', label: 'XP & Atrophy Timer',  status: 'new'  },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { href: '/items',       label: 'Item Database',     status: 'live' },
      { href: '/recipes',     label: 'Recipe Database',   status: 'live' },
      { href: '/atlas',       label: 'Resource Atlas',    status: 'soon' },
      { href: '/biome-guide', label: 'Biome Field Guide', status: 'soon' },
      { href: '/creatures',   label: 'Creature Database', status: 'soon' },
    ],
  },
  {
    label: 'Commerce',
    items: [
      { href: '/directory', label: 'Commerce Registry',   status: 'live' },
      { href: '/crafting',  label: 'Crafting Calculator', status: 'live' },
      { href: "/makers",    label: "Maker's Mark",        status: 'soon' },
      { href: '/market',    label: 'Market Prices',       status: 'soon' },
    ],
  },
  {
    label: 'Dispatch',
    items: [
      { href: '/dispatch',    label: 'Transmissions',  status: 'live' },
      { href: '/patch-notes', label: 'Patch Notes',    status: 'new'  },
    ],
  },
  {
    label: 'Corp HQ',
    items: [
      { href: '/corp/hq',             label: 'Command Center',   status: 'new' },
      { href: '/corp/hq/dispatch',    label: 'Dispatch Editor',  status: 'new' },
      { href: '/admin/feedback',      label: 'Feedback Review',  status: 'new' },
      { href: '/corp/hq/commissions', label: 'Commission Board', status: 'new' },
      { href: '/corp/join',           label: 'Apply to Kodaxa'               },
    ],
  },
  {
    label: 'My Terminal',
    items: [
      { href: '/xp-timer', label: 'XP & Atrophy Timer', status: 'new' },
      { href: '/terminal', label: 'My Profile' },
    ],
  },
];

// ── Component ─────────────────────────────────────────────────────

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  pathname: string;
}

export function MobileNav({ open, onClose, pathname }: MobileNavProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  // Focus the close button when drawer opens
  useEffect(() => {
    if (open) closeButtonRef.current?.focus();
  }, [open]);

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className="fixed inset-y-0 right-0 z-50 w-full max-w-xs bg-sr-surface border-l border-sr-border flex flex-col overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-sr-border shrink-0">
          <span className="text-sm font-bold font-mono text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400 tracking-wide">
            KODAXA
          </span>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Close navigation menu"
            className="flex items-center justify-center w-11 h-11 rounded-md text-slate-400 hover:text-slate-100 hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-state-available transition-colors"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Nav groups */}
        <nav aria-label="Mobile navigation" className="flex-1 px-2 py-3 space-y-1">
          {NAV_GROUPS.map((group) => {
            if (group.href) {
              const isActive = pathname === group.href || (group.href !== '/' && pathname.startsWith(group.href));
              return (
                <Link
                  key={group.label}
                  href={group.href}
                  onClick={onClose}
                  className={`flex items-center px-3 py-3 rounded-md text-sm font-medium transition-colors min-h-[44px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-state-available ${
                    isActive ? 'bg-cyan-800/40 text-cyan-200' : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800'
                  }`}
                >
                  {group.label}
                </Link>
              );
            }

            return (
              <div key={group.label}>
                <p className="px-3 pt-3 pb-1 text-[9px] font-mono font-semibold text-slate-600 tracking-widest uppercase">
                  {group.label}
                </p>
                {group.items?.map((item) => {
                  const isActive = pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={`flex items-center justify-between gap-3 px-3 py-3 rounded-md text-sm transition-colors min-h-[44px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-state-available ${
                        isActive ? 'text-cyan-300 bg-cyan-800/20' : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800'
                      }`}
                    >
                      {item.label}
                      {item.status && (
                        <span className={`text-[8px] font-mono font-bold ${STATUS_STYLES[item.status]} shrink-0`}>
                          {STATUS_LABELS[item.status]}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </nav>

        {/* Footer CTA */}
        <div className="px-4 py-4 border-t border-sr-border shrink-0">
          <a
            href="https://discord.gg/kodaxa"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-full min-h-[44px] px-4 py-3 text-[11px] font-mono font-semibold bg-amber-800/30 border border-amber-700/40 text-amber-300 hover:bg-amber-800/50 hover:border-amber-600/60 transition-all tracking-wide uppercase rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-state-available"
          >
            Open Comms — Discord
          </a>
        </div>
      </div>
    </>
  );
}
