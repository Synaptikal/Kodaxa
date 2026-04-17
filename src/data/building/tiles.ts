/**
 * tiles.ts
 * Fabricator tile definitions for the Base Building Planner.
 * One concern: structural and decorative Fabricator pieces with skill requirements.
 *
 * Fabricator tiles are placed on the homestead as walls, floors, roofs, windows,
 * doors, and decorative primitives. Unlike Instaformer blocks (cube-only), Fabricator
 * tiles include primitives (arcs, rods, spheres) and detail props.
 *
 * Sources:
 *   - starsreach.com/building-system-upgrade/ (primitive shapes, glass walls)
 *   - Twilight Update (Aug 2025) — Architect tree assignments
 *   - Crucible Update (Nov 2025) — 2×2 floors, 1×1 rugs added
 *   - Haven Update (Dec 2025) — concave floor/ceiling tiles added
 *   - costsConfirmed: false = estimate, shown with "~approx" in BOM
 */

import type { TileDef } from '@/types/building';

export const FABRICATOR_TILES: TileDef[] = [
  // ── Basic structural (starter — no skill lock) ─────────────────────

  {
    id: 'fab_floor_1x1',
    name: 'Floor Tile (1×1)',
    category: 'fabricator',
    subcategory: 'structural',
    color: '#374151',
    cost: [
      { resourceId: 'concrete_mix', resourceName: 'Concrete Mix', quantity: 2 },
    ],
    adhesion: 'moderate',
    countedInCap: true,
    isLight: false,
    costsConfirmed: false,
    description: 'Basic 1×1 floor tile. Starter piece — no skill required.',
  },
  {
    id: 'fab_wall_1x1',
    name: 'Wall Panel (1×1)',
    category: 'fabricator',
    subcategory: 'walls',
    color: '#4b5563',
    cost: [
      { resourceId: 'concrete_mix', resourceName: 'Concrete Mix', quantity: 3 },
    ],
    adhesion: 'moderate',
    countedInCap: true,
    isLight: false,
    costsConfirmed: false,
    description: 'Standard wall panel. Starter piece.',
  },

  // ── Architect-tier structural ─────────────────────────────────────

  {
    id: 'fab_floor_2x2',
    name: 'Wide Floor Tile (2×2)',
    category: 'fabricator',
    subcategory: 'structural',
    color: '#374151',
    cost: [
      { resourceId: 'concrete_mix', resourceName: 'Concrete Mix', quantity: 6 },
    ],
    requiredSkillId: 'architect.advanced_tiles',
    requiredTree: 'architect',
    adhesion: 'moderate',
    countedInCap: true,
    isLight: false,
    costsConfirmed: false,
    description: '2×2 floor tile added in the Crucible Update. Requires Architect: Advanced Tiles.',
  },
  {
    id: 'fab_floor_concave',
    name: 'Concave Floor Tile',
    category: 'fabricator',
    subcategory: 'structural',
    color: '#374151',
    cost: [
      { resourceId: 'poly_composite', resourceName: 'Poly-Composite', quantity: 3 },
    ],
    requiredSkillId: 'architect.advanced_tiles',
    requiredTree: 'architect',
    adhesion: 'moderate',
    countedInCap: true,
    isLight: false,
    costsConfirmed: false,
    description: 'Curved floor for domed rooms. Added in Haven Update. Requires Architect: Advanced Tiles. ~approx cost.',
  },
  {
    id: 'fab_ceiling_concave',
    name: 'Concave Ceiling Tile',
    category: 'fabricator',
    subcategory: 'structural',
    color: '#374151',
    cost: [
      { resourceId: 'poly_composite', resourceName: 'Poly-Composite', quantity: 3 },
    ],
    requiredSkillId: 'architect.advanced_tiles',
    requiredTree: 'architect',
    adhesion: 'moderate',
    countedInCap: true,
    isLight: false,
    costsConfirmed: false,
    description: 'Curved ceiling. Added in Haven Update. ~approx cost.',
  },
  {
    id: 'fab_glass_wall',
    name: 'Glass Wall (1×1)',
    category: 'fabricator',
    subcategory: 'walls',
    color: '#7dd3fc',
    cost: [
      { resourceId: 'hardened_glass', resourceName: 'Hardened Glass', quantity: 3 },
    ],
    requiredSkillId: 'architect.glass_set',
    requiredTree: 'architect',
    adhesion: 'moderate',
    countedInCap: true,
    isLight: false,
    costsConfirmed: false,
    description: 'Transparent wall panel. Requires Architect: Glass Set. ~approx cost.',
  },
  {
    id: 'fab_glass_wall_large',
    name: 'Large Glass Wall (2×1)',
    category: 'fabricator',
    subcategory: 'walls',
    color: '#bae6fd',
    cost: [
      { resourceId: 'hardened_glass', resourceName: 'Hardened Glass', quantity: 5 },
    ],
    requiredSkillId: 'architect.glass_set',
    requiredTree: 'architect',
    adhesion: 'moderate',
    countedInCap: true,
    isLight: false,
    costsConfirmed: false,
    description: 'Wide glass wall spanning 2 units. Requires Architect: Glass Set. ~approx cost.',
  },
  {
    id: 'fab_glass_corner',
    name: 'Glass Corner',
    category: 'fabricator',
    subcategory: 'walls',
    color: '#93c5fd',
    cost: [
      { resourceId: 'hardened_glass', resourceName: 'Hardened Glass', quantity: 2 },
    ],
    requiredSkillId: 'architect.glass_set',
    requiredTree: 'architect',
    adhesion: 'moderate',
    countedInCap: true,
    isLight: false,
    costsConfirmed: false,
    description: 'Corner glass panel for enclosed rooms. Requires Architect: Glass Set. ~approx cost.',
  },
  {
    id: 'fab_window',
    name: 'Window Panel',
    category: 'fabricator',
    subcategory: 'walls',
    color: '#e0f2fe',
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
    description: 'Framed window for walls. Requires Architect: Glass Set. ~approx cost.',
  },
  {
    id: 'fab_door',
    name: 'Door (Animated)',
    category: 'fabricator',
    subcategory: 'access',
    color: '#a16207',
    cost: [
      { resourceId: 'timber_plank', resourceName: 'Timber Plank', quantity: 4 },
      { resourceId: 'refined_metal_alloy', resourceName: 'Refined Metal Alloy', quantity: 2 },
    ],
    requiredSkillId: 'architect.advanced_tiles',
    requiredTree: 'architect',
    adhesion: 'moderate',
    countedInCap: true,
    isLight: false,
    costsConfirmed: false,
    description: 'Animated hinged door. Detail prop — cannot be assembled from primitives. ~approx cost.',
  },
  {
    id: 'fab_rug_1x1',
    name: 'Rug (1×1)',
    category: 'fabricator',
    subcategory: 'decor',
    color: '#7c3aed',
    cost: [
      { resourceId: 'timber_plank', resourceName: 'Timber Plank', quantity: 1 },
    ],
    requiredSkillId: 'architect.advanced_tiles',
    requiredTree: 'architect',
    adhesion: 'moderate',
    countedInCap: true,
    isLight: false,
    costsConfirmed: false,
    description: 'Decorative rug added in the Crucible Update. ~approx cost.',
  },

  // ── Fabricator primitives (Building System Upgrade shapes) ─────────

  {
    id: 'fab_arc',
    name: 'Arc Primitive',
    category: 'fabricator',
    subcategory: 'structural',
    color: '#6b7280',
    cost: [
      { resourceId: 'poly_composite', resourceName: 'Poly-Composite', quantity: 2 },
    ],
    requiredSkillId: 'architect.fabricator_primitives',
    requiredTree: 'architect',
    adhesion: 'moderate',
    countedInCap: true,
    isLight: false,
    costsConfirmed: false,
    description: 'Curved arc shape for arched doorways and vaulted ceilings. ~approx cost.',
  },
  {
    id: 'fab_rod',
    name: 'Rod Primitive',
    category: 'fabricator',
    subcategory: 'supports',
    color: '#6b7280',
    cost: [
      { resourceId: 'refined_metal_alloy', resourceName: 'Refined Metal Alloy', quantity: 1 },
    ],
    requiredSkillId: 'architect.fabricator_primitives',
    requiredTree: 'architect',
    adhesion: 'cohesive',
    countedInCap: true,
    isLight: false,
    costsConfirmed: false,
    description: 'Thin cylindrical rod for railings and supports. ~approx cost.',
  },
  {
    id: 'fab_sphere',
    name: 'Sphere Primitive',
    category: 'fabricator',
    subcategory: 'decor',
    color: '#6b7280',
    cost: [
      { resourceId: 'poly_composite', resourceName: 'Poly-Composite', quantity: 2 },
    ],
    requiredSkillId: 'architect.fabricator_primitives',
    requiredTree: 'architect',
    adhesion: 'moderate',
    countedInCap: true,
    isLight: false,
    costsConfirmed: false,
    description: 'Spherical decorative element or dome cap. ~approx cost.',
  },

  // ── Lights (count toward light sub-cap of 30) ─────────────────────

  {
    id: 'fab_light_wall',
    name: 'Wall Light',
    category: 'fabricator',
    subcategory: 'lighting',
    color: '#fef08a',
    cost: [
      { resourceId: 'crystal_compound', resourceName: 'Crystal Compound', quantity: 2 },
      { resourceId: 'refined_metal_alloy', resourceName: 'Refined Metal Alloy', quantity: 1 },
    ],
    requiredSkillId: 'architect.advanced_tiles',
    requiredTree: 'architect',
    adhesion: 'moderate',
    countedInCap: true,
    isLight: true,
    costsConfirmed: false,
    description: 'Mounted wall light. Counts toward the 30-light homestead sub-cap. ~approx cost.',
  },
  {
    id: 'fab_light_ceiling',
    name: 'Ceiling Light',
    category: 'fabricator',
    subcategory: 'lighting',
    color: '#fef08a',
    cost: [
      { resourceId: 'crystal_compound', resourceName: 'Crystal Compound', quantity: 2 },
      { resourceId: 'refined_metal_alloy', resourceName: 'Refined Metal Alloy', quantity: 1 },
    ],
    requiredSkillId: 'architect.advanced_tiles',
    requiredTree: 'architect',
    adhesion: 'moderate',
    countedInCap: true,
    isLight: true,
    costsConfirmed: false,
    description: 'Hanging ceiling light. Counts toward the 30-light sub-cap. ~approx cost.',
  },
  {
    id: 'fab_light_floor',
    name: 'Floor Light (Inset)',
    category: 'fabricator',
    subcategory: 'lighting',
    color: '#fde68a',
    cost: [
      { resourceId: 'crystal_compound', resourceName: 'Crystal Compound', quantity: 1 },
      { resourceId: 'refined_metal_alloy', resourceName: 'Refined Metal Alloy', quantity: 1 },
    ],
    requiredSkillId: 'architect.advanced_tiles',
    requiredTree: 'architect',
    adhesion: 'moderate',
    countedInCap: true,
    isLight: true,
    costsConfirmed: false,
    description: 'Inset floor lighting. Counts toward the 30-light sub-cap. ~approx cost.',
  },

  // ── Decor props ───────────────────────────────────────────────────

  {
    id: 'fab_desktop_computer',
    name: 'Desktop Computer',
    category: 'fabricator',
    subcategory: 'decor',
    color: '#1e293b',
    cost: [
      { resourceId: 'poly_composite', resourceName: 'Poly-Composite', quantity: 3 },
      { resourceId: 'crystal_compound', resourceName: 'Crystal Compound', quantity: 1 },
    ],
    requiredSkillId: 'architect.advanced_tiles',
    requiredTree: 'architect',
    adhesion: 'moderate',
    countedInCap: true,
    isLight: false,
    costsConfirmed: false,
    description: 'Decorative desktop computer added in the Open Horizon Update. ~approx cost.',
  },
  {
    id: 'fab_cabinet',
    name: 'Short Cabinet',
    category: 'fabricator',
    subcategory: 'decor',
    color: '#78350f',
    cost: [
      { resourceId: 'timber_plank', resourceName: 'Timber Plank', quantity: 3 },
    ],
    requiredSkillId: 'architect.advanced_tiles',
    requiredTree: 'architect',
    adhesion: 'moderate',
    countedInCap: true,
    isLight: false,
    costsConfirmed: false,
    description: 'Short storage cabinet added in Open Horizon. ~approx cost.',
  },
];

/** Fast lookup by tile ID */
export function getFabricatorMap(): Map<string, TileDef> {
  return new Map(FABRICATOR_TILES.map((t) => [t.id, t]));
}
