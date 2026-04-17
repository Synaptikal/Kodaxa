/**
 * bom-calculator.ts
 * Computes the Bill of Materials from a set of placed cells.
 * One concern: aggregating tile costs and tracking homestead limits.
 */

import type {
  BillOfMaterials,
  PlacedCell,
  ResourceTotal,
  TileTotal,
} from '@/types/building';
import { ALL_TILES, TILE_CAP, TILE_CAP_WARNING, LIGHT_CAP, LIGHT_CAP_WARNING, getResourceMap } from '@/data/building';

export function calculateBom(cells: PlacedCell[]): BillOfMaterials {
  let totalTiles = 0;
  let totalLights = 0;

  const resourceMap = new Map<string, ResourceTotal>();
  const tileMap = new Map<string, TileTotal>();
  const resources = getResourceMap();

  for (const cell of cells) {
    const def = ALL_TILES.find((t) => t.id === cell.tileId);
    if (!def) continue;

    if (def.countedInCap) totalTiles++;
    if (def.isLight) totalLights++;

    // Track tile counts
    const tCount = tileMap.get(def.id) ?? {
      tileId: def.id,
      tileName: def.name,
      count: 0,
    };
    tCount.count++;
    tileMap.set(def.id, tCount);

    // Track resource costs
    for (const cost of def.cost) {
      const rId = cost.resourceId;
      const resDef = resources.get(rId);

      const rTotal = resourceMap.get(rId) ?? {
        resourceId: rId,
        resourceName: cost.resourceName,
        total: 0,
        hasEstimate: false,
        source: resDef?.source ?? 'mined',
        sourceHint: resDef?.sourceHint ?? '',
      };

      rTotal.total += cost.quantity;
      if (!def.costsConfirmed) {
        rTotal.hasEstimate = true;
      }

      resourceMap.set(rId, rTotal);
    }
  }

  return {
    totalTiles,
    totalLights,
    capWarning: totalTiles >= TILE_CAP_WARNING,
    capExceeded: totalTiles > TILE_CAP,
    lightWarning: totalLights >= LIGHT_CAP_WARNING,
    lightExceeded: totalLights > LIGHT_CAP,
    byResource: Array.from(resourceMap.values()).sort((a, b) => b.total - a.total),
    byTile: Array.from(tileMap.values()).sort((a, b) => b.count - a.count),
  };
}
