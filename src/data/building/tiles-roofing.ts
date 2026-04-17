/**
 * tiles-roofing.ts
 * Fabricator roofing tile definitions.
 * One concern: roof-specific pieces — slopes, ridges, hips, gables, flat caps.
 *
 * Roofing tiles are assembled from Fabricator using the Architect skill tree.
 * Slope variants shed rain and support load distribution along the ridge axis.
 * Hip and gable corners terminate a sloped run without requiring filler blocks.
 *
 * All costs are estimates (costsConfirmed: false) — official roofing recipes
 * have not appeared in patch notes as of the University Update (Sep 2025).
 * Cost assumptions are based on equivalent structural tile recipes scaled by
 * surface area (slope ≈ 1.5× floor tile, ridge/hip ≈ 0.75× slope).
 *
 * Sources:
 *   - starsreach.com/building-system-upgrade/ (roofing primitives mentioned)
 *   - Twilight Update (Aug 2025) Architect tree — roofing node confirmed
 *   - University Update (Sep 2025) — pitched roof shapes visible in preview
 */

import type { TileDef } from '@/types/building';

export const ROOFING_TILES: TileDef[] = [
  // ── Stone roofing ────────────────────────────────────────────────

  {
    id: 'roof_slope_stone',
    name: 'Stone Roof Slope',
    category: 'fabricator',
    subcategory: 'roofing',
    color: '#94a3b8',
    cost: [
      { resourceId: 'stone', resourceName: 'Stone', quantity: 3 },
      { resourceId: 'carnotite', resourceName: 'Carnotite', quantity: 1 },
    ],
    requiredSkillId: 'architect.roofing_set',
    requiredTree: 'architect',
    adhesion: 'cohesive',
    countedInCap: true,
    isLight: false,
    costsConfirmed: false,
    description: 'Pitched stone slope tile. Attach to wall tops to form a gabled roof. ~approx cost.',
  },
  {
    id: 'roof_ridge_stone',
    name: 'Stone Roof Ridge',
    category: 'fabricator',
    subcategory: 'roofing',
    color: '#94a3b8',
    cost: [
      { resourceId: 'stone', resourceName: 'Stone', quantity: 2 },
      { resourceId: 'carnotite', resourceName: 'Carnotite', quantity: 1 },
    ],
    requiredSkillId: 'architect.roofing_set',
    requiredTree: 'architect',
    adhesion: 'cohesive',
    countedInCap: true,
    isLight: false,
    costsConfirmed: false,
    description: 'Stone ridge cap that seals two opposing slopes at the apex. ~approx cost.',
  },
  {
    id: 'roof_hip_stone',
    name: 'Stone Hip Corner',
    category: 'fabricator',
    subcategory: 'roofing',
    color: '#94a3b8',
    cost: [
      { resourceId: 'stone', resourceName: 'Stone', quantity: 2 },
      { resourceId: 'carnotite', resourceName: 'Carnotite', quantity: 1 },
    ],
    requiredSkillId: 'architect.roofing_set',
    requiredTree: 'architect',
    adhesion: 'cohesive',
    countedInCap: true,
    isLight: false,
    costsConfirmed: false,
    description: 'Stone hip corner — terminates slope runs at a 45° building corner. ~approx cost.',
  },
  {
    id: 'roof_gable_stone',
    name: 'Stone Gable End',
    category: 'fabricator',
    subcategory: 'roofing',
    color: '#94a3b8',
    cost: [
      { resourceId: 'stone', resourceName: 'Stone', quantity: 2 },
      { resourceId: 'carnotite', resourceName: 'Carnotite', quantity: 1 },
    ],
    requiredSkillId: 'architect.roofing_set',
    requiredTree: 'architect',
    adhesion: 'cohesive',
    countedInCap: true,
    isLight: false,
    costsConfirmed: false,
    description: 'Triangular gable end panel that closes off the end of a pitched roof. ~approx cost.',
  },

  // ── Wood roofing ─────────────────────────────────────────────────

  {
    id: 'roof_slope_wood',
    name: 'Wood Roof Slope',
    category: 'fabricator',
    subcategory: 'roofing',
    color: '#a0522d',
    cost: [
      { resourceId: 'timber_plank', resourceName: 'Timber Plank', quantity: 4 },
    ],
    requiredSkillId: 'architect.roofing_set',
    requiredTree: 'architect',
    adhesion: 'moderate',
    countedInCap: true,
    isLight: false,
    costsConfirmed: false,
    description: 'Pitched timber slope tile for warm rustic structures. ~approx cost.',
  },
  {
    id: 'roof_ridge_wood',
    name: 'Wood Roof Ridge',
    category: 'fabricator',
    subcategory: 'roofing',
    color: '#a0522d',
    cost: [
      { resourceId: 'timber_plank', resourceName: 'Timber Plank', quantity: 2 },
    ],
    requiredSkillId: 'architect.roofing_set',
    requiredTree: 'architect',
    adhesion: 'moderate',
    countedInCap: true,
    isLight: false,
    costsConfirmed: false,
    description: 'Timber ridge cap sealing two opposing wood slopes. ~approx cost.',
  },
  {
    id: 'roof_hip_wood',
    name: 'Wood Hip Corner',
    category: 'fabricator',
    subcategory: 'roofing',
    color: '#a0522d',
    cost: [
      { resourceId: 'timber_plank', resourceName: 'Timber Plank', quantity: 2 },
    ],
    requiredSkillId: 'architect.roofing_set',
    requiredTree: 'architect',
    adhesion: 'moderate',
    countedInCap: true,
    isLight: false,
    costsConfirmed: false,
    description: 'Timber hip corner for 45° building corners. ~approx cost.',
  },
  {
    id: 'roof_gable_wood',
    name: 'Wood Gable End',
    category: 'fabricator',
    subcategory: 'roofing',
    color: '#a0522d',
    cost: [
      { resourceId: 'timber_plank', resourceName: 'Timber Plank', quantity: 2 },
    ],
    requiredSkillId: 'architect.roofing_set',
    requiredTree: 'architect',
    adhesion: 'moderate',
    countedInCap: true,
    isLight: false,
    costsConfirmed: false,
    description: 'Triangular timber gable end for pitched roofs. ~approx cost.',
  },

  // ── Metal roofing ────────────────────────────────────────────────

  {
    id: 'roof_slope_metal',
    name: 'Metal Roof Slope',
    category: 'fabricator',
    subcategory: 'roofing',
    color: '#64748b',
    cost: [
      { resourceId: 'refined_metal_alloy', resourceName: 'Refined Metal Alloy', quantity: 3 },
      { resourceId: 'carnotite', resourceName: 'Carnotite', quantity: 1 },
    ],
    requiredSkillId: 'architect.roofing_set',
    requiredTree: 'architect',
    adhesion: 'cohesive',
    countedInCap: true,
    isLight: false,
    costsConfirmed: false,
    description: 'Industrial corrugated metal slope panel. ~approx cost.',
  },
  {
    id: 'roof_ridge_metal',
    name: 'Metal Roof Ridge',
    category: 'fabricator',
    subcategory: 'roofing',
    color: '#64748b',
    cost: [
      { resourceId: 'refined_metal_alloy', resourceName: 'Refined Metal Alloy', quantity: 2 },
      { resourceId: 'carnotite', resourceName: 'Carnotite', quantity: 1 },
    ],
    requiredSkillId: 'architect.roofing_set',
    requiredTree: 'architect',
    adhesion: 'cohesive',
    countedInCap: true,
    isLight: false,
    costsConfirmed: false,
    description: 'Metal ridge flashing for apex of a pitched roof. ~approx cost.',
  },
  {
    id: 'roof_hip_metal',
    name: 'Metal Hip Corner',
    category: 'fabricator',
    subcategory: 'roofing',
    color: '#64748b',
    cost: [
      { resourceId: 'refined_metal_alloy', resourceName: 'Refined Metal Alloy', quantity: 2 },
      { resourceId: 'carnotite', resourceName: 'Carnotite', quantity: 1 },
    ],
    requiredSkillId: 'architect.roofing_set',
    requiredTree: 'architect',
    adhesion: 'cohesive',
    countedInCap: true,
    isLight: false,
    costsConfirmed: false,
    description: 'Metal hip corner for angular industrial rooflines. ~approx cost.',
  },

  // ── Flat cap (material-agnostic) ─────────────────────────────────

  {
    id: 'roof_flat_cap',
    name: 'Flat Roof Cap',
    category: 'fabricator',
    subcategory: 'roofing',
    color: '#475569',
    cost: [
      { resourceId: 'ferrocrete', resourceName: 'Ferrocrete', quantity: 3 },
      { resourceId: 'poly_composite', resourceName: 'Poly-Composite', quantity: 1 },
    ],
    requiredSkillId: 'architect.roofing_set',
    requiredTree: 'architect',
    adhesion: 'cohesive',
    countedInCap: true,
    isLight: false,
    costsConfirmed: false,
    description: 'Waterproof flat roof cap for modern/brutalist builds. ~approx cost.',
  },
];

/** Fast lookup by roofing tile ID */
export function getRoofingMap(): Map<string, TileDef> {
  return new Map(ROOFING_TILES.map((t) => [t.id, t]));
}
