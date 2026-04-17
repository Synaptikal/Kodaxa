/**
 * client.ts
 * Supabase client for Client Components (runs in the browser).
 * One concern: creating a browser-side Supabase client.
 *
 * The publishable key is safe to expose client-side
 * because RLS enforces all access rules at the DB level.
 *
 * Source: https://supabase.com/docs/guides/auth/server-side/nextjs
 */

import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
