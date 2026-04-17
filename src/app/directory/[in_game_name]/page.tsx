/**
 * app/directory/[in_game_name]/page.tsx
 * Public crafter profile page.
 * One concern: fetching and displaying a single crafter's full profile.
 *
 * Dynamic route: /directory/:in_game_name
 * Data is server-fetched. ReviewForm is client-only and wrapped in Suspense.
 */

import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { getCrafterProfile } from '@/lib/directory/queries';
import { ProfileHeader } from '@/components/directory/profile-header';
import { ReviewList } from '@/components/directory/review-list';
import { ReviewForm } from '@/components/directory/review-form';
import { NavHeader } from '@/components/ui/nav-header';

interface PageProps {
  params: Promise<{ in_game_name: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { in_game_name } = await params;
  const name = decodeURIComponent(in_game_name);
  return {
    title: `${name} – Crafter Directory`,
    description: `View ${name}'s Stars Reach crafter profile, specializations, and reviews.`,
  };
}

export default async function CrafterProfilePage({ params }: PageProps) {
  const { in_game_name } = await params;
  const decodedName = decodeURIComponent(in_game_name);

  // Fetch profile + current user in parallel
  const supabase = await createClient();
  const [profile, { data: { user } }] = await Promise.all([
    getCrafterProfile(decodedName),
    supabase.auth.getUser(),
  ]);

  if (!profile) notFound();

  const isOwn = user?.id === profile.id;
  // Has the current user already reviewed this crafter?
  const hasReviewed = user
    ? profile.reviews.some((r) => r.reviewer_id === user.id)
    : false;
  // Logged-in users who haven't reviewed (and aren't viewing own profile) can review
  const canReview = !!user && !isOwn && !hasReviewed;

  return (
    <div className="min-h-screen bg-sr-bg text-slate-100">
      <NavHeader />

      <main className="mx-auto max-w-3xl px-4 py-8 space-y-6">
        {/* Back link */}
        <a
          href="/directory"
          className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 transition-colors"
        >
          ← Back to Directory
        </a>

        {/* Profile header */}
        <ProfileHeader profile={profile} isOwn={isOwn} />

        {/* Reviews section */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
            Reviews
          </h2>

          <ReviewList reviews={profile.reviews} />

          {/* Review form — show when eligible */}
          {canReview && (
            <Suspense fallback={null}>
              <ReviewForm
                revieweeId={profile.id}
              />
            </Suspense>
          )}

          {/* Prompt to sign in if not authenticated */}
          {!user && (
            <p className="text-xs text-slate-600 text-center pt-2">
              <a href="/auth/sign-in" className="text-cyan-500 hover:text-cyan-400">
                Sign in
              </a>{' '}
              to leave a review.
            </p>
          )}

          {/* Already reviewed notice */}
          {user && !isOwn && hasReviewed && (
            <p className="text-xs text-slate-600 text-center pt-2">
              You&apos;ve already submitted a review for this crafter.
            </p>
          )}
        </section>
      </main>
    </div>
  );
}
