/**
 * recipe-detail.tsx
 * Detail panel for a selected recipe — shows optimizer and chain view.
 * One concern: composing stat optimizer + chain visualizer for one recipe.
 */

'use client';

import { useState, useCallback } from 'react';
import { PackagePlusIcon, CheckIcon } from 'lucide-react';
import type { Recipe, Resource, RecipeOutputCategory } from '@/types/crafting';
import type { ItemCategory } from '@/types/items';
import { StatOptimizerPanel } from '@/components/crafting/stat-optimizer-panel';
import { ChainView } from '@/components/crafting/chain-view';
import { appendCraftedItem } from '@/hooks/use-inventory';

/** Maps crafting output categories to the inventory item category taxonomy */
const OUTPUT_TO_ITEM_CATEGORY: Record<RecipeOutputCategory, ItemCategory> = {
  block:     'industrial',
  decor:     'industrial',
  paver:     'industrial',
  tool:      'tool',
  weapon:    'tool',
  material:  'industrial',
  alloy:     'alloy',
  food:      'consumable',
  furniture: 'industrial',
  component: 'industrial',
  other:     'industrial',
};

export interface RecipeDetailProps {
  recipe: Recipe;
  resourceMap: Map<string, Resource>;
  recipeMap: Map<string, Recipe>;
  recipeByOutput: Map<string, Recipe>;
}

type DetailTab = 'optimizer' | 'chain';

export function RecipeDetail({
  recipe,
  resourceMap,
  recipeMap,
  recipeByOutput,
}: RecipeDetailProps) {
  const [activeTab, setActiveTab] = useState<DetailTab>('optimizer');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAddToInventory = useCallback(() => {
    const totalQty = quantity * recipe.output.quantity;
    appendCraftedItem(
      recipe.output.name,
      OUTPUT_TO_ITEM_CATEGORY[recipe.output.category],
      totalQty,
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }, [quantity, recipe.output]);

  const tabClass = (tab: DetailTab) =>
    `px-3 py-1.5 text-xs font-medium rounded-t-md transition-colors ${
      activeTab === tab
        ? 'bg-slate-800 text-cyan-300 border-b-2 border-cyan-400'
        : 'text-slate-500 hover:text-slate-300'
    }`;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Recipe header */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-slate-100">{recipe.name}</h2>
            <p className="text-xs text-slate-400 mt-0.5">{recipe.description}</p>
            <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-500">
              <span className="capitalize">Station: {recipe.stationId}</span>
              <span className="capitalize">Branch: {recipe.branch.replace('_', ' ')}</span>
              {recipe.confirmed ? (
                <span className="text-emerald-500">Confirmed</span>
              ) : (
                <span className="text-purple-400">Unconfirmed</span>
              )}
            </div>
          </div>
          <button
            onClick={handleAddToInventory}
            className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-medium transition-all ${
              added
                ? 'bg-emerald-800/50 text-emerald-300 border border-emerald-700/50'
                : 'bg-slate-700/50 text-slate-300 border border-slate-600/50 hover:bg-slate-700 hover:text-slate-100'
            }`}
            title={`Add ${quantity * recipe.output.quantity}× ${recipe.output.name} to inventory`}
          >
            {added ? (
              <><CheckIcon className="w-3 h-3" /><span>Added</span></>
            ) : (
              <><PackagePlusIcon className="w-3 h-3" /><span>Add to Inventory</span></>
            )}
          </button>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 px-4 pt-2 border-b border-slate-700">
        <button onClick={() => setActiveTab('optimizer')} className={tabClass('optimizer')}>
          Stat Optimizer
        </button>
        <button onClick={() => setActiveTab('chain')} className={tabClass('chain')}>
          Crafting Chain
        </button>

        {/* Quantity selector (for chain view) */}
        {activeTab === 'chain' && (
          <div className="ml-auto flex items-center gap-1.5">
            <label className="text-[10px] text-slate-500">Qty:</label>
            <input
              type="number"
              min={1}
              max={999}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
              className="w-14 bg-slate-800 border border-slate-600 rounded px-1.5 py-0.5 text-xs text-center text-slate-200 focus:border-cyan-400 focus:outline-none tabular-nums"
            />
          </div>
        )}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'optimizer' && (
          <StatOptimizerPanel recipe={recipe} resourceMap={resourceMap} />
        )}
        {activeTab === 'chain' && (
          <ChainView
            recipe={recipe}
            quantity={quantity}
            recipeMap={recipeMap}
            recipeByOutput={recipeByOutput}
            resourceMap={resourceMap}
          />
        )}
      </div>
    </div>
  );
}
