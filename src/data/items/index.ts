/**
 * items/index.ts
 * Item data aggregator — combines all item category files into unified exports.
 * One concern: aggregating item data and providing query helpers.
 *
 * Data breakdown:
 *   materials.ts  — metals (25), alloys (18), gemstones (20), rocks (21), soils (13), gases (10)
 *   organics.ts   — animal drops (12), fruit (11), fungi (7), fiber (1), wood (5), stock flora (10), seedlings (29)
 *   industrial.ts — industrial products (7), liquids (2), intermediates (39)
 *   crafted.ts    — tools (24), food (3), medicine (7)
 *   Total: ~305 items
 */

import type { Item, ItemCategory } from '@/types/items';
import { METAL_ITEMS, ALLOY_ITEMS, GEMSTONE_ITEMS, ROCK_ITEMS, SOIL_ITEMS, GAS_ITEMS } from './materials';
import { ANIMAL_ITEMS, FRUIT_ITEMS, FUNGUS_ITEMS, FIBER_ITEMS, WOOD_ITEMS, STOCK_FLORA_ITEMS, SEEDLING_ITEMS } from './organics';
import { INDUSTRIAL_PRODUCT_ITEMS, LIQUID_ITEMS, INTERMEDIATE_ITEMS } from './industrial';
import { TOOL_ITEMS, FOOD_ITEMS, MEDICINE_ITEMS } from './crafted';

/** All items combined */
const ALL_ITEMS: Item[] = [
  ...METAL_ITEMS,
  ...ALLOY_ITEMS,
  ...GEMSTONE_ITEMS,
  ...ROCK_ITEMS,
  ...SOIL_ITEMS,
  ...GAS_ITEMS,
  ...ANIMAL_ITEMS,
  ...FRUIT_ITEMS,
  ...FUNGUS_ITEMS,
  ...FIBER_ITEMS,
  ...WOOD_ITEMS,
  ...STOCK_FLORA_ITEMS,
  ...SEEDLING_ITEMS,
  ...INDUSTRIAL_PRODUCT_ITEMS,
  ...LIQUID_ITEMS,
  ...INTERMEDIATE_ITEMS,
  ...TOOL_ITEMS,
  ...FOOD_ITEMS,
  ...MEDICINE_ITEMS,
];

/** Get all items as a flat array */
export function getAllItems(): Item[] {
  return ALL_ITEMS;
}

/** Get a single item by id */
export function getItemById(id: string): Item | undefined {
  return ALL_ITEMS.find((item) => item.id === id);
}

/** Get items filtered by top-level category */
export function getItemsByCategory(category: ItemCategory): Item[] {
  return ALL_ITEMS.filter((item) => item.category === category);
}

/** Get items filtered by subcategory */
export function getItemsBySubcategory(subcategory: string): Item[] {
  return ALL_ITEMS.filter((item) => item.subcategory === subcategory);
}

/** Case-insensitive search by name or description */
export function searchItems(query: string): Item[] {
  const q = query.toLowerCase();
  return ALL_ITEMS.filter(
    (item) =>
      item.name.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q),
  );
}

/** Get items by crafting station */
export function getItemsByStation(station: Item['station']): Item[] {
  return ALL_ITEMS.filter((item) => item.station === station);
}

/** Get all confirmed items only */
export function getConfirmedItems(): Item[] {
  return ALL_ITEMS.filter((item) => item.confirmed);
}

/** Summary stats for the item database */
export function getItemStats() {
  const byCategory = new Map<ItemCategory, number>();
  for (const item of ALL_ITEMS) {
    byCategory.set(item.category, (byCategory.get(item.category) ?? 0) + 1);
  }
  return {
    total: ALL_ITEMS.length,
    confirmed: ALL_ITEMS.filter((i) => i.confirmed).length,
    byCategory: Object.fromEntries(byCategory),
  };
}
