/**
 * use-trade.ts
 * Hooks for the Trade System.
 * One concern: localStorage CRUD for vendor kiosk listings, trade log, and price history.
 *
 * Follows the same SSR-safe pattern as use-saved-builds.ts.
 */

'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import type {
  VendorListing,
  TradeTransaction,
  PriceHistoryEntry,
  ListingStatus,
  TradeType,
  PriceSource,
} from '@/types/trade';
import { calculateListingFee, KIOSK_MAX_LISTINGS, netProfitLoss } from '@/types/trade';

// ── Storage keys ────────────────────────────────────────────────────

const LISTINGS_KEY  = 'sr_vendor_listings';
const TRADES_KEY    = 'sr_trade_log';
const PRICES_KEY    = 'sr_price_history';
const MAX_LISTINGS  = 500;
const MAX_TRADES    = 500;
const MAX_PRICES    = 1000;

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

// ── Vendor Listings Hook ────────────────────────────────────────────

export interface VendorListingsHook {
  listings: VendorListing[];
  hydrated: boolean;
  addListing: (itemName: string, quantity: number, listPrice: number) => void;
  updateListing: (id: string, updates: Partial<VendorListing>) => void;
  markSold: (id: string, buyerName?: string) => void;
  withdrawListing: (id: string) => void;
  deleteListing: (id: string) => void;
  activeCount: number;
  activeListings: VendorListing[];
  slotsRemaining: number;
  totalListingFees: number;
}

export function useVendorListings(): VendorListingsHook {
  const [listings, setListings] = useState<VendorListing[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setListings(load<VendorListing>(LISTINGS_KEY));
    setHydrated(true);
  }, []);

  const addListing = useCallback((itemName: string, quantity: number, listPrice: number) => {
    setListings((prev) => {
      const totalValue = quantity * listPrice;
      const fee = calculateListingFee(quantity, listPrice);
      const entry: VendorListing = {
        id: uid(),
        item_name: itemName,
        quantity,
        list_price: listPrice,
        listing_fee: fee,
        total_value: totalValue,
        status: 'active',
        listed_at: new Date().toISOString(),
      };
      const updated = [entry, ...prev].slice(0, MAX_LISTINGS);
      save(LISTINGS_KEY, updated);
      return updated;
    });
  }, []);

  const updateListing = useCallback((id: string, updates: Partial<VendorListing>) => {
    setListings((prev) => {
      const updated = prev.map((l) => (l.id === id ? { ...l, ...updates } : l));
      save(LISTINGS_KEY, updated);
      return updated;
    });
  }, []);

  const markSold = useCallback((id: string, buyerName?: string) => {
    setListings((prev) => {
      const updated = prev.map((l) =>
        l.id === id
          ? { ...l, status: 'sold' as ListingStatus, sold_at: new Date().toISOString(), buyer_name: buyerName }
          : l,
      );
      save(LISTINGS_KEY, updated);
      return updated;
    });
  }, []);

  const withdrawListing = useCallback((id: string) => {
    setListings((prev) => {
      const updated = prev.map((l) =>
        l.id === id ? { ...l, status: 'withdrawn' as ListingStatus } : l,
      );
      save(LISTINGS_KEY, updated);
      return updated;
    });
  }, []);

  const deleteListing = useCallback((id: string) => {
    setListings((prev) => {
      const updated = prev.filter((l) => l.id !== id);
      save(LISTINGS_KEY, updated);
      return updated;
    });
  }, []);

  const activeListings = useMemo(() => listings.filter((l) => l.status === 'active'), [listings]);
  const activeCount = activeListings.length;
  const slotsRemaining = KIOSK_MAX_LISTINGS - activeCount;
  const totalListingFees = useMemo(
    () => listings.reduce((acc, l) => acc + l.listing_fee, 0),
    [listings],
  );

  return {
    listings, hydrated, addListing, updateListing, markSold,
    withdrawListing, deleteListing, activeCount, activeListings,
    slotsRemaining, totalListingFees,
  };
}

// ── Trade Log Hook ──────────────────────────────────────────────────

export interface TradeLogHook {
  trades: TradeTransaction[];
  hydrated: boolean;
  addTrade: (input: Omit<TradeTransaction, 'id'>) => void;
  deleteTrade: (id: string) => void;
  netProfit: number;
  totalSales: number;
  totalPurchases: number;
}

export function useTradeLog(): TradeLogHook {
  const [trades, setTrades] = useState<TradeTransaction[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setTrades(load<TradeTransaction>(TRADES_KEY));
    setHydrated(true);
  }, []);

  const addTrade = useCallback((input: Omit<TradeTransaction, 'id'>) => {
    setTrades((prev) => {
      const entry: TradeTransaction = { id: uid(), ...input };
      const updated = [entry, ...prev].slice(0, MAX_TRADES);
      save(TRADES_KEY, updated);
      return updated;
    });
  }, []);

  const deleteTrade = useCallback((id: string) => {
    setTrades((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      save(TRADES_KEY, updated);
      return updated;
    });
  }, []);

  const netProfit = useMemo(() => netProfitLoss(trades), [trades]);
  const totalSales = useMemo(
    () => trades.filter((t) => t.type === 'sale').reduce((acc, t) => acc + t.total, 0),
    [trades],
  );
  const totalPurchases = useMemo(
    () => trades.filter((t) => t.type === 'purchase').reduce((acc, t) => acc + t.total, 0),
    [trades],
  );

  return { trades, hydrated, addTrade, deleteTrade, netProfit, totalSales, totalPurchases };
}

// ── Price History Hook ──────────────────────────────────────────────

export interface PriceHistoryHook {
  prices: PriceHistoryEntry[];
  hydrated: boolean;
  addPrice: (itemName: string, unitPrice: number, planet: string, source: PriceSource) => void;
  deletePrice: (id: string) => void;
  getPricesForItem: (itemName: string) => PriceHistoryEntry[];
}

export function usePriceHistory(): PriceHistoryHook {
  const [prices, setPrices] = useState<PriceHistoryEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setPrices(load<PriceHistoryEntry>(PRICES_KEY));
    setHydrated(true);
  }, []);

  const addPrice = useCallback(
    (itemName: string, unitPrice: number, planet: string, source: PriceSource) => {
      setPrices((prev) => {
        const entry: PriceHistoryEntry = {
          id: uid(),
          item_name: itemName,
          unit_price: unitPrice,
          planet,
          date: new Date().toISOString(),
          source,
        };
        const updated = [entry, ...prev].slice(0, MAX_PRICES);
        save(PRICES_KEY, updated);
        return updated;
      });
    },
    [],
  );

  const deletePrice = useCallback((id: string) => {
    setPrices((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      save(PRICES_KEY, updated);
      return updated;
    });
  }, []);

  const getPricesForItem = useCallback(
    (itemName: string) => prices.filter((p) => p.item_name === itemName),
    [prices],
  );

  return { prices, hydrated, addPrice, deletePrice, getPricesForItem };
}
