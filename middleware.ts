/**
 * middleware.ts (root)
 * Next.js middleware — intercepts every request to refresh Supabase auth tokens.
 * One concern: keeping the session cookie alive across server-rendered pages.
 *
 * Runs on the Edge runtime per Next.js middleware design.
 * Delegates all Supabase cookie logic to lib/supabase/proxy.ts.
 */

import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/proxy';

export default async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
