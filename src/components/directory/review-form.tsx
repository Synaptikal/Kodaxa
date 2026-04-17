/**
 * review-form.tsx
 * Form for submitting a review on a crafter's profile.
 * One concern: collecting rating + comment and calling submitReview action.
 */

'use client';

import { useState, useTransition } from 'react';
import { StarRating } from '@/components/directory/star-rating';
import { submitReview } from '@/lib/directory/actions';

export interface ReviewFormProps {
  revieweeId: string;
  professionId?: string;
}

export function ReviewForm({ revieweeId, professionId }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    if (rating === 0) {
      setError('Please select a rating.');
      return;
    }
    setError(null);

    startTransition(async () => {
      const result = await submitReview({
        reviewee_id: revieweeId,
        rating,
        comment: comment.trim() || undefined,
        profession_id: professionId,
      });

      if (result.success) {
        setSubmitted(true);
      } else {
        setError(result.error ?? 'System fault — review transmission failed.');
      }
    });
  };

  if (submitted) {
    return (
      <div className="border border-teal-700/40 bg-teal-950/20 p-3 text-center">
        <p className="text-xs font-mono text-teal-300 uppercase tracking-wider">✓ Review Transmitted</p>
      </div>
    );
  }

  return (
    <div className="border border-sr-border bg-sr-surface/40 p-3 space-y-3">
      <h4 className="text-[8px] font-mono text-slate-500 uppercase tracking-[0.25em]">
        File a Review
      </h4>

      {/* Star selector */}
      <div>
        <p className="text-[10px] text-slate-500 mb-1">Your rating</p>
        <StarRating
          rating={rating}
          interactive
          onRate={setRating}
        />
      </div>

      {/* Comment */}
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Describe your experience (optional)..."
        rows={3}
        maxLength={500}
        className="w-full bg-slate-900 border border-slate-600 rounded-md px-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none resize-none"
      />

      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}

      <button
        onClick={handleSubmit}
        disabled={isPending}
        className="w-full py-2 bg-cyan-600/20 border border-cyan-700/60 text-cyan-300 text-[10px] font-mono font-semibold uppercase tracking-wide hover:bg-cyan-600/30 disabled:opacity-50 transition-all"
      >
        {isPending ? 'Transmitting…' : 'Transmit Review'}
      </button>
    </div>
  );
}
