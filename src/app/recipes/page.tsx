/**
 * recipes/page.tsx
 * Recipe Database — searchable reference browser for all crafting recipes.
 * One concern: browse and filter all recipes; distinct from the Crafting Calculator.
 *
 * Server component: data loaded at build time from src/data/crafting/.
 * Client filtering delegated to RecipesBrowser child component.
 */

import type { Metadata } from 'next';
import { NavHeader } from '@/components/ui/nav-header';
import { RecipesBrowser } from '@/components/recipes/recipes-browser';
import { getAllRecipes, getAllStations } from '@/data/crafting/index';

export const metadata: Metadata = {
  title: 'Recipe Database — Kodaxa Studios',
  description: 'Browse and filter all Stars Reach crafting recipes. Kodaxa Material Analytics Suite.',
};

export default function RecipesPage() {
  const recipes = getAllRecipes();
  const stations = getAllStations();

  return (
    <div className="flex flex-col h-dvh overflow-hidden">
      <NavHeader />
      <RecipesBrowser recipes={recipes} stations={stations} />
    </div>
  );
}
