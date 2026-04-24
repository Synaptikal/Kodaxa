/**
 * proxy.ts (Supabase session utility)
 * Two concerns: refresh expired auth tokens AND redirect unauthenticated
 * requests away from protected route prefixes.
 *
 * Next.js 16: Server Components can't write cookies, so the proxy
 * intercepts every request, refreshes the token if needed, and
 * passes updated cookies through to both the request and response.
 *
 * SECURITY NOTE: Middleware is a fast UX gate — it is NOT the sole
 * security boundary. Route layouts and the DAL (requireDirector, etc.)
 * perform the authoritative auth check. See CVE-2025-29927 for why
 * middleware alone cannot be trusted as a hard security barrier.
 *
 * Source: https://supabase.com/docs/guides/auth/server-side/nextjs
 */

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
          // 1. Set on the request so downstream server code sees fresh tokens
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          // 2. Recreate response to carry the mutated request
          supabaseResponse = NextResponse.next({ request });
          // 3. Set on the response so the browser stores the new cookies
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Refresh the session — triggers setAll if tokens are stale.
  // IMPORTANT: use getUser(), not getSession() — getSession() doesn't
  // validate the JWT and is unsafe for server-side auth checks.
  const { data: { user } } = await supabase.auth.getUser();

  // ── Protected route gate ───────────────────────────────────────────
  // /terminal is intentionally excluded: it renders a public sign-in
  // CTA for unauthenticated visitors (design decision, not a bug).
  const PROTECTED_PREFIXES = ['/corp/hq', '/admin'] as const;
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));

  if (isProtected && !user) {
    const signIn = new URL('/auth/sign-in', request.url);
    signIn.searchParams.set('next', pathname);
    return NextResponse.redirect(signIn);
  }

  return supabaseResponse;
}
