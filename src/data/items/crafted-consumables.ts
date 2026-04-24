/**
 * crafted-consumables.ts
 * Craftable consumable items produced at the Stove station.
 * One concern: food and medicine item definitions.
 *
 * Sources:
 *   - StarsReach_GUNC_Reference.md §5.4 (Food recipes — 3 items)
 *   - StarsReach_GUNC_Reference.md §5.5 (Medicine recipes — 7 items)
 *
 * Split from crafted.ts on 2026-04-23 (weekly auto-audit, warning threshold).
 */

import type { Item } from '@/types/items';

// ── Food (Stove Station) ──────────────────────────────────────────────

export const FOOD_ITEMS: Item[] = [
  {
    id: 'fruit_jam',
    name: 'Fruit Jam',
    category: 'consumable',
    subcategory: 'food',
    description: 'Preserved fruit spread. Crafted from Fruit ×10. Basic food item.',
    sources: ['crafting'],
    station: 'stove',
    confirmed: true,
  },
  {
    id: 'meat_kabob',
    name: 'Meat Kabob',
    category: 'consumable',
    subcategory: 'food',
    description: 'Grilled meat on a skewer. Crafted from Meat ×10. Restores stamina and health.',
    sources: ['crafting'],
    station: 'stove',
    confirmed: true,
  },
  {
    id: 'mushroom_patty',
    name: 'Mushroom Patty',
    category: 'consumable',
    subcategory: 'food',
    description: 'Compressed fungus patty. Crafted from Fungus ×10. Vegetarian food option.',
    sources: ['crafting'],
    station: 'stove',
    confirmed: true,
  },
];

// ── Medicine (Stove Station) ──────────────────────────────────────────

export const MEDICINE_ITEMS: Item[] = [
  {
    id: 'cure_all',
    name: 'Cure All',
    category: 'consumable',
    subcategory: 'medicine',
    description: 'General ailment cure. Crafted from Fungus ×10 + Oil ×5. New players start with 5.',
    sources: ['crafting'],
    station: 'stove',
    confirmed: true,
  },
  {
    id: 'flame_out',
    name: 'Flame Out',
    category: 'consumable',
    subcategory: 'medicine',
    description: 'Removes fire and heat status effects. Crafted from Fruit ×10 + Inert Gas ×5. New players start with 5.',
    sources: ['crafting'],
    station: 'stove',
    confirmed: true,
  },
  {
    id: 'go_juice',
    name: 'Go Juice',
    category: 'consumable',
    subcategory: 'medicine',
    description: 'Stimulant and energy booster. Crafted from Fruit ×10 + U-Al ×5. New players start with 5.',
    sources: ['crafting'],
    station: 'stove',
    confirmed: true,
  },
  {
    id: 'health_booster',
    name: 'Health Booster',
    category: 'consumable',
    subcategory: 'medicine',
    description: 'HP recovery consumable. Crafted from Meat ×15. New players start with 5.',
    sources: ['crafting'],
    station: 'stove',
    confirmed: true,
  },
  {
    id: 'stamina_booster',
    name: 'Stamina Booster',
    category: 'consumable',
    subcategory: 'medicine',
    description: 'Stamina and endurance recovery. Crafted from Fungus ×15. New players start with 5.',
    sources: ['crafting'],
    station: 'stove',
    confirmed: true,
  },
  {
    id: 'thaw_bones',
    name: 'Thaw Bones',
    category: 'consumable',
    subcategory: 'medicine',
    description: 'Removes cold and freeze status effects. Crafted from Cactus Fiber ×5 + Fruit ×10. New players start with 5.',
    sources: ['crafting'],
    station: 'stove',
    confirmed: true,
  },
  {
    id: 'watt_away',
    name: 'Watt Away',
    category: 'consumable',
    subcategory: 'medicine',
    description: 'Removes electric status effects. Crafted from Brass ×5 + Electrum ×5 + Oil ×5. New players start with 5.',
    sources: ['crafting'],
    station: 'stove',
    confirmed: true,
  },
];
