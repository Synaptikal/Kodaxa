/**
 * app/directory/[in_game_name]/page.tsx
 * Public crafter profile page with commission request button.
 */

import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { getCrafterProfile } from '@/lib/directory/queries';
import { ProfileHeader } from '@/components/directory/profile-header';
import { ReviewList } from '@/components/directory/review-list';
import { ReviewForm } from '@/components/directory/review-form';
import { CommissionButton } from '@/components/corp/commission-button';
import { NavHeader } from '@/components/ui/nav-header';

interface PageProps {
  params: Promise<{ in_game_name: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { in_game_name } = await params;
  const name = decodeURIComponent(in_game_name);
  return {
    title: `${name} – Commerce Registry`,
    description: `View ${name}'s Stars Reach crafter profile, specializations, and reviews.`,
  };
}

export default async function CrafterProfilePage({ params }: PageProps) {
  const { in_game_name } = await params;
  const decodedName = decodeURIComponent(in_game_name);

  const supabase = await createClient();
  const [profile, { data: { user } }] = await Promise.all([
    getCrafterProfile(decodedName),
    supabase.auth.getUser(),
  ]);

  if (!profile) notFound();

  const isOwn      = user?.id === profile.id;
  const hasReviewed = user ? profile.reviews.some((r) => r.reviewer_id === user.id) : false;
  const canReview  = !!user && !isOwn && !hasReviewed;
  // Can commission if logged in, not own profile, and crafter is open/limited
  const canCommission = !!user && !isOwn && profile.commission_status !== 'closed';

  return (
    <div className="min-h-screen bg-sr-bg text-slate-100">
      <NavHeader />

      <main className="mx-auto max-w-3xl px-4 py-8 space-y-6">
        <a
          href="/directory"
          className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 transition-colors"
        >
          ← Back to Directory
        </a>

        <ProfileHeader profile={profile} isOwn={isOwn} />

        {/* Commission CTA */}
        {canCommission && (
          <div className="border border-amber-800/30 bg-amber-900/10 p-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-amber-300 font-mono">Commission this Operative</p>
              <p className="text-[10px] text-slate-500 mt-0.5">
                {profile.commission_status === 'limited'
                  ? 'Taking select commissions — reach out before submitting.'
                  : 'Currently accepting commission requests.'}
              </p>
            </div>
            <CommissionButton assigneeId={profile.id} assigneeName={profile.in_game_name} />
          </div>
        )}

        {!user && profile.commission_status !== 'closed' && (
          <div className="border border-slate-800 bg-slate-900/20 p-3 text-center">
            <p className="text-xs text-slate-500">
              <a href="/auth/sign-in" className="text-cyan-500 hover:text-cyan-400">Sign in</a>{' '}
              to submit a commission request or leave a review.
            </p>
          </div>
        )}

        {/* Reviews */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Reviews</h2>
          <ReviewList reviews={profile.reviews} />

          {canReview && (
            <Suspense fallback={null}>
              <ReviewForm revieweeId={profile.id} />
            </Suspense>
          )}

          {user && !isOwn && hasReviewed && (
            <p className="text-xs text-slate-600 text-center pt-2">
              You&apos;ve already submitted a review for this operative.
            </p>
          )}
        </section>
      </main>
    </div>
  );
}
