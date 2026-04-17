/**
 * planet-select.tsx
 * Planet picker used across tools (Atlas, Directory, Market, etc.).
 * One concern: consistent planet selection with biome color indicators.
 */

'use client';

import { getConfirmedPlanets, BIOME_COLORS, type Planet } from '@/data/shared/planets';

const CONFIRMED_PLANETS = getConfirmedPlanets();

export interface PlanetSelectProps {
  value: string;
  onChange: (planetId: string) => void;
  /** Show "Any planet" as first option */
  includeAny?: boolean;
  anyLabel?: string;
  className?: string;
  label?: string;
}

export function PlanetSelect({
  value,
  onChange,
  includeAny = true,
  anyLabel = 'Any planet',
  className = '',
  label,
}: PlanetSelectProps) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label className="text-[10px] text-slate-500 uppercase tracking-wider">
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          bg-slate-800 border border-slate-700 rounded-md
          px-2.5 py-1.5 text-xs text-slate-200
          focus:outline-none focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600/40
          transition-colors
        "
      >
        {includeAny && <option value="">— {anyLabel} —</option>}
        {CONFIRMED_PLANETS.map((planet) => (
          <option key={planet.id} value={planet.id}>
            {planet.name}
          </option>
        ))}
      </select>
    </div>
  );
}

/** Inline planet badge (non-interactive) */
export function PlanetBadge({ planet }: { planet: Planet | string }) {
  const p =
    typeof planet === 'string'
      ? CONFIRMED_PLANETS.find((pl) => pl.id === planet)
      : planet;

  if (!p) return <span className="text-slate-500 text-xs">Unknown</span>;

  const colorClass = BIOME_COLORS[p.biome];

  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium ${colorClass}`}>
      <span className="text-[8px]">●</span>
      {p.name}
    </span>
  );
}

/** Compact pill-style planet filter buttons */
export interface PlanetFilterProps {
  selected: string;
  onChange: (planetId: string) => void;
  includeAll?: boolean;
}

export function PlanetFilter({ selected, onChange, includeAll = true }: PlanetFilterProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {includeAll && (
        <button
          onClick={() => onChange('')}
          className={`px-2.5 py-1 rounded-full text-xs border transition-colors ${
            selected === ''
              ? 'bg-cyan-800/50 text-cyan-200 border-cyan-700'
              : 'bg-slate-800/30 text-slate-400 border-slate-700 hover:border-slate-600 hover:text-slate-300'
          }`}
        >
          All
        </button>
      )}
      {CONFIRMED_PLANETS.filter((p) => p.id !== 'unknown').map((planet) => {
        const isActive = selected === planet.id;
        return (
          <button
            key={planet.id}
            onClick={() => onChange(planet.id)}
            className={`px-2.5 py-1 rounded-full text-xs border transition-colors ${
              isActive
                ? 'bg-cyan-800/50 text-cyan-200 border-cyan-700'
                : 'bg-slate-800/30 text-slate-400 border-slate-700 hover:border-slate-600 hover:text-slate-300'
            }`}
          >
            {planet.name}
          </button>
        );
      })}
    </div>
  );
}
