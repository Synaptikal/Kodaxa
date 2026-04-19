/**
 * inventory-form.tsx
 * Quick-add form for the stockpile and tool registry.
 * One concern: capture new items or tools, providing autocomplete for item taxonomy.
 */

'use client';

import { useState, useCallback } from 'react';
import type { StockpileEntry, ToolEntry, StorageLocation } from '@/types/inventory';
import { STORAGE_LABELS } from '@/types/inventory';
import { getAllItems } from '@/data/items/index';
import { getProfessionSummaries } from '@/data/professions/index';

const ALL_ITEMS = getAllItems();
const ALL_PROFESSIONS = getProfessionSummaries();
const STORAGE_OPTS = Object.keys(STORAGE_LABELS) as StorageLocation[];

interface Props {
  onAddStockpile: (item: Omit<StockpileEntry, 'id' | 'updated_at'>) => void;
  onAddTool: (tool: Omit<ToolEntry, 'id' | 'updated_at'>) => void;
}

export function InventoryForm({ onAddStockpile, onAddTool }: Props) {
  const [mode, setMode] = useState<'item' | 'tool'>('item');

  // Item states
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [location, setLocation] = useState<StorageLocation>('backpack');
  const [planet, setPlanet] = useState('');

  // Tool states
  const [toolName, setToolName] = useState('');
  const [toolProfId, setToolProfId] = useState('');
  const [toolQuality, setToolQuality] = useState('1');
  const [spec1, setSpec1] = useState('');
  const [spec2, setSpec2] = useState('');

  const submitItem = useCallback(() => {
    if (!itemName) return;
    const q = parseInt(quantity, 10) || 1;
    const refItem = ALL_ITEMS.find((i) => i.name.toLowerCase() === itemName.toLowerCase());
    const category = refItem?.category || 'materials';

    onAddStockpile({
      item_name: itemName,
      item_category: category as any,
      quantity: q,
      storage_location: location,
      planet_source: planet.trim() || undefined,
    });

    setItemName('');
    setQuantity('');
    setPlanet('');
  }, [itemName, quantity, location, planet, onAddStockpile]);

  const submitTool = useCallback(() => {
    if (!toolName || !toolProfId) return;
    const prof = ALL_PROFESSIONS.find((p) => p.id === toolProfId);
    if (!prof) return;

    onAddTool({
      tool_name: toolName,
      profession_id: toolProfId,
      profession_name: prof.name,
      quality_level: parseInt(toolQuality, 10) || 1,
      specials: [spec1 || undefined, spec2 || undefined],
    });

    setToolName('');
    setToolProfId('');
    setToolQuality('1');
    setSpec1('');
    setSpec2('');
  }, [toolName, toolProfId, toolQuality, spec1, spec2, onAddTool]);

  const inputCls = 'w-full bg-slate-800 border border-slate-700 rounded-md px-2.5 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-teal-600 transition-colors';
  const btnCls = 'px-3 py-1.5 rounded-md text-xs font-medium transition-colors w-full mt-3';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Quick Add</h3>
        <div className="flex bg-slate-800 rounded-md border border-slate-700 overflow-hidden">
          <button
            onClick={() => setMode('item')}
            className={`px-3 py-1 text-[10px] font-medium transition-colors ${
              mode === 'item' ? 'bg-teal-900/50 text-teal-300' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Material
          </button>
          <button
            onClick={() => setMode('tool')}
            className={`px-3 py-1 text-[10px] font-medium transition-colors border-l border-slate-700 ${
              mode === 'tool' ? 'bg-amber-900/50 text-amber-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Tool
          </button>
        </div>
      </div>

      {mode === 'item' ? (
        <div className="space-y-3">
          <div>
            <label className="block text-[10px] text-slate-500 mb-1 uppercase tracking-wider">Item Name</label>
            <input
              type="text" list="item-datalist" value={itemName} onChange={(e) => setItemName(e.target.value)}
              placeholder="e.g. Iron Ore" className={inputCls}
            />
            <datalist id="item-datalist">
              {ALL_ITEMS.map((item) => (
                <option key={item.id} value={item.name} />
              ))}
            </datalist>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] text-slate-500 mb-1 uppercase tracking-wider">Quantity</label>
              <input
                type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)}
                placeholder="1" className={inputCls}
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-500 mb-1 uppercase tracking-wider">Planet</label>
              <input
                type="text" value={planet} onChange={(e) => setPlanet(e.target.value)}
                placeholder="Optional" className={inputCls}
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] text-slate-500 mb-1 uppercase tracking-wider">Storage Location</label>
            <select
              value={location} onChange={(e) => setLocation(e.target.value as StorageLocation)}
              className={inputCls}
            >
              {STORAGE_OPTS.map((opt) => (
                <option key={opt} value={opt}>{STORAGE_LABELS[opt]}</option>
              ))}
            </select>
          </div>
          <button
            onClick={submitItem}
            disabled={!itemName}
            className={`${btnCls} bg-teal-800/50 text-teal-200 hover:bg-teal-800/70 disabled:opacity-30 disabled:cursor-not-allowed`}
          >
            Add to Stockpile
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div>
            <label className="block text-[10px] text-slate-500 mb-1 uppercase tracking-wider">Tool Name</label>
            <input
              type="text" value={toolName} onChange={(e) => setToolName(e.target.value)}
              placeholder="e.g. Plasma Extractor" className={inputCls}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] text-slate-500 mb-1 uppercase tracking-wider">Profession</label>
              <select
                value={toolProfId} onChange={(e) => setToolProfId(e.target.value)}
                className={inputCls}
              >
                <option value="">— Select —</option>
                {ALL_PROFESSIONS.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] text-slate-500 mb-1 uppercase tracking-wider">Quality</label>
              <input
                type="number" min="1" max="10" value={toolQuality} onChange={(e) => setToolQuality(e.target.value)}
                className={inputCls}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] text-slate-500 mb-1 uppercase tracking-wider">Special 1</label>
              <input
                type="text" value={spec1} onChange={(e) => setSpec1(e.target.value)}
                placeholder="Optional" className={inputCls}
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-500 mb-1 uppercase tracking-wider">Special 2</label>
              <input
                type="text" value={spec2} onChange={(e) => setSpec2(e.target.value)}
                placeholder="Optional" className={inputCls}
              />
            </div>
          </div>
          <button
            onClick={submitTool}
            disabled={!toolName || !toolProfId}
            className={`${btnCls} bg-amber-800/50 text-amber-200 hover:bg-amber-800/70 disabled:opacity-30 disabled:cursor-not-allowed`}
          >
            Register Tool
          </button>
        </div>
      )}
    </div>
  );
}
