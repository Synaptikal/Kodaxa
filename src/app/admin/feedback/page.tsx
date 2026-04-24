import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { canManageRoster } from '@/types/corp';
import AdminControls from '@/components/feedback/AdminControls';

export const metadata = { title: 'Feedback Queue — Kodaxa Admin' };

const CATEGORY_LABELS: Record<string, string> = {
  bug_report:      'Bug Report',
  feature_request: 'Feature Request',
  data_issue:      'Data Issue',
  tool_feedback:   'Tool Feedback',
  general:         'General',
};

const CATEGORY_COLORS: Record<string, string> = {
  bug_report:      'text-red-400 border-red-900/50',
  feature_request: 'text-accent border-accent/30',
  data_issue:      'text-violet-400 border-violet-900/50',
  tool_feedback:   'text-cyan-400 border-cyan-900/50',
  general:         'text-sr-muted border-sr-border',
};

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
  if (!canManageRoster(role)) redirect('/');

  const { data: items, error } = await supabase
    .from('feedback')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-sm font-mono text-red-400">Error loading feedback: {error.message}</p>
      </main>
    );
  }

  const pending  = items?.filter(it => (it.status ?? 'pending') === 'pending')  ?? [];
  const reviewed = items?.filter(it => it.status === 'reviewed') ?? [];

  return (
    <main className="max-w-4xl mx-auto px-4 py-10 space-y-8">

      {/* Header */}
      <div className="border-b border-sr-border pb-5 space-y-1">
        <p className="text-[9px] font-mono uppercase tracking-[0.3em] text-sr-muted/60">Kodaxa Admin</p>
        <h1 className="text-2xl font-black font-mono text-sr-text tracking-tight">FEEDBACK QUEUE</h1>
        <div className="flex items-center gap-5 pt-1">
          <span className="text-xs font-mono text-amber-400">
            {pending.length} pending
          </span>
          <span className="text-xs font-mono text-emerald-400/70">
            {reviewed.length} reviewed
          </span>
          <span className="text-xs font-mono text-sr-muted/50">
            {items?.length ?? 0} total
          </span>
        </div>
      </div>

      {items?.length === 0 && (
        <p className="text-sm font-mono text-sr-muted/50 py-12 text-center">
          No feedback submissions yet.
        </p>
      )}

      <ul className="space-y-3">
        {items?.map((it) => {
          const catColor = CATEGORY_COLORS[it.category] ?? CATEGORY_COLORS.general;
          const catLabel = CATEGORY_LABELS[it.category] ?? 'General';
          const isAnon   = !it.name && !it.email;

          return (
            <li key={it.id} className="border border-sr-border bg-sr-surface/30 p-4 space-y-3">

              {/* Top row: identity + category + controls */}
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    {isAnon ? (
                      <span className="text-xs font-mono text-sr-muted/50 italic">Anonymous</span>
                    ) : (
                      <>
                        {it.name && (
                          <span className="text-xs font-mono font-semibold text-sr-text">{it.name}</span>
                        )}
                        {it.email && (
                          <span className="text-[9px] font-mono text-sr-muted/60">{it.email}</span>
                        )}
                      </>
                    )}
                    <span className={`text-[8px] font-mono uppercase tracking-[0.2em] border px-1.5 py-0.5 ${catColor}`}>
                      {catLabel}
                    </span>
                  </div>
                  <p className="text-[9px] font-mono text-sr-muted/50">
                    {new Date(it.created_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                </div>
                <AdminControls id={it.id} status={it.status} />
              </div>

              {/* Message body */}
              <div className="text-sm text-sr-muted leading-relaxed whitespace-pre-wrap border-l-2 border-sr-border/60 pl-3">
                {it.message}
              </div>

            </li>
          );
        })}
      </ul>

    </main>
  );
}
