/**
 * crafted.ts
 * Barrel re-export for all craftable item definitions.
 * One concern: re-exporting from split submodules without breaking consumers.
 *
 * Split on 2026-04-23 (weekly auto-audit — 370-line warning threshold).
 * Data files: crafted-tools.ts (Toolmaker) · crafted-consumables.ts (Stove)
 *
 * Public API is unchanged — all consumers importing TOOL_ITEMS, FOOD_ITEMS,
 * or MEDICINE_ITEMS from './crafted' will resolve correctly.
 */

export { TOOL_ITEMS } from './crafted-tools';
export { FOOD_ITEMS, MEDICINE_ITEMS } from './crafted-consumables';
