/**
 * actions.ts
 * Server Actions for Market Prices.
 * One concern: submit / delete market price reports.
 */

'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import type { SubmitPriceReportInput } from '@/types/market';

interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

const MAX_ITEM = 120;
const MAX_PLANET = 60;
const MAX_VENDOR = 120;
const MAX_NOTES = 500;
const MAX_PRICE = 10_000_000_000; // 10B cr — plenty of headroom

export async function submitPriceReport(
  input: SubmitPriceReportInput,
): Promise<ActionResult<{ id: string }>> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Not authenticated.' };

  const item = input.item_name.trim();
  const planet = input.planet.trim();

  if (!item) return { success: false, error: 'Item name is required.' };
  if (item.length > MAX_ITEM) {
    return { success: false, error: `Item name must be ${MAX_ITEM} chars or fewer.` };
  }
  if (!planet) return { success: false, error: 'Planet is required.' };
  if (planet.length > MAX_PLANET) {
    return { success: false, error: `Planet name must be ${MAX_PLANET} chars or fewer.` };
  }
  if (input.vendor_hint && input.vendor_hint.length > MAX_VENDOR) {
    return { success: false, error: `Vendor hint must be ${MAX_VENDOR} chars or fewer.` };
  }
  if (input.notes && input.notes.length > MAX_NOTES) {
    return { success: false, error: `Notes must be ${MAX_NOTES} chars or fewer.` };
  }

  const quantity = Math.max(1, Math.floor(input.quantity));
  const total    = Math.floor(input.total_price);
  if (!Number.isFinite(total) || total < 0 || total > MAX_PRICE) {
    return { success: false, error: 'Price must be a non-negative integer within bounds.' };
  }

  const row = {
    submitter_id:  user.id,
    item_name:     item,
    item_category: input.item_category,
    planet,
    planet_key:    planet.toLowerCase(),
    vendor_hint:   input.vendor_hint,
    side:          input.side,
    quantity,
    total_price:   total,
    unit_price:    total / quantity, // trigger recomputes anyway
    notes:         input.notes,
    observed_at:   input.observed_at ?? new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('market_price_reports')
    .insert(row)
    .select('id')
    .single();

  if (error) return { success: false, error: error.message };

  revalidatePath('/market');
  revalidatePath('/terminal');
  return { success: true, data: { id: data.id } };
}

export async function deletePriceReport(
  id: string,
): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Not authenticated.' };

  const { error } = await supabase
    .from('market_price_reports')
    .delete()
    .eq('id', id)
    .eq('submitter_id', user.id);

  if (error) return { success: false, error: error.message };

  revalidatePath('/market');
  revalidatePath('/terminal');
  return { success: true };
}
