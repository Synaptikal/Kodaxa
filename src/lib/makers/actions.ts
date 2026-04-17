/**
 * actions.ts
 * Server Actions for Maker's Mark portfolio management.
 * One concern: upsert and delete maker_portfolio_items.
 *
 * RLS enforces ownership. These are defense-in-depth.
 */

'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import type { UpsertPortfolioItemInput } from '@/types/makers';

interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

const MAX_TITLE = 120;
const MAX_DESC = 800;
const MAX_URL = 500;

export async function upsertPortfolioItem(
  input: UpsertPortfolioItemInput,
): Promise<ActionResult<{ id: string }>> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Not authenticated.' };

  const title = input.title.trim();
  if (!title) return { success: false, error: 'Title is required.' };
  if (title.length > MAX_TITLE) {
    return { success: false, error: `Title must be ${MAX_TITLE} chars or fewer.` };
  }
  if (input.description && input.description.length > MAX_DESC) {
    return { success: false, error: `Description must be ${MAX_DESC} chars or fewer.` };
  }
  if (input.image_url && input.image_url.length > MAX_URL) {
    return { success: false, error: `Image URL must be ${MAX_URL} chars or fewer.` };
  }

  const row = {
    crafter_id:      user.id,
    title,
    description:     input.description ?? null,
    profession_id:   input.profession_id ?? null,
    item_type:       input.item_type ?? null,
    image_url:       input.image_url ?? null,
    is_featured:     input.is_featured ?? false,
    is_visible:      input.is_visible ?? true,
    commission_hint: input.commission_hint ?? null,
  };

  const query = input.id
    ? supabase
        .from('maker_portfolio_items')
        .update(row)
        .eq('id', input.id)
        .eq('crafter_id', user.id)
        .select('id')
        .single()
    : supabase.from('maker_portfolio_items').insert(row).select('id').single();

  const { data, error } = await query;
  if (error) return { success: false, error: error.message };

  revalidatePath('/makers');
  revalidatePath('/directory/me');
  return { success: true, data: { id: data.id } };
}

export async function deletePortfolioItem(
  id: string,
): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Not authenticated.' };

  const { error } = await supabase
    .from('maker_portfolio_items')
    .delete()
    .eq('id', id)
    .eq('crafter_id', user.id);

  if (error) return { success: false, error: error.message };

  revalidatePath('/makers');
  revalidatePath('/directory/me');
  return { success: true };
}
