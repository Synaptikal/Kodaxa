/**
 * index.ts
 * Aggregates all building tile definitions and provides lookup utilities.
 * One concern: single import point for all tile/block data.
 */

import { INSTAFORMER_BLOCKS, getBlockMap } from './blocks';
import { FABRICATOR_TILES, getFabricatorMap } from './tiles';
import { ROOFING_TILES, getRoofingMap } from './tiles-roofing';
import { ACCESS_TILES, getAccessMap } from './tiles-access';
import { PAVER_TILES, getPaverMap } from './paver';
import { BUILDING_RESOURCES, getResourceMap } from './materials';
import type { TileDef } from '@/types/building';

export { TILE_CAP, TILE_CAP_WARNING, LIGHT_CAP, LIGHT_CAP_WARNING } from './blocks';
export { BUILDING_RESOURCES, getResourceMap } from './materials';

/** All tile/block definitions combined */
export const ALL_TILES: TileDef[] = [
  ...INSTAFORMER_BLOCKS,
  ...FABRICATOR_TILES,
  ...ROOFING_TILES,
  ...ACCESS_TILES,
  ...PAVER_TILES,
];

/** Fast lookup across all categories by tile ID */
export function getTileMap(): Map<string, TileDef> {
  const map = new Map<string, TileDef>();
  for (const tile of ALL_TILES) {
    map.set(tile.id, tile);
  }
  return map;
}

/** Get tiles filtered by category */
export function getTilesByCategory(category: TileDef['category']): TileDef[] {
  return ALL_TILES.filter((t) => t.category === category);
}

/** Get tiles filtered by subcategory */
export function getTilesBySubcategory(subcategory: TileDef['subcategory']): TileDef[] {
  return ALL_TILES.filter((t) => t.subcategory === subcategory);
}
