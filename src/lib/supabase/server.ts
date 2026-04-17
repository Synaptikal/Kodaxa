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

import { createServerClient } from '@supabase/ssr';
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
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              cookieStore.set(name, value, options as any),
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
