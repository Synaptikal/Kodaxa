/**
 * vendor-kiosk.tsx
 * UI for managing active Vendor Kiosk listings.
 * One concern: track listed items, calculate fees, and mark items as sold.
 */

'use client';

import { useState } from 'react';
import type { VendorListing } from '@/types/trade';
import { LISTING_STATUS_COLORS, LISTING_STATUS_LABELS } from '@/types/trade';
import { getAllItems } from '@/data/items/index';

const ALL_ITEMS = getAllItems();

interface Props {
  listings: VendorListing[];
  slotsRemaining: number;
  onAdd: (itemName: string, quantity: number, listPrice: number) => void;
  onMarkSold: (id: string, buyerName?: string) => void;
  onWithdraw: (id: string) => void;
  onDelete: (id: string) => void;
}

export function VendorKiosk({ listings, slotsRemaining, onAdd, onMarkSold, onWithdraw, onDelete }: Props) {
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [listPrice, setListPrice] = useState('');

  const handleAdd = () => {
    if (!itemName) return;
    const q = parseInt(quantity, 10) || 1;
    const p = parseInt(listPrice, 10) || 10; // Kiosk min price is 10
    onAdd(itemName, q, Math.max(10, p));
    setItemName('');
    setQuantity('');
    setListPrice('');
  };

  const activeListings = listings.filter((l) => l.status === 'active');
  const pastListings = listings.filter((l) => l.status !== 'active');

  const inputCls = 'bg-slate-800 border border-slate-700 rounded-md px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-emerald-600 transition-colors';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Vendor Kiosk</h3>
        <span className="text-[10px] text-slate-500 font-mono">{slotsRemaining} slots remaining</span>
      </div>

      {/* Add Form */}
      <div className="flex flex-wrap items-end gap-3 p-3 bg-slate-800/30 border border-slate-700 rounded-lg">
        <div className="flex-1 min-w-[140px]">
          <label className="block text-[10px] text-slate-500 mb-1 uppercase tracking-wider">Item Name</label>
          <input
            type="text" list="kiosk-item-datalist" value={itemName} onChange={(e) => setItemName(e.target.value)}
            placeholder="e.g. Copper Ingot" className={`${inputCls} w-full`}
          />
          <datalist id="kiosk-item-datalist">
            {ALL_ITEMS.map((item) => (
              <option key={item.id} value={item.name} />
            ))}
          </datalist>
        </div>
        <div className="w-20">
          <label className="block text-[10px] text-slate-500 mb-1 uppercase tracking-wider">Qty</label>
          <input
            type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)}
            placeholder="1" className={`${inputCls} w-full text-right`}
          />
        </div>
        <div className="w-24">
          <label className="block text-[10px] text-slate-500 mb-1 uppercase tracking-wider">Unit Price</label>
          <input
            type="number" min="10" value={listPrice} onChange={(e) => setListPrice(e.target.value)}
            placeholder="Klaatu" className={`${inputCls} w-full text-right font-mono text-emerald-400`}
          />
        </div>
        <button
          onClick={handleAdd}
          disabled={!itemName || slotsRemaining <= 0}
          className="bg-emerald-800/40 hover:bg-emerald-800/60 text-emerald-300 px-4 py-1 rounded text-xs transition-colors h-7 disabled:opacity-30"
        >
          List
        </button>
      </div>

      {/* Active Listings */}
      <div>
        <h4 className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">Active Listings ({activeListings.length})</h4>
        {activeListings.length === 0 ? (
          <p className="text-xs text-slate-600 italic">No items currently listed.</p>
        ) : (
          <div className="space-y-2">
            {activeListings.map((listing) => (
              <div key={listing.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-slate-800/50 border border-slate-700/50 rounded-lg group">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-200 font-medium">{listing.item_name}</span>
                    <span className="text-xs text-slate-500">x{listing.quantity}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    Listed: {new Date(listing.listed_at).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-4 w-full sm:w-auto">
                  <div className="text-right">
                    <p className="text-xs font-mono text-emerald-400">{listing.list_price.toLocaleString()} K/ea</p>
                    <p className="text-[10px] text-amber-500/80">Fee: {listing.listing_fee.toLocaleString()} K</p>
                  </div>
                  <div className="flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onMarkSold(listing.id)}
                      className="bg-teal-900/40 hover:bg-teal-700/60 text-teal-300 px-2.5 py-1 rounded text-[10px]"
                    >
                      Sold
                    </button>
                    <button
                       onClick={() => onWithdraw(listing.id)}
                       className="bg-slate-700/40 hover:bg-slate-600/60 text-slate-300 px-2.5 py-1 rounded text-[10px]"
                     >
                       Pull
                     </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* History */}
      {pastListings.length > 0 && (
        <div className="mt-6 pt-4 border-t border-slate-800/50">
          <h4 className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">History</h4>
          <div className="space-y-1">
            {pastListings.slice(0, 5).map((listing) => (
              <div key={listing.id} className="flex items-center justify-between py-1.5 px-2 hover:bg-slate-800/30 rounded group transition-colors">
                <div className="flex items-center gap-3">
                  <span className={`text-[9px] px-1.5 py-0.5 rounded border ${LISTING_STATUS_COLORS[listing.status]}`}>
                    {LISTING_STATUS_LABELS[listing.status]}
                  </span>
                  <span className="text-xs text-slate-400">{listing.item_name} <span className="text-slate-500">x{listing.quantity}</span></span>
                </div>
                <div className="flex items-center gap-3">
                  {listing.status === 'sold' && (
                    <span className="text-xs font-mono text-emerald-500/70">{listing.total_value.toLocaleString()} K</span>
                  )}
                  <button onClick={() => onDelete(listing.id)} className="text-[10px] text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100">×</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
