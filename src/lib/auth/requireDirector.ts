import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { canAdminister } from '@/types/corp';

export async function requireDirector() {
  const supabase = await createClient();
  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userData?.user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });

  const user = userData.user;
  const { data: profile, error: profileErr } = await supabase
    .from('crafter_profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const role = profile?.role ?? 'client';
  if (!canAdminister(role)) return NextResponse.json({ error: 'forbidden' }, { status: 403 });

  return { supabase, user, profile };
}
