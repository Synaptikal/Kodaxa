/**
 * materials.ts
 * Raw resource definitions for the Base Building Planner.
 * One concern: mapping resource IDs to display names and acquisition hints.
 *
 * Used by the BOM panel to show "where to get this" context alongside quantities.
 * Every resourceId referenced in blocks.ts, tiles.ts, or paver.ts must appear here.
 *
 * Sources:
 *   - starsreach.com/mining-in-stars-reach/
 *   - starsreach.com/physics-midterm/
 *   - Twilight Update crafting recipes (Aug 2025)
 *   - Crucible Update material changes (Nov 2025)
 */

import type { ResourceDef } from '@/types/building';

export const BUILDING_RESOURCES: ResourceDef[] = [
  // ── Mined raw materials ──────────────────────────────────────────
  {
    id: 'dirt',
    name: 'Dirt',
    source: 'mined',
    sourceHint: 'Mine surface soil with the Terraformer',
  },
  {
    id: 'sand',
    name: 'Sand',
    source: 'mined',
    sourceHint: 'Mine sandy terrain deposits with the Terraformer',
  },
  {
    id: 'stone',
    name: 'Stone',
    source: 'mined',
    sourceHint: 'Mine stone strata underground with the Terraformer',
  },
  {
    id: 'shale',
    name: 'Shale',
    source: 'mined',
    sourceHint: 'Mine brittle shale deposits; found below surface stone',
  },
  {
    id: 'pumice',
    name: 'Pumice',
    source: 'mined',
    sourceHint: 'Volcanic brittle rock; found near thermal vents',
  },
  {
    id: 'wood',
    name: 'Wood',
    source: 'mined',
    sourceHint: 'Harvest trees on your homestead with the Xyloslicer',
  },
  {
    id: 'crystal_compound',
    name: 'Crystal Compound',
    source: 'refined',
    sourceHint: 'Refine raw crystals (Siliex, Vitraite) at a Refining Station',
  },
  {
    id: 'carnotite',
    name: 'Carnotite',
    source: 'mined',
    sourceHint: 'Rare radioactive mineral; found in deep ore veins',
  },

  // ── Refined materials ─────────────────────────────────────────────
  {
    id: 'refined_metal_alloy',
    name: 'Refined Metal Alloy',
    source: 'refined',
    sourceHint: 'Smelt raw metal ores (Ferron, Cobaltite) at a Smelting Station',
  },
  {
    id: 'refined_alloy',
    name: 'Refined Alloy',
    source: 'refined',
    sourceHint: 'Advanced alloy; smelt refined metals with Carnotite flux',
  },
  {
    id: 'poly_composite',
    name: 'Poly-Composite',
    source: 'crafted',
    sourceHint: 'Craft at a Fabrication Station from processed polymers',
  },
  {
    id: 'hardened_glass',
    name: 'Hardened Glass',
    source: 'refined',
    sourceHint: 'Fuse Crystal Compound and Sand at a Smelting Station',
  },
  {
    id: 'timber_plank',
    name: 'Timber Plank',
    source: 'crafted',
    sourceHint: 'Process Wood at a Woodworking Station',
  },
  {
    id: 'concrete_mix',
    name: 'Concrete Mix',
    source: 'crafted',
    sourceHint: 'Craft from Stone, Sand, and Carnotite binder at a Mixing Station',
  },
  {
    id: 'road_substrate',
    name: 'Road Substrate',
    source: 'crafted',
    sourceHint: 'Craft from Stone and Concrete Mix at a Civil Station',
  },
  {
    id: 'ferrocrete',
    name: 'Ferrocrete',
    source: 'crafted',
    sourceHint: 'Heavy composite; craft from Refined Metal Alloy and Concrete Mix',
  },
];

/** Fast resource lookup by ID */
export function getResourceMap(): Map<string, ResourceDef> {
  return new Map(BUILDING_RESOURCES.map((r) => [r.id, r]));
}
