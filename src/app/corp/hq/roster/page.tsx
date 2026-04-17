import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUserProfile, getRoster } from '@/lib/corp/queries';
import { canManageRoster } from '@/types/corp';
import type { CorpRole } from '@/types/corp';
import { HQLayout } from '@/components/corp/hq-layout';
import { RosterPanel } from '@/components/corp/roster-panel';

export const metadata: Metadata = { title: 'Roster Manifest — Kodaxa HQ' };

export default async function RosterPage() {
  const supabase = await createClient();
  const [profile, { data: { user } }] = await Promise.all([
    getCurrentUserProfile(),
    supabase.auth.getUser(),
  ]);

  if (!profile || !user) redirect('/auth/sign-in?next=/corp/hq/roster');

  const role = profile.role as CorpRole;
  if (!canManageRoster(role)) redirect('/corp/hq');

  const members = await getRoster();

  return (
    <HQLayout userRole={role} displayName={profile.display_name} inGameName={profile.in_game_name}>
      <RosterPanel
        members={members as Parameters<typeof RosterPanel>[0]['members']}
        currentUserId={user.id}
        currentUserRole={role}
      />
    </HQLayout>
  );
}
