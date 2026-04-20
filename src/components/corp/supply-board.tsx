'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { CorpSupplyRequest, CorpRole } from '@/types/corp';
import { PlusCircle, PackageOpen, Tag, MapPin, Clock, CheckCircle2, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { getAllItems } from '@/data/items/index';

const ALL_ITEMS = getAllItems();

interface SupplyBoardProps {
  requests: CorpSupplyRequest[];
  currentUserId: string;
  currentUserRole: CorpRole;
}

export function SupplyBoard({ requests, currentUserId, currentUserRole }: SupplyBoardProps) {
  const router = useRouter();
  const [filter, setFilter] = useState<'open' | 'fulfilled' | 'all'>('open');
  const [pledgeQuantity, setPledgeQuantity] = useState('');
  const [activeRequestId, setActiveRequestId] = useState<string | null>(null);

  // New Order Form state
  const [isCreating, setIsCreating] = useState(false);
  const [newItemParams, setNewItemParams] = useState({ name: '', quantity: '', planet: '', notes: '' });

  const canCreate = currentUserRole === 'ceo' || currentUserRole === 'officer';

  // Compute stats on client side
  const enrichedRequests = requests.map(req => {
    const pledged_total = req.pledges?.reduce((acc, p) => acc + p.quantity_pledged, 0) || 0;
    const progress = Math.min((pledged_total / req.quantity_needed) * 100, 100);
    return { ...req, pledged_total, progress };
  });

  const filtered = enrichedRequests.filter(req => {
    if (filter === 'open') return req.status === 'open';
    if (filter === 'fulfilled') return req.status === 'fulfilled';
    return true;
  });

  async function handlePledge(requestId: string) {
    if (!pledgeQuantity || isNaN(Number(pledgeQuantity))) return;
    
    const quantity = Number(pledgeQuantity);
    if (quantity <= 0) return;

    const supabase = createClient();
    const { error } = await supabase.from('corp_supply_pledges').insert({
      request_id: requestId,
      claimer_id: currentUserId,
      quantity_pledged: quantity,
      status: 'pending'
    });

    if (!error) {
      setPledgeQuantity('');
      setActiveRequestId(null);
      router.refresh(); // Refresh server data
    } else {
      console.error(error);
    }
  }

  async function handleCreateOrder(e: React.FormEvent) {
    e.preventDefault();
    if (!newItemParams.name || !newItemParams.quantity) return;
    const quantity = parseInt(newItemParams.quantity, 10);
    if (isNaN(quantity) || quantity <= 0) return;

    const supabase = createClient();
    const { error } = await supabase.from('corp_supply_requests').insert({
      poster_id: currentUserId,
      item_name: newItemParams.name,
      quantity_needed: quantity,
      planet_pref: newItemParams.planet.trim() || null,
      notes: newItemParams.notes.trim() || null,
      status: 'open'
    });

    if (!error) {
      setIsCreating(false);
      setNewItemParams({ name: '', quantity: '', planet: '', notes: '' });
      router.refresh();
    } else {
      console.error(error);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sr-border pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <PackageOpen className="w-5 h-5 text-amber-500" />
            Supply Requisitions
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            Corporate resource targets. Post what your division needs, or pledge to fulfill active orders.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-slate-900 border border-sr-border rounded-md p-1">
            <button
              onClick={() => setFilter('open')}
              className={`px-3 py-1 text-xs font-medium rounded-sm transition-colors ${
                filter === 'open' ? 'bg-amber-800/40 text-amber-300' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Open
            </button>
            <button
              onClick={() => setFilter('fulfilled')}
              className={`px-3 py-1 text-xs font-medium rounded-sm transition-colors ${
                filter === 'fulfilled' ? 'bg-slate-700 text-slate-200' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Fulfilled
            </button>
          </div>
          
          {canCreate && (
            <button 
              onClick={() => setIsCreating(!isCreating)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md font-bold text-xs font-mono uppercase tracking-wider transition-colors ${
                isCreating ? 'bg-slate-700 text-slate-300' : 'bg-amber-600 hover:bg-amber-500 text-slate-900'
              }`}
            >
              {isCreating ? <X className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
              {isCreating ? 'Cancel' : 'New Order'}
            </button>
          )}
        </div>
      </div>

      {isCreating && (
        <form onSubmit={handleCreateOrder} className="bg-slate-900 border border-amber-900/50 rounded-xl p-5 mb-6 space-y-4 shadow-lg shadow-amber-900/10">
          <h3 className="text-sm font-bold text-amber-500 uppercase tracking-widest font-mono border-b border-amber-900/30 pb-2">Draft Requisition</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Material Name *</label>
              <input
                type="text" list="supply-item-datalist" required autoFocus
                value={newItemParams.name} onChange={(e) => setNewItemParams({...newItemParams, name: e.target.value})}
                placeholder="e.g. Iron Ore"
                className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-slate-200 outline-none focus:border-amber-500"
              />
              <datalist id="supply-item-datalist">
                {ALL_ITEMS.map((item) => (
                  <option key={item.id} value={item.name} />
                ))}
              </datalist>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Target Quantity *</label>
              <input
                type="number" min="1" required
                value={newItemParams.quantity} onChange={(e) => setNewItemParams({...newItemParams, quantity: e.target.value})}
                placeholder="0"
                className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-slate-200 outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Preferred Planet</label>
              <input
                type="text"
                value={newItemParams.planet} onChange={(e) => setNewItemParams({...newItemParams, planet: e.target.value})}
                placeholder="Optional"
                className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-slate-200 outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Logistics Notes</label>
              <input
                type="text"
                value={newItemParams.notes} onChange={(e) => setNewItemParams({...newItemParams, notes: e.target.value})}
                placeholder="Optional delivery details..."
                className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-slate-200 outline-none focus:border-amber-500"
              />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button type="submit" className="bg-amber-600 hover:bg-amber-500 text-slate-900 px-6 py-2 rounded-md font-bold text-sm tracking-wide transition-colors">
              Post Requisition
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-4">
        {filtered.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-sr-border rounded-xl bg-sr-surface/30">
            <p className="text-slate-400 font-mono text-sm uppercase tracking-widest">No matching requisitions</p>
          </div>
        ) : (
          filtered.map(req => (
            <div key={req.id} className="bg-sr-surface border border-sr-border rounded-xl p-5 overflow-hidden relative group">
              {/* Progress Background */}
              <div 
                className={`absolute top-0 left-0 h-1 transition-all duration-1000 ${
                  req.status === 'fulfilled' ? 'bg-emerald-500 w-full' : 'bg-amber-500'
                }`}
                style={{ width: req.status === 'fulfilled' ? '100%' : `${req.progress}%` }}
              />

              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl font-bold text-slate-100">{req.item_name}</span>
                        {req.status === 'fulfilled' && (
                          <Badge variant="live" className="text-[10px]">FULFILLED</Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono">
                         <span className="flex items-center gap-1">
                           <Clock className="w-3.5 h-3.5" />
                           {new Date(req.created_at).toLocaleDateString()}
                         </span>
                         {req.planet_pref && (
                           <span className="flex items-center gap-1 text-cyan-400/80">
                             <MapPin className="w-3.5 h-3.5" />
                             {req.planet_pref}
                           </span>
                         )}
                         <span className="flex items-center gap-1 text-slate-500">
                           <Tag className="w-3.5 h-3.5" />
                           Req by @{req.poster?.in_game_name || 'System'}
                         </span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-3xl font-mono font-bold text-slate-200">
                        {req.pledged_total?.toLocaleString()} <span className="text-slate-500 text-lg">/ {req.quantity_needed.toLocaleString()}</span>
                      </p>
                    </div>
                  </div>

                  {req.notes && (
                    <p className="text-sm text-slate-300 bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                      {req.notes}
                    </p>
                  )}
                  
                  {/* Pledges */}
                  {req.pledges && req.pledges.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-sr-border/40">
                      <span className="text-xs text-slate-500 font-mono self-center mr-2">Pledges:</span>
                      {req.pledges.map(p => (
                        <div key={p.id} className="text-xs bg-slate-800 border border-slate-700 px-2 py-1 rounded text-slate-300 flex items-center gap-2">
                          <span className="text-amber-400 font-mono">{p.quantity_pledged}</span>
                          <span>@{p.claimer?.in_game_name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Action Panel */}
                <div className="lg:border-l lg:border-sr-border lg:pl-6 flex flex-col justify-center min-w-[200px]">
                  {req.status === 'open' && (
                    <div className="space-y-3">
                      {activeRequestId === req.id ? (
                        <div className="flex gap-2">
                          <input 
                            type="number"
                            min="1"
                            max={req.quantity_needed - (req.pledged_total || 0)}
                            value={pledgeQuantity}
                            onChange={(e) => setPledgeQuantity(e.target.value)}
                            placeholder="Qty"
                            className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm text-slate-200 font-mono focus:border-amber-500 outline-none"
                            autoFocus
                          />
                          <button
                            onClick={() => handlePledge(req.id)}
                            className="bg-amber-600 hover:bg-amber-500 text-slate-900 px-3 rounded font-bold transition-colors"
                          >
                            ✓
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => setActiveRequestId(req.id)}
                          className="w-full py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-md font-mono text-sm tracking-wide text-slate-200 transition-colors"
                        >
                          Pledge Items
                        </button>
                      )}
                      
                      {canCreate && (
                        <button className="w-full py-2 bg-transparent hover:bg-emerald-900/30 border border-sr-border hover:border-emerald-700 rounded-md font-mono text-sm tracking-wide text-emerald-500 transition-colors">
                          Mark Fulfilled
                        </button>
                      )}
                    </div>
                  )}
                  {req.status === 'fulfilled' && (
                    <div className="flex flex-col items-center justify-center text-emerald-500 gap-2 h-full">
                      <CheckCircle2 className="w-8 h-8" />
                      <span className="font-mono text-xs uppercase tracking-widest font-bold">Order Complete</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
