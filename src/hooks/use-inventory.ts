/**
 * use-inventory.ts
 * Hooks for the Inventory & Materials Manager.
 * One concern: localStorage CRUD for stockpile, crates, and tool registry.
 *
 * Follows the same SSR-safe pattern as use-saved-builds.ts.
 */

'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import type {
  StockpileEntry,
  CrateConfig,
  CrateId,
  ToolEntry,
  StorageLocation,
} from '@/types/inventory';
import { DEFAULT_CRATES, countByLocation, countByCategory } from '@/types/inventory';
import type { ItemCategory } from '@/types/items';

// ── Storage keys ────────────────────────────────────────────────────

const STOCKPILE_KEY = 'sr_stockpile';
const CRATES_KEY    = 'sr_crates';
const TOOLS_KEY     = 'sr_tool_registry';
const MAX_STOCKPILE = 500;
const MAX_TOOLS     = 50;

// ── Helpers ─────────────────────────────────────────────────────────

function load<T>(key: string): T[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    return JSON.parse(raw) as T[];
  } catch {
    return [];
  }
}

function save<T>(key: string, data: T[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // Storage full — silently ignore
  }
}

function uid(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// ── Crafting Integration ─────────────────────────────────────────────

/**
 * Standalone (non-hook) function called by the Crafting Calculator when the
 * user clicks "Add to Inventory". Writes directly to sr_stockpile so the
 * crafting page doesn't need to instantiate useStockpile.
 */
export function appendCraftedItem(
  itemName: string,
  itemCategory: import('@/types/items').ItemCategory,
  quantity: number,
  notes?: string,
): void {
  if (typeof window === 'undefined') return;
  const existing = load<StockpileEntry>(STOCKPILE_KEY);
  const entry: StockpileEntry = {
    id: uid(),
    item_name: itemName,
    item_category: itemCategory,
    quantity,
    storage_location: 'backpack',
    notes: notes?.trim() || undefined,
    updated_at: new Date().toISOString(),
  };
  save(STOCKPILE_KEY, [entry, ...existing].slice(0, MAX_STOCKPILE));
}

// ── Stockpile Hook ──────────────────────────────────────────────────

export interface StockpileHook {
  items: StockpileEntry[];
  hydrated: boolean;
  addItem: (input: Omit<StockpileEntry, 'id' | 'updated_at'>) => void;
  updateItem: (id: string, updates: Partial<StockpileEntry>) => void;
  deleteItem: (id: string) => void;
  locationCounts: Record<StorageLocation, number>;
  categoryCounts: Partial<Record<ItemCategory, number>>;
  totalQuantity: number;
}

export function useStockpile(): StockpileHook {
  const [items, setItems] = useState<StockpileEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(load<StockpileEntry>(STOCKPILE_KEY));
    setHydrated(true);
  }, []);

  const addItem = useCallback((input: Omit<StockpileEntry, 'id' | 'updated_at'>) => {
    setItems((prev) => {
      const entry: StockpileEntry = {
        ...input,
        id: uid(),
        updated_at: new Date().toISOString(),
      };
      const updated = [entry, ...prev].slice(0, MAX_STOCKPILE);
      save(STOCKPILE_KEY, updated);
      return updated;
    });
  }, []);

  const updateItem = useCallback((id: string, updates: Partial<StockpileEntry>) => {
    setItems((prev) => {
      const updated = prev.map((item) =>
        item.id === id ? { ...item, ...updates, updated_at: new Date().toISOString() } : item,
      );
      save(STOCKPILE_KEY, updated);
      return updated;
    });
  }, []);

  const deleteItem = useCallback((id: string) => {
    setItems((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      save(STOCKPILE_KEY, updated);
      return updated;
    });
  }, []);

  const locationCounts = useMemo(() => countByLocation(items), [items]);
  const categoryCounts = useMemo(() => countByCategory(items), [items]);
  const totalQuantity = useMemo(() => items.reduce((acc, i) => acc + i.quantity, 0), [items]);

  return { items, hydrated, addItem, updateItem, deleteItem, locationCounts, categoryCounts, totalQuantity };
}

// ── Crate Config Hook ───────────────────────────────────────────────

export interface CrateConfigHook {
  crates: CrateConfig[];
  hydrated: boolean;
  updateCrate: (id: CrateId, updates: Partial<CrateConfig>) => void;
  addPermission: (id: CrateId, memberName: string) => void;
  removePermission: (id: CrateId, memberName: string) => void;
}

export function useCrateConfig(): CrateConfigHook {
  const [crates, setCrates] = useState<CrateConfig[]>(DEFAULT_CRATES);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const loaded = load<CrateConfig>(CRATES_KEY);
    if (loaded.length > 0) setCrates(loaded);
    setHydrated(true);
  }, []);

  const updateCrate = useCallback((id: CrateId, updates: Partial<CrateConfig>) => {
    setCrates((prev) => {
      const updated = prev.map((c) => (c.id === id ? { ...c, ...updates } : c));
      save(CRATES_KEY, updated);
      return updated;
    });
  }, []);

  const addPermission = useCallback((id: CrateId, memberName: string) => {
    setCrates((prev) => {
      const updated = prev.map((c) =>
        c.id === id && !c.shared_with.includes(memberName)
          ? { ...c, shared_with: [...c.shared_with, memberName] }
          : c,
      );
      save(CRATES_KEY, updated);
      return updated;
    });
  }, []);

  const removePermission = useCallback((id: CrateId, memberName: string) => {
    setCrates((prev) => {
      const updated = prev.map((c) =>
        c.id === id
          ? { ...c, shared_with: c.shared_with.filter((n) => n !== memberName) }
          : c,
      );
      save(CRATES_KEY, updated);
      return updated;
    });
  }, []);

  return { crates, hydrated, updateCrate, addPermission, removePermission };
}

// ── Tool Registry Hook ──────────────────────────────────────────────

export interface ToolRegistryHook {
  tools: ToolEntry[];
  hydrated: boolean;
  addTool: (input: Omit<ToolEntry, 'id' | 'updated_at'>) => void;
  updateTool: (id: string, updates: Partial<ToolEntry>) => void;
  deleteTool: (id: string) => void;
}

export function useToolRegistry(): ToolRegistryHook {
  const [tools, setTools] = useState<ToolEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setTools(load<ToolEntry>(TOOLS_KEY));
    setHydrated(true);
  }, []);

  const addTool = useCallback((input: Omit<ToolEntry, 'id' | 'updated_at'>) => {
    setTools((prev) => {
      const entry: ToolEntry = {
        ...input,
        id: uid(),
        updated_at: new Date().toISOString(),
      };
      const updated = [entry, ...prev].slice(0, MAX_TOOLS);
      save(TOOLS_KEY, updated);
      return updated;
    });
  }, []);

  const updateTool = useCallback((id: string, updates: Partial<ToolEntry>) => {
    setTools((prev) => {
      const updated = prev.map((t) =>
        t.id === id ? { ...t, ...updates, updated_at: new Date().toISOString() } : t,
      );
      save(TOOLS_KEY, updated);
      return updated;
    });
  }, []);

  const deleteTool = useCallback((id: string) => {
    setTools((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      save(TOOLS_KEY, updated);
      return updated;
    });
  }, []);

  return { tools, hydrated, addTool, updateTool, deleteTool };
}
