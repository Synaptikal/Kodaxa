/**
 * lib/corp/actions.ts
 * Server actions for the Kodaxa corp system.
 * Commissions, applications, and role management.
 */

'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import type { CommissionStatus, ApplicationStatus, CorpRole } from '@/types/corp';

// ── Commissions ───────────────────────────────────────────────────────

export async function submitCommission(formData: {
  assigneeId: string;
  title: string;
  description: string;
  itemType?: string;
  quantity?: number;
  budgetHint?: string;
  planet?: string;
  deliveryHint?: string;
  deadlineHint?: string;
  clientNotes?: string;
}): Promise<{ success: boolean; error?: string; id?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Not authenticated' };

  const { data, error } = await supabase
    .from('commissions')
    .insert({
      client_id:     user.id,
      assignee_id:   formData.assigneeId,
      title:         formData.title,
      description:   formData.description,
      item_type:     formData.itemType || null,
      quantity:      formData.quantity ?? 1,
      budget_hint:   formData.budgetHint || null,
      planet:        formData.planet || null,
      delivery_hint: formData.deliveryHint || null,
      deadline_hint: formData.deadlineHint || null,
      client_notes:  formData.clientNotes || null,
    })
    .select('id')
    .single();

  if (error) return { success: false, error: error.message };

  revalidatePath('/corp/hq/commissions');
  return { success: true, id: data.id };
}

export async function updateCommissionStatus(
  id: string,
  status: CommissionStatus,
  assigneeNotes?: string,
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const update: Record<string, unknown> = { status };
  if (assigneeNotes !== undefined) update.assignee_notes = assigneeNotes;

  const { error } = await supabase
    .from('commissions')
    .update(update)
    .eq('id', id);

  if (error) return { success: false, error: error.message };

  revalidatePath('/corp/hq/commissions');
  return { success: true };
}

export async function cancelCommission(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Not authenticated' };

  const { error } = await supabase
    .from('commissions')
    .update({ status: 'cancelled' })
    .eq('id', id)
    .eq('client_id', user.id)
    .eq('status', 'pending');

  if (error) return { success: false, error: error.message };
  revalidatePath('/corp/hq/commissions');
  return { success: true };
}

// ── Applications ──────────────────────────────────────────────────────

export async function submitApplication(formData: {
  inGameName: string;
  discordHandle?: string;
  track: string;
  motivation: string;
  professions?: string[];
  availability?: string;
}): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { error } = await supabase
    .from('corp_applications')
    .insert({
      applicant_id:   user?.id ?? null,
      in_game_name:   formData.inGameName,
      discord_handle: formData.discordHandle || null,
      track:          formData.track,
      motivation:     formData.motivation,
      professions:    formData.professions ?? null,
      availability:   formData.availability || null,
    });

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function reviewApplication(
  id: string,
  status: ApplicationStatus,
  reviewNotes?: string,
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Not authenticated' };

  const { error } = await supabase
    .from('corp_applications')
    .update({ status, review_notes: reviewNotes || null, reviewed_by: user.id })
    .eq('id', id);

  if (error) return { success: false, error: error.message };

  revalidatePath('/corp/hq/admin');
  return { success: true };
}

// ── Role management (CEO only) ────────────────────────────────────────

export async function setMemberRole(
  profileId: string,
  role: CorpRole,
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Not authenticated' };

  // Verify current user is CEO
  const { data: me } = await supabase
    .from('crafter_profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (me?.role !== 'ceo') return { success: false, error: 'Insufficient clearance' };

  // Cannot demote yourself
  if (profileId === user.id && role !== 'ceo') {
    return { success: false, error: 'Cannot change your own rank' };
  }

  const { error } = await supabase
    .from('crafter_profiles')
    .update({ role })
    .eq('id', profileId);

  if (error) return { success: false, error: error.message };

  revalidatePath('/corp/hq/roster');
  revalidatePath('/corp/hq/admin');
  return { success: true };
}
