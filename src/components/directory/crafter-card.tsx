/**
 * crafter-card.tsx
 * Directory listing card for a single crafter.
 * One concern: displaying crafter summary info in the directory grid.
 */

import Link from 'next/link';
import type { CrafterSummary } from '@/types/directory';
import { COMMISSION_LABELS, COMMISSION_COLORS } from '@/types/directory';
import { StarRating } from '@/components/directory/star-rating';

export interface CrafterCardProps {
  crafter: CrafterSummary;
}

/** Category accent colors for specialization chips */
const CATEGORY_CHIP: Record<string, string> = {
  crafting:       'bg-orange-900/40 text-orange-300',
  harvesting:     'bg-lime-900/40 text-lime-300',
  scouting:       'bg-emerald-900/40 text-emerald-300',
  combat:         'bg-red-900/40 text-red-300',
  social:         'bg-sky-900/40 text-sky-300',
  science:        'bg-violet-900/40 text-violet-300',
  infrastructure: 'bg-amber-900/40 text-amber-300',
};

export function CrafterCard({ crafter }: CrafterCardProps) {
  const commissionColor = COMMISSION_COLORS[crafter.commission_status];
  const commissionLabel = COMMISSION_LABELS[crafter.commission_status];

  return (
    <Link
      href={`/directory/${encodeURIComponent(crafter.in_game_name)}`}
      className="group flex flex-col gap-3 p-4 rounded-xl border border-slate-700 bg-slate-800/30 hover:bg-slate-800/60 hover:border-slate-600 transition-all"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h3 className="text-sm font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors">
              {crafter.display_name}
            </h3>
            {crafter.is_kodaxa_member && (
              <span className="shrink-0 text-[8px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-900/40 border border-amber-700/40 text-amber-400 uppercase tracking-wider">
                Kodaxa
              </span>
            )}
          </div>
          <p className="text-[10px] text-slate-500 font-mono">{crafter.in_game_name}</p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-medium border ${commissionColor}`}
        >
          {commissionLabel}
        </span>
      </div>

      {/* Bio */}
      {crafter.bio && (
        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
          {crafter.bio}
        </p>
      )}

      {/* Specialization chips */}
      {crafter.specializations.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {crafter.specializations.slice(0, 4).map((s) => (
            <span
              key={s.profession_id}
              className={`rounded-full px-2 py-0.5 text-[9px] font-medium ${
                CATEGORY_CHIP[s.category] ?? 'bg-slate-700 text-slate-300'
              }`}
            >
              {s.profession_name}
            </span>
          ))}
          {crafter.specializations.length > 4 && (
            <span className="text-[9px] text-slate-500 self-center">
              +{crafter.specializations.length - 4} more
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto">
        <StarRating rating={crafter.average_rating} count={crafter.total_reviews} compact />
        {crafter.home_planet && (
          <span className="text-[10px] text-slate-500 truncate">
            {crafter.home_planet}
          </span>
        )}
      </div>
    </Link>
  );
}
