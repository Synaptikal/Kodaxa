/**
 * actions.ts
 * Next.js Server Actions for crafter directory mutations.
 * One concern: create/update profiles, specializations, and reviews.
 *
 * Server Actions run server-side with full auth context.
 * All writes validate auth.uid() before touching the DB.
 * RLS is the final enforcement layer — these are defense-in-depth.
 */

'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import type {
  UpsertProfileInput,
  AddSpecializationInput,
  SubmitReviewInput,
} from '@/types/directory';

/** Standard action result */
interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

// ── Profile ────────────────────────────────────────────────────────

export async function upsertCrafterProfile(
  input: UpsertProfileInput,
): Promise<ActionResult<{ id: string }>> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: 'Not authenticated.' };

  // Validate bio length (500 char limit)
  if (input.bio && input.bio.length > 500) {
    return { success: false, error: 'Bio must be 500 characters or fewer.' };
  }

  const { data, error } = await supabase
    .from('crafter_profiles')
    .upsert(
      { id: user.id, ...input, updated_at: new Date().toISOString() },
      { onConflict: 'id' },
    )
    .select('id')
    .single();

  if (error) {
    if (error.code === '23505') {
      return { success: false, error: 'That in-game name is already taken.' };
    }
    return { success: false, error: 'Failed to save profile.' };
  }

  revalidatePath('/directory');
  revalidatePath(`/directory/${input.in_game_name}`);
  return { success: true, data: { id: data.id } };
}

// ── Specializations ────────────────────────────────────────────────

export async function addSpecialization(
  input: AddSpecializationInput,
): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: 'Not authenticated.' };

  const { error } = await supabase.from('crafter_specializations').insert({
    crafter_id: user.id,
    ...input,
  });

  if (error) {
    if (error.code === '23505') {
      return { success: false, error: 'You already have this profession listed.' };
    }
    return { success: false, error: 'Failed to add specialization.' };
  }

  revalidatePath('/directory');
  revalidatePath('/directory/me');
  return { success: true };
}

export async function removeSpecialization(
  specializationId: string,
): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: 'Not authenticated.' };

  const { error } = await supabase
    .from('crafter_specializations')
    .delete()
    .eq('id', specializationId)
    .eq('crafter_id', user.id); // RLS + app-level guard

  if (error) return { success: false, error: 'Failed to remove specialization.' };

  revalidatePath('/directory');
  revalidatePath('/directory/me');
  return { success: true };
}

// ── Reviews ────────────────────────────────────────────────────────

export async function submitReview(
  input: SubmitReviewInput,
): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: 'Not authenticated.' };

  // Prevent self-reviews (belt + suspenders — SQL CHECK also enforces this)
  if (user.id === input.reviewee_id) {
    return { success: false, error: 'You cannot review yourself.' };
  }

  // Validate rating
  if (input.rating < 1 || input.rating > 5) {
    return { success: false, error: 'Rating must be between 1 and 5.' };
  }

  const { error } = await supabase.from('crafter_reviews').insert({
    reviewer_id: user.id,
    ...input,
  });

  if (error) {
    if (error.code === '23505') {
      return { success: false, error: 'You have already reviewed this crafter.' };
    }
    return { success: false, error: 'Failed to submit review.' };
  }

  revalidatePath(`/directory/${input.reviewee_id}`);
  return { success: true };
}

// ── Profile visibility ─────────────────────────────────────────────

export async function setProfileVisibility(
  visible: boolean,
): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: 'Not authenticated.' };

  const { error } = await supabase
    .from('crafter_profiles')
    .update({ is_visible: visible, updated_at: new Date().toISOString() })
    .eq('id', user.id);

  if (error) return { success: false, error: 'Failed to update visibility.' };

  revalidatePath('/directory');
  return { success: true };
}
