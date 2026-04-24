/**
 * app/auth/callback/route.ts
 * Handles Supabase email confirmation redirects.
 *
 * Supabase sends users here after email confirmation. Two flows exist:
 *   1. PKCE flow    — ?code=<otp>                  (OAuth / newer signup)
 *   2. Token flow   — ?token_hash=<hash>&type=signup (email OTP confirmation)
 *
 * We handle both, exchange for a session cookie, then redirect to the
 * profile editor so new users can complete their profile.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { EmailOtpType } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code       = searchParams.get('code');
  const token_hash = searchParams.get('token_hash');
  const type       = searchParams.get('type') as EmailOtpType | null;
  const rawNext    = searchParams.get('next') ?? '';
  // Only allow relative paths — block open-redirect via //evil.com or https://...
  const next = rawNext.startsWith('/') && !rawNext.startsWith('//') ? rawNext : '/directory/me';

  const supabase = await createClient();

  // ── PKCE code flow (OAuth / newer Supabase signup) ──────────────────
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // ── OTP token_hash flow (email confirmation) ─────────────────────────
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash, type });
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Something went wrong — send back to sign-in with a visible hint
  return NextResponse.redirect(`${origin}/auth/sign-in?error=confirmation_failed`);
}
