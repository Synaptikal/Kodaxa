import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getCurrentUserProfile, getSupplyRequests } from '@/lib/corp/queries';
import type { CorpRole } from '@/types/corp';
import { SupplyBoard } from '@/components/corp/supply-board';

export const metadata: Metadata = { title: 'Supply Requisitions — Kodaxa HQ' };

export default async function SupplyPage() {
  const profile = await getCurrentUserProfile();
  if (!profile) redirect('/auth/sign-in');

  const requests = await getSupplyRequests();
  const role = profile.role as CorpRole;

  return (
    <SupplyBoard
      requests={requests as Parameters<typeof SupplyBoard>[0]['requests']}
      currentUserId={profile.id}
      currentUserRole={role}
    />
  );
}
