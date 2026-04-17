/**
 * recipe-explorer.tsx
 * Searchable, filterable recipe browser panel.
 * One concern: recipe search/filter UI and result list.
 */

'use client';

import { useState, useMemo, useCallback } from 'react';
import type { Recipe, Resource, CraftingStation } from '@/types/crafting';
import { RecipeCard } from '@/components/crafting/recipe-card';

export interface RecipeExplorerProps {
  recipes: Recipe[];
  stations: CraftingStation[];
  resourceMap: Map<string, Resource>;
  onSelectRecipe: (recipeId: string) => void;
  selectedRecipeId?: string;
}

/** Output categories for filtering */
const OUTPUT_CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'block', label: 'Blocks' },
  { value: 'decor', label: 'Decor' },
  { value: 'paver', label: 'Pavers' },
  { value: 'material', label: 'Materials' },
  { value: 'tool', label: 'Tools' },
  { value: 'weapon', label: 'Weapons' },
  { value: 'food', label: 'Food' },
];

export function RecipeExplorer({
  recipes,
  stations,
  resourceMap,
  onSelectRecipe,
  selectedRecipeId,
}: RecipeExplorerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [stationFilter, setStationFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filtered = useMemo(() => {
    let results = recipes;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      results = results.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.ingredients.some((ing) => {
            const res = resourceMap.get(ing.resourceId);
            return res?.name.toLowerCase().includes(q);
          }),
      );
    }

    if (stationFilter !== 'all') {
      results = results.filter((r) => r.stationId === stationFilter);
    }

    if (categoryFilter !== 'all') {
      results = results.filter((r) => r.output.category === categoryFilter);
    }

    return results;
  }, [recipes, searchQuery, stationFilter, categoryFilter, resourceMap]);

  const chipClass = useCallback(
    (value: string, current: string) =>
      `px-2 py-1 rounded-full text-[10px] font-medium transition-colors cursor-pointer ${
        value === current
          ? 'bg-cyan-800/60 text-cyan-200'
          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
      }`,
    [],
  );

  return (
    <div className="flex flex-col gap-3 h-full overflow-hidden">
      {/* Search */}
      <input
        type="text"
        placeholder="Search recipes, ingredients..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full bg-slate-800 border border-slate-600 rounded-md px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none transition-colors"
      />

      {/* Station filter */}
      <div className="flex flex-wrap gap-1">
        <button
          onClick={() => setStationFilter('all')}
          className={chipClass('all', stationFilter)}
        >
          All Stations
        </button>
        {stations.map((s) => (
          <button
            key={s.id}
            onClick={() => setStationFilter(s.id)}
            className={chipClass(s.id, stationFilter)}
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-1">
        {OUTPUT_CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setCategoryFilter(cat.value)}
            className={chipClass(cat.value, categoryFilter)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Result count */}
      <p className="text-[10px] text-slate-500">
        {filtered.length} recipe{filtered.length !== 1 ? 's' : ''} found
      </p>

      {/* Recipe list */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {filtered.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            resourceMap={resourceMap}
            onSelect={onSelectRecipe}
            isSelected={recipe.id === selectedRecipeId}
          />
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-slate-600 text-center py-8">
            No recipes match your filters.
          </p>
        )}
      </div>
    </div>
  );
}
