'use client';

import { useState, useTransition } from 'react';
import { reviewApplication } from '@/lib/corp/actions';
import type { CorpApplication } from '@/types/corp';
import { TRACK_LABELS, AVAILABILITY_LABELS } from '@/types/corp';

interface AdminPanelProps {
  applications: CorpApplication[];
}

export function AdminPanel({ applications }: AdminPanelProps) {
  const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected'>('pending');

  const filtered = applications.filter((a) => a.status === filter);
  const counts = {
    pending:  applications.filter((a) => a.status === 'pending').length,
    approved: applications.filter((a) => a.status === 'approved').length,
    rejected: applications.filter((a) => a.status === 'rejected').length,
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div className="space-y-1">
        <p className="text-[9px] font-mono text-slate-600 uppercase tracking-[0.3em]">Corp HQ // Admin Control</p>
        <h1 className="text-xl font-bold font-mono text-slate-100">Admin Control</h1>
        <p className="text-xs text-slate-500">Director access — recruitment applications</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 border-b border-sr-border">
        {(['pending','approved','rejected'] as const).map((s) => {
          const labels = { pending: 'Pending Review', approved: 'Approved', rejected: 'Rejected' };
          const colors = {
            pending:  filter === s ? 'border-amber-500 text-amber-300' : 'border-transparent text-slate-500 hover:text-slate-300',
            approved: filter === s ? 'border-teal-500 text-teal-300'  : 'border-transparent text-slate-500 hover:text-slate-300',
            rejected: filter === s ? 'border-red-500 text-red-300'    : 'border-transparent text-slate-500 hover:text-slate-300',
          };
          return (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 text-[9px] font-mono font-semibold uppercase tracking-wider border-b-2 -mb-px transition-colors ${colors[s]}`}
            >
              {labels[s]} ({counts[s]})
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <p className="text-xs text-slate-600 font-mono text-center py-8 border border-sr-border">
          No applications in this category
        </p>
      ) : (
        <div className="space-y-3">
          {filtered.map((app) => (
            <ApplicationCard key={app.id} application={app} />
          ))}
        </div>
      )}
    </div>
  );
}

function ApplicationCard({ application: app }: { application: CorpApplication }) {
  const [isPending, startTransition] = useTransition();
  const [expanded, setExpanded] = useState(app.status === 'pending');
  const [notes, setNotes] = useState('');

  function handle(status: 'approved' | 'rejected') {
    startTransition(async () => {
      await reviewApplication(app.id, status, notes || undefined);
    });
  }

  const statusColors = {
    pending:  'text-amber-400 border-amber-600/40 bg-amber-900/10',
    approved: 'text-teal-400 border-teal-600/40 bg-teal-900/10',
    rejected: 'text-red-400 border-red-600/40 bg-red-900/10',
  };
  const statusLabels = { pending: 'PENDING', approved: 'APPROVED', rejected: 'REJECTED' };

  return (
    <div className="border border-sr-border bg-sr-surface/40">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-800/30 transition-colors text-left"
      >
        <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 border shrink-0 ${statusColors[app.status]}`}>
          {statusLabels[app.status]}
        </span>
        <span className="text-xs font-mono text-slate-200 flex-1 truncate">{app.in_game_name}</span>
        <span className="text-[9px] font-mono text-slate-500 shrink-0">
          {TRACK_LABELS[app.track] ?? app.track}
        </span>
        <span className="text-[8px] font-mono text-slate-700 shrink-0">
          {new Date(app.created_at).toLocaleDateString()}
        </span>
        <span className={`text-[9px] text-slate-600 shrink-0 ${expanded ? 'rotate-180' : ''} transition-transform`}>▾</span>
      </button>

      {expanded && (
        <div className="border-t border-sr-border px-4 py-4 space-y-4 bg-sr-bg/30">
          <div className="grid sm:grid-cols-3 gap-4 text-xs">
            <Field label="In-Game Name"   value={app.in_game_name} />
            {app.discord_handle && <Field label="Discord" value={app.discord_handle} />}
            <Field label="Track"          value={TRACK_LABELS[app.track] ?? app.track} />
            {app.availability && <Field label="Availability" value={AVAILABILITY_LABELS[app.availability] ?? app.availability} />}
          </div>

          {app.professions && app.professions.length > 0 && (
            <div>
              <p className="text-[8px] font-mono text-slate-600 uppercase tracking-widest mb-1.5">Professions</p>
              <div className="flex flex-wrap gap-1">
                {app.professions.map((p) => (
                  <span key={p} className="text-[9px] font-mono px-1.5 py-0.5 border border-slate-700 bg-slate-800 text-slate-400">{p}</span>
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="text-[8px] font-mono text-slate-600 uppercase tracking-widest mb-1">Motivation</p>
            <p className="text-xs text-slate-300 leading-relaxed">{app.motivation}</p>
          </div>

          {app.review_notes && (
            <div>
              <p className="text-[8px] font-mono text-slate-600 uppercase tracking-widest mb-1">Review Notes</p>
              <p className="text-xs text-slate-400">{app.review_notes}</p>
            </div>
          )}

          {app.status === 'pending' && (
            <div className="space-y-2 border-t border-sr-border pt-4">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Optional review notes..."
                className="w-full bg-sr-bg border border-sr-border px-2 py-1.5 text-xs font-mono text-slate-300 focus:border-cyan-700 focus:outline-none resize-none h-16"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handle('approved')}
                  disabled={isPending}
                  className="px-4 py-1.5 text-[9px] font-mono font-bold uppercase tracking-wider border border-teal-700/50 text-teal-400 hover:bg-teal-900/20 transition-colors disabled:opacity-40"
                >
                  APPROVE
                </button>
                <button
                  onClick={() => handle('rejected')}
                  disabled={isPending}
                  className="px-4 py-1.5 text-[9px] font-mono font-bold uppercase tracking-wider border border-red-700/50 text-red-400 hover:bg-red-900/20 transition-colors disabled:opacity-40"
                >
                  REJECT
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[8px] font-mono text-slate-600 uppercase tracking-widest">{label}</p>
      <p className="text-xs text-slate-300 mt-0.5">{value}</p>
    </div>
  );
}
