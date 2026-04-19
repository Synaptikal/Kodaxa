/**
 * lib/corp/queries.ts
 * Supabase query functions for the Kodaxa corp system.
 * Covers commissions, applications, roster, and HQ stats.
 */

import { createClient } from '@/lib/supabase/server';
import type { Commission, CorpApplication, HQStats, CorpRole } from '@/types/corp';

// ── Role ──────────────────────────────────────────────────────────────

/**
 * Get the current authed user's corp role. Returns 'client' if not found.
 */
export async function getCurrentUserRole(): Promise<CorpRole> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 'client';

  const { data } = await supabase
    .from('crafter_profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  return (data?.role as CorpRole) ?? 'client';
}

/**
 * Get a crafter profile with role info (for nav/badge rendering).
 */
export async function getCurrentUserProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from('crafter_profiles')
    .select('id, display_name, in_game_name, role')
    .eq('id', user.id)
    .single();

  return data ?? null;
}

// ── HQ Stats ──────────────────────────────────────────────────────────

export async function getHQStats(): Promise<HQStats> {
  const supabase = await createClient();

  const [commRes, membersRes, appsRes, completedRes] = await Promise.all([
    supabase.from('commissions').select('id', { count: 'exact', head: true })
      .in('status', ['pending', 'accepted']),
    supabase.from('crafter_profiles').select('id', { count: 'exact', head: true })
      .in('role', ['ceo', 'officer', 'associate', 'contractor']),
    supabase.from('corp_applications').select('id', { count: 'exact', head: true })
      .eq('status', 'pending'),
    supabase.from('commissions').select('id', { count: 'exact', head: true })
      .eq('status', 'completed')
      .gte('updated_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()),
  ]);

  return {
    openCommissions:     commRes.count      ?? 0,
    activeMembers:       membersRes.count   ?? 0,
    pendingApplications: appsRes.count      ?? 0,
    completedThisMonth:  completedRes.count ?? 0,
  };
}

// ── Commissions ───────────────────────────────────────────────────────

/**
 * Get commissions visible to the current user (RLS handles filtering).
 */
export async function getCommissions(status?: string): Promise<Commission[]> {
  const supabase = await createClient();

  let query = supabase
    .from('commissions')
    .select(`
      *,
      client:client_id (id, display_name, in_game_name),
      assignee:assignee_id (id, display_name, in_game_name)
    `)
    .order('created_at', { ascending: false });

  if (status) query = query.eq('status', status);

  const { data, error } = await query;
  if (error) {
    console.error('[corp/queries] getCommissions:', error.message);
    return [];
  }

  return (data ?? []) as unknown as Commission[];
}

/**
 * Get a single commission by ID.
 */
export async function getCommission(id: string): Promise<Commission | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('commissions')
    .select(`
      *,
      client:client_id (id, display_name, in_game_name),
      assignee:assignee_id (id, display_name, in_game_name)
    `)
    .eq('id', id)
    .single();

  if (error) return null;
  return data as unknown as Commission;
}

// ── Roster ────────────────────────────────────────────────────────────

/**
 * Get all corp members (officer+ only via RLS).
 */
export async function getRoster() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('crafter_profiles')
    .select('id, display_name, in_game_name, role, home_planet, commission_status, is_visible, created_at')
    .in('role', ['ceo', 'officer', 'associate', 'contractor'])
    .order('role')
    .order('display_name');

  if (error) {
    console.error('[corp/queries] getRoster:', error.message);
    return [];
  }
  return data ?? [];
}

// ── Applications ──────────────────────────────────────────────────────

export async function getApplications(status?: string): Promise<CorpApplication[]> {
  const supabase = await createClient();

  let query = supabase
    .from('corp_applications')
    .select('*')
    .order('created_at', { ascending: false });

  if (status) query = query.eq('status', status);

  const { data, error } = await query;
  if (error) {
    console.error('[corp/queries] getApplications:', error.message);
    return [];
  }
  return (data ?? []) as CorpApplication[];
}

// ── Supply Board ──────────────────────────────────────────────────────

export async function getSupplyRequests() {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('corp_supply_requests')
    .select(`
      *,
      poster:poster_id (id, display_name, in_game_name),
      pledges:corp_supply_pledges(
        *,
        claimer:claimer_id (id, display_name, in_game_name)
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[corp/queries] getSupplyRequests:', error.message);
    return [];
  }
  
  return data;
}

// ── Skills Directory ──────────────────────────────────────────────────

export async function getMemberSkills() {
  const supabase = await createClient();
  
  // We join profiles with specializations
  // Only fetching members (not clients)
  const { data, error } = await supabase
    .from('crafter_profiles')
    .select(`
      id, display_name, in_game_name, role, home_planet,
      crafter_specializations(
        profession_id, profession_name, category, crafting_branch, skill_level
      )
    `)
    .in('role', ['ceo', 'officer', 'associate', 'contractor'])
    .order('display_name', { ascending: true });

  if (error) {
    console.error('[corp/queries] getMemberSkills:', error.message);
    return [];
  }
  
  return data;
}
