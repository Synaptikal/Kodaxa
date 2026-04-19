/**
 * trade.ts
 * Types for the Trade System — vendor kiosk tracking, fee calculator, price history.
 * One concern: defining the shape of vendor listings, transactions, and price history.
 *
 * localStorage-persisted personal data — extends the existing market.ts module.
 *
 * Key game mechanics modeled:
 *   - Vendor Kiosks cap at 100 listed items
 *   - 5% non-refundable listing fee
 *   - 10 Klaatu minimum per item
 *   - All prices are in Klaatu
 */

// ── Vendor Kiosk ────────────────────────────────────────────────────

export type ListingStatus = 'active' | 'sold' | 'expired' | 'withdrawn';

export const LISTING_STATUS_LABELS: Record<ListingStatus, string> = {
  active:    'Active',
  sold:      'Sold',
  expired:   'Expired',
  withdrawn: 'Withdrawn',
};

export const LISTING_STATUS_COLORS: Record<ListingStatus, string> = {
  active:    'text-emerald-400 bg-emerald-900/30 border-emerald-800/40',
  sold:      'text-teal-400    bg-teal-900/30    border-teal-800/40',
  expired:   'text-slate-400   bg-slate-800/30   border-slate-700/40',
  withdrawn: 'text-amber-400   bg-amber-900/30   border-amber-800/40',
};

/** A single item listed on the player's Vendor Kiosk */
export interface VendorListing {
  /** Unique ID */
  id: string;
  /** Item name */
  item_name: string;
  /** Quantity listed */
  quantity: number;
  /** Price per unit in Klaatu */
  list_price: number;
  /** Listing fee (auto-calculated: 5% of total value) */
  listing_fee: number;
  /** Total value (quantity × list_price) */
  total_value: number;
  /** Current listing status */
  status: ListingStatus;
  /** When the item was listed */
  listed_at: string;
  /** When the item was sold (if sold) */
  sold_at?: string;
  /** Buyer name (if known) */
  buyer_name?: string;
}

// ── Trade Transactions ──────────────────────────────────────────────

export type TradeType = 'sale' | 'purchase';

/** A recorded trade transaction */
export interface TradeTransaction {
  /** Unique ID */
  id: string;
  /** Sale or purchase */
  type: TradeType;
  /** Item name */
  item_name: string;
  /** Quantity traded */
  quantity: number;
  /** Price per unit in Klaatu */
  unit_price: number;
  /** Total Klaatu exchanged */
  total: number;
  /** Who you traded with (if known) */
  counterparty?: string;
  /** Planet where the trade occurred */
  planet: string;
  /** ISO date */
  date: string;
  /** Optional notes */
  notes?: string;
}

// ── Price History ───────────────────────────────────────────────────

export type PriceSource = 'own_sale' | 'observed' | 'market_report';

export const PRICE_SOURCE_LABELS: Record<PriceSource, string> = {
  own_sale:      'Own Sale',
  observed:      'Observed',
  market_report: 'Market Report',
};

/** A manually-logged price observation */
export interface PriceHistoryEntry {
  /** Unique ID */
  id: string;
  /** Item name */
  item_name: string;
  /** Observed unit price in Klaatu */
  unit_price: number;
  /** Planet where observed */
  planet: string;
  /** ISO date */
  date: string;
  /** How this price was obtained */
  source: PriceSource;
}

// ── Constants ───────────────────────────────────────────────────────

/** Vendor Kiosk game caps */
export const KIOSK_MAX_LISTINGS = 100;
export const KIOSK_LISTING_FEE_RATE = 0.05;
export const KIOSK_MIN_PRICE = 10;

// ── Helpers ─────────────────────────────────────────────────────────

/** Calculate the 5% listing fee for a vendor kiosk listing */
export function calculateListingFee(quantity: number, unitPrice: number): number {
  return Math.ceil(quantity * unitPrice * KIOSK_LISTING_FEE_RATE);
}

/** Calculate profit after listing fee */
export function calculateProfit(quantity: number, unitPrice: number): number {
  const revenue = quantity * unitPrice;
  const fee = calculateListingFee(quantity, unitPrice);
  return revenue - fee;
}

/** Net P/L from a set of transactions */
export function netProfitLoss(transactions: TradeTransaction[]): number {
  return transactions.reduce((acc, t) => {
    return acc + (t.type === 'sale' ? t.total : -t.total);
  }, 0);
}
