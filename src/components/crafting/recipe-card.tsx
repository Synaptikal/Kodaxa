/**
 * recipe-card.tsx
 * Card component for displaying a single crafting recipe.
 * One concern: rendering recipe details (ingredients, station, output).
 */

'use client';

import type { Recipe, Resource } from '@/types/crafting';

export interface RecipeCardProps {
  recipe: Recipe;
  resourceMap: Map<string, Resource>;
  onSelect?: (recipeId: string) => void;
  isSelected?: boolean;
}

/** Station color accents */
const STATION_COLORS: Record<string, string> = {
  lathe: 'border-orange-500/40 bg-orange-950/20',
  stove: 'border-red-500/40 bg-red-950/20',
  toolmaker: 'border-blue-500/40 bg-blue-950/20',
  refinery: 'border-emerald-500/40 bg-emerald-950/20',
  unknown: 'border-slate-500/40 bg-slate-950/20',
};

/** Output category badge colors */
const CATEGORY_BADGE: Record<string, string> = {
  block: 'bg-slate-700 text-slate-200',
  decor: 'bg-violet-800/60 text-violet-200',
  paver: 'bg-amber-800/60 text-amber-200',
  material: 'bg-emerald-800/60 text-emerald-200',
  tool: 'bg-blue-800/60 text-blue-200',
  weapon: 'bg-red-800/60 text-red-200',
  food: 'bg-orange-800/60 text-orange-200',
  alloy: 'bg-cyan-800/60 text-cyan-200',
  other: 'bg-slate-700 text-slate-300',
};

export function RecipeCard({
  recipe,
  resourceMap,
  onSelect,
  isSelected,
}: RecipeCardProps) {
  const stationColor = STATION_COLORS[recipe.stationId] ?? STATION_COLORS.unknown;
  const badgeColor = CATEGORY_BADGE[recipe.output.category] ?? CATEGORY_BADGE.other;

  return (
    <button
      onClick={() => onSelect?.(recipe.id)}
      className={`
        w-full text-left rounded-lg border p-3 transition-all duration-150
        ${stationColor}
        ${isSelected ? 'ring-1 ring-cyan-400/50 shadow-lg shadow-cyan-900/20' : 'hover:brightness-110'}
      `}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-sm font-semibold text-slate-100 leading-tight">
          {recipe.name}
        </h3>
        <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-medium ${badgeColor}`}>
          {recipe.output.category}
        </span>
      </div>

      {/* Ingredients */}
      <div className="space-y-0.5 mb-2">
        {recipe.ingredients.map((ing, i) => {
          const resource = resourceMap.get(ing.resourceId);
          return (
            <div key={i} className="flex justify-between text-xs">
              <span className="text-slate-400">
                {resource?.name ?? ing.resourceId}
                {ing.anyInCategory && (
                  <span className="text-slate-600 ml-1">(any {ing.anyInCategory})</span>
                )}
              </span>
              <span className="text-slate-500 tabular-nums">&times;{ing.quantity}</span>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-[10px]">
        <span className="text-slate-500 capitalize">{recipe.stationId}</span>
        {recipe.isIntermediate && (
          <span className="text-cyan-500/70">Intermediate</span>
        )}
        {!recipe.confirmed && (
          <span className="text-purple-400">Unconfirmed</span>
        )}
      </div>
    </button>
  );
}
