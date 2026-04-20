import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireDirector } from '@/lib/auth/requireDirector';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, message } = body;

    const supabase = await createClient();
    const { data, error } = await supabase.from('feedback').insert([
      { name, email, message },
    ]).select();

    if (error) {
      console.error('supabase insert error', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, item: data?.[0] ?? null });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'invalid' }, { status: 400 });
  }
}

export async function GET() {
  const auth = await requireDirector();
  if (auth instanceof NextResponse) return auth;

  const { supabase } = auth;
  const { data, error } = await supabase.from('feedback').select('*').order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ items: data });
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: 'missing id' }, { status: 400 });
    const auth = await requireDirector();
    if (auth instanceof NextResponse) return auth;

    const { supabase } = auth;
    const { error } = await supabase.from('feedback').delete().eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'invalid' }, { status: 400 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, status } = await req.json();
    if (!id || !status) return NextResponse.json({ error: 'missing id or status' }, { status: 400 });
    const auth = await requireDirector();
    if (auth instanceof NextResponse) return auth;

    const { supabase } = auth;
    const { data, error } = await supabase.from('feedback').update({ status }).eq('id', id).select();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true, item: data?.[0] ?? null });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'invalid' }, { status: 400 });
  }
}
