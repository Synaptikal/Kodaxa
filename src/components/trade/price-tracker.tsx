/**
 * price-tracker.tsx
 * Tool to manually log and track observed item prices around the galaxy.
 * One concern: log item prices by planet and source.
 */

'use client';

import { useState } from 'react';
import type { PriceHistoryEntry, PriceSource } from '@/types/trade';
import { PRICE_SOURCE_LABELS } from '@/types/trade';
import { getAllItems } from '@/data/items/index';

const ALL_ITEMS = getAllItems();
const SOURCE_OPTS = Object.keys(PRICE_SOURCE_LABELS) as PriceSource[];

interface Props {
  prices: PriceHistoryEntry[];
  onAddPrice: (itemName: string, unitPrice: number, planet: string, source: PriceSource) => void;
  onDeletePrice: (id: string) => void;
}

export function PriceTracker({ prices, onAddPrice, onDeletePrice }: Props) {
  const [itemName, setItemName] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [planet, setPlanet] = useState('');
  const [source, setSource] = useState<PriceSource>('observed');
  
  const [search, setSearch] = useState('');

  const handleAdd = () => {
    if (!itemName || !planet) return;
    const p = parseInt(unitPrice, 10) || 0;
    onAddPrice(itemName, p, planet.trim(), source);
    setItemName('');
    setUnitPrice('');
  };

  const filteredPrices = prices
    .filter((p) => !search || p.item_name.toLowerCase().includes(search.toLowerCase()))
    .slice(0, 50); // Show max 50 for performance

  const inputCls = 'w-full bg-slate-800 border border-slate-700 rounded-md px-2.5 py-1 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-teal-600 transition-colors';

  return (
    <div className="space-y-6">
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Price Observer</h3>

      {/* Add Form (Inline) */}
      <div className="flex flex-wrap items-end gap-2 p-2 bg-slate-800/30 border border-slate-700 rounded-md">
        <div className="flex-1 min-w-[120px]">
          <input
            type="text" list="price-item-list" value={itemName} onChange={(e) => setItemName(e.target.value)}
            placeholder="Item" className={inputCls}
          />
          <datalist id="price-item-list">
            {ALL_ITEMS.map((item) => <option key={item.id} value={item.name} />)}
          </datalist>
        </div>
        <div className="w-24">
          <input type="number" min="0" value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} placeholder="Price (K)" className={`${inputCls} font-mono`} />
        </div>
        <div className="w-28">
          <input type="text" value={planet} onChange={(e) => setPlanet(e.target.value)} placeholder="Planet" className={inputCls} />
        </div>
        <div className="w-28">
          <select value={source} onChange={(e) => setSource(e.target.value as PriceSource)} className={inputCls}>
            {SOURCE_OPTS.map((s) => <option key={s} value={s}>{PRICE_SOURCE_LABELS[s]}</option>)}
          </select>
        </div>
        <button
          onClick={handleAdd}
          disabled={!itemName || !planet}
          className="bg-slate-700/50 hover:bg-slate-600 text-slate-200 px-3 py-1 rounded text-xs transition-colors h-7 disabled:opacity-30"
        >
          Track
        </button>
      </div>

      {/* Observation List */}
      <div>
        <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
           <h4 className="text-[10px] text-slate-500 uppercase tracking-wider">Recent Observations</h4>
           <input 
             type="text" placeholder="Filter items..." value={search} onChange={(e) => setSearch(e.target.value)}
             className="bg-slate-900 border border-slate-800 rounded px-2 py-0.5 text-[10px] text-slate-300 w-32 focus:outline-none focus:border-slate-600"
           />
        </div>
        
        {filteredPrices.length === 0 ? (
          <p className="text-xs text-slate-600 italic py-4 text-center">No prices tracked yet. Document market rates to identify trade routes.</p>
        ) : (
          <div className="space-y-1 max-h-96 overflow-y-auto">
            {filteredPrices.map((p) => (
              <div key={p.id} className="flex items-center justify-between py-1.5 px-3 hover:bg-slate-800/30 rounded group text-xs border border-transparent transition-colors">
                <div className="flex items-center gap-4 w-1/2">
                   <span className="text-slate-200 truncate">{p.item_name}</span>
                   <span className="text-[10px] text-slate-500 truncate">{p.planet}</span>
                </div>
                <div className="flex items-center justify-end gap-4 w-1/2">
                   <span className="text-[9px] text-slate-600">{PRICE_SOURCE_LABELS[p.source]}</span>
                   <span className="font-mono text-emerald-400 w-16 text-right">{p.unit_price} K</span>
                   <button onClick={() => onDeletePrice(p.id)} className="text-[10px] text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
