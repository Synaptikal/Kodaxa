/**
 * trade/page.tsx
 * Trade System — vendor kiosk tracker and direct sales log.
 * One concern: auth-gated commerce tracking panel.
 *
 * Server component shell — auth guard then hands off to client TradePanel.
 */

import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { NavHeader } from '@/components/ui/nav-header';
import { createClient } from '@/lib/supabase/server';
import TradePanel from './trade-panel';

export const metadata: Metadata = {
  title: 'Trade System',
  description: 'Manage vendor kiosk listings, track direct trades, and log market prices.',
};

export const dynamic = 'force-dynamic';

export default async function TradePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/sign-in?next=/trade');

  return (
    <div className="flex flex-col min-h-dvh bg-sr-bg text-sr-text">
      <NavHeader />
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-8">
        <div className="mb-8 space-y-1">
          <p className="text-[9px] font-mono uppercase tracking-[0.3em] text-slate-600">
            My Terminal · Commerce Operations
          </p>
          <h1 className="text-2xl font-bold font-mono text-slate-100">Trade System</h1>
          <p className="text-sm text-slate-500 max-w-2xl">
            Track your vendor kiosk listings, log direct sales, and monitor your
            trade routes to stay under the item cap.
          </p>
        </div>
        <TradePanel />
      </main>
    </div>
  );
}
