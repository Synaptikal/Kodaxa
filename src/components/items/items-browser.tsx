/**
 * items-browser.tsx
 * Client-side item database browser with search and category filter controls.
 * One concern: filtering + displaying item cards from static data.
 *
 * Follows the same pattern as recipes-browser.tsx:
 *   - Server page loads data, passes as props
 *   - Client handles search/filter state
 *   - No data fetching, no side effects
 */

'use client';

import { useState, useMemo } from 'react';
import type { Item, ItemCategory } from '@/types/items';
import { CATEGORY_LABELS, RARITY_LABELS, RARITY_COLORS } from '@/types/items';
import { SearchInput } from '@/components/ui/search-input';
import { FilterPillGroup } from '@/components/ui/filter-pill';

export interface ItemsBrowserProps {
  items: Item[];
}

// Station display names
const STATION_LABELS: Record<string, string> = {
  toolmaker: 'Toolmaker',
  refinery:  'Refinery',
  lathe:     'Lathe',
  stove:     'Stove',
};

const STATION_COLORS: Record<string, string> = {
  toolmaker: 'text-teal-400',
  refinery:  'text-orange-400',
  lathe:     'text-cyan-400',
  stove:     'text-amber-400',
};

// Source display names
const SOURCE_LABELS: Record<string, string> = {
  mining:      'Mining',
  refining:    'Refining',
  harvesting:  'Harvesting',
  hunting:     'Hunting',
  farming:     'Farming',
  crafting:    'Crafting',
  gas_harvest: 'Gas Harvest',
  unknown:     'Unknown',
};

// Category accent colors for card borders
const CATEGORY_ACCENTS: Record<ItemCategory, string> = {
  metal:      'border-slate-500',
  alloy:      'border-orange-700/60',
  gemstone:   'border-violet-600/60',
  rock:       'border-stone-600/60',
  soil:       'border-amber-800/60',
  gas:        'border-sky-700/60',
  animal:     'border-red-800/60',
  flora:      'border-green-700/60',
  seedling:   'border-emerald-700/60',
  industrial: 'border-yellow-700/60',
  tool:       'border-cyan-700/60',
  consumable: 'border-pink-700/60',
};

const CATEGORY_BG: Record<ItemCategory, string> = {
  metal:      'bg-slate-500/10',
  alloy:      'bg-orange-900/20',
  gemstone:   'bg-violet-900/20',
  rock:       'bg-stone-800/20',
  soil:       'bg-amber-900/20',
  gas:        'bg-sky-900/20',
  animal:     'bg-red-900/20',
  flora:      'bg-green-900/20',
  seedling:   'bg-emerald-900/20',
  industrial: 'bg-yellow-900/20',
  tool:       'bg-cyan-900/20',
  consumable: 'bg-pink-900/20',
};

export function ItemsBrowser({ items }: ItemsBrowserProps) {
  const [query, setQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Build category filter options with counts
  const categoryOptions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const item of items) {
      counts.set(item.category, (counts.get(item.category) ?? 0) + 1);
    }
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([id, count]) => ({
        id,
        label: CATEGORY_LABELS[id as ItemCategory] ?? id,
        count,
      }));
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return items.filter((item) => {
      if (
        q &&
        !item.name.toLowerCase().includes(q) &&
        !item.description.toLowerCase().includes(q)
      )
        return false;
      if (
        selectedCategories.length > 0 &&
        !selectedCategories.includes(item.category)
      )
        return false;
      return true;
    });
  }, [items, query, selectedCategories]);

  function toggleCategory(id: string) {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Toolbar */}
      <div className="px-5 py-3 border-b border-slate-800 space-y-3 bg-sr-surface shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="text-sm font-bold text-slate-200 shrink-0">Item Database</h1>
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Search items…"
            className="flex-1 max-w-xs"
          />
          <span className="text-xs text-slate-600 font-mono shrink-0">
            {filtered.length} / {items.length}
          </span>
        </div>

        {/* Category filter */}
        <div className="space-y-1.5">
          <p className="text-[10px] text-slate-600 uppercase tracking-wider">Category</p>
          <FilterPillGroup
            options={categoryOptions}
            selected={selectedCategories}
            onToggle={toggleCategory}
            onClear={() => setSelectedCategories([])}
            accent="cyan"
          />
        </div>
      </div>

      {/* Item grid */}
      <div className="flex-1 overflow-y-auto p-4">
        {filtered.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-slate-600 text-sm">
            No items match your filters.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filtered.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ItemCard({ item }: { item: Item }) {
  const borderColor = CATEGORY_ACCENTS[item.category] ?? 'border-slate-700';
  const bgColor     = CATEGORY_BG[item.category]     ?? 'bg-slate-800/30';

  return (
    <div
      className={`flex flex-col gap-2 p-3 rounded-lg border ${borderColor} ${bgColor} hover:brightness-110 transition-all`}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-semibold text-slate-100 leading-tight flex-1 min-w-0">
          {item.name}
        </p>
        <span className="shrink-0 text-[9px] px-1.5 py-0.5 rounded bg-slate-700/80 text-slate-400 uppercase tracking-wide whitespace-nowrap">
          {CATEGORY_LABELS[item.category]}
        </span>
      </div>

      {/* Tier / Rarity badge */}
      {(item.tier !== undefined || item.rarity) && (
        <div className="flex items-center gap-1.5">
          {item.tier !== undefined && (
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
              Tier {item.tier}
            </span>
          )}
          {item.rarity && (
            <span className={`text-[9px] font-medium ${RARITY_COLORS[item.rarity]}`}>
              {RARITY_LABELS[item.rarity]}
            </span>
          )}
        </div>
      )}

      {/* Description */}
      <p className="text-[10px] text-slate-400 leading-relaxed line-clamp-3">
        {item.description}
      </p>

      {/* Footer: sources + station */}
      <div className="mt-auto pt-1.5 border-t border-slate-700/40 flex items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1">
          {item.sources.slice(0, 2).map((src) => (
            <span key={src} className="text-[8px] px-1 py-0.5 rounded bg-slate-800 text-slate-500 uppercase tracking-wide">
              {SOURCE_LABELS[src] ?? src}
            </span>
          ))}
        </div>
        {item.station && (
          <span className={`text-[9px] font-mono shrink-0 ${STATION_COLORS[item.station] ?? 'text-slate-500'}`}>
            {STATION_LABELS[item.station] ?? item.station}
          </span>
        )}
        {!item.confirmed && (
          <span className="text-[8px] px-1 py-0.5 rounded bg-amber-900/40 text-amber-500 border border-amber-800/30 shrink-0">
            unconfirmed
          </span>
        )}
      </div>
    </div>
  );
}
