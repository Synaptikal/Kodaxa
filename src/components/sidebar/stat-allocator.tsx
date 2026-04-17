/**
 * stat-allocator.tsx
 * Sidebar widget for allocating the 3 stat pools: Health, Stamina, Focus.
 * One concern: distributing 100 points across 3 pools with validation.
 *
 * Stars Reach gives players a fixed pool of stat points to distribute.
 * Adjusting one slider shifts available points for the others.
 * Total must always equal 100.
 */

'use client';

import { useCallback } from 'react';
import { Tooltip } from '@/components/ui/tooltip';
import type { StatAllocation } from '@/types/build';

const TOTAL = 100;
const MIN_STAT = 10;

const STAT_CONFIG = [
  {
    key: 'health' as const,
    label: 'Health',
    color: 'text-red-400',
    trackColor: 'accent-red-500',
    bgColor: 'bg-red-500',
    barBg: 'bg-red-900/30',
    description: 'Max HP and recovery rate',
  },
  {
    key: 'stamina' as const,
    label: 'Stamina',
    color: 'text-amber-400',
    trackColor: 'accent-amber-500',
    bgColor: 'bg-amber-500',
    barBg: 'bg-amber-900/30',
    description: 'Sprint, jump, tool use costs',
  },
  {
    key: 'focus' as const,
    label: 'Focus',
    color: 'text-sky-400',
    trackColor: 'accent-sky-500',
    bgColor: 'bg-sky-500',
    barBg: 'bg-sky-900/30',
    description: 'Skill cooldowns and XP gain rate',
  },
] as const;

export interface StatAllocatorProps {
  stats: StatAllocation;
  onStatsChange: (stats: StatAllocation) => void;
}

export function StatAllocator({ stats, onStatsChange }: StatAllocatorProps) {
  const total = stats.health + stats.stamina + stats.focus;
  const remaining = TOTAL - total;

  const handleChange = useCallback(
    (key: keyof StatAllocation, rawValue: number) => {
      // Clamp value between MIN and what's available
      const others = TOTAL - stats[key];
      const maxForOthers = (Object.keys(stats) as (keyof StatAllocation)[])
        .filter((k) => k !== key)
        .reduce((sum, k) => sum + MIN_STAT, 0);
      const maxValue = TOTAL - maxForOthers;
      const value = Math.max(MIN_STAT, Math.min(maxValue, rawValue));

      // Distribute the difference across the other two stats proportionally
      const diff = stats[key] - value;
      const otherKeys = (Object.keys(stats) as (keyof StatAllocation)[]).filter((k) => k !== key);
      const otherTotal = otherKeys.reduce((sum, k) => sum + stats[k], 0);

      const newStats = { ...stats, [key]: value };

      if (otherTotal > 0) {
        let leftover = diff;
        otherKeys.forEach((k, i) => {
          if (i === otherKeys.length - 1) {
            // Last key gets remaining to avoid rounding errors
            newStats[k] = Math.max(MIN_STAT, stats[k] + leftover);
          } else {
            const share = Math.round((stats[k] / otherTotal) * diff);
            newStats[k] = Math.max(MIN_STAT, stats[k] + share);
            leftover -= share;
          }
        });
      }

      // Ensure total is exactly 100
      const newTotal = newStats.health + newStats.stamina + newStats.focus;
      if (newTotal !== TOTAL) {
        const adj = TOTAL - newTotal;
        const lastKey = otherKeys[otherKeys.length - 1];
        newStats[lastKey] = Math.max(MIN_STAT, newStats[lastKey] + adj);
      }

      onStatsChange(newStats);
    },
    [stats, onStatsChange],
  );

  return (
    <div className="flex flex-col gap-2 p-3 rounded-lg bg-slate-800/50 border border-slate-700">
      <div className="flex items-baseline justify-between">
        <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1">
          Stat Pools
          <Tooltip content="Distribute 100 points across Health, Stamina, and Focus. Each stat has a minimum of 10. Adjusting one slider redistributes the remainder proportionally.">
            <span className="text-slate-500 hover:text-slate-300 cursor-help text-[10px]">?</span>
          </Tooltip>
        </h3>
        <span
          className={`text-xs font-mono ${Math.abs(remaining) > 0 ? 'text-red-400' : 'text-slate-500'}`}
          title="Should always be 100"
        >
          {total}/{TOTAL}
        </span>
      </div>

      <div className="space-y-2.5">
        {STAT_CONFIG.map(({ key, label, color, trackColor, bgColor, barBg, description }) => {
          const value = stats[key];
          const pct = (value / TOTAL) * 100;
          return (
            <div key={key}>
              <div className="flex items-baseline justify-between mb-1">
                <span className={`text-[11px] font-medium ${color}`}>{label}</span>
                <span className="text-xs font-mono text-slate-300 tabular-nums">{value}</span>
              </div>

              {/* Visual bar */}
              <div className={`relative h-1.5 rounded-full ${barBg} mb-1.5`}>
                <div
                  className={`absolute left-0 top-0 h-full rounded-full ${bgColor} transition-all duration-150`}
                  style={{ width: `${pct}%` }}
                />
              </div>

              {/* Slider input */}
              <input
                type="range"
                min={MIN_STAT}
                max={TOTAL - MIN_STAT * 2}
                value={value}
                onChange={(e) => handleChange(key, Number(e.target.value))}
                className={`w-full h-1 rounded-full appearance-none cursor-pointer ${trackColor}`}
                title={description}
              />
            </div>
          );
        })}
      </div>

      <p className="text-[9px] text-slate-600 leading-tight mt-0.5">
        Adjust to match your preferred playstyle. Total must equal 100.
      </p>
    </div>
  );
}
