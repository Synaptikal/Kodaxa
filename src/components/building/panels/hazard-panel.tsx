'use client';

import { useMemo } from 'react';
import { analyzeHazards } from '@/lib/building/hazard-analyzer';
import type { PlacedCell } from '@/types/building';
import { AlertTriangleIcon, CheckCircle2Icon, ShieldAlertIcon } from 'lucide-react';

interface HazardPanelProps {
  cells: PlacedCell[];
  claimX: number;
  claimZ: number;
}

export function HazardPanel({ cells, claimX, claimZ }: HazardPanelProps) {
  const hazards = useMemo(() => analyzeHazards(cells, claimX, claimZ), [cells, claimX, claimZ]);

  if (cells.length === 0) return null;

  if (hazards.length === 0) {
    return (
      <div className="p-4 border-b border-white/5 bg-black/20 backdrop-blur-md flex items-start gap-3 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none" />
        <CheckCircle2Icon className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
        <div className="relative z-10">
          <h3 className="text-xs uppercase tracking-widest font-bold text-emerald-400 mb-1 drop-shadow-sm">Structural Check</h3>
          <p className="text-[10px] text-stone-300 leading-relaxed">
            No hazards detected. Spans are supported and build is within bounds.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 border-b border-white/5 bg-black/20 backdrop-blur-md flex flex-col gap-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500/20 to-transparent" />
      <h3 className="text-xs uppercase tracking-widest font-bold text-stone-300 flex items-center gap-3 drop-shadow-sm">
        Structural Hazards
        <span className="px-2 py-0.5 rounded-md bg-red-500/20 text-red-400 text-[10px] font-bold border border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.2)] animate-pulse">
          {hazards.length}
        </span>
      </h3>

      <div className="flex flex-col gap-2">
        {hazards.map(hazard => {
          const isRisk = hazard.type === 'collapse_risk';
          const isOob = hazard.type === 'out_of_bounds';
          
          let Icon = AlertTriangleIcon;
          let colorClass = 'text-amber-400';
          let bgClass = 'bg-gradient-to-r from-amber-500/10 to-transparent border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.05)]';
          let shadowClass = 'drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]';
          
          if (isRisk || isOob) {
            Icon = ShieldAlertIcon;
            colorClass = 'text-red-400';
            bgClass = 'bg-gradient-to-r from-red-500/10 to-transparent border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.1)]';
            shadowClass = 'drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]';
          }

          return (
            <div 
              key={hazard.id} 
              className={`p-3 rounded-lg border backdrop-blur-sm flex items-start gap-3 transition-transform duration-300 hover:scale-[1.02] ${bgClass}`}
            >
              <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${colorClass} ${shadowClass}`} />
              <div className="flex flex-col gap-1 z-10">
                <span className={`text-[10px] font-bold uppercase tracking-widest ${colorClass}`}>
                  {isRisk ? 'Collapse Risk' : isOob ? 'Boundary Violation' : 'Collapse Warning'}
                </span>
                <span className="text-xs text-stone-300 leading-relaxed font-medium">
                  {hazard.message}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
