/**
 * app/auth/sign-up/page.tsx
 * Account creation page. Shows "check your email" on success.
 * One concern: rendering the sign-up form in the auth shell.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthForm } from '@/components/auth/auth-form';
import { NavHeader } from '@/components/ui/nav-header';

export const metadata: Metadata = {
  title: 'Request Access – Kodaxa Studios',
};

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-sr-bg text-slate-100">
      <NavHeader />

      <main className="mx-auto max-w-sm px-4 py-16">
        <div className="border border-sr-border bg-sr-surface/40 p-6 space-y-5">
          <div>
            <p className="text-[8px] font-mono uppercase tracking-[0.3em] text-slate-600 mb-1">
              Personnel · Account Services
            </p>
            <h1 className="text-lg font-bold font-mono text-slate-100">Request Access</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Free account — access your terminal, save builds, and contribute data to the network.
            </p>
          </div>

          <AuthForm mode="sign-up" />

          <p className="text-center text-xs font-mono text-slate-500">
            Already have a personnel file?{' '}
            <Link href="/auth/sign-in" className="text-cyan-500 hover:text-cyan-400">
              Establish Uplink
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
