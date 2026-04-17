/**
 * market-browser.tsx
 * Client-side Market Prices browser — filter + table over aggregated stats.
 * One concern: filter state + table render.
 */

'use client';

import { useState, useMemo } from 'react';
import {
  MARKET_CATEGORIES,
  MARKET_CATEGORY_LABELS,
  MARKET_SIDE_COLORS,
  MARKET_SIDE_LABELS,
  formatCredits,
  type MarketCategory,
  type MarketPriceStat,
  type MarketSide,
} from '@/types/market';
import { SearchInput } from '@/components/ui/search-input';
import { FilterPillGroup } from '@/components/ui/filter-pill';

export interface MarketBrowserProps {
  stats: MarketPriceStat[];
}

export function MarketBrowser({ stats }: MarketBrowserProps) {
  const [query, setQuery] = useState('');
  const [categories, setCategories] = useState<MarketCategory[]>([]);
  const [sideFilter, setSideFilter] = useState<MarketSide | 'all'>('all');

  const counts = useMemo(() => {
    const c: Partial<Record<MarketCategory, number>> = {};
    for (const s of stats) {
      if (s.item_category) {
        c[s.item_category] = (c[s.item_category] ?? 0) + 1;
      }
    }
    return c;
  }, [stats]);

  const filtered = useMemo(() => {
    let list = stats;

    const q = query.toLowerCase().trim();
    if (q) {
      list = list.filter(
        (s) =>
          s.item_name.toLowerCase().includes(q) ||
          s.planet.toLowerCase().includes(q) ||
          s.planet_key.includes(q),
      );
    }
    if (categories.length > 0) {
      list = list.filter(
        (s) => s.item_category && categories.includes(s.item_category),
      );
    }
    if (sideFilter !== 'all') {
      list = list.filter((s) => s.side === sideFilter);
    }
    return list;
  }, [stats, query, categories, sideFilter]);

  const toggleCategory = (id: string) => {
    setCategories((prev) =>
      prev.includes(id as MarketCategory)
        ? prev.filter((c) => c !== id)
        : [...prev, id as MarketCategory],
    );
  };

  if (stats.length === 0) return <EmptyMarket />;

  return (
    <div className="flex flex-col gap-3">
      <div className="space-y-3">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search by item or planet…"
        />

        <div className="flex flex-wrap items-center gap-3">
          <FilterPillGroup
            options={MARKET_CATEGORIES.map((c) => ({
              id: c,
              label: MARKET_CATEGORY_LABELS[c],
              count: counts[c] ?? 0,
            }))}
            selected={categories}
            onToggle={toggleCategory}
            onClear={categories.length > 0 ? () => setCategories([]) : undefined}
            accent="violet"
          />

          <div className="flex gap-1 ml-auto">
            {(['all', 'sell', 'buy'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSideFilter(s)}
                className={`text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded transition-colors ${
                  sideFilter === s
                    ? 'bg-violet-900/50 text-violet-200 border border-violet-700/60'
                    : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-slate-200'
                }`}
              >
                {s === 'all' ? 'All' : MARKET_SIDE_LABELS[s]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-500">
          {filtered.length} of {stats.length} stats · 30-day rolling
        </span>
        <span className="text-[10px] text-slate-600 font-mono">
          Min · Median · Max per unit
        </span>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/30 overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/60">
              <Header>Item</Header>
              <Header>Planet</Header>
              <Header>Side</Header>
              <Header align="right">Min</Header>
              <Header align="right">Median</Header>
              <Header align="right">Max</Header>
              <Header align="right">N</Header>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <Row key={`${s.item_name}__${s.planet_key}__${s.side}`} stat={s} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Row({ stat }: { stat: MarketPriceStat }) {
  return (
    <tr className="border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors">
      <td className="py-2 px-3 min-w-[180px]">
        <div className="flex flex-col">
          <span className="text-slate-100 font-medium">{stat.item_name}</span>
          {stat.item_category && (
            <span className="text-[9px] font-mono uppercase tracking-wider text-slate-500">
              {stat.item_category}
            </span>
          )}
        </div>
      </td>
      <td className="py-2 px-3 text-slate-300">{stat.planet}</td>
      <td className="py-2 px-3">
        <span
          className={`text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded border ${MARKET_SIDE_COLORS[stat.side]}`}
        >
          {stat.side}
        </span>
      </td>
      <td className="py-2 px-3 text-right font-mono tabular-nums text-slate-400">
        {formatCredits(stat.min_unit_price)}
      </td>
      <td className="py-2 px-3 text-right font-mono tabular-nums text-slate-100 font-bold">
        {formatCredits(stat.median_unit_price)}
      </td>
      <td className="py-2 px-3 text-right font-mono tabular-nums text-slate-400">
        {formatCredits(stat.max_unit_price)}
      </td>
      <td className="py-2 px-3 text-right text-[11px] font-mono text-slate-500">
        {stat.sample_count}
      </td>
    </tr>
  );
}

function Header(props: { children: React.ReactNode; align?: 'left' | 'right' }) {
  return (
    <th
      className={`py-2 px-3 font-mono text-[10px] uppercase tracking-wider text-slate-500 ${
        props.align === 'right' ? 'text-right' : 'text-left'
      }`}
    >
      {props.children}
    </th>
  );
}

function EmptyMarket() {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-8 text-center space-y-2">
      <p className="text-sm text-slate-300 font-medium">No price reports yet</p>
      <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
        File the first observation to seed the 30-day rolling market view.
        Every report is retained for 30 days, then rolls out of the aggregate.
      </p>
    </div>
  );
}
