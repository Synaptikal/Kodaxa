/**
 * items.ts
 * Core data types for the Stars Reach item reference database.
 * One concern: defining the shape of all collectible, harvestable, and craftable items.
 *
 * Distinct from crafting.ts (which models recipe inputs/outputs for the calculator).
 * This covers the full item taxonomy as a browsable reference.
 *
 * Sources:
 *   - StarsReach_GUNC_Reference.md Section 4 (material registry)
 *   - StarsReach_GUNC_Reference.md Section 5 (recipe outputs / crafted items)
 */

// ── Category & Classification ────────────────────────────────────────

/** Top-level item category */
export type ItemCategory =
  | 'metal'       // Raw metals (Iron, Copper, Titanium…)
  | 'alloy'       // Refined metal alloys (Brass, Steel, Bronze…)
  | 'gemstone'    // Gems (Agate, Diamond, Armorcryst…)
  | 'rock'        // Geological rocks (Granite, Limestone, Obsidian…)
  | 'soil'        // Soil types (Clay, Sand, Peat…)
  | 'gas'         // Gases (Methane, Helium, Fluorine…)
  | 'animal'      // Animal drops (Meat, Hide, Bone, Horn…)
  | 'flora'       // Plant materials (Fruit, Fungus, Wood, Fiber…)
  | 'seedling'    // Plantable seedlings (decorative/farming)
  | 'industrial'  // Processed/intermediate materials (Plastic, Glass, Oil…)
  | 'tool'        // Craftable tools and equipment
  | 'consumable'; // Food and medicine

/** Sub-grouping within a category for UI filtering */
export type ItemSubcategory =
  // metal sub
  | 'raw_metal'
  // alloy sub
  | 'metal_alloy'
  // gemstone subs
  | 'gem_common' | 'gem_uncommon' | 'gem_rare' | 'gem_exotic'
  // rock subs
  | 'igneous' | 'metamorphic' | 'sedimentary' | 'exotic_rock'
  // soil subs
  | 'carbon_soil' | 'clay_soil' | 'rocky_soil' | 'sandy_soil' | 'silty_soil'
  // gas subs
  | 'inert_gas' | 'reactive_gas'
  // animal subs
  | 'meat' | 'hide' | 'skeletal'
  // flora subs
  | 'fruit' | 'fungus' | 'fiber' | 'wood' | 'stock_flora'
  // industrial subs
  | 'industrial_product' | 'intermediate' | 'liquid'
  // tool subs
  | 'mining_tool' | 'combat_tool' | 'utility_tool' | 'crafting_station' | 'building_tool'
  // consumable subs
  | 'food' | 'medicine';

/** Rarity classification (used for metals by tier and gemstone rarity) */
export type ItemRarity =
  | 'very_common'   // Tier 1 metals
  | 'common'        // Tier 2 metals / common gems
  | 'uncommon'      // Tier 3 metals / uncommon gems
  | 'rare'          // Tier 4 metals / rare gems
  | 'scarce'        // Tier 5 metals
  | 'exotic';       // Exotic gems / special materials

/** How the item is obtained */
export type ItemSource =
  | 'mining'      // Dug from terrain
  | 'refining'    // Processed at Refinery
  | 'harvesting'  // Gathered from flora/fauna
  | 'hunting'     // Dropped by creatures
  | 'farming'     // Grown at homestead
  | 'crafting'    // Crafted at a station
  | 'gas_harvest' // Extracted from gas pockets
  | 'unknown';

// ── Core Item Type ───────────────────────────────────────────────────

/** A single item in the Stars Reach item reference database */
export interface Item {
  /** Unique slug identifier (snake_case) */
  id: string;
  /** Display name */
  name: string;
  /** Top-level category */
  category: ItemCategory;
  /** Sub-grouping for detailed filtering */
  subcategory?: ItemSubcategory;
  /** Metal tier (1–5) for raw metals */
  tier?: number;
  /** Rarity classification */
  rarity?: ItemRarity;
  /** Human-readable description */
  description: string;
  /** Additional context for crafters — how this item feeds into recipes */
  craftingContext?: string;
  /** How this item is obtained */
  sources: ItemSource[];
  /** Which crafting station produces this item (crafted items only) */
  station?: 'toolmaker' | 'refinery' | 'lathe' | 'stove';
  /** Path to item icon in /public/items/ — null until icons are sourced */
  icon?: string | null;
  /** Whether this data is confirmed from game sources vs. inferred */
  confirmed: boolean;
}

// ── Display Helpers ──────────────────────────────────────────────────

export const CATEGORY_LABELS: Record<ItemCategory, string> = {
  metal:      'Metal',
  alloy:      'Alloy',
  gemstone:   'Gemstone',
  rock:       'Rock',
  soil:       'Soil',
  gas:        'Gas',
  animal:     'Animal Drop',
  flora:      'Flora',
  seedling:   'Seedling',
  industrial: 'Industrial',
  tool:       'Tool',
  consumable: 'Consumable',
};

export const RARITY_LABELS: Record<ItemRarity, string> = {
  very_common: 'Very Common',
  common:      'Common',
  uncommon:    'Uncommon',
  rare:        'Rare',
  scarce:      'Scarce',
  exotic:      'Exotic',
};

export const RARITY_COLORS: Record<ItemRarity, string> = {
  very_common: 'text-slate-400',
  common:      'text-green-400',
  uncommon:    'text-cyan-400',
  rare:        'text-violet-400',
  scarce:      'text-amber-400',
  exotic:      'text-orange-400',
};

/** Metal tier → rarity mapping */
export const TIER_RARITY: Record<number, ItemRarity> = {
  1: 'very_common',
  2: 'common',
  3: 'uncommon',
  4: 'rare',
  5: 'scarce',
};
