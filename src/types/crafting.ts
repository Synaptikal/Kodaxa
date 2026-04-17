/**
 * crafting.ts
 * Core data types for the Stars Reach crafting system.
 * One concern: defining the shape of recipes, resources, stations, and stats.
 *
 * Key game mechanics modeled:
 *   - 4 resource stats: Potential (P), Quality (Q), Resilience (R), Versatility (V)
 *   - Stats vary per resource per planet
 *   - Crafting drops the lowest stat, averages the rest
 *   - Recipes are gated by skill tree branches
 *   - Crafting stations: Lathe, Stove, Toolmaker, Refinery (+ more expected)
 *
 * Sources:
 *   https://starsreach.com/physics-midterm/
 *   https://starsreach.com/appearance-customization-for-crafting/
 *   https://starsreach.com/better-homes-gardens/
 */

// ── Resource Stats ──────────────────────────────────────────────────

/** The 4 resource stats that determine crafted item quality */
export interface ResourceStats {
  /** Ability to deliver/preserve/supply energy (conductivity, calories, etc.) */
  potential: number;
  /** General fitness metric of the resource */
  quality: number;
  /** Ability to bounce back, withstand damage, elasticity */
  resilience: number;
  /** Malleability, reactivity, workability, solvent capability */
  versatility: number;
}

/** Shorthand stat key for iteration */
export type StatKey = keyof ResourceStats;

/** All 4 stat keys in display order */
export const STAT_KEYS: StatKey[] = [
  'potential',
  'quality',
  'resilience',
  'versatility',
];

/** Human-readable short labels */
export const STAT_LABELS: Record<StatKey, string> = {
  potential: 'P',
  quality: 'Q',
  resilience: 'R',
  versatility: 'V',
};

/** Human-readable full labels */
export const STAT_NAMES: Record<StatKey, string> = {
  potential: 'Potential',
  quality: 'Quality',
  resilience: 'Resilience',
  versatility: 'Versatility',
};

// ── Resources ───────────────────────────────────────────────────────

/** Category of raw resource */
export type ResourceCategory =
  | 'ore'
  | 'metal'
  | 'mineral'
  | 'stone'
  | 'soil'
  | 'gas'
  | 'liquid'
  | 'organic'
  | 'alloy'
  | 'processed';

/** A resource type in the game (e.g., "Iron", "Titanium") */
export interface Resource {
  id: string;
  name: string;
  category: ResourceCategory;
  /** Tier if applicable (e.g., "Tier 1 Metal") */
  tier?: number;
  /** Default/average stats (actual stats vary per planet) */
  baseStats: ResourceStats;
  /** Known planet-specific stat overrides */
  planetStats?: PlanetResourceStats[];
  /** Brief description */
  description: string;
}

/** Planet-specific stat values for a resource */
export interface PlanetResourceStats {
  planetName: string;
  stats: ResourceStats;
  /** Who reported this data (for community DB phase) */
  reportedBy?: string;
  reportedAt?: string;
}

// ── Crafting Stations ───────────────────────────────────────────────

/** Known crafting station types */
export type CraftingStationId =
  | 'lathe'
  | 'stove'
  | 'toolmaker'
  | 'refinery'
  | 'unknown';

/** A crafting station definition */
export interface CraftingStation {
  id: CraftingStationId;
  name: string;
  description: string;
  /** Which skill branch unlocks recipes for this station */
  skillBranch: CraftingBranch;
}

// ── Skill Branches ──────────────────────────────────────────────────

/** Crafting skill tree branches (confirmed from Better Homes & Gardens update) */
export type CraftingBranch =
  | 'architect'
  | 'civil_engineering'
  | 'refining'
  | 'toolmaking'
  | 'weaponsmithing'
  | 'cooking'
  | 'unknown';

// ── Recipes ─────────────────────────────────────────────────────────

/** A single ingredient in a recipe */
export interface RecipeIngredient {
  /** Resource ID */
  resourceId: string;
  /** Quantity required */
  quantity: number;
  /** If true, accepts any resource in a category (e.g., "any Sedimentary Rock") */
  anyInCategory?: ResourceCategory;
}

/** A crafting recipe */
export interface Recipe {
  id: string;
  name: string;
  description: string;
  /** Which station this is crafted at */
  stationId: CraftingStationId;
  /** Which skill branch gates this recipe */
  branch: CraftingBranch;
  /** Input ingredients */
  ingredients: RecipeIngredient[];
  /** Output item(s) — most recipes produce 1 item */
  output: RecipeOutput;
  /** If this recipe produces a sub-component used in other recipes */
  isIntermediate: boolean;
  /** Recipe IDs that use this recipe's output as an ingredient */
  usedIn?: string[];
  /** Recipe IDs whose outputs are ingredients in this recipe */
  dependsOn?: string[];
  /** Relative complexity (affects XP reward) */
  complexity: number;
  /** Whether this recipe is confirmed from game data vs. speculated */
  confirmed: boolean;
}

/** What a recipe produces */
export interface RecipeOutput {
  /** Resource or item ID */
  itemId: string;
  /** Display name */
  name: string;
  /** Quantity produced */
  quantity: number;
  /** Category of the output */
  category: RecipeOutputCategory;
}

export type RecipeOutputCategory =
  | 'block'
  | 'decor'
  | 'paver'
  | 'tool'
  | 'weapon'
  | 'material'
  | 'alloy'
  | 'food'
  | 'furniture'
  | 'component'
  | 'other';

// ── Calculator State ────────────────────────────────────────────────

/** User's input for a resource stat optimization calculation */
export interface ResourceInput {
  resourceId: string;
  /** Player-scouted stats (overrides base if provided) */
  stats: ResourceStats;
  /** Optional planet name for tracking */
  planetName?: string;
}

/** Result of a stat optimization calculation */
export interface OptimizationResult {
  /**
   * How many lowest values were dropped per stat.
   * From CraftingScreenModel.cs CalculateStatValue:
   *   ≥5 ingredient slots → drop 2 lowest
   *   ≥2 ingredient slots → drop 1 lowest
   */
  droppedCount: 1 | 2;
  /**
   * Final computed stats.
   * Each stat is independently: sort values desc → drop N lowest → RoundToInt(sum/count).
   * All 4 stats are always present in the output — no stat is fully discarded.
   */
  finalStats: ResourceStats;
  /** Effective quality score — average of all 4 final stats */
  effectiveQuality: number;
  /** Per-ingredient contribution breakdown */
  contributions: IngredientContribution[];
}

/** Per-ingredient breakdown for UI display */
export interface IngredientContribution {
  resourceId: string;
  resourceName: string;
  /**
   * Quantity fraction — for display only, NOT used in stat formula.
   * Stat calculation treats each ingredient slot as one equal input.
   */
  weight: number;
  /** Raw stats for this ingredient (as entered by the player) */
  weightedStats: ResourceStats;
}
