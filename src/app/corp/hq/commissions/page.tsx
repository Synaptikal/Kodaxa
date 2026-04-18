import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUserProfile, getCommissions } from '@/lib/corp/queries';
import type { CorpRole } from '@/types/corp';
import { CommissionBoard } from '@/components/corp/commission-board';

export const metadata: Metadata = { title: 'Commission Board — Kodaxa HQ' };

export default async function CommissionsPage() {
  const supabase = await createClient();
  const [profile, { data: { user } }] = await Promise.all([
    getCurrentUserProfile(),
    supabase.auth.getUser(),
  ]);

  const role = profile!.role as CorpRole;
  const commissions = await getCommissions();

  return (
    <CommissionBoard
      commissions={commissions}
      currentUserId={user!.id}
      userRole={role}
    />
  );
}
