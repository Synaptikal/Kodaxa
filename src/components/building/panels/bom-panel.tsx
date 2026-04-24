'use client';

import { useMemo } from 'react';
import { calculateBom } from '@/lib/building/bom-calculator';
import type { PlacedCell } from '@/types/building';
import { TILE_CAP, LIGHT_CAP } from '@/data/building';
import { ArrowRightIcon } from 'lucide-react';
import Link from 'next/link';

interface BomPanelProps {
  cells: PlacedCell[];
}

export function BomPanel({ cells }: BomPanelProps) {
  const bom = useMemo(() => calculateBom(cells), [cells]);

  const tileProgress = Math.min((bom.totalTiles / TILE_CAP) * 100, 100);
  const lightProgress = Math.min((bom.totalLights / LIGHT_CAP) * 100, 100);

  // Filter for valid resources to send to crafting calc
  const hasCraftingHandoff = bom.byResource.some(r => r.source === 'crafted' || r.source === 'refined');
  const handoffUrl = useMemo(() => {
    if (!hasCraftingHandoff) return '#';
    const resourceStr = bom.byResource
      .filter(r => r.source === 'crafted' || r.source === 'refined')
      .map(r => `${r.resourceId}:${r.total}`)
      .join(',');
    return `/crafting?resources=${resourceStr}`;
  }, [bom, hasCraftingHandoff]);

  if (cells.length === 0) {
    return (
      <div className="flex flex-col p-4 border-b border-stone-800 gap-1">
        <h3 className="text-xs uppercase tracking-widest font-bold text-stone-500">Bill of Materials</h3>
        <p className="text-[9px] font-mono text-stone-600 leading-relaxed">
          Build shopping list generated from your design.
        </p>
        <p className="text-[9px] font-mono text-stone-700 leading-relaxed">
          Place blocks to see material totals, cap usage, and a crafting handoff.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col border-b border-white/5 bg-black/20 backdrop-blur-md relative overflow-hidden">
      
      {/* Cap Tracker */}
      <div className="p-4 border-b border-white/5 bg-white/[0.02]">
        <div className="flex justify-between items-end mb-1">
          <span className="text-xs uppercase tracking-widest font-bold text-stone-500">Homestead Cap</span>
          <span className={`text-sm font-bold ${bom.capExceeded ? 'text-red-500' : bom.capWarning ? 'text-amber-500' : 'text-stone-300'}`}>
            {bom.totalTiles} / {TILE_CAP}
          </span>
        </div>
        <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden mb-3 shadow-inner">
          <div 
            className={`h-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(0,0,0,0.5)] ${bom.capExceeded ? 'bg-red-500 shadow-red-500/50' : bom.capWarning ? 'bg-amber-400 shadow-amber-400/50' : 'bg-cyan-400 shadow-cyan-400/50'}`}
            style={{ width: `${tileProgress}%` }}
          />
        </div>
        {bom.capExceeded && (
          <p className="text-[10px] text-red-400 leading-tight mb-3 font-medium animate-pulse">
            Build exceeds the authorized tile limit. You will not be able to finalize this in-game.
          </p>
        )}

        <div className="flex justify-between items-end mb-1">
          <span className="text-[10px] uppercase font-bold text-stone-600">Light Limits</span>
          <span className={`text-xs ${bom.lightExceeded ? 'text-red-500' : bom.lightWarning ? 'text-amber-500' : 'text-stone-400'}`}>
            {bom.totalLights} / {LIGHT_CAP}
          </span>
        </div>
        <div className="h-1 w-full bg-black/40 rounded-full overflow-hidden shadow-inner">
          <div 
            className={`h-full transition-all duration-700 ease-out shadow-[0_0_8px_rgba(0,0,0,0.5)] ${bom.lightExceeded ? 'bg-red-500 shadow-red-500/50' : bom.lightWarning ? 'bg-amber-400 shadow-amber-400/50' : 'bg-yellow-400 shadow-yellow-400/50'}`}
            style={{ width: `${lightProgress}%` }}
          />
        </div>
      </div>

      {/* Resource List */}
      <div className="p-4 flex flex-col gap-3">
        <h3 className="text-xs uppercase tracking-widest font-bold text-stone-500">Materials Needed</h3>
        
        <div className="flex flex-col gap-2 relative z-10">
          {bom.byResource.map(res => (
            <div key={res.resourceId} className="flex flex-col gap-1 p-2 rounded-md bg-white/[0.01] hover:bg-white/[0.05] border border-transparent hover:border-white/10 transition-all duration-300 group">
              <div className="flex justify-between items-baseline group">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-stone-300 group-hover:text-cyan-300 transition-colors duration-200">
                    {res.resourceName}
                  </span>
                  {res.hasEstimate && (
                    <span className="text-[8px] uppercase tracking-wider font-bold bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded shadow-[0_0_8px_rgba(251,191,36,0.2)]">
                      ~approx
                    </span>
                  )}
                </div>
                <span className="text-sm font-bold text-white tabular-nums drop-shadow-md">{res.total}</span>
              </div>
              <span className="text-[9px] text-stone-500 line-clamp-1 group-hover:text-stone-400 transition-colors duration-200">{res.sourceHint}</span>
            </div>
          ))}
        </div>

        {hasCraftingHandoff && (
          <Link
            href={handoffUrl}
            className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 bg-cyan-600/10 hover:bg-cyan-600/20 text-cyan-400 hover:text-cyan-300 text-xs font-bold uppercase tracking-widest transition-colors border border-cyan-700/50 hover:border-cyan-600/70"
          >
            <span>Open in Crafting Calc</span>
            <ArrowRightIcon className="w-3 h-3" />
          </Link>
        )}
      </div>

    </div>
  );
}
