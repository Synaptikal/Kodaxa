import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { canAdminister } from '@/types/corp';
import AdminControls from '@/components/feedback/AdminControls';

export const metadata = { title: 'Admin — Feedback' };

export default async function AdminFeedbackPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/auth/sign-in?next=/admin/feedback');

  const { data: profile } = await supabase
    .from('crafter_profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const role = profile?.role ?? 'client';
  if (!canAdminister(role)) redirect('/');

  const { data: items, error } = await supabase.from('feedback').select('*').order('created_at', { ascending: false });
  if (error) {
    return <div className="p-4">Error loading feedback: {error.message}</div>;
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">Feedback (Admin)</h1>
      <p className="text-sm text-slate-400">Director-level access required; you can review, mark reviewed, or delete entries.</p>

      <ul className="mt-6 space-y-4">
        {items?.map((it: any) => (
          <li key={it.id} data-feedback-id={it.id} className="border rounded p-3">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium">{it.name} — <span className="text-xs text-slate-500">{it.email}</span></p>
                <p className="text-xs text-slate-400">{new Date(it.created_at).toLocaleString()}</p>
              </div>
              <div className="ml-4">
                <AdminControls id={it.id} status={it.status} />
              </div>
            </div>
            <div className="mt-2 text-sm whitespace-pre-wrap">{it.message}</div>
            <div className="mt-2 text-xs text-slate-500">Status: <span className="feedback-status-text">{it.status ?? 'pending'}</span></div>
          </li>
        ))}
      </ul>
    </main>
  );
}
