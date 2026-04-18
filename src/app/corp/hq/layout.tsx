/**
 * corp/hq/layout.tsx
 * Auth gate + HQLayout wrapper for all /corp/hq/* routes.
 * One concern: verify auth + corp role, pass identity to HQLayout.
 */

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { HQLayout } from '@/components/corp/hq-layout';
import { canAccessHQ } from '@/types/corp';
import type { CorpRole } from '@/types/corp';

export default async function CorpHQLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/auth/sign-in?next=/corp/hq');

  const { data: profile } = await supabase
    .from('crafter_profiles')
    .select('role, display_name, in_game_name')
    .eq('id', user.id)
    .single();

  const role = (profile?.role ?? 'client') as CorpRole;

  if (!canAccessHQ(role)) redirect('/');

  return (
    <HQLayout
      userRole={role}
      displayName={profile?.display_name ?? 'Unknown'}
      inGameName={profile?.in_game_name ?? '—'}
    >
      {children}
    </HQLayout>
  );
}
