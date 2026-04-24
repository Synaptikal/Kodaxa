/**
 * lib/dispatch/actions.ts
 * Server Actions for dispatch post mutations.
 * One concern: create, update, publish, unpublish, delete posts.
 *
 * All writes require ceo or officer role (checked via get_user_role()).
 */

'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import type { Block, DispatchCategory } from '@/types/dispatch';

interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface SavePostInput {
  slug: string;
  title: string;
  category: DispatchCategory;
  author: string;
  eyebrow?: string;
  ref_id?: string;
  tag?: string;
  summary: string;
  tags: string[];
  content: Block[];
}

async function assertEditor(
  supabase: Awaited<ReturnType<typeof createClient>>,
  requiredRole: 'editor' | 'ceo' = 'editor',
) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 'Not authenticated.';

  const { data } = await supabase
    .from('crafter_profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (requiredRole === 'ceo') {
    if (data?.role !== 'ceo') return 'Insufficient clearance — CEO required.';
  } else {
    if (!data || !['ceo', 'officer'].includes(data.role)) {
      return 'Insufficient clearance — CEO or Officer required.';
    }
  }
  return null;
}

/** Upsert a post as draft */
export async function savePost(input: SavePostInput): Promise<ActionResult<{ slug: string }>> {
  const supabase = await createClient();
  const authError = await assertEditor(supabase);
  if (authError) return { success: false, error: authError };

  const { data, error } = await supabase
    .from('dispatch_posts')
    .upsert(
      { ...input, status: 'draft' },
      { onConflict: 'slug' },
    )
    .select('slug')
    .single();

  if (error) {
    return { success: false, error: 'Failed to save post.' };
  }

  revalidatePath('/corp/hq/dispatch');
  return { success: true, data: { slug: data.slug } };
}

/** Publish a post — sets status=published and published_at=today if not set */
export async function publishPost(slug: string): Promise<ActionResult> {
  const supabase = await createClient();
  const authError = await assertEditor(supabase);
  if (authError) return { success: false, error: authError };

  const today = new Date().toISOString().split('T')[0];

  const { error } = await supabase
    .from('dispatch_posts')
    .update({ status: 'published', published_at: today })
    .eq('slug', slug)
    .is('published_at', null); // only set date if not already set

  // If above matched nothing (date was already set), just flip status
  if (error) {
    const { error: e2 } = await supabase
      .from('dispatch_posts')
      .update({ status: 'published' })
      .eq('slug', slug);
    if (e2) return { success: false, error: 'Failed to publish post.' };
  }

  revalidatePath('/dispatch');
  revalidatePath(`/dispatch/${slug}`);
  revalidatePath('/corp/hq/dispatch');
  revalidatePath('/');
  return { success: true };
}

/** Retract a post back to draft */
export async function unpublishPost(slug: string): Promise<ActionResult> {
  const supabase = await createClient();
  const authError = await assertEditor(supabase);
  if (authError) return { success: false, error: authError };

  const { error } = await supabase
    .from('dispatch_posts')
    .update({ status: 'draft' })
    .eq('slug', slug);

  if (error) return { success: false, error: 'Failed to retract post.' };

  revalidatePath('/dispatch');
  revalidatePath(`/dispatch/${slug}`);
  revalidatePath('/corp/hq/dispatch');
  revalidatePath('/');
  return { success: true };
}

/** Hard delete — CEO only, enforced at both app and RLS layers */
export async function deletePost(slug: string): Promise<ActionResult> {
  const supabase = await createClient();
  const authError = await assertEditor(supabase, 'ceo');
  if (authError) return { success: false, error: authError };

  const { error } = await supabase
    .from('dispatch_posts')
    .delete()
    .eq('slug', slug);

  if (error) return { success: false, error: 'Failed to delete post.' };

  revalidatePath('/dispatch');
  revalidatePath('/corp/hq/dispatch');
  revalidatePath('/');
  return { success: true };
}
