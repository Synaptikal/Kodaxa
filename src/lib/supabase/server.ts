/**
 * server.ts
 * Supabase client for Server Components, Server Actions, and Route Handlers.
 * One concern: creating an authenticated server-side Supabase client.
 *
 * Uses @supabase/ssr with cookie-based session management.
 * cookies() is async in Next.js 16 — must await.
 *
 * Source: https://supabase.com/docs/guides/auth/server-side/nextjs
 */

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // setAll called from a Server Component — safe to ignore.
            // The proxy.ts handles token refresh for the response.
          }
        },
      },
    },
  );
}
