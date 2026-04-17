/**
 * proxy.ts (root)
 * Next.js 16 proxy — replaces deprecated middleware.ts.
 * One concern: intercept requests to refresh Supabase auth tokens.
 *
 * Runs on Node.js runtime (not Edge) per Next.js 16 design.
 * Delegates all Supabase cookie logic to lib/supabase/proxy.ts.
 */

import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/proxy';

export default async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
