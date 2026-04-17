/**
 * building.ts
 * Core data types for the Stars Reach Base Building Planner.
 * One concern: defining the shape of all building state and tile data.
 *
 * Sources:
 *   - Game tile caps: starsreach.com (Sep 2025 update — 330 tiles, 30 lights)
 *   - Material adhesion classes: starsreach.com/physics-midterm/
 *   - Skill tree assignments: starsreach.com/twilight-update-notes/ (Twilight Aug 2025)
 */

// ── Tile & Material definitions ─────────────────────────────────────

/** Which building palette tab this tile belongs to */
export type TileCategory = 'instaformer' | 'fabricator' | 'paver';

/**
 * Subcategory within each palette tab — drives grouped display in palette.
 * Instaformer: 'blocks' | 'slopes'
 * Fabricator:  'structural' | 'roofing' | 'walls' | 'access' | 'supports' | 'lighting' | 'decor'
 * Paver:       'paths' | 'roads'
 */
export type TileSubcategory =
  | 'blocks' | 'slopes'
  | 'structural' | 'roofing' | 'walls' | 'access' | 'supports' | 'lighting' | 'decor'
  | 'paths' | 'roads';

/**
 * Material adhesion class — drives the structural hazard analyzer.
 * brittle: shale, dirt, pumice — collapses easily
 * moderate: wood, glass, sand — medium tolerance
 * cohesive: stone, metal, gems — survives longest unsupported spans
 * Source: starsreach.com/physics-midterm/
 */
export type AdhesionClass = 'brittle' | 'moderate' | 'cohesive';

/** Which skill tree is required to unlock a tile */
export type RequiredTree =
  | 'architect'
  | 'civil_engineering'
  | 'mineralogy'
  | 'forestry';

/** A single raw-material cost entry for crafting one unit of a tile */
export interface MaterialCost {
  resourceId: string;
  resourceName: string;
  quantity: number;
}

/** A tile/block definition — drives the palette, BOM calculator, and hazard analyzer */
export interface TileDef {
  id: string;
  name: string;
  category: TileCategory;
  /** Subcategory for grouped palette display */
  subcategory: TileSubcategory;
  /** Hex color for the 3D mesh and palette swatch */
  color: string;
  /** Raw material cost to place one unit of this tile */
  cost: MaterialCost[];
  /** Which skill node must be learnable to use this tile (for UI flagging only) */
  requiredSkillId?: string;
  requiredTree?: RequiredTree;
  /** Material adhesion — drives cavern stability thresholds */
  adhesion: AdhesionClass;
  /** Whether this tile counts toward the 330-tile homestead cap */
  countedInCap: boolean;
  /** Whether this tile is a light (sub-cap of 30 within the main cap) */
  isLight: boolean;
  /**
   * false = material cost is an approximation; shows "~approx" badge in BOM.
   * Set this to false for any entry not confirmed in official patch notes.
   */
  costsConfirmed: boolean;
  /** Short tooltip description */
  description?: string;
}

/** A raw resource that can appear as a crafting input */
export interface ResourceDef {
  id: string;
  name: string;
  /** How the player obtains this resource */
  source: 'mined' | 'refined' | 'crafted' | 'looted';
  /** Short hint shown in BOM panel */
  sourceHint: string;
}

// ── Claim & placement state ──────────────────────────────────────────

/** A floor/stratum layer within the 3D claim volume */
export interface ClaimLayer {
  /** Layer index: negative = underground, 0 = ground, positive = above-ground */
  index: number;
  /** Display label (editable by player) */
  label: string;
  /** Tailwind CSS color class for the layer's color swatch in the UI */
  color: string;
}

/** A single placed block/tile at a specific 3D grid position */
export interface PlacedCell {
  /** UUID — unique per placed instance */
  id: string;
  /** References TileDef.id */
  tileId: string;
  /** Grid column (0 to claimX-1) */
  x: number;
  /** Layer index (matches ClaimLayer.index) */
  y: number;
  /** Grid row (0 to claimZ-1) */
  z: number;
  /** Yaw rotation in 90-degree steps (0=0, 1=1, 2=180, 3=270) */
  rotation: number;
}

