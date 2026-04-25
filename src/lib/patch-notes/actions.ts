/**
 * actions.ts
 * Server Actions for patch notes import admin — publish, unpublish, delete.
 * One concern: director-gated mutations on patch_notes_imports rows.
 *
 * All writes use the service client (pni_all_service RLS policy).
 * Auth gate: ceo or officer role required.
 */

'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient as createUserClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';
import { canManageRoster } from '@/types/corp';
import { fetchLatestPosts } from '@/lib/patch-notes/scraper';

async function assertDirector(): Promise<string | null> {
  const supabase = await createUserClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 'Not authenticated.';

  const { data: profile } = await supabase
    .from('crafter_profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!canManageRoster(profile?.role ?? 'client')) {
    return 'Insufficient clearance — CEO or Officer required.';
  }
  return null;
}

// Form action signature: (id: string, _: FormData) so .bind(null, id) produces
// (_: FormData) => Promise<void>, which satisfies the form action type contract.

export async function publishPatchNote(id: string, _: FormData): Promise<void> {
  const err = await assertDirector();
  if (err) { redirect('/admin/patch-notes?error=forbidden'); return; }

  const supabase = createServiceClient();
  await supabase.from('patch_notes_imports').update({ status: 'published' }).eq('id', id);
  revalidatePath('/patch-notes');
  revalidatePath('/admin/patch-notes');
}

export async function unpublishPatchNote(id: string, _: FormData): Promise<void> {
  const err = await assertDirector();
  if (err) { redirect('/admin/patch-notes?error=forbidden'); return; }

  const supabase = createServiceClient();
  await supabase.from('patch_notes_imports').update({ status: 'draft' }).eq('id', id);
  revalidatePath('/patch-notes');
  revalidatePath('/admin/patch-notes');
}

export async function deletePatchNote(id: string, _: FormData): Promise<void> {
  const err = await assertDirector();
  if (err) { redirect('/admin/patch-notes?error=forbidden'); return; }

  const supabase = createServiceClient();
  await supabase.from('patch_notes_imports').delete().eq('id', id);
  revalidatePath('/patch-notes');
  revalidatePath('/admin/patch-notes');
}

/** Fetch latest posts from WP API and upsert as drafts. Redirects with ?imported=N on success. */
export async function triggerImport(_: FormData): Promise<void> {
  const err = await assertDirector();
  if (err) redirect('/admin/patch-notes?error=forbidden');

  try {
    const posts = await fetchLatestPosts(10);
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

    const imported = results.filter((r) => r.status === 'fulfilled').length;
    revalidatePath('/admin/patch-notes');
    redirect(`/admin/patch-notes?imported=${imported}`);
  } catch {
    redirect('/admin/patch-notes?error=import_failed');
  }
}
