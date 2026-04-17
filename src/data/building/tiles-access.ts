/**
 * tiles-access.ts
 * Fabricator access and structural support tile definitions.
 * One concern: stairs, ramps, landings, pillars, railings — vertical movement and
 *              structural articulation pieces.
 *
 * Access tiles let players move between floors and define structural framing.
 * Pillars carry load notation in the hazard analyzer.
 * Railings occupy one tile unit but are treated as open (non-blocking) by pathfinding.
 *
 * All costs are estimates (costsConfirmed: false) — access tile recipes have not
 * appeared in confirmed patch notes. Estimates based on:
 *   - Stair ≈ 2× wall panel cost (mass + joint labor)
 *   - Pillar ≈ 1.5× block cost (load-rated dense pour)
 *   - Railing ≈ 0.75× wall cost (open frame)
 *   - Landing ≈ floor tile cost
 *
 * Sources:
 *   - starsreach.com/building-system-upgrade/ (stair and ramp shapes mentioned)
 *   - Twilight Update (Aug 2025) Architect tree — stairs node visible
 *   - University Update (Sep 2025) — pillar primitives in preview screenshots
 */

import type { TileDef } from '@/types/building';

export const ACCESS_TILES: TileDef[] = [
  // ── Stairs ───────────────────────────────────────────────────────

  {
    id: 'access_stair_stone',
    name: 'Stone Stairs',
    category: 'fabricator',
    subcategory: 'access',
    color: '#94a3b8',
    cost: [
      { resourceId: 'stone', resourceName: 'Stone', quantity: 6 },
      { resourceId: 'carnotite', resourceName: 'Carnotite', quantity: 2 },
    ],
    requiredSkillId: 'architect.access_set',
    requiredTree: 'architect',
    adhesion: 'cohesive',
    countedInCap: true,
    isLight: false,
    costsConfirmed: false,
    description: 'One-unit-wide stone stair flight. Connects two adjacent floor layers. ~approx cost.',
  },
  {
    id: 'access_stair_wood',
    name: 'Wood Stairs',
    category: 'fabricator',
    subcategory: 'access',
    color: '#a0522d',
    cost: [
      { resourceId: 'timber_plank', resourceName: 'Timber Plank', quantity: 6 },
    ],
    requiredSkillId: 'architect.access_set',
    requiredTree: 'architect',
    adhesion: 'moderate',
    countedInCap: true,
    isLight: false,
    costsConfirmed: false,
    description: 'Timber stair flight for rustic interiors. ~approx cost.',
  },
  {
    id: 'access_stair_metal',
    name: 'Metal Stairs',
    category: 'fabricator',
    subcategory: 'access',
    color: '#64748b',
    cost: [
      { resourceId: 'refined_metal_alloy', resourceName: 'Refined Metal Alloy', quantity: 5 },
      { resourceId: 'carnotite', resourceName: 'Carnotite', quantity: 2 },
    ],
    requiredSkillId: 'architect.access_set',
    requiredTree: 'architect',
    adhesion: 'cohesive',
    countedInCap: true,
    isLight: false,
    costsConfirmed: false,
    description: 'Industrial metal grate stair flight. ~approx cost.',
  },

  // ── Stair landing ────────────────────────────────────────────────

  {
    id: 'access_landing',
    name: 'Stair Landing',
    category: 'fabricator',
    subcategory: 'access',
    color: '#4b5563',
    cost: [
      { resourceId: 'concrete_mix', resourceName: 'Concrete Mix', quantity: 3 },
    ],
    requiredSkillId: 'architect.access_set',
    requiredTree: 'architect',
    adhesion: 'moderate',
    countedInCap: true,
    isLight: false,
    costsConfirmed: false,
    description: 'Flat landing platform for multi-flight staircases or elevated entries. ~approx cost.',
  },

  // ── Ramps ────────────────────────────────────────────────────────

  {
    id: 'access_ramp_stone',
    name: 'Stone Ramp',
    category: 'fabricator',
    subcategory: 'access',
    color: '#94a3b8',
    cost: [
      { resourceId: 'stone', resourceName: 'Stone', quantity: 5 },
      { resourceId: 'carnotite', resourceName: 'Carnotite', quantity: 1 },
    ],
    requiredSkillId: 'architect.access_set',
    requiredTree: 'architect',
    adhesion: 'cohesive',
    countedInCap: true,
    isLight: false,
    costsConfirmed: false,
    description: 'Gradual stone ramp for vehicle and cart access between levels. ~approx cost.',
  },
  {
    id: 'access_ramp_metal',
    name: 'Metal Ramp',
    category: 'fabricator',
    subcategory: 'access',
    color: '#64748b',
    cost: [
      { resourceId: 'refined_metal_alloy', resourceName: 'Refined Metal Alloy', quantity: 4 },
      { resourceId: 'carnotite', resourceName: 'Carnotite', quantity: 1 },
    ],
    requiredSkillId: 'architect.access_set',
    requiredTree: 'architect',
    adhesion: 'cohesive',
    countedInCap: true,
    isLight: false,
    costsConfirmed: false,
    description: 'Industrial metal ramp with grated surface. ~approx cost.',
  },

  // ── Pillars / columns ────────────────────────────────────────────

  {
    id: 'support_pillar_stone',
    name: 'Stone Pillar',
    category: 'fabricator',
    subcategory: 'supports',
    color: '#94a3b8',
    cost: [
      { resourceId: 'stone', resourceName: 'Stone', quantity: 5 },
      { resourceId: 'carnotite', resourceName: 'Carnotite', quantity: 2 },
    ],
    requiredSkillId: 'architect.support_set',
    requiredTree: 'architect',
    adhesion: 'cohesive',
    countedInCap: true,
    isLight: false,
    costsConfirmed: false,
    description: 'Vertical stone column. Load-bearing — reduces collapse risk radius for adjacent spans. ~approx cost.',
  },
  {
    id: 'support_pillar_wood',
    name: 'Wood Post',
    category: 'fabricator',
    subcategory: 'supports',
    color: '#a0522d',
    cost: [
      { resourceId: 'timber_plank', resourceName: 'Timber Plank', quantity: 4 },
    ],
    requiredSkillId: 'architect.support_set',
    requiredTree: 'architect',
    adhesion: 'moderate',
    countedInCap: true,
    isLight: false,
    costsConfirmed: false,
    description: 'Timber post column. Moderate load support for residential builds. ~approx cost.',
  },
  {
    id: 'support_pillar_metal',
    name: 'Metal Column',
    category: 'fabricator',
    subcategory: 'supports',
    color: '#475569',
    cost: [
      { resourceId: 'refined_metal_alloy', resourceName: 'Refined Metal Alloy', quantity: 4 },
      { resourceId: 'carnotite', resourceName: 'Carnotite', quantity: 2 },
    ],
    requiredSkillId: 'architect.support_set',
    requiredTree: 'architect',
    adhesion: 'cohesive',
    countedInCap: true,
    isLight: false,
    costsConfirmed: false,
    description: 'Structural steel I-beam column. Highest single-tile load rating. ~approx cost.',
  },
  {
    id: 'support_pillar_cap_stone',
    name: 'Stone Column Cap',
    category: 'fabricator',
    subcategory: 'supports',
    color: '#94a3b8',
    cost: [
      { resourceId: 'stone', resourceName: 'Stone', quantity: 2 },
      { resourceId: 'carnotite', resourceName: 'Carnotite', quantity: 1 },
    ],
    requiredSkillId: 'architect.support_set',
    requiredTree: 'architect',
    adhesion: 'cohesive',
    countedInCap: true,
    isLight: false,
    costsConfirmed: false,
    description: 'Decorative capital that tops a stone pillar. Does not add load support. ~approx cost.',
  },

  // ── Railings / balustrades ────────────────────────────────────────

  {
    id: 'access_railing_wood',
    name: 'Wood Railing',
    category: 'fabricator',
    subcategory: 'access',
    color: '#a0522d',
    cost: [
      { resourceId: 'timber_plank', resourceName: 'Timber Plank', quantity: 2 },
    ],
    requiredSkillId: 'architect.access_set',
    requiredTree: 'architect',
    adhesion: 'moderate',
    countedInCap: true,
    isLight: false,
    costsConfirmed: false,
    description: 'Open timber balustrade. Occupies one tile but does not block pathing. ~approx cost.',
  },
  {
    id: 'access_railing_metal',
    name: 'Metal Railing',
    category: 'fabricator',
    subcategory: 'access',
    color: '#64748b',
    cost: [
      { resourceId: 'refined_metal_alloy', resourceName: 'Refined Metal Alloy', quantity: 2 },
    ],
    requiredSkillId: 'architect.access_set',
    requiredTree: 'architect',
    adhesion: 'cohesive',
    countedInCap: true,
    isLight: false,
    costsConfirmed: false,
    description: 'Industrial pipe railing for walkways, balconies, and bridges. ~approx cost.',
  },
  {
    id: 'access_railing_glass',
    name: 'Glass Railing',
    category: 'fabricator',
    subcategory: 'access',
    color: '#bae6fd',
    cost: [
      { resourceId: 'hardened_glass', resourceName: 'Hardened Glass', quantity: 2 },
      { resourceId: 'refined_metal_alloy', resourceName: 'Refined Metal Alloy', quantity: 1 },
    ],
    requiredSkillId: 'architect.glass_set',
    requiredTree: 'architect',
    adhesion: 'moderate',
    countedInCap: true,
    isLight: false,
    costsConfirmed: false,
    description: 'Frameless glass balustrade for modern homesteads. ~approx cost.',
  },
];

/** Fast lookup by access/support tile ID */
export function getAccessMap(): Map<string, TileDef> {
  return new Map(ACCESS_TILES.map((t) => [t.id, t]));
}
