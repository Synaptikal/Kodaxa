/**
 * app/directory/me/page.tsx
 * Auth-gated profile editor for the current user's crafter listing.
 * One concern: orchestrating profile upsert + specialization management.
 *
 * Redirects to /auth/sign-in if not authenticated.
 * Uses getOwnProfile() (service-role bypass for own data) so new users
 * whose profile row doesn't exist yet see an empty form.
 */

import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { getOwnProfile } from '@/lib/directory/queries';
import { getProfessionSummaries } from '@/data/professions';
import { setProfileVisibility } from '@/lib/directory/actions';
import type { DirectoryProfessionCategory } from '@/types/directory';
import { ProfileEditForm } from '@/components/directory/profile-edit-form';
import { SpecializationManager } from '@/components/directory/specialization-manager';
import { NavHeader } from '@/components/ui/nav-header';
import { VisibilityToggle } from '@/components/directory/visibility-toggle';

export const metadata: Metadata = {
  title: 'My Commerce Profile – Kodaxa Studios',
};

export default async function ProfileEditorPage() {
  // Auth check
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/sign-in?next=/directory/me');
  }

  // Load own profile and profession list in parallel
  const [profile, professionSummaries] = await Promise.all([
    getOwnProfile(),
    Promise.resolve(getProfessionSummaries()),
  ]);

  // Map profession summaries to the shape SpecializationManager expects.
  // ProfessionCategory and DirectoryProfessionCategory are the same values.
  const professionOptions = professionSummaries.map((p) => ({
    id: p.id,
    name: p.name,
    category: p.category as DirectoryProfessionCategory,
  }));

  return (
    <div className="min-h-screen bg-sr-bg text-slate-100">
      <NavHeader />

      <main className="mx-auto max-w-2xl px-4 py-8 space-y-8">
        <div className="border-b border-sr-border pb-5">
          <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-sr-muted mb-1">
            Commerce Registry · Personnel File
          </p>
          <h1 className="text-xl font-bold font-mono text-slate-100">
            {profile ? 'Amend Dossier' : 'File Dossier'}
          </h1>
          <p className="text-xs font-mono text-sr-muted mt-1 leading-relaxed">
            {profile
              ? 'Update your operative record. Changes are reflected in the Commerce Registry immediately.'
              : 'Register your operative record in the Commerce Registry so contract issuers can locate you.'}
          </p>
        </div>

        {/* Profile fields */}
        <Section title="Operative Record">
          <ProfileEditForm existing={profile} />
        </Section>

        {/* Specializations — only show once profile exists */}
        {profile && (
          <Section title="Active Professions">
            <p className="text-xs font-mono text-sr-muted mb-3">
              Register the professions you offer services for. Contract issuers filter by these when searching.
            </p>
            <SpecializationManager
              specializations={profile.specializations}
              professionOptions={professionOptions}
            />
          </Section>
        )}

        {/* Visibility toggle */}
        {profile && (
          <Section title="Registry Listing">
            <VisibilityToggle
              isVisible={profile.is_visible}
              onToggle={setProfileVisibility}
            />
          </Section>
        )}

        {/* View public profile link */}
        {profile && (
          <div className="text-center border-t border-sr-border pt-5">
            <a
              href={`/directory/${encodeURIComponent(profile.in_game_name)}`}
              className="text-[10px] font-mono uppercase tracking-[0.2em] text-cyan-500 hover:text-cyan-400 transition-colors"
            >
              View Public Dossier →
            </a>
          </div>
        )}
      </main>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border border-sr-border bg-sr-surface/20 p-5 space-y-3">
      <p className="text-[10px] font-mono text-sr-muted uppercase tracking-[0.25em]">{title}</p>
      {children}
    </section>
  );
}
