import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUserProfile, getRoster } from '@/lib/corp/queries';
import { canManageRoster } from '@/types/corp';
import type { CorpRole } from '@/types/corp';
import { RosterPanel } from '@/components/corp/roster-panel';

export const metadata: Metadata = { title: 'Roster Manifest — Kodaxa HQ' };

export default async function RosterPage() {
  const supabase = await createClient();
  const [profile, { data: { user } }] = await Promise.all([
    getCurrentUserProfile(),
    supabase.auth.getUser(),
  ]);

  const role = profile!.role as CorpRole;
  if (!canManageRoster(role)) redirect('/corp/hq');

  const members = await getRoster();

  return (
    <RosterPanel
      members={members as Parameters<typeof RosterPanel>[0]['members']}
      currentUserId={user!.id}
      currentUserRole={role}
    />
  );
}
