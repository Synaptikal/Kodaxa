/**
 * recipes-refining.ts
 * Refinery and material processing recipes.
 * One concern: refining/transmutation recipe data.
 *
 * Confirmed mechanics from Better Homes & Gardens update:
 *   - Oil can be created from ANY sedimentary rock
 *   - Oil and Plastic recipes unlocked by default
 *   - Clay created from Chalky or Laterite soil (Clay Ore removed)
 *   - Ceramic fired from Clay
 *   - Antimatter Gas can be collected and converted
 *
 * Many of the 400+ refinery recipes are not yet publicly documented.
 * These are the confirmed ones — more will be added as data surfaces.
 */

import type { Recipe } from '@/types/crafting';

/** Refining recipes — confirmed from dev blogs and wiki */
export const REFINING_RECIPES: Recipe[] = [
  // ── Oil chain ───────────────────────────────────────────────────
  {
    id: 'refine_oil',
    name: 'Refine: Oil',
    description: 'Convert any sedimentary rock into oil at the Refinery. Unlocked by default.',
    stationId: 'refinery',
    branch: 'refining',
    ingredients: [{ resourceId: 'sedimentary_rock', quantity: 10, anyInCategory: 'stone' }],
    output: { itemId: 'oil', name: 'Oil', quantity: 1, category: 'material' },
    isIntermediate: true,
    usedIn: ['refine_plastic'],
    complexity: 1,
    confirmed: true,
  },
  {
    id: 'refine_plastic',
    name: 'Refine: Plastic',
    description: 'Convert oil into plastic at the Refinery. Unlocked by default.',
    stationId: 'refinery',
    branch: 'refining',
    ingredients: [{ resourceId: 'oil', quantity: 5 }],
    output: { itemId: 'plastic', name: 'Plastic', quantity: 1, category: 'material' },
    isIntermediate: true,
    dependsOn: ['refine_oil'],
    complexity: 2,
    confirmed: true,
  },

  // ── Clay chain ──────────────────────────────────────────────────
  {
    id: 'refine_clay_chalky',
    name: 'Refine: Clay (from Chalky Soil)',
    description: 'Convert chalky soil into clay at the Refinery.',
    stationId: 'refinery',
    branch: 'refining',
    ingredients: [{ resourceId: 'chalky_soil', quantity: 10 }],
    output: { itemId: 'clay', name: 'Clay', quantity: 1, category: 'material' },
    isIntermediate: true,
    usedIn: ['refine_ceramic'],
    complexity: 1,
    confirmed: true,
  },
  {
    id: 'refine_clay_laterite',
    name: 'Refine: Clay (from Laterite Soil)',
    description: 'Convert laterite soil into clay at the Refinery.',
    stationId: 'refinery',
    branch: 'refining',
    ingredients: [{ resourceId: 'laterite_soil', quantity: 10 }],
    output: { itemId: 'clay', name: 'Clay', quantity: 1, category: 'material' },
    isIntermediate: true,
    usedIn: ['refine_ceramic'],
    complexity: 1,
    confirmed: true,
  },
  {
    id: 'refine_ceramic',
    name: 'Refine: Ceramic',
    description: 'Fire clay into ceramic at the Refinery.',
    stationId: 'refinery',
    branch: 'refining',
    ingredients: [{ resourceId: 'clay', quantity: 5 }],
    output: { itemId: 'ceramic', name: 'Ceramic', quantity: 1, category: 'material' },
    isIntermediate: true,
    dependsOn: ['refine_clay_chalky', 'refine_clay_laterite'],
    complexity: 2,
    confirmed: true,
  },

  // ── Glass ───────────────────────────────────────────────────────
  {
    id: 'refine_glass',
    name: 'Refine: Glass',
    description: 'Melt sand into glass at the Refinery.',
    stationId: 'refinery',
    branch: 'refining',
    ingredients: [{ resourceId: 'sandstone', quantity: 10 }],
    output: { itemId: 'glass', name: 'Glass', quantity: 1, category: 'material' },
    isIntermediate: true,
    complexity: 1,
    confirmed: true,
  },
];
