/**
 * route.ts — GET /api/cron/import-stars-reach
 * Vercel Cron endpoint — auto-imports latest Stars Reach build notes.
 * One concern: scheduled import, no user session required.
 *
 * Auth: Vercel sends x-vercel-cron:1 header on production invocations.
 * Manual trigger: set Authorization: Bearer <CRON_SECRET>.
 * Both paths are accepted so local testing works without spoofing headers.
 */

import { NextRequest, NextResponse } from 'next/server';
import { fetchLatestPosts } from '@/lib/patch-notes/scraper';
import { createServiceClient } from '@/lib/supabase/service';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const isDev         = process.env.NODE_ENV !== 'production';
  const cronHeader    = request.headers.get('x-vercel-cron') === '1';
  const cronSecret    = process.env.CRON_SECRET;
  const authHeader    = request.headers.get('authorization');
  const hasSecret     = !!cronSecret && authHeader === `Bearer ${cronSecret}`;

  if (!isDev && !cronHeader && !hasSecret) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  try {
    const posts   = await fetchLatestPosts(5);
    const supabase = createServiceClient();

    const results = await Promise.allSettled(
      posts.map((p) =>
        supabase.from('patch_notes_imports').upsert(
          {
            source_url:    p.sourceUrl,
            source_slug:   p.sourceSlug,
            title:         p.title,
            version_label: p.versionLabel,
            category:      p.category,
            release_date:  p.releaseDate,
            summary:       p.summary,
            bullet_points: p.bulletPoints,
            raw_content:   p.rawContent,
            import_hash:   p.importHash,
          },
          { onConflict: 'source_slug' },
        ),
      ),
    );

    const succeeded = results.filter((r) => r.status === 'fulfilled').length;
    return NextResponse.json({ ok: true, imported: succeeded, total: posts.length });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
