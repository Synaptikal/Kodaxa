/**
 * xp-timer-panel.tsx
 * XP & Atrophy Timer main panel.
 * One concern: add/manage per-profession XP session timers with atrophy warnings.
 *
 * Game rule: skills go "out of practice" after 7 days without XP in that tree.
 * Users log when they last earned XP per profession. Timer counts down to atrophy.
 *
 * State stored in localStorage under key 'sr_xp_timers'.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { getProfessionSummaries } from '@/data/professions/index';
import { CountdownTimer } from '@/components/ui/countdown-timer';

const STORAGE_KEY = 'sr_xp_timers';
const ATROPHY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

interface XpEntry {
  professionId: string;
  professionName: string;
  lastXpAt: string; // ISO timestamp
  note?: string;
}

function loadEntries(): XpEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as XpEntry[];
  } catch {
    return [];
  }
}

function saveEntries(entries: XpEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

const ALL_SUMMARIES = getProfessionSummaries();

export function XpTimerPanel() {
  const [entries, setEntries] = useState<XpEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [addingProf, setAddingProf] = useState('');
  const [addingNote, setAddingNote] = useState('');
  const [filterExpired, setFilterExpired] = useState(false);

  useEffect(() => {
    setEntries(loadEntries());
    setHydrated(true);
  }, []);

  const logXp = useCallback((professionId: string, note?: string) => {
    const prof = ALL_SUMMARIES.find((s) => s.id === professionId);
    if (!prof) return;

    setEntries((prev) => {
      const next = prev.filter((e) => e.professionId !== professionId);
      const entry: XpEntry = {
        professionId,
        professionName: prof.name,
        lastXpAt: new Date().toISOString(),
        note: note?.trim() || undefined,
      };
      const updated = [entry, ...next];
      saveEntries(updated);
      return updated;
    });
  }, []);

  const removeEntry = useCallback((professionId: string) => {
    setEntries((prev) => {
      const updated = prev.filter((e) => e.professionId !== professionId);
      saveEntries(updated);
      return updated;
    });
  }, []);

  const handleAdd = useCallback(() => {
    if (!addingProf) return;
    logXp(addingProf, addingNote);
    setAddingProf('');
    setAddingNote('');
  }, [addingProf, addingNote, logXp]);

  // Professions not yet tracked
  const untrackedProfs = ALL_SUMMARIES.filter(
    (s) => !entries.some((e) => e.professionId === s.id),
  );

  const now = Date.now();
  const displayEntries = filterExpired
    ? entries.filter((e) => now - new Date(e.lastXpAt).getTime() >= ATROPHY_MS)
    : entries;

  if (!hydrated) return null;

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Toolbar */}
      <div className="px-5 py-4 border-b border-slate-800 bg-sr-surface shrink-0">
        <div className="flex items-center justify-between gap-4 mb-3">
          <div>
            <h1 className="text-sm font-bold text-slate-200">XP &amp; Atrophy Timer</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Track when you last earned XP per profession. Skills atrophy after 7 days.
            </p>
          </div>
          <button
            onClick={() => setFilterExpired((v) => !v)}
            className={`text-xs px-2.5 py-1 rounded border transition-colors ${
              filterExpired
                ? 'bg-red-900/40 text-red-300 border-red-800/50'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-600'
            }`}
          >
            {filterExpired ? 'Showing: Expired' : 'Show: All'}
          </button>
        </div>

        {/* Add entry */}
        <div className="flex items-center gap-2">
          <select
            value={addingProf}
            onChange={(e) => setAddingProf(e.target.value)}
            className="flex-1 bg-slate-800 border border-slate-700 rounded-md px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-600 transition-colors"
          >
            <option value="">— Select profession —</option>
            {untrackedProfs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={addingNote}
            onChange={(e) => setAddingNote(e.target.value)}
            placeholder="Note (optional)"
            className="w-32 bg-slate-800 border border-slate-700 rounded-md px-2.5 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-600 transition-colors"
          />
          <button
            onClick={handleAdd}
            disabled={!addingProf}
            className="px-3 py-1.5 rounded-md text-xs font-medium bg-cyan-800/50 text-cyan-200 hover:bg-cyan-800/70 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Log XP Now
          </button>
        </div>
      </div>

      {/* Timer list */}
      <div className="flex-1 overflow-y-auto p-4">
        {entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 gap-3 text-center">
            <p className="text-slate-500 text-sm">No XP sessions tracked yet.</p>
            <p className="text-sr-muted text-xs max-w-xs">
              Select a profession above and click "Log XP Now" after each play session to track your atrophy timers.
            </p>
          </div>
        ) : displayEntries.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-sr-muted text-sm">
            No expired timers right now.
          </div>
        ) : (
          <div className="space-y-2 max-w-2xl mx-auto">
            {displayEntries.map((entry) => {
              const elapsed = now - new Date(entry.lastXpAt).getTime();
              const targetDate = new Date(new Date(entry.lastXpAt).getTime() + ATROPHY_MS);
              const isExpired = elapsed >= ATROPHY_MS;
              const isWarning = !isExpired && elapsed >= ATROPHY_MS * 0.75; // 75%+ used

              return (
                <div
                  key={entry.professionId}
                  className={`flex items-center gap-4 px-4 py-3 rounded-lg border transition-colors ${
                    isExpired
                      ? 'border-red-800/60 bg-red-900/10'
                      : isWarning
                        ? 'border-amber-800/60 bg-amber-900/10'
                        : 'border-slate-700 bg-slate-800/30'
                  }`}
                >
                  {/* Profession name */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-200">{entry.professionName}</p>
                    {entry.note && (
                      <p className="text-xs text-sr-muted truncate">{entry.note}</p>
                    )}
                    <p className="text-xs text-sr-muted mt-0.5">
                      Last XP: {new Date(entry.lastXpAt).toLocaleString(undefined, {
                        month: 'short', day: 'numeric',
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </p>
                  </div>

                  {/* Countdown */}
                  <div className="text-right shrink-0">
                    <p className="text-xs text-sr-muted uppercase tracking-wider mb-0.5">
                      {isExpired ? 'Atrophied' : 'Atrophies in'}
                    </p>
                    <CountdownTimer
                      targetDate={targetDate}
                      className="text-sm font-bold"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-1 shrink-0">
                    <button
                      onClick={() => logXp(entry.professionId, entry.note)}
                      className="text-xs px-2 py-1 rounded bg-teal-800/40 text-teal-300 hover:bg-teal-800/60 transition-colors"
                      title="Reset timer — log XP now"
                    >
                      ↺ Log XP
                    </button>
                    <button
                      onClick={() => removeEntry(entry.professionId)}
                      className="text-xs px-2 py-1 rounded bg-slate-700/40 text-slate-500 hover:text-red-400 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer hint */}
      {entries.length > 0 && (
        <div className="px-5 py-2 border-t border-slate-800 shrink-0">
          <p className="text-xs text-slate-700 text-center">
            Timers stored locally in your browser. {entries.length} profession{entries.length !== 1 ? 's' : ''} tracked.
          </p>
        </div>
      )}
    </div>
  );
}
