/**
 * recipes-blocks.ts
 * Block and paver recipes for the Lathe station.
 * One concern: confirmed recipe data from GUNC Wiki Lathing page.
 *
 * All recipes confirmed from: https://wiki.gunc.org/index.php/Lathing
 * Format: 20 raw material → 1 block (standard ratio)
 */

import type { Recipe } from '@/types/crafting';

/** Block recipes — confirmed from GUNC wiki */
export const BLOCK_RECIPES: Recipe[] = [
  // ── Metal blocks ────────────────────────────────────────────────
  block('block_aluminum', 'Block: Aluminum', [{ resourceId: 'aluminum', quantity: 20 }]),
  block('block_steel_panel', 'Block: Steel Panel', [
    { resourceId: 'carbon', quantity: 10 },
    { resourceId: 'iron', quantity: 10 },
  ]),
  block('block_brass_panel', 'Block: Brass Panel', [
    { resourceId: 'copper', quantity: 10 },
    { resourceId: 'zinc', quantity: 10 },
  ]),
  block('block_anti_gravium', 'Block: Anti-Gravium', [
    { resourceId: 'anti_gravium', quantity: 20 },
  ]),

  // ── Stone blocks ────────────────────────────────────────────────
  block('block_granite', 'Block: Granite', [{ resourceId: 'granite', quantity: 20 }]),
  block('block_marble', 'Block: Marble', [{ resourceId: 'marble', quantity: 20 }]),
  block('block_slate', 'Block: Slate', [{ resourceId: 'slate', quantity: 20 }]),
  block('block_sandstone', 'Block: Sandstone', [{ resourceId: 'sandstone', quantity: 20 }]),
  block('block_diorite', 'Block: Diorite', [{ resourceId: 'diorite', quantity: 20 }]),
  block('block_gabbro', 'Block: Gabbro', [{ resourceId: 'gabbro', quantity: 20 }]),
  block('block_gneiss', 'Block: Gneiss', [{ resourceId: 'gneiss', quantity: 20 }]),
  block('block_breccia', 'Block: Breccia', [{ resourceId: 'breccia', quantity: 20 }]),
  block('block_conglomerate', 'Block: Conglomerate', [{ resourceId: 'conglomerate', quantity: 20 }]),
  block('block_glass', 'Block: Glass', [{ resourceId: 'glass', quantity: 20 }]),

  // ── Pavers ──────────────────────────────────────────────────────
  paver('paver_cobblestone', 'Paver: Cobblestone', [{ resourceId: 'granite', quantity: 20 }]),
  paver('paver_dirt', 'Paver: Dirt', [{ resourceId: 'soil', quantity: 20 }]),
  paver('paver_slate', 'Paver: Slate', [{ resourceId: 'slate', quantity: 20 }]),
];

// ── Helper factories ──────────────────────────────────────────────

function block(
  id: string,
  name: string,
  ingredients: { resourceId: string; quantity: number }[],
): Recipe {
  return {
    id,
    name,
    description: `Craft ${name} at the Lathe.`,
    stationId: 'lathe',
    branch: 'architect',
    ingredients: ingredients.map((i) => ({ ...i })),
    output: { itemId: id, name, quantity: 1, category: 'block' },
    isIntermediate: false,
    complexity: 1,
    confirmed: true,
  };
}

function paver(
  id: string,
  name: string,
  ingredients: { resourceId: string; quantity: number }[],
): Recipe {
  return {
    id,
    name,
    description: `Craft ${name} ground surface at the Lathe.`,
    stationId: 'lathe',
    branch: 'architect',
    ingredients: ingredients.map((i) => ({ ...i })),
    output: { itemId: id, name, quantity: 1, category: 'paver' },
    isIntermediate: false,
    complexity: 1,
    confirmed: true,
  };
}
