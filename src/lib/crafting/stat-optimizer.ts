/**
 * stat-optimizer.ts
 * Resource stat optimization engine for Stars Reach crafting.
 * One concern: calculating optimal material combinations and predicted output stats.
 *
 * Core mechanic (from CraftingScreenModel.cs CalculateStatValue):
 *   For each of the 4 stats (P, Q, R, V) independently:
 *     1. Collect one value per ingredient slot (max 5 slots)
 *     2. Sort values descending
 *     3. Drop 2 lowest if ≥5 slots filled; drop 1 lowest if ≥2 slots filled
 *     4. Final stat = RoundToInt(sum / remaining count)
 *   effectiveQuality = average of all 4 final stats
 *
 * Key correction from prior implementation:
 *   - OLD (wrong): quantity-weighted average → drop lowest whole stat → average 3
 *   - NEW (correct): per-stat drop of lowest values, all 4 stats present in output
 *
 * Source: decompiled CraftingScreenModel.cs, Stars Reach Playtest build
 */

import type {
  ResourceStats,
  StatKey,
  ResourceInput,
  OptimizationResult,
  IngredientContribution,
  RecipeIngredient,
} from '@/types/crafting';
import { STAT_KEYS } from '@/types/crafting';

/**
 * Calculate the final item stats from a set of ingredient inputs.
 *
 * Each ingredient slot contributes ONE value per stat (quantity is not
 * multiplied into the formula — it is display-only for the UI breakdown).
 */
export function calculateOutputStats(
  inputs: ResourceInput[],
  ingredients: RecipeIngredient[],
): OptimizationResult {
  const statsMap = new Map(inputs.map((i) => [i.resourceId, i.stats]));
  const totalQuantity = Math.max(
    1,
    ingredients.reduce((sum, ing) => sum + ing.quantity, 0),
  );

  // Build display-only contributions (weight = quantity fraction, not used in formula)
  const contributions: IngredientContribution[] = ingredients.map((ing) => {
    const stats = statsMap.get(ing.resourceId) ?? defaultStats();
    return {
      resourceId: ing.resourceId,
      resourceName: ing.resourceId,
      weight: ing.quantity / totalQuantity,
      weightedStats: { ...stats },
    };
  });

  // Determine drop count from slot count (matches CalculateStatValue source)
  const slotCount = ingredients.length;
  const droppedCount: 1 | 2 = slotCount >= 5 ? 2 : 1;

  // Per-stat: collect one value per slot, sort desc, drop N lowest, round average
  const finalStats: ResourceStats = {
    potential: calculateStatValue(contributions.map((c) => c.weightedStats.potential), droppedCount),
    quality: calculateStatValue(contributions.map((c) => c.weightedStats.quality), droppedCount),
    resilience: calculateStatValue(contributions.map((c) => c.weightedStats.resilience), droppedCount),
    versatility: calculateStatValue(contributions.map((c) => c.weightedStats.versatility), droppedCount),
  };

  const effectiveQuality =
    STAT_KEYS.reduce((sum, k) => sum + finalStats[k], 0) / STAT_KEYS.length;

  return {
    droppedCount,
    finalStats,
    effectiveQuality,
    contributions,
  };
}

/**
 * Compare multiple resource combinations for the same recipe.
 * Returns them sorted by effective quality (highest first).
 */
export function compareCombinations(
  combinations: ResourceInput[][],
  ingredients: RecipeIngredient[],
): OptimizationResult[] {
  return combinations
    .map((inputs) => calculateOutputStats(inputs, ingredients))
    .sort((a, b) => b.effectiveQuality - a.effectiveQuality);
}

/**
 * Suggest which stat to optimize for, given a recipe's intended use.
 * This is a heuristic — players may have different priorities.
 */
export function suggestOptimalStat(
  outputCategory: string,
): { primary: StatKey; secondary: StatKey; reason: string } {
  switch (outputCategory) {
    case 'weapon':
      return {
        primary: 'potential',
        secondary: 'resilience',
        reason: 'Weapons benefit most from energy delivery (P) and durability (R).',
      };
    case 'tool':
      return {
        primary: 'resilience',
        secondary: 'versatility',
        reason: 'Tools need durability (R) and workability (V) for long-term use.',
      };
    case 'block':
    case 'decor':
    case 'paver':
      return {
        primary: 'quality',
        secondary: 'resilience',
        reason: 'Building materials benefit from general fitness (Q) and durability (R).',
      };
    case 'food':
      return {
        primary: 'potential',
        secondary: 'quality',
        reason: 'Food benefits from caloric content (P) and general fitness (Q).',
      };
    case 'alloy':
    case 'material':
      return {
        primary: 'versatility',
        secondary: 'quality',
        reason: 'Intermediate materials benefit from workability (V) for downstream crafting.',
      };
    default:
      return {
        primary: 'quality',
        secondary: 'potential',
        reason: 'General items benefit from overall quality (Q).',
      };
  }
}

// ── Internal helpers ────────────────────────────────────────────────

/**
 * Per-stat calculation matching CraftingScreenModel.cs CalculateStatValue.
 * Takes one value per ingredient slot, sorts descending, drops N lowest,
 * returns RoundToInt(sum / remaining count).
 * If fewer than 2 values, no drop occurs.
 */
function calculateStatValue(values: number[], dropCount: 1 | 2): number {
  if (values.length === 0) return 0;
  if (values.length === 1) return Math.round(values[0]);

  const sorted = [...values].sort((a, b) => b - a); // descending
  const effectiveDrop = Math.min(dropCount, sorted.length - 1);
  const kept = sorted.slice(0, sorted.length - effectiveDrop);
  return Math.round(kept.reduce((s, v) => s + v, 0) / kept.length);
}

/** Default zero stats */
function defaultStats(): ResourceStats {
  return { potential: 0, quality: 0, resilience: 0, versatility: 0 };
}

/** Create stats from a simple 4-tuple for convenience */
export function statsFrom(p: number, q: number, r: number, v: number): ResourceStats {
  return { potential: p, quality: q, resilience: r, versatility: v };
}
