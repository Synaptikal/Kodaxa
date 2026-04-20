"use client";

import { useState, useMemo } from 'react';
import { NavHeader } from '@/components/ui/nav-header';
import { RecipeExplorer } from '@/components/crafting/recipe-explorer';
import { RecipeDetail } from '@/components/crafting/recipe-detail';
import {
  getAllRecipes,
  getAllStations,
  getResourceMap,
  getRecipeMap,
  getRecipeByOutputMap,
  getCraftingStats,
} from '@/data/crafting/index';

/** Static data — computed once at module load */
const ALL_RECIPES = getAllRecipes();
const ALL_STATIONS = getAllStations();
const RESOURCE_MAP = getResourceMap();
const RECIPE_MAP = getRecipeMap();
const RECIPE_BY_OUTPUT = getRecipeByOutputMap();
const STATS = getCraftingStats();

export default function CraftingClient() {
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | undefined>();

  const selectedRecipe = useMemo(
    () => (selectedRecipeId ? RECIPE_MAP.get(selectedRecipeId) : undefined),
    [selectedRecipeId],
  );

  return (
    <div className="flex flex-col h-dvh overflow-hidden">
      <NavHeader />

      <div className="flex flex-1 overflow-hidden">
        {/* ── Left: Recipe Explorer ───────────────────────── */}
        <aside className="w-80 shrink-0 flex flex-col p-3 bg-sr-surface border-r border-sr-border overflow-hidden">
          {/* Stats banner */}
          <div className="flex gap-3 mb-3 text-[10px] text-slate-500">
            <span>{STATS.totalRecipes} recipes</span>
            <span>{STATS.totalResources} resources</span>
            <span>{STATS.totalStations} stations</span>
          </div>

          <RecipeExplorer
            recipes={ALL_RECIPES}
            stations={ALL_STATIONS}
            resourceMap={RESOURCE_MAP}
            onSelectRecipe={setSelectedRecipeId}
            selectedRecipeId={selectedRecipeId}
          />
        </aside>

        {/* ── Right: Recipe Detail ────────────────────────── */}
        <main className="flex-1 overflow-hidden bg-sr-bg">
          {selectedRecipe ? (
            <RecipeDetail
              key={selectedRecipe.id}
              recipe={selectedRecipe}
              resourceMap={RESOURCE_MAP}
              recipeMap={RECIPE_MAP}
              recipeByOutput={RECIPE_BY_OUTPUT}
            />
          ) : (
            <EmptyState />
          )}
        </main>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-8">
      <p className="text-lg font-semibold text-slate-400 mb-2">Select a recipe to get started</p>
      <p className="text-xs text-slate-600 max-w-md">
        Browse recipes on the left, then use the Stat Optimizer to input your
        scouted P/Q/R/V values and see predicted output quality. The Crafting
        Chain tab shows dependency trees and shopping lists.
      </p>
    </div>
  );
}
