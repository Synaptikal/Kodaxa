/**
 * session-history.tsx
 * Scrollable list of past play sessions with activity badges.
 * One concern: render session log entries with delete action.
 */

'use client';

import type { SessionLog } from '@/types/dashboard';
import { ACTIVITY_LABELS, ACTIVITY_COLORS, formatDuration, formatKlaatuAbs } from '@/types/dashboard';

interface Props {
  sessions: SessionLog[];
  onDelete: (id: string) => void;
}

export function SessionHistory({ sessions, onDelete }: Props) {
  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-32 gap-2 text-center">
        <p className="text-slate-500 text-sm">No sessions logged yet.</p>
        <p className="text-slate-600 text-xs max-w-xs">
          Use the form above to log your play sessions. Track what you did, what you earned, and where you went.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Session History</h3>
      {sessions.map((session) => (
        <div
          key={session.id}
          className="border border-slate-700 bg-slate-800/30 rounded-lg px-4 py-3 space-y-2"
        >
          {/* Header row */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400">
                {new Date(session.date).toLocaleDateString(undefined, {
                  month: 'short', day: 'numeric', year: 'numeric',
                })}
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {session.duration_minutes === 0 ? 'Quick Log' : formatDuration(session.duration_minutes)}
              </span>
            </div>
            <div className="flex items-center gap-3">
              {session.klaatu_earned > 0 && (
                <span className="text-[10px] font-mono text-emerald-400">+{formatKlaatuAbs(session.klaatu_earned)}</span>
              )}
              {session.klaatu_spent > 0 && (
                <span className="text-[10px] font-mono text-red-400">-{formatKlaatuAbs(session.klaatu_spent)}</span>
              )}
              <button
                onClick={() => onDelete(session.id)}
                className="text-xs text-slate-600 hover:text-red-400 transition-colors"
              >
                ×
              </button>
            </div>
          </div>

          {/* Activity badges */}
          {session.activities.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {session.activities.map((act, i) => (
                <span
                  key={i}
                  className={`text-[10px] px-1.5 py-0.5 rounded border ${ACTIVITY_COLORS[act.type]}`}
                  title={act.detail + (act.planet ? ` — ${act.planet}` : '')}
                >
                  {ACTIVITY_LABELS[act.type]}{act.planet ? ` · ${act.planet}` : ''}
                </span>
              ))}
            </div>
          )}

          {/* XP gains */}
          {Object.keys(session.xp_gained).length > 0 && (
            <div className="flex flex-wrap gap-2">
              {Object.entries(session.xp_gained).map(([profId, xp]) => (
                <span key={profId} className="text-[10px] font-mono text-violet-400">
                  {profId.split('.')[0]}: +{xp} XP
                </span>
              ))}
            </div>
          )}

          {/* Notes */}
          {session.notes && (
            <p className="text-xs text-slate-500 italic">{session.notes}</p>
          )}
        </div>
      ))}
    </div>
  );
}
