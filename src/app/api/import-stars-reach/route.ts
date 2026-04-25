/**
 * route.ts — POST /api/import-stars-reach
 * Manual patch notes import trigger. Director-gated.
 * One concern: fetch WP API, upsert drafts into patch_notes_imports.
 *
 * Query params:
 *   ?count=N  — number of posts to fetch (default 10, max 50)
 */

import { NextResponse } from 'next/server';
import { requireDirector } from '@/lib/auth/requireDirector';
import { fetchLatestPosts } from '@/lib/patch-notes/scraper';
import { createServiceClient } from '@/lib/supabase/service';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const auth = await requireDirector();
  if (auth instanceof NextResponse) return auth;

  const { searchParams } = new URL(req.url);
  const count = Math.min(parseInt(searchParams.get('count') ?? '10', 10) || 10, 50);

  try {
    const posts = await fetchLatestPosts(count);
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
            // status intentionally omitted — preserves existing published/draft state
          },
          { onConflict: 'source_slug' },
        ),
      ),
    );

    const succeeded = results.filter((r) => r.status === 'fulfilled').length;
    const failed    = results.filter((r) => r.status === 'rejected').length;

    return NextResponse.json({ imported: succeeded, failed, total: posts.length });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
