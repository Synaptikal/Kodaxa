/**
 * not-found.tsx
 * Custom 404 — shown when Next.js can't match a route.
 * One concern: branded error page, no JS required.
 */

import Link from 'next/link';
import { NavHeader } from '@/components/ui/nav-header';

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-dvh bg-sr-bg text-sr-text">
      <NavHeader />
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="text-center space-y-5 max-w-sm w-full">
          <div className="border border-sr-border bg-sr-surface/30 px-8 py-10 space-y-4">
            <p className="text-[9px] font-mono uppercase tracking-[0.35em] text-slate-600">
              System · Navigation Error · 404
            </p>
            <p className="text-7xl font-black font-mono text-slate-800 select-none leading-none">
              404
            </p>
            <div className="border-t border-sr-border/40 pt-4 space-y-1.5">
              <p className="text-sm font-mono text-slate-400">Route not found in the sector map.</p>
              <p className="text-xs font-mono text-slate-600">
                The coordinates you entered do not resolve to a known installation.
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2 text-[10px] font-mono uppercase tracking-widest border border-sr-border text-slate-400 hover:text-slate-200 hover:border-slate-600 transition-colors"
            >
              Return to HQ →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
