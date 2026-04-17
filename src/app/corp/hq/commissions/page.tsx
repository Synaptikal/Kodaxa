import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUserProfile, getCommissions } from '@/lib/corp/queries';
import { canAccessHQ } from '@/types/corp';
import type { CorpRole } from '@/types/corp';
import { HQLayout } from '@/components/corp/hq-layout';
import { CommissionBoard } from '@/components/corp/commission-board';

export const metadata: Metadata = { title: 'Commission Board — Kodaxa HQ' };

export default async function CommissionsPage() {
  const supabase = await createClient();
  const [profile, { data: { user } }] = await Promise.all([
    getCurrentUserProfile(),
    supabase.auth.getUser(),
  ]);

  if (!profile || !user) redirect('/auth/sign-in?next=/corp/hq/commissions');

  const role = profile.role as CorpRole;
  if (!canAccessHQ(role)) redirect('/corp/join');

  const commissions = await getCommissions();

  return (
    <HQLayout userRole={role} displayName={profile.display_name} inGameName={profile.in_game_name}>
      <CommissionBoard
        commissions={commissions}
        currentUserId={user.id}
        userRole={role}
      />
    </HQLayout>
  );
}
