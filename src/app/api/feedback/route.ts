import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireDirector } from '@/lib/auth/requireDirector';

const MAX_NAME    = 80;
const MAX_EMAIL   = 254;
const MAX_MESSAGE = 2000;

const VALID_CATEGORIES = ['bug_report', 'feature_request', 'data_issue', 'tool_feedback', 'general'] as const;
type Category = typeof VALID_CATEGORIES[number];

function apiError(message: string, code: string, status: number) {
  return NextResponse.json({ error: message, code }, { status });
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return apiError('Authentication required.', 'UNAUTHENTICATED', 401);

    const body = await req.json();
    const name     = String(body.name     ?? '').trim();
    const email    = String(body.email    ?? '').trim();
    const message  = String(body.message  ?? '').trim();
    const category = String(body.category ?? 'general').trim() as Category;

    if (!message) return apiError('Message is required.', 'MISSING_MESSAGE', 400);
    if (name.length    > MAX_NAME)    return apiError(`Name must be ${MAX_NAME} chars or fewer.`,       'NAME_TOO_LONG',    400);
    if (email.length   > MAX_EMAIL)   return apiError(`Email must be ${MAX_EMAIL} chars or fewer.`,     'EMAIL_TOO_LONG',   400);
    if (message.length > MAX_MESSAGE) return apiError(`Message must be ${MAX_MESSAGE} chars or fewer.`, 'MESSAGE_TOO_LONG', 400);
    if (!VALID_CATEGORIES.includes(category)) return apiError('Invalid category.', 'INVALID_CATEGORY', 400);

    const { data, error } = await supabase.from('feedback').insert([
      { name, email, message, category, submitter_id: user.id },
    ]).select();

    if (error) {
      console.error('supabase insert error', error);
      return apiError('Failed to submit feedback.', 'DB_INSERT_FAILED', 500);
    }

    return NextResponse.json({ success: true, item: data?.[0] ?? null });
  } catch (err) {
    console.error(err);
    return apiError('Invalid request body.', 'INVALID_BODY', 400);
  }
}

export async function GET() {
  const auth = await requireDirector();
  if (auth instanceof NextResponse) return auth;

  const { supabase } = auth;
  const { data, error } = await supabase.from('feedback').select('*').order('created_at', { ascending: false });
  if (error) return apiError('Failed to fetch feedback.', 'DB_FETCH_FAILED', 500);
  return NextResponse.json({ items: data });
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) return apiError('Missing id', 'MISSING_ID', 400);
    const auth = await requireDirector();
    if (auth instanceof NextResponse) return auth;

    const { supabase } = auth;
    const { error } = await supabase.from('feedback').delete().eq('id', id);
    if (error) return apiError('Failed to delete feedback.', 'DB_DELETE_FAILED', 500);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return apiError('Invalid request body', 'INVALID_BODY', 400);
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, status } = await req.json();
    if (!id || !status) return apiError('Missing id or status', 'MISSING_FIELDS', 400);
    const auth = await requireDirector();
    if (auth instanceof NextResponse) return auth;

    const { supabase } = auth;
    const { data, error } = await supabase.from('feedback').update({ status }).eq('id', id).select();
    if (error) return apiError('Failed to update feedback.', 'DB_UPDATE_FAILED', 500);

    return NextResponse.json({ success: true, item: data?.[0] ?? null });
  } catch (err) {
    console.error(err);
    return apiError('Invalid request body', 'INVALID_BODY', 400);
  }
}
