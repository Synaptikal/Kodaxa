/**
 * demo.ts
 * Prebuilt demo homestead state for the Building Planner.
 * One concern: giving first-time visitors a populated canvas that shows
 * claim sizing, multiple layers, BOM, and skill requirements in action.
 *
 * Structure: 6×6 claim, two floors.
 *   Ground (y=0) — stone perimeter + interior floor tiles
 *   Floor 1 (y=1) — wood upper walls with entrance gap
 * Triggers: BOM (stone + floor tile + wood), Skill Req (architect.wood_building_set)
 */

import type { BuildingState, PlacedCell, ClaimLayer } from '@/types/building';

const DEFAULT_LAYERS: ClaimLayer[] = [
  { index: -2, label: 'Basement 2',  color: 'bg-stone-900' },
  { index: -1, label: 'Basement 1',  color: 'bg-stone-800' },
  { index: 0,  label: 'Ground Floor', color: 'bg-stone-700' },
  { index: 1,  label: 'Floor 1',     color: 'bg-stone-600' },
  { index: 2,  label: 'Floor 2',     color: 'bg-stone-600' },
  { index: 3,  label: 'Roof',        color: 'bg-stone-500' },
];

function buildDemoCells(): PlacedCell[] {
  const cells: PlacedCell[] = [];
  let n = 0;
  const c = (tileId: string, x: number, y: number, z: number): PlacedCell => ({
    id: `demo_${n++}`,
    tileId,
    x, y, z,
    rotation: 0,
  });

  // Ground floor (y=0) — stone perimeter
  for (let x = 0; x < 6; x++) {
    cells.push(c('block_stone', x, 0, 0)); // front wall
    cells.push(c('block_stone', x, 0, 5)); // back wall
  }
  for (let z = 1; z < 5; z++) {
    cells.push(c('block_stone', 0, 0, z)); // left wall
    cells.push(c('block_stone', 5, 0, z)); // right wall
  }

  // Ground floor interior — floor tiles
  for (let x = 1; x < 5; x++) {
    for (let z = 1; z < 5; z++) {
      cells.push(c('fab_floor_1x1', x, 0, z));
    }
  }

  // Floor 1 (y=1) — wood walls with entrance gap at front (x=2,3)
  for (let x = 0; x < 6; x++) {
    cells.push(c('block_wood', x, 1, 5)); // back wall
  }
  ([0, 1, 4, 5] as const).forEach((x) => cells.push(c('block_wood', x, 1, 0)));
  for (let z = 1; z < 5; z++) {
    cells.push(c('block_wood', 0, 1, z)); // left wall
    cells.push(c('block_wood', 5, 1, z)); // right wall
  }

  return cells;
}

export const DEMO_STATE: BuildingState = {
  name: 'Starter Homestead',
  claimX: 6,
  claimZ: 6,
  hiddenLayers: [],
  layers: DEFAULT_LAYERS,
  activeLayer: 0,
  cells: buildDemoCells(),
  selectedTileId: null,
  mode: 'place',
  currentRotation: 0,
  updatedAt: new Date().toISOString(),
};
