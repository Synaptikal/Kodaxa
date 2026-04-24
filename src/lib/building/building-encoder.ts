/**
 * building-encoder.ts
 * Encode/decode BuildingState to/from URL-safe strings.
 * One concern: enabling shareable URLs without a backend.
 */

import type { BuildingState, ClaimLayer } from '@/types/building';

const DEFAULT_LAYERS: ClaimLayer[] = [
  { index: -2, label: 'Basement 2', color: 'bg-stone-900' },
  { index: -1, label: 'Basement 1', color: 'bg-stone-800' },
  { index: 0,  label: 'Ground Floor', color: 'bg-stone-700' },
  { index: 1,  label: 'Floor 1', color: 'bg-stone-600' },
  { index: 2,  label: 'Floor 2', color: 'bg-stone-600' },
  { index: 3,  label: 'Roof', color: 'bg-stone-500' },
];

export function emptyBuildingState(): BuildingState {
  return {
    name: 'My Homestead',
    claimX: 10,
    claimZ: 10,
    hiddenLayers: [],
    layers: DEFAULT_LAYERS,
    activeLayer: 0,
    cells: [],
    selectedTileId: null,
    mode: 'place',
    currentRotation: 0,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Cell format: x.y.z.rot,tileId — rows separated by "~"
 * URL params:
 *   n  = name
 *   cx = claimX (omit if 10)
 *   cz = claimZ (omit if 10)
 *   al = activeLayer (omit if 0)
 *   hl = hiddenLayers comma-separated (omit if empty)
 *   l  = customized layer labels: idx.label~idx.label
 *   c  = cells
 */
export function encodeBuildingState(state: BuildingState): string {
  const params = new URLSearchParams();

  if (state.name !== 'My Homestead') {
    params.set('n', state.name);
  }

  if ((state.claimX ?? 10) !== 10) {
    params.set('cx', String(state.claimX));
  }
  if ((state.claimZ ?? 10) !== 10) {
    params.set('cz', String(state.claimZ));
  }

  if (state.activeLayer !== 0) {
    params.set('al', state.activeLayer.toString());
  }

  const hiddenLayers = state.hiddenLayers ?? [];
  if (hiddenLayers.length > 0) {
    params.set('hl', hiddenLayers.join(','));
  }

  if (state.cells.length > 0) {
    const compactCells = state.cells
      .map((c) => `${c.x}.${c.y}.${c.z}.${c.rotation || 0},${c.tileId}`)
      .join('~');
    params.set('c', compactCells);
  }

  // Only encode layer names if they've been customized
  const customLayers = state.layers.filter(
    (l, i) => l.label !== DEFAULT_LAYERS[i]?.label
  );
  if (customLayers.length > 0) {
    const encodedLayers = customLayers
      .map((l) => `${l.index}.${encodeURIComponent(l.label)}`)
      .join('~');
    params.set('l', encodedLayers);
  }

  return params.toString();
}

/** Decode URL params back into full state */
export function decodeBuildingState(searchParams: URLSearchParams): BuildingState {
  const state = emptyBuildingState();

  if (!searchParams) return state;

  const n = searchParams.get('n');
  if (n) state.name = n;

  const cx = searchParams.get('cx');
  if (cx) state.claimX = Math.max(4, Math.min(32, parseInt(cx, 10) || 10));

  const cz = searchParams.get('cz');
  if (cz) state.claimZ = Math.max(4, Math.min(32, parseInt(cz, 10) || 10));

  const al = searchParams.get('al');
  if (al) state.activeLayer = parseInt(al, 10) || 0;

  const hl = searchParams.get('hl');
  if (hl) {
    state.hiddenLayers = hl
      .split(',')
      .map((s) => parseInt(s, 10))
      .filter((n) => !isNaN(n));
  }

  const c = searchParams.get('c');
  if (c) {
    state.cells = c.split('~').map((chunk, i) => {
      const parts = chunk.split('.');
      const tail = parts.slice(3).join('.');

      let rotation = 0;
      let tileId = tail;

      const commaIdx = tail.indexOf(',');
      if (commaIdx !== -1) {
        const rotStr = tail.substring(0, commaIdx);
        const parsed = parseInt(rotStr, 10);
        if (!isNaN(parsed)) {
          rotation = parsed;
          tileId = tail.substring(commaIdx + 1);
        }
      }

      return {
        id: `cell_${Date.now()}_${i}`,
        x: parseInt(parts[0], 10),
        y: parseInt(parts[1], 10),
        z: parseInt(parts[2], 10),
        rotation,
        tileId,
      };
    });
  }

  const l = searchParams.get('l');
  if (l) {
    l.split('~').forEach((chunk) => {
      const parts = chunk.split('.');
      const index = parseInt(parts[0], 10);
      const label = decodeURIComponent(parts[1]);
      const layer = state.layers.find((ly) => ly.index === index);
      if (layer) layer.label = label;
    });
  }

  return state;
}

export function generateBuildingShareUrl(state: BuildingState, origin: string): string {
  const encoded = encodeBuildingState(state);
  return `${origin}/building${encoded ? `?${encoded}` : ''}`;
}
