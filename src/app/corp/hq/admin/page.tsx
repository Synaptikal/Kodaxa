import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getCurrentUserProfile, getApplications } from '@/lib/corp/queries';
import { canAdminister } from '@/types/corp';
import type { CorpRole } from '@/types/corp';
import { AdminPanel } from '@/components/corp/admin-panel';

export const metadata: Metadata = { title: 'Admin Control — Kodaxa HQ' };

export default async function AdminPage() {
  const profile = await getCurrentUserProfile();

  const role = profile.role as CorpRole;
  if (!canAdminister(role)) redirect('/corp/hq');

  const applications = await getApplications();

  return <AdminPanel applications={applications} />;
}
