import { useReducer, useCallback } from 'react';
import type { BuildingState, BuildingAction } from '@/types/building';
import { emptyBuildingState } from '@/lib/building/building-encoder';

const MAX_HISTORY = 20;

interface StateWithHistory {
  current: BuildingState;
  past: BuildingState[];
  future: BuildingState[];
}

function buildingReducer(state: BuildingState, action: BuildingAction): BuildingState {
  switch (action.type) {
    case 'SET_NAME':
      return { ...state, name: action.name };

    case 'SET_ACTIVE_LAYER':
      return { ...state, activeLayer: action.layer };

    case 'SET_MODE':
      return { ...state, mode: action.mode };

    case 'SELECT_TILE':
      return { ...state, selectedTileId: action.tileId, mode: action.tileId ? 'place' : state.mode };

    case 'ROTATE_TILE':
      return { ...state, currentRotation: ((state.currentRotation ?? 0) + 1) % 4 };

    case 'RENAME_LAYER':
      return {
        ...state,
        layers: state.layers.map(l =>
          l.index === action.index ? { ...l, label: action.label } : l
        )
      };

    case 'SET_CLAIM_SIZE': {
      // Clamp to valid range (4×4 min, 32×32 max)
      const clampedX = Math.max(4, Math.min(32, action.claimX));
      const clampedZ = Math.max(4, Math.min(32, action.claimZ));
      // Trim any cells that now fall outside the new claim bounds
      const cells = state.cells.filter(
        c => c.x >= 0 && c.x < clampedX && c.z >= 0 && c.z < clampedZ
      );
      return {
        ...state,
        claimX: clampedX,
        claimZ: clampedZ,
        cells,
        updatedAt: new Date().toISOString()
      };
    }

    case 'TOGGLE_LAYER_VISIBILITY': {
      const hiddenLayers = state.hiddenLayers ?? [];
      const isHidden = hiddenLayers.includes(action.index);
      return {
        ...state,
        hiddenLayers: isHidden
          ? hiddenLayers.filter(i => i !== action.index)
          : [...hiddenLayers, action.index]
      };
    }

    case 'PLACE_CELL': {
      if (!state.selectedTileId) return state;

      // Remove any existing cell at this location first
      const cells = state.cells.filter(c =>
        !(c.x === action.x && c.y === action.y && c.z === action.z)
      );

      cells.push({
        id: `cell_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        tileId: state.selectedTileId,
        x: action.x,
        y: action.y,
        z: action.z,
        rotation: state.currentRotation ?? 0
      });

      return { ...state, cells, updatedAt: new Date().toISOString() };
    }

    case 'ERASE_CELL': {
      const cells = state.cells.filter(c =>
        !(c.x === action.x && c.y === action.y && c.z === action.z)
      );

      if (cells.length === state.cells.length) return state;
      return { ...state, cells, updatedAt: new Date().toISOString() };
    }

    case 'PLACE_CELL_BATCH': {
      if (!state.selectedTileId || action.coords.length === 0) return state;

      const coordsSet = new Set(action.coords.map(c => `${c.x},${c.y},${c.z}`));
      let cells = state.cells.filter(c => !coordsSet.has(`${c.x},${c.y},${c.z}`));

      const newCells = action.coords.map((c, i) => ({
        id: `cell_${Date.now()}_${i}_${Math.random().toString(36).substring(2, 6)}`,
        tileId: state.selectedTileId!,
        x: c.x,
        y: c.y,
        z: c.z,
        rotation: state.currentRotation ?? 0
      }));

      cells = [...cells, ...newCells];
      return { ...state, cells, updatedAt: new Date().toISOString() };
    }

    case 'ERASE_CELL_BATCH': {
      const cells = state.cells.filter(c => {
        if (c.y !== action.y) return true;
        if (c.x >= action.minX && c.x <= action.maxX && c.z >= action.minZ && c.z <= action.maxZ) {
          return false;
        }
        return true;
      });
      if (cells.length === state.cells.length) return state;
      return { ...state, cells, updatedAt: new Date().toISOString() };
    }

    case 'EYEDROP_CELL': {
      const cell = state.cells.find(c => c.x === action.x && c.y === action.y && c.z === action.z);
      if (!cell) return state;
      return { ...state, selectedTileId: cell.tileId, mode: 'place', currentRotation: cell.rotation || 0 };
    }

    case 'PICK_UP_CELL': {
      const cellIndex = state.cells.findIndex(c => c.x === action.x && c.y === action.y && c.z === action.z);
      if (cellIndex === -1) return state;
      const cell = state.cells[cellIndex];
      const cells = [...state.cells];
      cells.splice(cellIndex, 1);
      return {
        ...state,
        cells,
        selectedTileId: cell.tileId,
        mode: 'place',
        currentRotation: cell.rotation || 0,
        updatedAt: new Date().toISOString()
      };
    }

    case 'LOAD_STATE':
      return action.state;

    case 'RESET':
      return emptyBuildingState();

    default:
      return state;
  }
}

function historyReducer(state: StateWithHistory, action: BuildingAction): StateWithHistory {
  if (action.type === 'UNDO') {
    if (state.past.length === 0) return state;
    const previous = state.past[state.past.length - 1];
    const newPast = state.past.slice(0, state.past.length - 1);
    return {
      current: previous,
      past: newPast,
      future: [state.current, ...state.future]
    };
  }

  if (action.type === 'REDO') {
    if (state.future.length === 0) return state;
    const next = state.future[0];
    const newFuture = state.future.slice(1);
    return {
      current: next,
      past: [...state.past, state.current],
      future: newFuture
    };
  }

  const nextCurrent = buildingReducer(state.current, action);

  if (nextCurrent === state.current) return state;

  // History tracking: place/erase/claim-resize/reset/load create undo points
  const createsHistory = [
    'PLACE_CELL', 'ERASE_CELL', 'PLACE_CELL_BATCH', 'ERASE_CELL_BATCH',
    'SET_CLAIM_SIZE', 'RESET', 'LOAD_STATE'
  ].includes(action.type);

  if (createsHistory) {
    const newPast = [...state.past, state.current].slice(-MAX_HISTORY);
    return {
      current: nextCurrent,
      past: newPast,
      future: []
    };
  }

  return {
    ...state,
    current: nextCurrent
  };
}

export function useBuildingState(initialState?: BuildingState) {
  const [state, dispatch] = useReducer(historyReducer, {
    current: initialState || emptyBuildingState(),
    past: [],
    future: []
  });

  const canUndo = state.past.length > 0;
  const canRedo = state.future.length > 0;

  const setName           = useCallback((name: string) => dispatch({ type: 'SET_NAME', name }), []);
  const setActiveLayer    = useCallback((layer: number) => dispatch({ type: 'SET_ACTIVE_LAYER', layer }), []);
  const setMode           = useCallback((mode: BuildingState['mode']) => dispatch({ type: 'SET_MODE', mode }), []);
  const selectTile        = useCallback((tileId: string | null) => dispatch({ type: 'SELECT_TILE', tileId }), []);
  const placeCell         = useCallback((x: number, y: number, z: number) => dispatch({ type: 'PLACE_CELL', x, y, z }), []);
  const placeCellBatch    = useCallback((coords: {x:number, y:number, z:number}[]) => dispatch({ type: 'PLACE_CELL_BATCH', coords }), []);
  const eraseCell         = useCallback((x: number, y: number, z: number) => dispatch({ type: 'ERASE_CELL', x, y, z }), []);
  const eraseCellBatch    = useCallback((y: number, minX: number, maxX: number, minZ: number, maxZ: number) => dispatch({ type: 'ERASE_CELL_BATCH', y, minX, maxX, minZ, maxZ }), []);
  const eyedropCell       = useCallback((x: number, y: number, z: number) => dispatch({ type: 'EYEDROP_CELL', x, y, z }), []);
  const pickUpCell        = useCallback((x: number, y: number, z: number) => dispatch({ type: 'PICK_UP_CELL', x, y, z }), []);
  const renameLayer       = useCallback((index: number, label: string) => dispatch({ type: 'RENAME_LAYER', index, label }), []);
  const rotateTile        = useCallback(() => dispatch({ type: 'ROTATE_TILE' }), []);
  const setClaimSize      = useCallback((claimX: number, claimZ: number) => dispatch({ type: 'SET_CLAIM_SIZE', claimX, claimZ }), []);
  const toggleLayerVisibility = useCallback((index: number) => dispatch({ type: 'TOGGLE_LAYER_VISIBILITY', index }), []);

  const undo      = useCallback(() => dispatch({ type: 'UNDO' }), []);
  const redo      = useCallback(() => dispatch({ type: 'REDO' }), []);
  const reset     = useCallback(() => dispatch({ type: 'RESET' }), []);
  const loadState = useCallback((s: BuildingState) => dispatch({ type: 'LOAD_STATE', state: s }), []);

  return {
    state: state.current,
    canUndo,
    canRedo,
    dispatch,
    setName,
    setActiveLayer,
    setMode,
    selectTile,
    placeCell,
    placeCellBatch,
    eraseCell,
    eraseCellBatch,
    eyedropCell,
    pickUpCell,
    renameLayer,
    rotateTile,
    setClaimSize,
    toggleLayerVisibility,
    undo,
    redo,
    reset,
    loadState,
  };
}
