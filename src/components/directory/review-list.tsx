/**
 * review-list.tsx
 * Display list of crafter reviews on a profile page.
 * One concern: rendering review cards with ratings and comments.
 */

import type { CrafterReviewWithReviewer } from '@/types/directory';
import { StarRating } from '@/components/directory/star-rating';

export interface ReviewListProps {
  reviews: CrafterReviewWithReviewer[];
}

export function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <p className="text-sm text-slate-500 text-center py-6">
        No reviews yet. Be the first to leave feedback.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: CrafterReviewWithReviewer }) {
  const date = new Date(review.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="border border-slate-700 bg-slate-800/30 p-3">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <p className="text-xs font-medium text-slate-200">
            {review.reviewer.display_name}
          </p>
          <p className="text-[10px] text-slate-500 font-mono">
            {review.reviewer.in_game_name}
          </p>
        </div>
        <div className="flex flex-col items-end gap-0.5">
          <StarRating rating={review.rating} compact />
          <span className="text-[9px] text-slate-600">{date}</span>
        </div>
      </div>

      {review.comment && (
        <p className="text-xs text-slate-300 leading-relaxed">{review.comment}</p>
      )}

      {review.verified && (
        <span className="mt-1.5 inline-flex items-center gap-1 text-[9px] text-emerald-400">
          ✓ Verified interaction
        </span>
      )}
    </div>
  );
}
