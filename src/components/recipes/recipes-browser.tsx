/**
 * recipes-browser.tsx
 * Client-side recipe browser with search and filter controls.
 * One concern: filtering + displaying recipe cards from static data.
 *
 * Distinct from the Crafting Calculator — this is a reference browser,
 * not an optimization tool. No stat math here.
 */

'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import type { Recipe, CraftingStation } from '@/types/crafting';
import { SearchInput } from '@/components/ui/search-input';
import { FilterPillGroup } from '@/components/ui/filter-pill';

export interface RecipesBrowserProps {
  recipes: Recipe[];
  stations: CraftingStation[];
}

const BRANCH_LABELS: Record<string, string> = {
  architect: 'Architect',
  civil_engineering: 'Civil Engineering',
  refining: 'Refining',
  toolmaking: 'Toolmaking',
  weaponsmithing: 'Weaponsmithing',
  cooking: 'Cooking',
  unknown: 'Other',
};

const CATEGORY_LABELS: Record<string, string> = {
  block: 'Block',
  decor: 'Decor',
  paver: 'Paver',
  tool: 'Tool',
  weapon: 'Weapon',
  material: 'Material',
  alloy: 'Alloy',
  food: 'Food',
  furniture: 'Furniture',
  component: 'Component',
  other: 'Other',
};

export function RecipesBrowser({ recipes, stations }: RecipesBrowserProps) {
  const [query, setQuery] = useState('');
  const [selectedStation, setSelectedStation] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);

  // Derive station options with counts
  const stationOptions = useMemo(() =>
    stations.map((s) => ({
      id: s.id,
      label: s.name,
      count: recipes.filter((r) => r.stationId === s.id).length,
    })),
    [recipes, stations],
  );

  // Derive output category options with counts
  const categoryOptions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const r of recipes) {
      counts.set(r.output.category, (counts.get(r.output.category) ?? 0) + 1);
    }
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([id, count]) => ({ id, label: CATEGORY_LABELS[id] ?? id, count }));
  }, [recipes]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return recipes.filter((r) => {
      if (q && !r.name.toLowerCase().includes(q) && !r.description.toLowerCase().includes(q))
        return false;
      if (selectedStation.length > 0 && !selectedStation.includes(r.stationId))
        return false;
      if (selectedCategory.length > 0 && !selectedCategory.includes(r.output.category))
        return false;
      return true;
    });
  }, [recipes, query, selectedStation, selectedCategory]);

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Toolbar */}
      <div className="px-5 py-3 border-b border-slate-800 space-y-3 bg-sr-surface shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="text-sm font-bold text-slate-200 shrink-0">Recipe Database</h1>
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Search recipes…"
            className="flex-1 max-w-xs"
          />
          <span className="text-xs text-sr-muted font-mono shrink-0">
            {filtered.length} / {recipes.length}
          </span>
          <Link
            href="/crafting"
            className="ml-auto shrink-0 text-xs px-2.5 py-1 rounded bg-orange-800/30 text-orange-300 border border-orange-800/40 hover:bg-orange-800/50 transition-colors"
          >
            Crafting Calc →
          </Link>
        </div>

        {/* Station filter */}
        <div className="space-y-1.5">
          <p className="text-xs text-sr-muted uppercase tracking-wider">Station</p>
          <FilterPillGroup
            options={stationOptions}
            selected={selectedStation}
            onToggle={(id) =>
              setSelectedStation((prev) =>
                prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
              )
            }
            onClear={() => setSelectedStation([])}
            accent="orange"
          />
        </div>

        {/* Category filter */}
        <div className="space-y-1.5">
          <p className="text-xs text-sr-muted uppercase tracking-wider">Output Type</p>
          <FilterPillGroup
            options={categoryOptions}
            selected={selectedCategory}
            onToggle={(id) =>
              setSelectedCategory((prev) =>
                prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
              )
            }
            onClear={() => setSelectedCategory([])}
            accent="amber"
          />
        </div>
      </div>

      {/* Recipe grid */}
      <div className="flex-1 overflow-y-auto p-4">
        {filtered.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-sr-muted text-sm">
            No recipes match your filters.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filtered.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function RecipeCard({ recipe }: { recipe: Recipe }) {
  const stationColors: Record<string, string> = {
    lathe: 'text-cyan-400',
    stove: 'text-amber-400',
    toolmaker: 'text-teal-400',
    refinery: 'text-orange-400',
    unknown: 'text-slate-500',
  };
  const stationNames: Record<string, string> = {
    lathe: 'Lathe',
    stove: 'Stove',
    toolmaker: 'Toolmaker',
    refinery: 'Refinery',
    unknown: 'Unknown',
  };

  return (
    <div className="flex flex-col gap-2 p-3 border border-slate-700 bg-slate-800/30 hover:bg-slate-800/50 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-slate-100 truncate">{recipe.name}</p>
          <p className={`text-xs font-mono ${stationColors[recipe.stationId] ?? 'text-slate-500'}`}>
            {stationNames[recipe.stationId] ?? recipe.stationId}
          </p>
        </div>
        <span className="shrink-0 text-xs px-1.5 py-0.5 rounded bg-slate-700 text-slate-400 uppercase tracking-wide">
          {CATEGORY_LABELS[recipe.output.category] ?? recipe.output.category}
        </span>
      </div>

      {/* Output */}
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-slate-500">Produces</span>
        <span className="text-xs font-medium text-teal-400">
          {recipe.output.quantity > 1 ? `${recipe.output.quantity}× ` : ''}{recipe.output.name}
        </span>
        {!recipe.confirmed && (
          <span className="text-xs px-1 py-0.5 rounded bg-amber-900/40 text-amber-500 border border-amber-800/30">
            unconfirmed
          </span>
        )}
      </div>

      {/* Ingredients */}
      <div className="space-y-0.5">
        {recipe.ingredients.map((ing, i) => (
          <div key={i} className="flex items-center gap-1.5 text-xs">
            <span className="font-mono text-slate-400 w-6 text-right shrink-0">{ing.quantity}×</span>
            <span className="text-slate-300 truncate">{ing.resourceId.replace(/_/g, ' ')}</span>
          </div>
        ))}
      </div>

      {/* Branch tag */}
      <div className="mt-auto pt-1.5 border-t border-slate-700/50">
        <span className="text-xs text-sr-muted uppercase tracking-wider">
          {BRANCH_LABELS[recipe.branch] ?? recipe.branch}
        </span>
        {recipe.isIntermediate && (
          <span className="ml-2 text-xs text-violet-500">component</span>
        )}
      </div>
    </div>
  );
}
