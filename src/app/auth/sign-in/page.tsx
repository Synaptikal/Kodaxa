/**
 * app/auth/sign-in/page.tsx
 * Sign-in page. Redirects to /directory/me (or ?next=) on success.
 * One concern: rendering the sign-in form in the auth shell.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthForm } from '@/components/auth/auth-form';
import { NavHeader } from '@/components/ui/nav-header';

export const metadata: Metadata = {
  title: 'Establish Uplink – Kodaxa Studios',
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function SignInPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const next = typeof params.next === 'string' ? params.next : '/terminal';

  return (
    <div className="min-h-screen bg-sr-bg text-slate-100">
      <NavHeader />

      <main className="mx-auto max-w-sm px-4 py-16">
        <div className="border border-sr-border bg-sr-surface/40 p-6 space-y-5">
          <div>
            <p className="text-[8px] font-mono uppercase tracking-[0.3em] text-slate-600 mb-1">
              Personnel · Account Services
            </p>
            <h1 className="text-lg font-bold font-mono text-slate-100">Establish Uplink</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Access your terminal, analytics, saved builds, and personal data.
            </p>
          </div>

          <AuthForm mode="sign-in" next={next} />

          <p className="text-center text-xs font-mono text-slate-500">
            No personnel file?{' '}
            <Link href="/auth/sign-up" className="text-cyan-500 hover:text-cyan-400">
              Request Access
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
