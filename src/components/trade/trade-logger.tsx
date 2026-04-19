/**
 * trade-logger.tsx
 * Form and history for manual trades (player-to-player).
 * One concern: log sales and purchases with basic transaction history.
 */

'use client';

import { useState } from 'react';
import type { TradeTransaction, TradeType } from '@/types/trade';
import { getAllItems } from '@/data/items/index';

const ALL_ITEMS = getAllItems();

interface Props {
  trades: TradeTransaction[];
  onAddTrade: (trade: Omit<TradeTransaction, 'id'>) => void;
  onDeleteTrade: (id: string) => void;
}

export function TradeLogger({ trades, onAddTrade, onDeleteTrade }: Props) {
  const [type, setType] = useState<TradeType>('sale');
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [counterparty, setCounterparty] = useState('');
  const [planet, setPlanet] = useState('');
  const [notes, setNotes] = useState('');

  const handleAdd = () => {
    if (!itemName) return;
    const q = parseInt(quantity, 10) || 1;
    const p = parseInt(unitPrice, 10) || 0;
    
    onAddTrade({
      type,
      item_name: itemName,
      quantity: q,
      unit_price: p,
      total: q * p,
      counterparty: counterparty.trim() || undefined,
      planet: planet.trim(),
      date: new Date().toISOString(),
      notes: notes.trim() || undefined,
    });

    setItemName('');
    setQuantity('');
    setUnitPrice('');
    setCounterparty('');
    setNotes('');
  };

  const inputCls = 'w-full bg-slate-800 border border-slate-700 rounded-md px-2.5 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-teal-600 transition-colors';
  const recentTrades = trades.slice(0, 10);

  return (
    <div className="space-y-6">
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Direct Trade Log</h3>

      {/* Log Form */}
      <div className="space-y-3">
        <div className="flex bg-slate-800 rounded-md border border-slate-700 overflow-hidden w-fit">
          <button
            onClick={() => setType('sale')}
            className={`px-4 py-1.5 text-xs font-medium transition-colors ${
              type === 'sale' ? 'bg-emerald-900/50 text-emerald-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            I Sold
          </button>
          <button
            onClick={() => setType('purchase')}
            className={`px-4 py-1.5 text-xs font-medium transition-colors border-l border-slate-700 ${
              type === 'purchase' ? 'bg-red-900/50 text-red-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            I Bought
          </button>
        </div>

        <div>
          <label className="block text-[10px] text-slate-500 mb-1 uppercase tracking-wider">Item Name</label>
          <input
            type="text" list="trade-item-list" value={itemName} onChange={(e) => setItemName(e.target.value)}
            placeholder="Item" className={inputCls}
          />
          <datalist id="trade-item-list">
            {ALL_ITEMS.map((item) => <option key={item.id} value={item.name} />)}
          </datalist>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] text-slate-500 mb-1 uppercase tracking-wider">Qty</label>
            <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="1" className={inputCls} />
          </div>
          <div>
            <label className="block text-[10px] text-slate-500 mb-1 uppercase tracking-wider">Unit Price (K)</label>
            <input type="number" min="0" value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} placeholder="0" className={`${inputCls} font-mono`} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] text-slate-500 mb-1 uppercase tracking-wider">Player Name</label>
            <input type="text" value={counterparty} onChange={(e) => setCounterparty(e.target.value)} placeholder="Optional" className={inputCls} />
          </div>
          <div>
            <label className="block text-[10px] text-slate-500 mb-1 uppercase tracking-wider">Planet</label>
            <input type="text" value={planet} onChange={(e) => setPlanet(e.target.value)} placeholder="Optional" className={inputCls} />
          </div>
        </div>

        <button
          onClick={handleAdd}
          disabled={!itemName}
          className={`w-full px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
            type === 'sale' ? 'bg-emerald-800/40 text-emerald-300 hover:bg-emerald-800/60' : 'bg-red-800/40 text-red-300 hover:bg-red-800/60'
          } disabled:opacity-30`}
        >
          Log {type === 'sale' ? 'Sale' : 'Purchase'}
        </button>
      </div>

      {/* Recent Trades List */}
      <div>
        <h4 className="text-[10px] text-slate-500 uppercase tracking-wider mb-2 border-b border-slate-800 pb-1">Recent Trades</h4>
        {recentTrades.length === 0 ? (
          <p className="text-xs text-slate-600 italic py-2">No direct trades logged.</p>
        ) : (
          <div className="space-y-1">
             {recentTrades.map((t) => (
               <div key={t.id} className="flex items-center justify-between py-1.5 px-2 hover:bg-slate-800/30 rounded group transition-colors">
                 <div className="flex items-center gap-2">
                   {t.type === 'sale' ? (
                     <span className="text-[10px] text-emerald-400 font-bold px-1">S</span>
                   ) : (
                     <span className="text-[10px] text-red-400 font-bold px-1">B</span>
                   )}
                   <div className="flex flex-col">
                     <span className="text-xs text-slate-300">
                       {t.item_name} <span className="text-slate-500">x{t.quantity}</span>
                     </span>
                     {t.counterparty && <span className="text-[9px] text-slate-500">{t.type === 'sale' ? 'to' : 'from'} {t.counterparty}</span>}
                   </div>
                 </div>
                 <div className="flex items-center gap-3">
                   <div className="text-right">
                     <p className={`text-xs font-mono ${t.type === 'sale' ? 'text-emerald-400' : 'text-red-400'}`}>
                       {t.type === 'sale' ? '+' : '-'}{t.total.toLocaleString()} K
                     </p>
                   </div>
                   <button onClick={() => onDeleteTrade(t.id)} className="text-[10px] text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100">×</button>
                 </div>
               </div>
             ))}
          </div>
        )}
      </div>
    </div>
  );
}
