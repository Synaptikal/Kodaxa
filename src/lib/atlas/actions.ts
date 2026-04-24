/**
 * actions.ts
 * Next.js Server Actions for Resource Atlas mutations.
 * One concern: submit / update / delete resource readings.
 *
 * All writes validate auth.uid() and clamp PQRV into the game range.
 * RLS on resource_readings is the final enforcement layer.
 */

'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { clampPQRV, type SubmitReadingInput } from '@/types/atlas';

interface ActionResult<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

const MAX_RESOURCE_NAME = 80;
const MAX_PLANET = 60;
const MAX_NOTES = 500;
const MAX_COORDS = 120;

// ── Submit new reading ───────────────────────────────────────────────

export async function submitResourceReading(
  input: SubmitReadingInput,
): Promise<ActionResult<{ id: string }>> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: 'Not authenticated.' };

  // Validation
  const resource_name = input.resource_name.trim();
  const planet = input.planet.trim();

  if (!resource_name) return { success: false, error: 'Resource name is required.' };
  if (resource_name.length > MAX_RESOURCE_NAME) {
    return { success: false, error: `Resource name must be ${MAX_RESOURCE_NAME} chars or fewer.` };
  }
  if (!planet) return { success: false, error: 'Planet is required.' };
  if (planet.length > MAX_PLANET) {
    return { success: false, error: `Planet name must be ${MAX_PLANET} chars or fewer.` };
  }
  if (input.notes && input.notes.length > MAX_NOTES) {
    return { success: false, error: `Notes must be ${MAX_NOTES} chars or fewer.` };
  }
  if (input.coords_hint && input.coords_hint.length > MAX_COORDS) {
    return { success: false, error: `Coords must be ${MAX_COORDS} chars or fewer.` };
  }

  const row = {
    submitter_id:      user.id,
    resource_name,
    resource_category: input.resource_category,
    planet,
    // planet_key is filled by the DB trigger
    planet_key:        planet.toLowerCase(),
    biome_id:          input.biome_id,
    coords_hint:       input.coords_hint,
    potential:   clampPQRV(input.potential),
    quality:     clampPQRV(input.quality),
    resilience:  clampPQRV(input.resilience),
    versatility: clampPQRV(input.versatility),
    notes:       input.notes,
  };

  const { data, error } = await supabase
    .from('resource_readings')
    .insert(row)
    .select('id')
    .single();

  if (error) return { success: false, error: 'Failed to submit reading.' };

  revalidatePath('/atlas');
  revalidatePath('/terminal');
  return { success: true, data: { id: data.id } };
}

// ── Delete own reading ───────────────────────────────────────────────

export async function deleteResourceReading(
  id: string,
): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: 'Not authenticated.' };

  // RLS enforces ownership — this is defense-in-depth.
  const { error } = await supabase
    .from('resource_readings')
    .delete()
    .eq('id', id)
    .eq('submitter_id', user.id);

  if (error) return { success: false, error: 'Failed to delete reading.' };

  revalidatePath('/atlas');
  revalidatePath('/terminal');
  return { success: true };
}
