import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getCurrentUserProfile, getHQStats, getCommissions } from '@/lib/corp/queries';
import { canAccessHQ } from '@/types/corp';
import type { CorpRole } from '@/types/corp';
import { HQLayout } from '@/components/corp/hq-layout';
import { HQDashboard } from '@/components/corp/hq-dashboard';

export const metadata: Metadata = { title: 'Command Center — Kodaxa HQ' };

export default async function HQPage() {
  const [profile, stats] = await Promise.all([
    getCurrentUserProfile(),
    getHQStats(),
  ]);

  if (!profile) redirect('/auth/sign-in?next=/corp/hq');

  const role = profile.role as CorpRole;
  if (!canAccessHQ(role)) redirect('/corp/join');

  const recentCommissions = await getCommissions();
  const recent = recentCommissions.slice(0, 8);

  return (
    <HQLayout userRole={role} displayName={profile.display_name} inGameName={profile.in_game_name}>
      <HQDashboard
        stats={stats}
        recentCommissions={recent}
        userRole={role}
        displayName={profile.display_name}
      />
    </HQLayout>
  );
}
