/**
 * Crafting data loader.
 * One concern: importing all crafting data and building lookup maps.
 *
 * Aggregates recipes from all category files, resources, and stations
 * into unified maps for the crafting calculator.
 */

import type { Recipe, Resource, CraftingStation } from '@/types/crafting';
import { CRAFTING_STATIONS, getStationMap } from './stations';
import { RESOURCES, getResourceMap } from './resources';
import { BLOCK_RECIPES } from './recipes-blocks';
import { DECOR_RECIPES } from './recipes-decor';
import { REFINING_RECIPES } from './recipes-refining';
import { buildOutputIndex } from '@/lib/crafting/chain-resolver';

/** All recipes combined across all categories */
const ALL_RECIPES: Recipe[] = [
  ...BLOCK_RECIPES,
  ...DECOR_RECIPES,
  ...REFINING_RECIPES,
];

/** Get all recipes as a flat array */
export function getAllRecipes(): Recipe[] {
  return ALL_RECIPES;
}

/** Build a Map<recipeId, Recipe> for fast lookups */
export function getRecipeMap(): Map<string, Recipe> {
  return new Map(ALL_RECIPES.map((r) => [r.id, r]));
}

/** Build a Map<outputItemId, Recipe> for chain resolution */
export function getRecipeByOutputMap(): Map<string, Recipe> {
  return buildOutputIndex(getRecipeMap());
}

/** Get all resources */
export function getAllResources(): Resource[] {
  return RESOURCES;
}

/** Re-export resource map builder */
export { getResourceMap } from './resources';

/** Get all stations */
export function getAllStations(): CraftingStation[] {
  return CRAFTING_STATIONS;
}

/** Re-export station map builder */
export { getStationMap } from './stations';

/** Get recipes filtered by station */
export function getRecipesByStation(stationId: string): Recipe[] {
  return ALL_RECIPES.filter((r) => r.stationId === stationId);
}

/** Get recipes filtered by crafting branch */
export function getRecipesByBranch(branch: string): Recipe[] {
  return ALL_RECIPES.filter((r) => r.branch === branch);
}

/** Get recipes filtered by output category */
export function getRecipesByOutputCategory(category: string): Recipe[] {
  return ALL_RECIPES.filter((r) => r.output.category === category);
}

/** Search recipes by name (case-insensitive) */
export function searchRecipes(query: string): Recipe[] {
  const lower = query.toLowerCase();
  return ALL_RECIPES.filter(
    (r) =>
      r.name.toLowerCase().includes(lower) ||
      r.description.toLowerCase().includes(lower),
  );
}

/** Summary stats for the crafting data */
export function getCraftingStats() {
  return {
    totalRecipes: ALL_RECIPES.length,
    confirmedRecipes: ALL_RECIPES.filter((r) => r.confirmed).length,
    totalResources: RESOURCES.length,
    totalStations: CRAFTING_STATIONS.length,
    byStation: CRAFTING_STATIONS.map((s) => ({
      station: s.name,
      recipeCount: ALL_RECIPES.filter((r) => r.stationId === s.id).length,
    })),
  };
}