// ── Computed outputs ─────────────────────────────────────────────────

/** Bill of Materials — computed from placed cells */
export interface BillOfMaterials {
  totalTiles: number;
  totalLights: number;
  /** Approaching 330 cap (>= 270 tiles) */
  capWarning: boolean;
  /** Cap exceeded (> 330 tiles) */
  capExceeded: boolean;
  /** Approaching 30-light sub-cap (>= 25 lights) */
  lightWarning: boolean;
  /** Light sub-cap exceeded (> 30 lights) */
  lightExceeded: boolean;
  /** Aggregated resource requirements, sorted by quantity desc */
  byResource: ResourceTotal[];
  /** Per-tile-type placement counts */
  byTile: TileTotal[];
}

export interface ResourceTotal {
  resourceId: string;
  resourceName: string;
  total: number;
  /** True if any contributing tile has costsConfirmed: false */
  hasEstimate: boolean;
  source: ResourceDef['source'];
  sourceHint: string;
}

export interface TileTotal {
  tileId: string;
  tileName: string;
  count: number;
}

/** Hazard severity */
export type HazardType = 'collapse_risk' | 'collapse_warning' | 'out_of_bounds';

/** A detected structural or boundary hazard */
export interface HazardZone {
  id: string;
  type: HazardType;
  /** Grid positions of all affected cells */
  cells: { x: number; y: number; z: number }[];
  message: string;
}

/** Required skill node derived from placed cells */
export interface RequiredSkillEntry {
  skillId: string;
  skillLabel: string;
  tree: RequiredTree;
  /** How many tiles require this skill */
  tileCount: number;
}

// ── Editor state ─────────────────────────────────────────────────────

/** Current interaction mode */
export type BuildingMode = 'place' | 'erase' | 'pan' | 'fill' | 'select' | 'eyedropper' | 'measure';

/** Full serializable building state — stored in useReducer, encoded in URL */
export interface BuildingState {
  name: string;
  /** Claim width in grid units (X axis) — configurable, default 10 */
  claimX: number;
  /** Claim depth in grid units (Z axis) — configurable, default 10 */
  claimZ: number;
  /** Layers whose cells are hidden in the viewport (set of layer indices) */
  hiddenLayers: number[];
  /** All defined layers, sorted by index ascending */
  layers: ClaimLayer[];
  /** Index of the layer currently being edited */
  activeLayer: number;
  /** All placed cells across all layers */
  cells: PlacedCell[];
  /** Currently selected tile ID from the palette (null = nothing selected) */
  selectedTileId: string | null;
  /** Active edit mode */
  mode: BuildingMode;
  /** Current 90-degree yaw rotation (0=0, 1=90, 2=180, 3=270) */
  currentRotation: number;
  updatedAt: string;
}

/** All dispatchable actions for the building reducer */
export type BuildingAction =
  | { type: 'SET_NAME'; name: string }
  | { type: 'SET_ACTIVE_LAYER'; layer: number }
  | { type: 'SET_MODE'; mode: BuildingMode }
  | { type: 'SELECT_TILE'; tileId: string | null }
  | { type: 'PLACE_CELL'; x: number; y: number; z: number }
  | { type: 'PLACE_CELL_BATCH'; coords: { x: number; y: number; z: number }[] }
  | { type: 'ERASE_CELL'; x: number; y: number; z: number }
  | { type: 'ERASE_CELL_BATCH'; minX: number; maxX: number; minZ: number; maxZ: number; y: number }
  | { type: 'PICK_UP_CELL'; x: number; y: number; z: number }
  | { type: 'EYEDROP_CELL'; x: number; y: number; z: number }
  | { type: 'SET_CLAIM_SIZE'; claimX: number; claimZ: number }
  | { type: 'TOGGLE_LAYER_VISIBILITY'; index: number }
  | { type: 'RENAME_LAYER'; index: number; label: string }
  | { type: 'ROTATE_TILE' }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'RESET' }
  | { type: 'LOAD_STATE'; state: BuildingState };
