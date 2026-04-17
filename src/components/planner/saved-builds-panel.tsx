/**
 * saved-builds-panel.tsx
 * Collapsible sidebar panel for saving and loading builds from localStorage.
 * One concern: named build persistence without requiring an account.
 *
 * Displays a list of saved builds with summary stats.
 * Save overwrites any existing build with the same name.
 */

'use client';

import { useState, useCallback } from 'react';
import type { Build } from '@/types/build';
import type { SavedBuild } from '@/hooks/use-saved-builds';

export interface SavedBuildsPanelProps {
  currentBuild: Build;
  savedBuilds: SavedBuild[];
  onSave: (build: Build) => void;
  onLoad: (id: string) => void;
  onDelete: (id: string) => void;
}

export function SavedBuildsPanel({
  currentBuild,
  savedBuilds,
  onSave,
  onLoad,
  onDelete,
}: SavedBuildsPanelProps) {
  const [expanded, setExpanded] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleSave = useCallback(() => {
    onSave(currentBuild);
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2000);
    setExpanded(true);
  }, [currentBuild, onSave]);

  const handleLoad = useCallback(
    (id: string) => {
      onLoad(id);
      setExpanded(false);
    },
    [onLoad],
  );

  const handleDeleteClick = useCallback((id: string) => {
    setConfirmDeleteId(id);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (confirmDeleteId) {
      onDelete(confirmDeleteId);
      setConfirmDeleteId(null);
    }
  }, [confirmDeleteId, onDelete]);

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return iso;
    }
  };

  return (
    <div className="rounded-lg bg-slate-800/50 border border-slate-700 overflow-hidden">
      {/* Header row */}
      <div className="flex items-center justify-between px-3 py-2">
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 uppercase tracking-wider hover:text-slate-100 transition-colors"
        >
          <span className={`text-[10px] transition-transform duration-150 ${expanded ? 'rotate-90' : ''}`}>
            ▶
          </span>
          Saved Builds
          {savedBuilds.length > 0 && (
            <span className="ml-0.5 text-[10px] font-mono text-slate-500">
              ({savedBuilds.length})
            </span>
          )}
        </button>

        <button
          onClick={handleSave}
          className={`text-[10px] px-2 py-1 rounded transition-colors ${
            justSaved
              ? 'bg-teal-700/50 text-teal-300'
              : 'bg-cyan-800/40 text-cyan-300 hover:bg-cyan-800/60'
          }`}
          title={`Save current build as "${currentBuild.name}"`}
        >
          {justSaved ? '✓ Saved' : 'Save'}
        </button>
      </div>

      {/* Saved builds list */}
      {expanded && (
        <div className="border-t border-slate-700">
          {savedBuilds.length === 0 ? (
            <p className="px-3 py-4 text-xs text-slate-600 text-center">
              No saved builds yet. Click Save above.
            </p>
          ) : (
            <ul className="divide-y divide-slate-700/40">
              {savedBuilds.map((save) => (
                <li key={save.id} className="px-3 py-2">
                  {confirmDeleteId === save.id ? (
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-red-400">Delete "{save.name}"?</span>
                      <div className="flex gap-1.5">
                        <button
                          onClick={handleDeleteConfirm}
                          className="text-[10px] px-2 py-0.5 rounded bg-red-900/50 text-red-300 hover:bg-red-900 transition-colors"
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="text-[10px] px-2 py-0.5 rounded bg-slate-700 text-slate-400 hover:bg-slate-600 transition-colors"
                        >
                          No
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-2">
                      <button
                        onClick={() => handleLoad(save.id)}
                        className="flex-1 text-left group"
                      >
                        <p className="text-xs font-medium text-slate-200 group-hover:text-cyan-300 transition-colors truncate">
                          {save.name}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          {save.summary.activeSkillCount} skills · {save.summary.professionIds.length} professions
                        </p>
                        <p className="text-[9px] text-slate-600">
                          {formatDate(save.savedAt)}
                        </p>
                      </button>
                      <button
                        onClick={() => handleDeleteClick(save.id)}
                        className="shrink-0 text-slate-600 hover:text-red-400 transition-colors text-xs leading-none mt-0.5"
                        title="Delete save"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
