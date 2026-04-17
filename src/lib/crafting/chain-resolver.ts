/**
 * chain-resolver.ts
 * Resolves crafting dependency chains for Stars Reach recipes.
 * One concern: walking recipe dependencies to build a full production tree.
 *
 * Given a target recipe, this module produces:
 *   - A flat list of all required intermediate crafting steps
 *   - A tree structure for visualization
 *   - A total raw materials shopping list
 *
 * This is pure logic — no React, no side effects.
 */

import type { Recipe, RecipeIngredient } from '@/types/crafting';

/** A node in the crafting dependency tree */
export interface ChainNode {
  recipeId: string;
  recipeName: string;
  stationId: string;
  /** Quantity of this recipe's output needed */
  quantityNeeded: number;
  /** Number of times this recipe must be crafted */
  craftCount: number;
  /** Child nodes (sub-components that feed into this recipe) */
  children: ChainNode[];
  /** Depth in the tree (0 = target item) */
  depth: number;
}

/** A flat entry in the shopping list */
export interface ShoppingListEntry {
  resourceId: string;
  resourceName: string;
  /** Total quantity needed across all crafting steps */
  totalQuantity: number;
  /** Is this a raw material (no recipe to make it) or an intermediate? */
  isRaw: boolean;
}

/** Complete resolved chain result */
export interface ResolvedChain {
  /** Tree structure for visualization */
  tree: ChainNode;
  /** Flat ordered list of crafting steps (bottom-up) */
  steps: CraftingStep[];
  /** Total raw materials needed */
  shoppingList: ShoppingListEntry[];
}

/** A single crafting step in the production sequence */
export interface CraftingStep {
  recipeId: string;
  recipeName: string;
  stationId: string;
  craftCount: number;
  ingredients: { resourceId: string; totalQuantity: number }[];
  /** Order index (0 = craft first) */
  order: number;
}

/**
 * Resolve the full dependency chain for a target recipe.
 *
 * @param targetRecipeId - The recipe to craft
 * @param quantity - How many of the target item to produce
 * @param recipeMap - All recipes indexed by ID
 * @param recipeByOutput - Recipes indexed by output item ID
 */
export function resolveChain(
  targetRecipeId: string,
  quantity: number,
  recipeMap: Map<string, Recipe>,
  recipeByOutput: Map<string, Recipe>,
): ResolvedChain {
  const rawMaterials = new Map<string, ShoppingListEntry>();
  const stepMap = new Map<string, CraftingStep>();
  let stepOrder = 0;

  const tree = buildNode(
    targetRecipeId,
    quantity,
    0,
    recipeMap,
    recipeByOutput,
    rawMaterials,
    stepMap,
    { order: stepOrder },
  );

  // Convert step map to ordered array (reverse so leaves come first)
  const steps = Array.from(stepMap.values()).sort(
    (a, b) => b.order - a.order,
  );
  // Re-index order so 0 = craft first
  steps.forEach((s, i) => (s.order = i));

  return {
    tree,
    steps,
    shoppingList: Array.from(rawMaterials.values()),
  };
}

/** Recursively build a dependency tree node */
function buildNode(
  recipeId: string,
  quantityNeeded: number,
  depth: number,
  recipeMap: Map<string, Recipe>,
  recipeByOutput: Map<string, Recipe>,
  rawMaterials: Map<string, ShoppingListEntry>,
  stepMap: Map<string, CraftingStep>,
  orderRef: { order: number },
): ChainNode {
  const recipe = recipeMap.get(recipeId);
  if (!recipe) {
    return {
      recipeId,
      recipeName: recipeId,
      stationId: 'unknown',
      quantityNeeded,
      craftCount: quantityNeeded,
      children: [],
      depth,
    };
  }

  // How many crafts needed (ceil in case output quantity > 1)
  const craftCount = Math.ceil(quantityNeeded / recipe.output.quantity);

  const children: ChainNode[] = [];

  for (const ing of recipe.ingredients) {
    const totalIngNeeded = ing.quantity * craftCount;
    const subRecipe = recipeByOutput.get(ing.resourceId);

    if (subRecipe) {
      // This ingredient is itself crafted — recurse
      const child = buildNode(
        subRecipe.id,
        totalIngNeeded,
        depth + 1,
        recipeMap,
        recipeByOutput,
        rawMaterials,
        stepMap,
        orderRef,
      );
      children.push(child);
    } else {
      // Raw material — add to shopping list
      accumulateRaw(rawMaterials, ing.resourceId, totalIngNeeded);
    }
  }

  // Register this as a crafting step
  if (!stepMap.has(recipeId)) {
    stepMap.set(recipeId, {
      recipeId,
      recipeName: recipe.name,
      stationId: recipe.stationId,
      craftCount,
      ingredients: recipe.ingredients.map((ing) => ({
        resourceId: ing.resourceId,
        totalQuantity: ing.quantity * craftCount,
      })),
      order: orderRef.order++,
    });
  } else {
    // Recipe already in steps — increase craft count
    const existing = stepMap.get(recipeId)!;
    existing.craftCount += craftCount;
    existing.ingredients.forEach((ingStep, i) => {
      ingStep.totalQuantity += recipe.ingredients[i].quantity * craftCount;
    });
  }

  return {
    recipeId,
    recipeName: recipe.name,
    stationId: recipe.stationId,
    quantityNeeded,
    craftCount,
    children,
    depth,
  };
}

/** Accumulate raw material quantities in the shopping list */
function accumulateRaw(
  map: Map<string, ShoppingListEntry>,
  resourceId: string,
  quantity: number,
): void {
  const existing = map.get(resourceId);
  if (existing) {
    existing.totalQuantity += quantity;
  } else {
    map.set(resourceId, {
      resourceId,
      resourceName: resourceId, // Caller can enrich with display names
      totalQuantity: quantity,
      isRaw: true,
    });
  }
}

/**
 * Build the recipeByOutput lookup map.
 * Maps output item IDs to the recipe that produces them.
 */
export function buildOutputIndex(
  recipeMap: Map<string, Recipe>,
): Map<string, Recipe> {
  const index = new Map<string, Recipe>();
  for (const recipe of recipeMap.values()) {
    index.set(recipe.output.itemId, recipe);
  }
  return index;
}
