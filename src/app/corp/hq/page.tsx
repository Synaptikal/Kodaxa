import type { Metadata } from 'next';
import { getHQStats, getCommissions } from '@/lib/corp/queries';
import { HQDashboard } from '@/components/corp/hq-dashboard';
import { getCurrentUserProfile } from '@/lib/corp/queries';
import type { CorpRole } from '@/types/corp';

export const metadata: Metadata = { title: 'Command Center — Kodaxa HQ' };

export default async function HQPage() {
  const [profile, stats] = await Promise.all([
    getCurrentUserProfile(),
    getHQStats(),
  ]);

  const recentCommissions = await getCommissions();
  const recent = recentCommissions.slice(0, 8);

  return (
    <HQDashboard
      stats={stats}
      recentCommissions={recent}
      userRole={(profile?.role ?? 'client') as CorpRole}
      displayName={profile?.display_name ?? ''}
    />
  );
}
