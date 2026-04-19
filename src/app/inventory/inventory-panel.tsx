'use client';

import { useStockpile, useToolRegistry, useCrateConfig } from '@/hooks/use-inventory';
import { InventoryForm } from '@/components/inventory/inventory-form';
import { StockpileTable } from '@/components/inventory/stockpile-table';
import { ToolRegistry } from '@/components/inventory/tool-registry';
import { CrateManager } from '@/components/inventory/crate-manager';

/**
 * InventoryPanel
 * Client component that hydrates local data and orchestrates the inventory widgets.
 */
export default function InventoryPanel() {
  const { 
    items: stockpile, hydrated: stockHydrated, addItem: addStock, updateItem: updateStock, deleteItem: delStock,
    totalQuantity
  } = useStockpile();
  
  const { 
    tools, hydrated: toolsHydrated, addTool, deleteTool 
  } = useToolRegistry();
  
  const { 
    crates, hydrated: cratesHydrated, updateCrate, addPermission, removePermission 
  } = useCrateConfig();

  const isHydrated = stockHydrated && toolsHydrated && cratesHydrated;

  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Summary Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-800/40 border border-slate-700 rounded-lg px-4 py-3">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-mono mb-1">Total Items</p>
          <p className="text-lg font-bold font-mono text-teal-400">{totalQuantity.toLocaleString()}</p>
          <p className="text-[10px] text-slate-600">units spanning {stockpile.length} stacks</p>
        </div>
        <div className="bg-slate-800/40 border border-slate-700 rounded-lg px-4 py-3">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-mono mb-1">Registered Tools</p>
          <p className="text-lg font-bold font-mono text-amber-400">{tools.length}</p>
          <p className="text-[10px] text-slate-600">active loadouts</p>
        </div>
        <div className="bg-slate-800/40 border border-slate-700 rounded-lg px-4 py-3 col-span-2">
           <p className="text-[10px] text-slate-500 uppercase tracking-wider font-mono mb-1">Shared Access</p>
           <p className="text-lg font-bold font-mono text-slate-200">
             {new Set(crates.flatMap(c => c.shared_with)).size}
           </p>
           <p className="text-[10px] text-slate-600">unique corp members with crate access</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Forms & Crates */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
            <InventoryForm 
              onAddStockpile={addStock}
              onAddTool={addTool}
            />
          </div>
          
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
            <ToolRegistry 
              tools={tools}
              onDelete={deleteTool}
            />
          </div>
        </div>

        {/* Right Column: Stockpile & Crates */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
            <StockpileTable 
              items={stockpile}
              onUpdate={updateStock}
              onDelete={delStock}
            />
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
            <CrateManager 
              crates={crates}
              onUpdate={updateCrate}
              onAddPermission={addPermission}
              onRemovePermission={removePermission}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
