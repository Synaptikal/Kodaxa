/**
 * inventory.ts
 * Types for the Inventory & Materials Manager.
 * One concern: defining stockpile entries, crate config, and tool registry.
 *
 * localStorage-persisted personal data — same pattern as XP Timer.
 *
 * Key game mechanics modeled:
 *   - Materials have planet-specific PQRV stats (reuses types/atlas.ts)
 *   - 3 crates per homestead, shareable with corp members
 *   - Tools have quality levels and up to 2 Specials crafted in
 *   - Vendor Kiosk caps at 100 listed items
 */

import type { ItemCategory } from '@/types/items';
import type { PQRV } from '@/types/atlas';

// ── Storage Locations ───────────────────────────────────────────────

export type StorageLocation =
  | 'backpack'
  | 'crate_1'
  | 'crate_2'
  | 'crate_3'
  | 'bank'
  | 'vendor_kiosk';

export const STORAGE_LABELS: Record<StorageLocation, string> = {
  backpack:     'Backpack',
  crate_1:      'Crate 1',
  crate_2:      'Crate 2',
  crate_3:      'Crate 3',
  bank:         'Bank',
  vendor_kiosk: 'Vendor Kiosk',
};

export const STORAGE_COLORS: Record<StorageLocation, string> = {
  backpack:     'text-slate-300  bg-slate-800/40  border-slate-700',
  crate_1:      'text-teal-400   bg-teal-900/30   border-teal-800/40',
  crate_2:      'text-cyan-400   bg-cyan-900/30   border-cyan-800/40',
  crate_3:      'text-violet-400 bg-violet-900/30 border-violet-800/40',
  bank:         'text-amber-400  bg-amber-900/30  border-amber-800/40',
  vendor_kiosk: 'text-emerald-400 bg-emerald-900/30 border-emerald-800/40',
};

// ── Stockpile ───────────────────────────────────────────────────────

/** A single item stack in the player's inventory */
export interface StockpileEntry {
  /** Unique ID */
  id: string;
  /** Item name (matches items database) */
  item_name: string;
  /** Item category (from types/items.ts taxonomy) */
  item_category: ItemCategory;
  /** Quantity held */
  quantity: number;
  /** Planet where this was sourced (stats vary per planet) */
  planet_source?: string;
  /** PQRV stats if this is a resource (from types/atlas.ts) */
  pqrv?: PQRV;
  /** Where this stack is stored */
  storage_location: StorageLocation;
  /** Optional notes */
  notes?: string;
  /** Last updated timestamp */
  updated_at: string;
}

// ── Crate Config ────────────────────────────────────────────────────

export type CrateId = 'crate_1' | 'crate_2' | 'crate_3';

/** Configuration for a homestead storage crate */
export interface CrateConfig {
  /** Crate identifier */
  id: CrateId;
  /** Custom label for this crate */
  label: string;
  /** Corp member names who have access */
  shared_with: string[];
}

/** Default crate config */
export const DEFAULT_CRATES: CrateConfig[] = [
  { id: 'crate_1', label: 'Crate 1', shared_with: [] },
  { id: 'crate_2', label: 'Crate 2', shared_with: [] },
  { id: 'crate_3', label: 'Crate 3', shared_with: [] },
];

// ── Tool Registry ───────────────────────────────────────────────────

/** A tracked tool in the player's loadout */
export interface ToolEntry {
  /** Unique ID */
  id: string;
  /** Tool name (e.g. "Extractor", "Rally Banner") */
  tool_name: string;
  /** Profession this tool serves */
  profession_id: string;
  /** Profession display name (cached) */
  profession_name: string;
  /** Quality level (affects hopper size, XP rate, abilities) */
  quality_level: number;
  /** Up to 2 Specials crafted into this tool */
  specials: [string?, string?];
  /** Hopper size if applicable */
  hopper_size?: number;
  /** Optional notes */
  notes?: string;
  /** Last updated timestamp */
  updated_at: string;
}

// ── Helpers ─────────────────────────────────────────────────────────

/** Count items by storage location */
export function countByLocation(items: StockpileEntry[]): Record<StorageLocation, number> {
  const counts: Record<StorageLocation, number> = {
    backpack: 0, crate_1: 0, crate_2: 0, crate_3: 0, bank: 0, vendor_kiosk: 0,
  };
  for (const item of items) {
    counts[item.storage_location] += item.quantity;
  }
  return counts;
}

/** Count items by category */
export function countByCategory(items: StockpileEntry[]): Partial<Record<ItemCategory, number>> {
  const counts: Partial<Record<ItemCategory, number>> = {};
  for (const item of items) {
    counts[item.item_category] = (counts[item.item_category] ?? 0) + item.quantity;
  }
  return counts;
}
