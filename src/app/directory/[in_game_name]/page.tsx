/**
 * app/directory/[in_game_name]/page.tsx
 * Operative dossier — public crafter profile with commission request and field reports.
 * One concern: render a crafter's public record; gate commission + review by auth state.
 */

import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getCrafterProfile } from '@/lib/directory/queries';
import { ProfileHeader } from '@/components/directory/profile-header';
import { ReviewList } from '@/components/directory/review-list';
import { ReviewForm } from '@/components/directory/review-form';
import { CommissionButton } from '@/components/corp/commission-button';
import { NavHeader } from '@/components/ui/nav-header';
import { SectionLabel } from '@/components/ui/section-label';

interface PageProps {
  params: Promise<{ in_game_name: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { in_game_name } = await params;
  const name = decodeURIComponent(in_game_name);
  return {
    title: `${name} — Operative Dossier · Kodaxa`,
    description: `View ${name}'s Stars Reach operative dossier: professions, sector, maker's mark, and field reports.`,
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

  const isOwn        = user?.id === profile.id;
  const hasReviewed  = user ? profile.reviews.some((r) => r.reviewer_id === user.id) : false;
  const canReview    = !!user && !isOwn && !hasReviewed;
  const canCommission = !!user && !isOwn && profile.commission_status !== 'closed';

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.display_name,
    url: `https://kodaxa.dev/directory/${encodeURIComponent(profile.in_game_name)}`,
    description: profile.bio ?? undefined,
    jobTitle: profile.role ?? undefined,
    affiliation: profile.maker_mark ? { '@type': 'Organization', name: profile.maker_mark } : undefined,
    address: profile.home_planet ? { '@type': 'PostalAddress', addressLocality: profile.home_planet } : undefined,
    aggregateRating:
      profile.total_reviews > 0
        ? {
            '@type': 'AggregateRating',
            ratingValue: Number(profile.average_rating.toFixed(1)),
            reviewCount: profile.total_reviews,
          }
        : undefined,
  } as const;

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://kodaxa.dev' },
      { '@type': 'ListItem', position: 2, name: 'Commerce Registry', item: 'https://kodaxa.dev/directory' },
      { '@type': 'ListItem', position: 3, name: profile.in_game_name, item: `https://kodaxa.dev/directory/${encodeURIComponent(profile.in_game_name)}` },
    ],
  } as const;

  const reviewsLd = profile.reviews && profile.reviews.length > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: profile.reviews.map((r, i) => ({
          '@type': 'Review',
          author: { '@type': 'Person', name: r.reviewer.display_name },
          reviewBody: r.comment ?? undefined,
          reviewRating: { '@type': 'Rating', ratingValue: r.rating },
          datePublished: r.created_at,
        })),
      }
    : null;

  return (
    <div className="min-h-screen bg-sr-bg text-slate-100">
      <NavHeader />

      <main className="mx-auto max-w-4xl px-4 py-8 space-y-4">

        {/* JSON.stringify alone does not escape </script> sequences — replace < with \u003c
            per Next.js JSON-LD guidance: https://nextjs.org/docs/app/guides/json-ld */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, '\\u003c') }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd).replace(/</g, '\\u003c') }} />
        {reviewsLd && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewsLd).replace(/</g, '\\u003c') }} />
        )}

        {/* Breadcrumb nav */}
        <div className="flex items-center justify-between">
          <Link href="/directory"
            className="text-[9px] font-mono uppercase tracking-[0.15em] text-slate-600 hover:text-slate-400 transition-colors">
            ← Commerce Registry
          </Link>
          <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-slate-700">
            Dossier · {profile.in_game_name}
          </span>
        </div>

        {/* Dossier */}
        <ProfileHeader profile={profile} isOwn={isOwn} />

        {/* Commission CTA */}
        {canCommission && (
          <div className="border border-amber-800/40 bg-amber-900/10 px-5 py-4 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-[9px] font-mono uppercase tracking-[0.25em] text-amber-400">
                Issue Commission Request
              </p>
              <p className="text-[10px] font-mono text-slate-500 mt-0.5">
                {profile.commission_status === 'limited'
                  ? 'Taking select commissions — reach out before submitting.'
                  : 'Currently accepting commission requests.'}
              </p>
            </div>
            <CommissionButton assigneeId={profile.id} assigneeName={profile.in_game_name} />
          </div>
        )}

        {!user && profile.commission_status !== 'closed' && (
          <div className="border border-sr-border bg-sr-surface/20 px-4 py-3 text-center">
            <p className="text-[10px] font-mono text-slate-600">
              <Link href="/auth/sign-in" className="text-cyan-500 hover:text-cyan-400">
                Establish uplink
              </Link>{' '}
              to issue a commission request or submit a field report.
            </p>
          </div>
        )}

        {/* Field Reports (reviews) */}
        <section className="border border-sr-border bg-sr-surface/30">
          <div className="border-b border-sr-border/60 px-5 py-3 flex items-center justify-between">
            <SectionLabel
              text="Field Reports"
              sub={profile.reviews.length > 0 ? `${profile.reviews.length} on record` : 'None filed yet'}
            />
          </div>
          <div className="px-5 py-5 space-y-4">
            <ReviewList reviews={profile.reviews} />

            {canReview && (
              <Suspense fallback={null}>
                <ReviewForm revieweeId={profile.id} />
              </Suspense>
            )}

            {user && !isOwn && hasReviewed && (
              <p className="text-[10px] font-mono text-slate-600 text-center pt-2">
                Field report already on record for this operative.
              </p>
            )}
          </div>
        </section>

      </main>
    </div>
  );
}
