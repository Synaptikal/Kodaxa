/**
 * stockpile-table.tsx
 * List view of stored inventory items with inline quantity editing.
 * One concern: render items grouped or filterable.
 */

'use client';

import { useState } from 'react';
import type { StockpileEntry, StorageLocation } from '@/types/inventory';
import { STORAGE_LABELS, STORAGE_COLORS } from '@/types/inventory';

interface Props {
  items: StockpileEntry[];
  onUpdate: (id: string, updates: Partial<StockpileEntry>) => void;
  onDelete: (id: string) => void;
}

export function StockpileTable({ items, onUpdate, onDelete }: Props) {
  const [filterLoc, setFilterLoc] = useState<StorageLocation | 'all'>('all');
  const [search, setSearch] = useState('');

  const filtered = items.filter((item) => {
    if (filterLoc !== 'all' && item.storage_location !== filterLoc) return false;
    if (search && !item.item_name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Stockpile</h3>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 sm:w-48 bg-slate-800 border border-slate-700 rounded-md px-2.5 py-1 text-xs text-slate-200 focus:border-teal-600 focus:outline-none"
          />
          <select
            value={filterLoc}
            onChange={(e) => setFilterLoc(e.target.value as any)}
            className="bg-slate-800 border border-slate-700 rounded-md px-2.5 py-1 text-xs text-slate-200 focus:border-teal-600 focus:outline-none"
          >
            <option value="all">All Locations</option>
            {Object.entries(STORAGE_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="flex items-center justify-center h-32 border border-slate-800 rounded-lg border-dashed">
          <p className="text-slate-500 text-sm">Your stockpile is empty.</p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
          <div className="max-h-96 overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-800/50 text-[10px] text-slate-500 uppercase tracking-wider sticky top-0 backdrop-blur-sm">
                <tr>
                  <th className="px-4 py-2 font-medium">Item</th>
                  <th className="px-4 py-2 font-medium">Location</th>
                  <th className="px-4 py-2 font-medium text-right">Quantity</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-2.5">
                      <div className="text-sm text-slate-200">{item.item_name}</div>
                      {item.planet_source && (
                        <div className="text-[10px] text-slate-500 mt-0.5">from {item.planet_source}</div>
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      <select
                        value={item.storage_location}
                        onChange={(e) => onUpdate(item.id, { storage_location: e.target.value as StorageLocation })}
                        className={`text-[10px] px-1.5 py-0.5 rounded border focus:outline-none appearance-none cursor-pointer ${STORAGE_COLORS[item.storage_location]} bg-slate-950`}
                      >
                        {Object.entries(STORAGE_LABELS).map(([k, v]) => (
                          <option key={k} value={k} className="bg-slate-900 text-slate-300">{v}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => onUpdate(item.id, { quantity: parseInt(e.target.value, 10) || 0 })}
                        className="w-16 bg-transparent border-b border-transparent hover:border-slate-700 focus:border-teal-500 focus:outline-none text-right font-mono text-sm text-emerald-400"
                        min="0"
                      />
                    </td>
                    <td className="px-4 py-2.5 text-right w-12">
                      <button
                        onClick={() => onDelete(item.id)}
                        className="text-xs text-slate-600 hover:text-red-400 p-1"
                        title="Remove item"
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-slate-500 text-sm">
                      No items match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
