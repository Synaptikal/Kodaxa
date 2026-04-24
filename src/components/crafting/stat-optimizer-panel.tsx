/**
 * stat-optimizer-panel.tsx
 * UI for the resource stat optimizer — the crafting calculator's killer feature.
 * One concern: letting players input P/Q/R/V values and see predicted output stats.
 *
 * Mechanic (CraftingScreenModel.cs CalculateStatValue):
 *   Per stat: collect 1 value per slot → sort desc → drop 1 (2-4 slots) or 2 (5 slots) → round(avg)
 *   All 4 stats appear in output; effectiveQuality = avg of all 4.
 */

'use client';

import { useState, useMemo, useCallback } from 'react';
import type { Recipe, Resource, ResourceStats, StatKey, ResourceInput } from '@/types/crafting';
import { STAT_KEYS, STAT_LABELS, STAT_NAMES } from '@/types/crafting';
import { calculateOutputStats, suggestOptimalStat } from '@/lib/crafting/stat-optimizer';

export interface StatOptimizerPanelProps {
  recipe: Recipe;
  resourceMap: Map<string, Resource>;
}

/** Color for each stat */
const STAT_COLORS: Record<StatKey, string> = {
  potential: 'text-amber-400',
  quality: 'text-emerald-400',
  resilience: 'text-blue-400',
  versatility: 'text-violet-400',
};

const STAT_BAR_COLORS: Record<StatKey, string> = {
  potential: 'bg-amber-500',
  quality: 'bg-emerald-500',
  resilience: 'bg-blue-500',
  versatility: 'bg-violet-500',
};

export function StatOptimizerPanel({ recipe, resourceMap }: StatOptimizerPanelProps) {
  // Initialize input stats from base stats for each ingredient
  const [inputStats, setInputStats] = useState<Map<string, ResourceStats>>(() => {
    const map = new Map<string, ResourceStats>();
    for (const ing of recipe.ingredients) {
      const resource = resourceMap.get(ing.resourceId);
      map.set(ing.resourceId, resource?.baseStats ?? defaultStats());
    }
    return map;
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // setPlanetNames is scaffolded for the planned per-ingredient planet selector UI.
  // The planetName field is wired into ResourceInput[] but the setter has no UI yet.
  const [planetNames, setPlanetNames] = useState<Map<string, string>>(new Map());

  // Build ResourceInput array for the optimizer
  const inputs: ResourceInput[] = useMemo(
    () =>
      recipe.ingredients.map((ing) => ({
        resourceId: ing.resourceId,
        stats: inputStats.get(ing.resourceId) ?? defaultStats(),
        planetName: planetNames.get(ing.resourceId),
      })),
    [recipe.ingredients, inputStats, planetNames],
  );

  // Run optimization
  const result = useMemo(
    () => calculateOutputStats(inputs, recipe.ingredients),
    [inputs, recipe.ingredients],
  );

  // Stat suggestion for this recipe's output type
  const suggestion = useMemo(
    () => suggestOptimalStat(recipe.output.category),
    [recipe.output.category],
  );

  const updateStat = useCallback(
    (resourceId: string, stat: StatKey, value: number) => {
      setInputStats((prev) => {
        const next = new Map(prev);
        const current = next.get(resourceId) ?? defaultStats();
        next.set(resourceId, { ...current, [stat]: value });
        return next;
      });
    },
    [],
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Suggestion banner */}
      <div className="p-2 rounded-md bg-cyan-950/30 border border-cyan-800/30">
        <p className="text-xs text-cyan-300">
          <span className="font-semibold">Tip:</span> {suggestion.reason}{' '}
          Prioritize{' '}
          <span className={STAT_COLORS[suggestion.primary]}>
            {STAT_NAMES[suggestion.primary]}
          </span>{' '}
          and{' '}
          <span className={STAT_COLORS[suggestion.secondary]}>
            {STAT_NAMES[suggestion.secondary]}
          </span>.
        </p>
      </div>

      {/* Per-ingredient stat inputs */}
      {recipe.ingredients.map((ing) => {
        const resource = resourceMap.get(ing.resourceId);
        const stats = inputStats.get(ing.resourceId) ?? defaultStats();

        return (
          <IngredientStatInput
            key={ing.resourceId}
            resourceId={ing.resourceId}
            resourceName={resource?.name ?? ing.resourceId}
            quantity={ing.quantity}
            stats={stats}
            onStatChange={updateStat}
          />
        );
      })}

      {/* Results section */}
      <ResultDisplay result={result} />
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────

function IngredientStatInput({
  resourceId,
  resourceName,
  quantity,
  stats,
  onStatChange,
}: {
  resourceId: string;
  resourceName: string;
  quantity: number;
  stats: ResourceStats;
  onStatChange: (id: string, stat: StatKey, value: number) => void;
}) {
  return (
    <div className="rounded-md border border-slate-700 p-2.5 bg-slate-800/30">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-medium text-slate-200">{resourceName}</span>
        <span className="text-xs text-slate-500">&times;{quantity}</span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {STAT_KEYS.map((key) => (
          <div key={key} className="flex flex-col items-center gap-1">
            <label className={`text-xs font-mono font-bold ${STAT_COLORS[key]}`}>
              {STAT_LABELS[key]}
            </label>
            <input
              type="number"
              min={0}
              max={100}
              value={stats[key]}
              onChange={(e) => onStatChange(resourceId, key, Number(e.target.value) || 0)}
              className="w-full bg-slate-900 border border-slate-600 rounded px-1.5 py-1 text-xs text-center text-slate-200 focus:border-cyan-400 focus:outline-none tabular-nums"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function ResultDisplay({
  result,
}: {
  result: ReturnType<typeof calculateOutputStats>;
}) {
  return (
    <div className="border border-teal-800/40 bg-teal-950/20 p-3">
      <h4 className="text-xs font-semibold text-teal-300 uppercase tracking-wider mb-2">
        Predicted Output
      </h4>

      {/* Effective quality score */}
      <div className="flex items-baseline justify-between mb-3">
        <span className="text-sm text-slate-300">Effective Quality</span>
        <span className="text-xl font-bold font-mono text-teal-400">
          {result.effectiveQuality.toFixed(1)}
        </span>
      </div>

      {/* Stat bars */}
      <div className="space-y-1.5">
        {STAT_KEYS.map((key) => {
          const value = result.finalStats[key];
          return (
            <div key={key} className="flex items-center gap-2">
              <span className={`w-4 text-xs font-mono font-bold ${STAT_COLORS[key]}`}>
                {STAT_LABELS[key]}
              </span>
              <div className="flex-1 h-2 rounded-full bg-slate-700 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${STAT_BAR_COLORS[key]}`}
                  style={{ width: `${Math.min(value, 100)}%` }}
                />
              </div>
              <span className="w-8 text-right text-xs font-mono tabular-nums text-slate-300">
                {value}
              </span>
            </div>
          );
        })}
      </div>

      {/* Drop mechanic note */}
      <p className="mt-2 text-xs text-slate-500">
        {result.droppedCount === 2
          ? '2 lowest values per stat dropped (5-slot recipe).'
          : '1 lowest value per stat dropped.'}{' '}
        Values rounded to nearest integer per game formula.
      </p>
    </div>
  );
}

function defaultStats(): ResourceStats {
  return { potential: 50, quality: 50, resilience: 50, versatility: 50 };
}
