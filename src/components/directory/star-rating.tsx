'use client';

/**
 * star-rating.tsx
 * Star rating display component.
 * One concern: rendering a 1-5 star rating with optional review count.
 */

export interface StarRatingProps {
  rating: number;
  count?: number;
  compact?: boolean;
  /** If provided, renders interactive stars for input */
  onRate?: (value: number) => void;
  interactive?: boolean;
}

export function StarRating({
  rating,
  count,
  compact = false,
  onRate,
  interactive = false,
}: StarRatingProps) {
  const rounded = Math.round(rating * 2) / 2; // round to nearest 0.5

  return (
    <div className="flex items-center gap-1">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= rounded;
          const half = !filled && star - 0.5 <= rounded;

          return (
            <button
              key={star}
              onClick={() => interactive && onRate?.(star)}
              disabled={!interactive}
              className={`text-base leading-none transition-colors ${
                interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'
              }`}
              aria-label={`${star} star${star !== 1 ? 's' : ''}`}
            >
              <span
                className={
                  filled
                    ? 'text-amber-400'
                    : half
                    ? 'text-amber-400/60'
                    : 'text-slate-600'
                }
              >
                ★
              </span>
            </button>
          );
        })}
      </div>

      {!compact && rating > 0 && (
        <span className="text-xs text-slate-300 font-mono">
          {rating.toFixed(1)}
        </span>
      )}

      {count !== undefined && count > 0 && (
        <span className={`text-slate-500 ${compact ? 'text-[10px]' : 'text-xs'}`}>
          ({count})
        </span>
      )}

      {(!count || count === 0) && !compact && (
        <span className="text-xs text-slate-600">No reviews yet</span>
      )}
    </div>
  );
}
