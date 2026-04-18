/**
 * maker-card.tsx
 * Card renderer for a single maker on the /makers listing.
 * One concern: visual summary of a crafter with mark + featured portfolio strip.
 */

import Link from 'next/link';
import type { MakerWithPortfolio } from '@/types/makers';
import { COMMISSION_COLORS, COMMISSION_LABELS } from '@/types/directory';

export interface MakerCardProps {
  maker: MakerWithPortfolio;
}

export function MakerCard({ maker }: MakerCardProps) {
  const markSlug = encodeURIComponent(maker.maker_mark.toLowerCase());

  return (
    <article className="flex flex-col gap-3 p-4 rounded-xl border border-slate-800 bg-slate-900/40 hover:border-amber-800/50 transition-colors">
      {/* Header */}
      <header className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <Link
            href={`/makers/${markSlug}`}
            className="block group"
          >
            <p className="text-xs font-mono uppercase tracking-[0.18em] text-amber-500">
              {maker.maker_mark}
            </p>
            <h3 className="text-sm font-bold text-slate-100 group-hover:text-amber-300 transition-colors truncate">
              {maker.display_name}
              {maker.is_kodaxa_member && (
                <span className="ml-1.5 text-xs font-mono text-amber-400 bg-amber-900/40 border border-amber-700/50 px-1 py-0.5 rounded align-middle">
                  KODAXA
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-500 font-mono truncate">
              @{maker.in_game_name}
              {maker.home_planet && <> · {maker.home_planet}</>}
            </p>
          </Link>
        </div>

        <div className="flex flex-col items-end gap-1 shrink-0">
          <span
            className={`text-xs font-mono uppercase tracking-wider px-1.5 py-0.5 rounded border ${COMMISSION_COLORS[maker.commission_status]}`}
          >
            {COMMISSION_LABELS[maker.commission_status]}
          </span>
          {maker.total_reviews > 0 && (
            <span className="text-xs font-mono text-amber-400">
              ★ {maker.average_rating.toFixed(1)}{' '}
              <span className="text-sr-muted">({maker.total_reviews})</span>
            </span>
          )}
        </div>
      </header>

      {/* Bio */}
      {maker.bio && (
        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
          {maker.bio}
        </p>
      )}

      {/* Specializations */}
      {maker.specializations.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {maker.specializations.slice(0, 4).map((s) => (
            <span
              key={s.profession_id}
              className="text-xs font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300"
            >
              {s.profession_name}
            </span>
          ))}
          {maker.specializations.length > 4 && (
            <span className="text-xs font-mono text-sr-muted">
              +{maker.specializations.length - 4}
            </span>
          )}
        </div>
      )}

      {/* Featured portfolio strip */}
      {maker.featured_items.length > 0 ? (
        <div className="pt-2 mt-auto border-t border-slate-800/60">
          <p className="text-xs font-mono uppercase tracking-wider text-sr-muted mb-1.5">
            Featured Work ({maker.item_count})
          </p>
          <ul className="space-y-1">
            {maker.featured_items.map((item) => (
              <li
                key={item.id}
                className="flex items-baseline justify-between gap-2 text-xs"
              >
                <span className="text-slate-300 truncate">
                  {item.title}
                </span>
                {item.item_type && (
                  <span className="text-xs font-mono text-sr-muted shrink-0">
                    {item.item_type}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-xs text-sr-muted italic mt-auto pt-2 border-t border-slate-800/60">
          No portfolio yet — maker-mark registered, works coming soon.
        </p>
      )}

      <Link
        href={`/makers/${markSlug}`}
        className="text-xs font-mono uppercase tracking-wider text-amber-400 hover:text-amber-300 transition-colors"
      >
        View Maker’s Mark →
      </Link>
    </article>
  );
}
