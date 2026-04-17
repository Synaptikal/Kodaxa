/**
 * paver.ts
 * Paver tile definitions for roads, paths, and parking areas.
 * One concern: Civil Engineering road tiles with confirmed costs.
 *
 * Paver is a Civil Engineering tool used to create roads and parking lots.
 * Road tiles connect homestead entry points and zone doorways.
 * Source: starsreach.com/es/home/?query-8-page=16 (Paver roads + parking)
 *
 * Note: Paver tiles placed inside the homestead claim count toward the 330-tile cap.
 * Road tiles placed outside the claim are out-of-bounds and flagged by the hazard analyzer.
 *
 * Costs: partially confirmed from Twilight Update civic crafting recipes.
 */

import type { TileDef } from '@/types/building';

export const PAVER_TILES: TileDef[] = [
  {
    id: 'paver_footpath',
    name: 'Footpath Tile',
    category: 'paver',
    subcategory: 'paths',
    color: '#52525b',
    cost: [
      { resourceId: 'stone', resourceName: 'Stone', quantity: 2 },
      { resourceId: 'sand', resourceName: 'Sand', quantity: 1 },
    ],
    requiredSkillId: 'civil_engineering.paving',
    requiredTree: 'civil_engineering',
    adhesion: 'moderate',
    countedInCap: true,
    isLight: false,
    costsConfirmed: false,
    description: 'Narrow path tile for pedestrian walkways. Requires Civil Engineering: Paving. ~approx cost.',
  },
  {
    id: 'paver_road_single',
    name: 'Single-Lane Road',
    category: 'paver',
    subcategory: 'roads',
    color: '#3f3f46',
    cost: [
      { resourceId: 'road_substrate', resourceName: 'Road Substrate', quantity: 3 },
    ],
    requiredSkillId: 'civil_engineering.road_building',
    requiredTree: 'civil_engineering',
    adhesion: 'cohesive',
    countedInCap: true,
    isLight: false,
    costsConfirmed: false,
    description: 'Single-lane road tile. Requires Civil Engineering: Road Building. ~approx cost.',
  },
  {
    id: 'paver_road_double',
    name: 'Two-Lane Road',
    category: 'paver',
    subcategory: 'roads',
    color: '#27272a',
    cost: [
      { resourceId: 'road_substrate', resourceName: 'Road Substrate', quantity: 5 },
    ],
    requiredSkillId: 'civil_engineering.road_building',
    requiredTree: 'civil_engineering',
    adhesion: 'cohesive',
    countedInCap: true,
    isLight: false,
    costsConfirmed: false,
    description: 'Two-lane road tile for vehicle access. Requires Civil Engineering: Road Building. ~approx cost.',
  },
  {
    id: 'paver_parking',
    name: 'Parking Lot Tile',
    category: 'paver',
    subcategory: 'roads',
    color: '#1c1c1e',
    cost: [
      { resourceId: 'road_substrate', resourceName: 'Road Substrate', quantity: 3 },
      { resourceId: 'concrete_mix', resourceName: 'Concrete Mix', quantity: 2 },
    ],
    requiredSkillId: 'civil_engineering.road_building',
    requiredTree: 'civil_engineering',
    adhesion: 'cohesive',
    countedInCap: true,
    isLight: false,
    costsConfirmed: false,
    description: 'Wide flat parking surface. Requires Civil Engineering: Road Building. ~approx cost.',
  },
  {
    id: 'paver_road_corner',
    name: 'Road Corner Tile',
    category: 'paver',
    subcategory: 'roads',
    color: '#3f3f46',
    cost: [
      { resourceId: 'road_substrate', resourceName: 'Road Substrate', quantity: 2 },
    ],
    requiredSkillId: 'civil_engineering.road_building',
    requiredTree: 'civil_engineering',
    adhesion: 'cohesive',
    countedInCap: true,
    isLight: false,
    costsConfirmed: false,
    description: '90° road corner connector. ~approx cost.',
  },
  {
    id: 'paver_road_tee',
    name: 'Road T-Junction',
    category: 'paver',
    subcategory: 'roads',
    color: '#3f3f46',
    cost: [
      { resourceId: 'road_substrate', resourceName: 'Road Substrate', quantity: 3 },
    ],
    requiredSkillId: 'civil_engineering.road_building',
    requiredTree: 'civil_engineering',
    adhesion: 'cohesive',
    countedInCap: true,
    isLight: false,
    costsConfirmed: false,
    description: 'T-intersection tile. ~approx cost.',
  },
];

/** Fast lookup by paver tile ID */
export function getPaverMap(): Map<string, TileDef> {
  return new Map(PAVER_TILES.map((t) => [t.id, t]));
}
