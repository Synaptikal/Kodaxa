import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { canManageRoster } from '@/types/corp';

// Allows ceo + officer — aligns with feedback RLS policies in migration 018.
export async function requireDirector() {
  const supabase = await createClient();
  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userData?.user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });

  const user = userData.user;
  const { data: profile } = await supabase
    .from('crafter_profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const role = profile?.role ?? 'client';
  if (!canManageRoster(role)) return NextResponse.json({ error: 'forbidden' }, { status: 403 });

  return { supabase, user, profile };
}
