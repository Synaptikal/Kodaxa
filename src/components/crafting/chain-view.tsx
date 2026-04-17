/**
 * chain-view.tsx
 * Crafting dependency chain visualizer and shopping list.
 * One concern: rendering the production tree and raw material totals.
 *
 * Shows:
 *   - Tree of crafting steps (recursive sub-components)
 *   - Ordered crafting steps (bottom-up)
 *   - Total raw materials shopping list
 */

'use client';

import { useMemo } from 'react';
import type { Recipe, Resource } from '@/types/crafting';
import { resolveChain } from '@/lib/crafting/chain-resolver';
import type { ChainNode, ResolvedChain } from '@/lib/crafting/chain-resolver';

export interface ChainViewProps {
  recipe: Recipe;
  quantity: number;
  recipeMap: Map<string, Recipe>;
  recipeByOutput: Map<string, Recipe>;
  resourceMap: Map<string, Resource>;
}

export function ChainView({
  recipe,
  quantity,
  recipeMap,
  recipeByOutput,
  resourceMap,
}: ChainViewProps) {
  const chain = useMemo(
    () => resolveChain(recipe.id, quantity, recipeMap, recipeByOutput),
    [recipe.id, quantity, recipeMap, recipeByOutput],
  );

  const hasChain = chain.steps.length > 1 || chain.shoppingList.length > 0;

  if (!hasChain) {
    return (
      <div className="text-xs text-slate-500 py-4 text-center">
        No sub-components — this recipe uses only raw materials.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Shopping list */}
      <ShoppingList chain={chain} resourceMap={resourceMap} />

      {/* Ordered crafting steps */}
      <CraftingSteps chain={chain} resourceMap={resourceMap} />

      {/* Tree view */}
      <div>
        <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
          Dependency Tree
        </h4>
        <div className="pl-2 border-l border-slate-700">
          <TreeNode node={chain.tree} resourceMap={resourceMap} />
        </div>
      </div>
    </div>
  );
}

/** Raw materials shopping list */
function ShoppingList({
  chain,
  resourceMap,
}: {
  chain: ResolvedChain;
  resourceMap: Map<string, Resource>;
}) {
  if (chain.shoppingList.length === 0) return null;

  return (
    <div className="rounded-md border border-amber-800/30 bg-amber-950/15 p-3">
      <h4 className="text-xs font-semibold text-amber-300 uppercase tracking-wider mb-2">
        Raw Materials Needed
      </h4>
      <div className="space-y-1">
        {chain.shoppingList
          .sort((a, b) => b.totalQuantity - a.totalQuantity)
          .map((entry) => {
            const resource = resourceMap.get(entry.resourceId);
            return (
              <div key={entry.resourceId} className="flex justify-between text-xs">
                <span className="text-slate-300">
                  {resource?.name ?? entry.resourceId}
                </span>
                <span className="text-amber-400 tabular-nums font-mono">
                  &times;{entry.totalQuantity}
                </span>
              </div>
            );
          })}
      </div>
    </div>
  );
}

/** Ordered crafting steps */
function CraftingSteps({
  chain,
  resourceMap,
}: {
  chain: ResolvedChain;
  resourceMap: Map<string, Resource>;
}) {
  return (
    <div>
      <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
        Crafting Order
      </h4>
      <ol className="space-y-1.5">
        {chain.steps.map((step) => (
          <li
            key={step.recipeId}
            className="flex items-start gap-2 text-xs rounded-md bg-slate-800/40 px-2 py-1.5"
          >
            <span className="shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-slate-700 text-[10px] font-mono text-slate-300">
              {step.order + 1}
            </span>
            <div className="flex-1 min-w-0">
              <span className="text-slate-200 font-medium">{step.recipeName}</span>
              <span className="text-slate-500 ml-1">
                &times;{step.craftCount} at {step.stationId}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Recursive tree node renderer */
function TreeNode({
  node,
  resourceMap,
}: {
  node: ChainNode;
  resourceMap: Map<string, Resource>;
}) {
  return (
    <div className="py-1">
      <div className="flex items-center gap-1.5 text-xs">
        <span className="text-slate-300 font-medium">{node.recipeName}</span>
        <span className="text-slate-600">&times;{node.craftCount}</span>
        <span className="text-slate-600 text-[9px] capitalize">({node.stationId})</span>
      </div>
      {node.children.length > 0 && (
        <div className="ml-3 pl-2 border-l border-slate-700/50 mt-0.5">
          {node.children.map((child) => (
            <TreeNode key={child.recipeId} node={child} resourceMap={resourceMap} />
          ))}
        </div>
      )}
    </div>
  );
}
