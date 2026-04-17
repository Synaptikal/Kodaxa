/**
 * auth-form.tsx
 * Client-side sign-in / sign-up form with error feedback.
 * One concern: collecting credentials and calling auth Server Actions.
 */

'use client';

import { useState, useTransition } from 'react';
import { signIn, signUp } from '@/lib/auth/actions';

export type AuthMode = 'sign-in' | 'sign-up';

export interface AuthFormProps {
  mode: AuthMode;
  next?: string;
}

const inputClass =
  'w-full bg-sr-bg border border-sr-border px-3 py-2 text-sm font-mono text-slate-200 placeholder:text-slate-700 focus:border-cyan-700 focus:outline-none transition-colors';

export function AuthForm({ mode, next = '/directory/me' }: AuthFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [signedUp, setSignedUp] = useState(false);

  const action = mode === 'sign-in' ? signIn : signUp;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    formData.set('next', next);

    startTransition(async () => {
      const result = await action(formData);
      if (result?.error) {
        setError(result.error);
      } else if (mode === 'sign-up') {
        setSignedUp(true);
      }
      // sign-in success: server redirects, no state update needed
    });
  };

  if (signedUp) {
    return (
      <div className="border border-teal-700/40 bg-teal-950/20 p-5 text-center space-y-1">
        <p className="text-sm font-mono text-teal-300 uppercase tracking-wider">✓ Confirmed</p>
        <p className="text-xs font-mono text-slate-400">
          Uplink verification sent. Check your relay inbox and click the confirmation link.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-[10px] text-slate-500 uppercase tracking-wider mb-1">
          Email
        </label>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-[10px] text-slate-500 uppercase tracking-wider mb-1">
          Password
        </label>
        <input
          name="password"
          type="password"
          required
          autoComplete={mode === 'sign-in' ? 'current-password' : 'new-password'}
          placeholder={mode === 'sign-up' ? 'At least 8 characters' : '••••••••'}
          minLength={mode === 'sign-up' ? 8 : undefined}
          className={inputClass}
        />
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-2.5 bg-cyan-600/20 border border-cyan-700/60 text-cyan-300 text-xs font-mono font-semibold uppercase tracking-wide hover:bg-cyan-600/30 hover:border-cyan-600 disabled:opacity-50 transition-all"
      >
        {isPending
          ? 'Establishing Link…'
          : mode === 'sign-in' ? 'Establish Uplink' : 'Request Access'}
      </button>
    </form>
  );
}
