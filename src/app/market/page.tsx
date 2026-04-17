/**
 * market/page.tsx
 * Market Prices — 30-day rolling buy/sell observation tracker.
 * One concern: server-fetch aggregated stats and render browser + form.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { NavHeader } from '@/components/ui/nav-header';
import { MarketBrowser } from '@/components/market/market-browser';
import { PriceReportForm } from '@/components/market/price-report-form';
import { getMarketStats, getMarketOverview } from '@/lib/market/queries';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'Market Prices — Kodaxa Studios',
  description:
    'Crowdsourced 30-day rolling buy/sell price observations for Stars Reach items, planet by planet. Kodaxa Commerce Division.',
};

export const revalidate = 60;

export default async function MarketPage() {
  const supabase = await createClient();
  const [{ data: { user } }, stats, overview] = await Promise.all([
    supabase.auth.getUser(),
    getMarketStats({ limit: 200 }),
    getMarketOverview(),
  ]);

  return (
    <div className="flex flex-col min-h-dvh">
      <NavHeader />

      <header className="border-b border-slate-800 bg-slate-900/40">
        <div className="max-w-6xl mx-auto px-4 py-5 flex flex-wrap items-end justify-between gap-3">
          <div className="space-y-1">
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-violet-500">
              Commerce Division // Market Intelligence
            </p>
            <h1 className="text-2xl font-bold text-slate-100">Market Prices</h1>
            <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
              A 30-day rolling view of buy orders and sell listings reported by
              associate traders across every known world. File a snapshot of
              what you saw — the community gets smarter the more we share.
            </p>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono text-slate-500">
            <span>
              <span className="text-violet-400">{overview.totalReports}</span> reports
            </span>
            <span>
              <span className="text-slate-300">{overview.uniqueItems}</span> items
            </span>
            <span>
              <span className="text-emerald-400">{overview.uniquePlanets}</span> planets
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
        <div className="grid lg:grid-cols-[1fr_minmax(320px,380px)] gap-6 items-start">
          <MarketBrowser stats={stats} />
          <PriceReportForm isAuthenticated={!!user} />
        </div>

        <div className="mt-8 flex flex-wrap gap-3 border-t border-slate-800 pt-6">
          <Link
            href="/makers"
            className="text-xs px-3 py-1.5 rounded-md bg-amber-900/30 text-amber-300 border border-amber-800/40 hover:bg-amber-900/50 transition-colors"
          >
            Maker&apos;s Mark →
          </Link>
          <Link
            href="/atlas"
            className="text-xs px-3 py-1.5 rounded-md bg-amber-800/30 text-amber-200 border border-amber-700/40 hover:bg-amber-800/50 transition-colors"
          >
            Resource Atlas →
          </Link>
          <Link
            href="/crafting"
            className="text-xs px-3 py-1.5 rounded-md bg-orange-800/30 text-orange-300 border border-orange-800/40 hover:bg-orange-800/50 transition-colors"
          >
            Crafting Calc →
          </Link>
        </div>
      </main>
    </div>
  );
}
