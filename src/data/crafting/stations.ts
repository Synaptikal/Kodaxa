/**
 * stations.ts
 * Crafting station definitions for Stars Reach.
 * One concern: defining all known crafting stations.
 *
 * Confirmed stations from:
 *   - GUNC Wiki (Lathing page)
 *   - Better Homes & Gardens update
 *   - starsreach.wiki/Crafting
 */

import type { CraftingStation } from '@/types/crafting';

export const CRAFTING_STATIONS: CraftingStation[] = [
  {
    id: 'lathe',
    name: 'Lathe',
    description:
      'Primary crafting station for blocks, decor, pavers, and general construction items. Used across Architect and Civil Engineering branches.',
    skillBranch: 'architect',
  },
  {
    id: 'stove',
    name: 'Stove',
    description:
      'Cooking station for food items. Generates Cooking XP exclusively. Separated from the main Crafting tree.',
    skillBranch: 'cooking',
  },
  {
    id: 'toolmaker',
    name: 'Toolmaker',
    description:
      'Station for crafting profession tools and equipment. Linked to the Toolmaking branch.',
    skillBranch: 'toolmaking',
  },
  {
    id: 'refinery',
    name: 'Refinery',
    description:
      'Transmutation station for refining ores into metals, creating alloys, and converting materials. 400+ recipes. Unlocked via the Refining branch under Mineralogy.',
    skillBranch: 'refining',
  },
];

/** Map for fast station lookups */
export function getStationMap(): Map<string, CraftingStation> {
  const map = new Map<string, CraftingStation>();
  for (const station of CRAFTING_STATIONS) {
    map.set(station.id, station);
  }
  return map;
}
