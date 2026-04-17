/**
 * app/auth/callback/route.ts
 * Handles Supabase email confirmation redirects.
 * One concern: exchanging the one-time code for a session cookie.
 *
 * Supabase sends users here with ?code=<otp> after email confirmation.
 * We exchange the code, set the session cookie, and redirect to the profile editor.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/directory/me';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Something went wrong — send to sign-in with an error hint
  return NextResponse.redirect(`${origin}/auth/sign-in?error=confirmation_failed`);
}
