/**
 * blocks.ts
 * Instaformer block definitions with researched material costs.
 * One concern: providing accurate, source-linked block data for the BOM calculator.
 *
 * Tile cap constants (update these when the game changes them):
 *   TILE_CAP = 330 (total per homestead)
 *   TILE_CAP_WARNING = 270 (soft warning threshold)
 *   LIGHT_CAP = 30 (sub-limit for light tiles)
 *   LIGHT_CAP_WARNING = 25
 *
 * Sources (per tile):
 *   - starsreach.com/physics-midterm/ (adhesion classes, material behavior)
 *   - starsreach.com/building-system-upgrade/ (Instaformer shapes, 45° angles)
 *   - Twilight Update (Aug 2025) crafting recipe lists
 *   - University Update (Sep 2025) building tile models
 *   - costsConfirmed: false = estimate; shown with "~approx" badge in UI
 */

import type { TileDef } from '@/types/building';

/** Homestead tile cap — update here when game changes this value */
export const TILE_CAP = 330;
export const TILE_CAP_WARNING = 270;
export const LIGHT_CAP = 30;
export const LIGHT_CAP_WARNING = 25;

export const INSTAFORMER_BLOCKS: TileDef[] = [
  // ── Starter / unranked blocks (no skill lock) ─────────────────────

  {
    id: 'block_dirt',
    name: 'Dirt Block',
    category: 'instaformer',
    subcategory: 'blocks',
    color: '#7c5c3a',
    cost: [{ resourceId: 'dirt', resourceName: 'Dirt', quantity: 2 }],
    adhesion: 'brittle',
    countedInCap: true,
    isLight: false,
    costsConfirmed: true,
    description: 'Basic surface block. Brittle — avoid large unsupported spans.',
  },
  {
    id: 'block_sand',
    name: 'Sand Block',
    category: 'instaformer',
    subcategory: 'blocks',
    color: '#c8a96e',
    cost: [{ resourceId: 'sand', resourceName: 'Sand', quantity: 3 }],
    adhesion: 'brittle',
    countedInCap: true,
    isLight: false,
    costsConfirmed: true,
    description: 'Sandy fill block. Brittle — collapses easily in cavern spans.',
  },
  {
    id: 'block_shale',
    name: 'Shale Block',
    category: 'instaformer',
    subcategory: 'blocks',
    color: '#6b7280',
    cost: [{ resourceId: 'shale', resourceName: 'Shale', quantity: 3 }],
    adhesion: 'brittle',
    countedInCap: true,
    isLight: false,
    costsConfirmed: true,
    description: 'Brittle layered rock. Cheap, but collapses quickly in open spans.',
  },
  {
    id: 'block_stone',
    name: 'Stone Block',
    category: 'instaformer',
    subcategory: 'blocks',
    color: '#94a3b8',
    cost: [
      { resourceId: 'stone', resourceName: 'Stone', quantity: 4 },
      { resourceId: 'carnotite', resourceName: 'Carnotite', quantity: 1 },
    ],
    adhesion: 'cohesive',
    countedInCap: true,
    isLight: false,
    costsConfirmed: true,
    description: 'Cohesive structural block. Excellent for load-bearing walls and pillars.',
  },
  {
    id: 'block_pumice',
    name: 'Pumice Block',
    category: 'instaformer',
    subcategory: 'blocks',
    color: '#a1887f',
    cost: [{ resourceId: 'pumice', resourceName: 'Pumice', quantity: 3 }],
    adhesion: 'brittle',
    countedInCap: true,
    isLight: false,
    costsConfirmed: true,
    description: 'Lightweight volcanic stone. Brittle when used in wide spans.',
  },

  // ── Architect-tier blocks (require Architect skill tree) ──────────

  {
    id: 'block_wood',
    name: 'Wood Block',
    category: 'instaformer',
    subcategory: 'blocks',
    color: '#a0522d',
    cost: [{ resourceId: 'wood', resourceName: 'Wood', quantity: 4 }],
    requiredSkillId: 'architect.wood_building_set',
    requiredTree: 'architect',
    adhesion: 'moderate',
    countedInCap: true,
    isLight: false,
    costsConfirmed: true,
    description: 'Warm organic block. Requires Architect: Wood Building Set.',
  },
  {
    id: 'block_glass',
    name: 'Glass Block',
    category: 'instaformer',
    subcategory: 'blocks',
    color: '#7dd3fc',
    cost: [
      { resourceId: 'crystal_compound', resourceName: 'Crystal Compound', quantity: 4 },
    ],
    requiredSkillId: 'architect.glass_set',
    requiredTree: 'architect',
    adhesion: 'moderate',
    countedInCap: true,
    isLight: false,
    costsConfirmed: false, // Recipe unconfirmed — estimated from Crystal Compound pricing
    description: 'Transparent block. Requires Architect: Glass Set. ~approx cost.',
  },
  {
    id: 'block_metal',
    name: 'Metal Block',
    category: 'instaformer',
    subcategory: 'blocks',
    color: '#64748b',
    cost: [
      { resourceId: 'refined_metal_alloy', resourceName: 'Refined Metal Alloy', quantity: 3 },
      { resourceId: 'carnotite', resourceName: 'Carnotite', quantity: 1 },
    ],
    requiredSkillId: 'architect.metal_building_set',
    requiredTree: 'architect',
    adhesion: 'cohesive',
    countedInCap: true,
    isLight: false,
    costsConfirmed: true,
    description: 'Industrial metal block. High structural integrity. Requires Architect: Metal Building Set.',
  },
  {
    id: 'block_alloy',
    name: 'Alloy Block',
    category: 'instaformer',
    subcategory: 'blocks',
    color: '#475569',
    cost: [
      { resourceId: 'refined_alloy', resourceName: 'Refined Alloy', quantity: 4 },
      { resourceId: 'carnotite', resourceName: 'Carnotite', quantity: 2 },
    ],
    requiredSkillId: 'architect.advanced_alloy_set',
    requiredTree: 'architect',
    adhesion: 'cohesive',
    countedInCap: true,
    isLight: false,
    costsConfirmed: false, // Advanced alloy recipe partially confirmed
    description: 'Premium structural block. Best cohesion class. ~approx cost.',
  },
  {
    id: 'block_ferrocrete',
    name: 'Ferrocrete Block',
    category: 'instaformer',
    subcategory: 'blocks',
    color: '#78716c',
    cost: [
      { resourceId: 'ferrocrete', resourceName: 'Ferrocrete', quantity: 3 },
    ],
    requiredSkillId: 'architect.concrete_set',
    requiredTree: 'architect',
    adhesion: 'cohesive',
    countedInCap: true,
    isLight: false,
    costsConfirmed: false,
    description: 'Dense composite. Great for foundations. Requires Architect: Concrete Set. ~approx cost.',
  },

  // ── 45° angle variants (confirmed from Building System Upgrade blog) ─
  {
    id: 'block_stone_wedge',
    name: 'Stone Wedge (45°)',
    category: 'instaformer',
    subcategory: 'slopes',
    color: '#94a3b8',
    cost: [
      { resourceId: 'stone', resourceName: 'Stone', quantity: 2 },
      { resourceId: 'carnotite', resourceName: 'Carnotite', quantity: 1 },
    ],
    requiredSkillId: 'architect.stone_block_set',
    requiredTree: 'architect',
    adhesion: 'cohesive',
    countedInCap: true,
    isLight: false,
    costsConfirmed: false, // Wedge cost estimated at ~half full block
    description: '45° angled stone block for ramps and diagonal walls. ~approx cost.',
  },
  {
    id: 'block_metal_wedge',
    name: 'Metal Wedge (45°)',
    category: 'instaformer',
    subcategory: 'slopes',
    color: '#64748b',
    cost: [
      { resourceId: 'refined_metal_alloy', resourceName: 'Refined Metal Alloy', quantity: 2 },
      { resourceId: 'carnotite', resourceName: 'Carnotite', quantity: 1 },
    ],
    requiredSkillId: 'architect.metal_building_set',
    requiredTree: 'architect',
    adhesion: 'cohesive',
    countedInCap: true,
    isLight: false,
    costsConfirmed: false,
    description: '45° angled metal block. ~approx cost.',
  },
];

/** Fast lookup by block ID */
export function getBlockMap(): Map<string, TileDef> {
  return new Map(INSTAFORMER_BLOCKS.map((b) => [b.id, b]));
}
