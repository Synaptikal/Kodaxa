import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getCurrentUserProfile, getApplications } from '@/lib/corp/queries';
import { canAdminister } from '@/types/corp';
import type { CorpRole } from '@/types/corp';
import { HQLayout } from '@/components/corp/hq-layout';
import { AdminPanel } from '@/components/corp/admin-panel';

export const metadata: Metadata = { title: 'Admin Control — Kodaxa HQ' };

export default async function AdminPage() {
  const profile = await getCurrentUserProfile();

  if (!profile) redirect('/auth/sign-in?next=/corp/hq/admin');

  const role = profile.role as CorpRole;
  if (!canAdminister(role)) redirect('/corp/hq');

  const applications = await getApplications();

  return (
    <HQLayout userRole={role} displayName={profile.display_name} inGameName={profile.in_game_name}>
      <AdminPanel applications={applications} />
    </HQLayout>
  );
}
