/**
 * recipes-decor.ts
 * Decorative item and trophy recipes for the Lathe station.
 * One concern: confirmed decor recipe data from GUNC Wiki.
 *
 * All recipes confirmed from: https://wiki.gunc.org/index.php/Lathing
 * Decor items use tiered metals + stone combinations.
 */

import type { Recipe, RecipeIngredient } from '@/types/crafting';

/** Decor recipes — confirmed from GUNC wiki */
export const DECOR_RECIPES: Recipe[] = [
  // ── Structural decor ────────────────────────────────────────────
  decor('decor_column', 'Decor: Column', [
    { resourceId: 'sedimentary_rock', quantity: 5 },
    { resourceId: 'tier1_metal', quantity: 5 },
  ]),
  decor('decor_door_frame', 'Decor: Door Frame', [
    { resourceId: 'tier1_metal', quantity: 10 },
  ]),
  decor('decor_floor', 'Decor: Floor', [
    { resourceId: 'tier1_metal', quantity: 10 },
  ]),
  decor('decor_railing', 'Decor: Railing', [
    { resourceId: 'tier1_metal', quantity: 5 },
    { resourceId: 'tier2_metal', quantity: 5 },
  ]),
  decor('decor_ramp', 'Decor: Ramp', [
    { resourceId: 'tier1_metal', quantity: 10 },
  ]),
  decor('decor_stairs', 'Decor: Stairs', [
    { resourceId: 'tier1_metal', quantity: 10 },
    { resourceId: 'tier3_metal', quantity: 5 },
  ]),
  decor('decor_wall', 'Decor: Wall', [
    { resourceId: 'tier1_metal', quantity: 10 },
  ]),
  decor('decor_roof', 'Decor: Roof', [
    { resourceId: 'tier1_metal', quantity: 10 },
    { resourceId: 'tier2_metal', quantity: 5 },
  ]),

  // ── Light fixtures ──────────────────────────────────────────────
  decor('decor_light_blue', 'Decor: Light Blue', [
    { resourceId: 'glass', quantity: 5 },
    { resourceId: 'tier1_metal', quantity: 5 },
  ]),

  // ── Trophies ────────────────────────────────────────────────────
  trophy('trophy_ballhog', 'Trophy: Ballhog', 'chromium'),
  trophy('trophy_deer', 'Trophy: Deer', 'copper'),
  trophy('trophy_jackalope', 'Trophy: Jackalope', 'iron'),
  trophy('trophy_prowler', 'Trophy: Prowler', 'gold'),
];

// ── Helper factories ──────────────────────────────────────────────

function decor(
  id: string,
  name: string,
  ingredients: RecipeIngredient[],
): Recipe {
  return {
    id,
    name,
    description: `Decorative building piece crafted at the Lathe.`,
    stationId: 'lathe',
    branch: 'architect',
    ingredients,
    output: { itemId: id, name, quantity: 1, category: 'decor' },
    isIntermediate: false,
    complexity: 2,
    confirmed: true,
  };
}

function trophy(
  id: string,
  name: string,
  metalId: string,
): Recipe {
  return {
    id,
    name,
    description: `Decorative wall trophy crafted at the Lathe.`,
    stationId: 'lathe',
    branch: 'architect',
    ingredients: [{ resourceId: metalId, quantity: 5 }],
    output: { itemId: id, name, quantity: 1, category: 'decor' },
    isIntermediate: false,
    complexity: 2,
    confirmed: true,
  };
}
