/**
 * proxy.ts (Supabase session utility)
 * Called from the root proxy.ts to refresh expired auth tokens.
 * One concern: reading/writing Supabase cookies on the request/response pair.
 *
 * Next.js 16: Server Components can't write cookies, so the proxy
 * intercepts every request, refreshes the token if needed, and
 * passes updated cookies through to both the request and response.
 *
 * Source: https://supabase.com/docs/guides/auth/server-side/nextjs
 */

import { createServerClient } from '@supabase/ssr';
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
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          // 1. Set on the request so downstream server code sees fresh tokens
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          // 2. Recreate response to carry the mutated request
          supabaseResponse = NextResponse.next({ request });
          // 3. Set on the response so the browser stores the new cookies
          cookiesToSet.forEach(({ name, value, options }) =>
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            supabaseResponse.cookies.set(name, value, options as any),
          );
        },
      },
    },
  );

  // Refresh the session — triggers setAll if tokens are stale.
  // IMPORTANT: use getUser(), not getSession() — getSession() doesn't
  // validate the JWT and is unsafe for server-side auth checks.
  await supabase.auth.getUser();

  return supabaseResponse;
}
