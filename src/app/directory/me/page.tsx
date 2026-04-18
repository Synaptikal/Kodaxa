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
        <div>
          <h1 className="text-xl font-bold text-slate-100">
            {profile ? 'Edit Profile' : 'Create Your Profile'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Your profile is listed in the Crafter Directory so other players can find you.
          </p>
        </div>

        {/* Profile fields */}
        <Section title="Profile Details">
          <ProfileEditForm existing={profile} />
        </Section>

        {/* Specializations — only show once profile exists */}
        {profile && (
          <Section title="Specializations">
            <p className="text-xs text-slate-500 mb-3">
              Add the professions you offer services for. Players can filter the directory by these.
            </p>
            <SpecializationManager
              specializations={profile.specializations}
              professionOptions={professionOptions}
            />
          </Section>
        )}

        {/* Visibility toggle */}
        {profile && (
          <Section title="Visibility">
            <VisibilityToggle
              isVisible={profile.is_visible}
              onToggle={setProfileVisibility}
            />
          </Section>
        )}

        {/* View public profile link */}
        {profile && (
          <div className="text-center">
            <a
              href={`/directory/${encodeURIComponent(profile.in_game_name)}`}
              className="text-xs text-cyan-500 hover:text-cyan-400 transition-colors"
            >
              View your public profile →
            </a>
          </div>
        )}
      </main>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border border-slate-700 bg-slate-800/20 p-5 space-y-3">
      <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</h2>
      {children}
    </section>
  );
}
