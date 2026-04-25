/**
 * dashboard/page.tsx
 * Analytics Dashboard — session tracker, Klaatu flow, skill progression.
 * One concern: auth-gated personal analytics panel.
 *
 * Server component shell — auth guard then hands off to client DashboardPanel.
 */

import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { NavHeader } from '@/components/ui/nav-header';
import { createClient } from '@/lib/supabase/server';
import DashboardPanel from './dashboard-panel';

export const metadata: Metadata = {
  title: 'Analytics Dashboard',
  description: 'Log play sessions, track skill progress, and monitor Klaatu flow.',
};

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/sign-in?next=/dashboard');

  return (
    <div className="flex flex-col min-h-dvh bg-sr-bg text-sr-text">
      <NavHeader />
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-8">
        <div className="mb-8 space-y-1">
          <p className="text-[9px] font-mono uppercase tracking-[0.3em] text-slate-600">
            My Terminal · Analytics Dashboard
          </p>
          <h1 className="text-2xl font-bold font-mono text-slate-100">Analytics Dashboard</h1>
          <p className="text-sm text-slate-500 max-w-2xl">
            Track your daily Stars Reach sessions, monitor Klaatu income versus expenses,
            and map your skill progression over time.
          </p>
        </div>
        <DashboardPanel />
      </main>
    </div>
  );
}
