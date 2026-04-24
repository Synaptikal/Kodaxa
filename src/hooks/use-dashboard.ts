/**
 * use-dashboard.ts
 * Hooks for the Personal Analytics Dashboard.
 * One concern: localStorage CRUD for session logs, Klaatu ledger, and skill progress.
 *
 * Follows the same SSR-safe pattern as use-saved-builds.ts:
 *   - State initialized empty → hydrated from localStorage in useEffect
 *   - All writes immediately sync to localStorage via helper functions
 */

'use client';

import { useState, useCallback, useEffect } from 'react';
import type {
  SessionLog,
  KlaatuEntry,
  KlaatuCategory,
  SkillProgress,
  ActivityEntry,
} from '@/types/dashboard';

// ── Storage keys ────────────────────────────────────────────────────

const SESSION_KEY      = 'sr_session_logs';
const KLAATU_KEY       = 'sr_klaatu_ledger';
const SKILL_PROG_KEY   = 'sr_skill_progress';
const MAX_SESSIONS     = 200;
const MAX_KLAATU       = 500;

// ── Helpers ─────────────────────────────────────────────────────────

function load<T>(key: string): T[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    return JSON.parse(raw) as T[];
  } catch {
    return [];
  }
}

function save<T>(key: string, data: T[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // Storage full — silently ignore
  }
}

function uid(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// ── XP Timer Integration ─────────────────────────────────────────────

/**
 * Standalone (non-hook) function called by the XP Atrophy Timer when the user
 * logs XP for a profession. Creates a zero-duration "Quick Log" session entry
 * so the dashboard session history reflects timer activity without fabricating
 * duration or XP amounts that aren't known at log time.
 */
export function appendXpTimerLog(
  professionId: string,
  professionName: string,
  note?: string,
): void {
  if (typeof window === 'undefined') return;
  const existing = load<SessionLog>(SESSION_KEY);
  const entry: SessionLog = {
    id: uid(),
    date: new Date().toISOString(),
    duration_minutes: 0,
    activities: [{ type: 'other', detail: `XP session — ${professionName}` }],
    klaatu_earned: 0,
    klaatu_spent: 0,
    xp_gained: {},
    notes: note?.trim() || undefined,
  };
  save(SESSION_KEY, [entry, ...existing].slice(0, MAX_SESSIONS));
}

// ── Session Logs Hook ───────────────────────────────────────────────

export interface SessionLogsHook {
  sessions: SessionLog[];
  hydrated: boolean;
  addSession: (input: Omit<SessionLog, 'id'>) => void;
  updateSession: (id: string, updates: Partial<SessionLog>) => void;
  deleteSession: (id: string) => void;
  totalDuration: number;
  totalKlaatuEarned: number;
  totalKlaatuSpent: number;
}

export function useSessionLogs(): SessionLogsHook {
  const [sessions, setSessions] = useState<SessionLog[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSessions(load<SessionLog>(SESSION_KEY));
    setHydrated(true);
  }, []);

  const addSession = useCallback((input: Omit<SessionLog, 'id'>) => {
    setSessions((prev) => {
      const entry: SessionLog = { id: uid(), ...input };
      const updated = [entry, ...prev].slice(0, MAX_SESSIONS);
      save(SESSION_KEY, updated);
      return updated;
    });
  }, []);

  const updateSession = useCallback((id: string, updates: Partial<SessionLog>) => {
    setSessions((prev) => {
      const updated = prev.map((s) => (s.id === id ? { ...s, ...updates } : s));
      save(SESSION_KEY, updated);
      return updated;
    });
  }, []);

  const deleteSession = useCallback((id: string) => {
    setSessions((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      save(SESSION_KEY, updated);
      return updated;
    });
  }, []);

  const totalDuration = sessions.reduce((acc, s) => acc + s.duration_minutes, 0);
  const totalKlaatuEarned = sessions.reduce((acc, s) => acc + s.klaatu_earned, 0);
  const totalKlaatuSpent = sessions.reduce((acc, s) => acc + s.klaatu_spent, 0);

  return {
    sessions, hydrated, addSession, updateSession, deleteSession,
    totalDuration, totalKlaatuEarned, totalKlaatuSpent,
  };
}

// ── Klaatu Ledger Hook ──────────────────────────────────────────────

export interface KlaatuLedgerHook {
  entries: KlaatuEntry[];
  hydrated: boolean;
  addEntry: (category: KlaatuCategory, amount: number, description: string, sessionId?: string) => void;
  deleteEntry: (id: string) => void;
  balance: number;
  income: number;
  expenses: number;
}

export function useKlaatuLedger(): KlaatuLedgerHook {
  const [entries, setEntries] = useState<KlaatuEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setEntries(load<KlaatuEntry>(KLAATU_KEY));
    setHydrated(true);
  }, []);

  const addEntry = useCallback(
    (category: KlaatuCategory, amount: number, description: string, sessionId?: string) => {
      setEntries((prev) => {
        const entry: KlaatuEntry = {
          id: uid(),
          date: new Date().toISOString(),
          amount,
          category,
          description,
          session_id: sessionId,
        };
        const updated = [entry, ...prev].slice(0, MAX_KLAATU);
        save(KLAATU_KEY, updated);
        return updated;
      });
    },
    [],
  );

  const deleteEntry = useCallback((id: string) => {
    setEntries((prev) => {
      const updated = prev.filter((e) => e.id !== id);
      save(KLAATU_KEY, updated);
      return updated;
    });
  }, []);

  const balance = entries.reduce((acc, e) => acc + e.amount, 0);
  const income = entries.filter((e) => e.amount > 0).reduce((acc, e) => acc + e.amount, 0);
  const expenses = entries.filter((e) => e.amount < 0).reduce((acc, e) => acc + Math.abs(e.amount), 0);

  return { entries, hydrated, addEntry, deleteEntry, balance, income, expenses };
}

// ── Skill Progress Hook ─────────────────────────────────────────────

export interface SkillProgressHook {
  progress: SkillProgress[];
  hydrated: boolean;
  logXp: (professionId: string, professionName: string, xp: number) => void;
  resetProfession: (professionId: string) => void;
}

export function useSkillProgress(): SkillProgressHook {
  const [progress, setProgress] = useState<SkillProgress[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setProgress(load<SkillProgress>(SKILL_PROG_KEY));
    setHydrated(true);
  }, []);

  const logXp = useCallback((professionId: string, professionName: string, xp: number) => {
    setProgress((prev) => {
      const existing = prev.find((p) => p.profession_id === professionId);
      const entry: SkillProgress = existing
        ? {
            ...existing,
            current_xp: existing.current_xp + xp,
            sessions_logged: existing.sessions_logged + 1,
            last_active: new Date().toISOString(),
          }
        : {
            profession_id: professionId,
            profession_name: professionName,
            current_xp: xp,
            sessions_logged: 1,
            last_active: new Date().toISOString(),
          };
      const updated = [entry, ...prev.filter((p) => p.profession_id !== professionId)];
      save(SKILL_PROG_KEY, updated);
      return updated;
    });
  }, []);

  const resetProfession = useCallback((professionId: string) => {
    setProgress((prev) => {
      const updated = prev.filter((p) => p.profession_id !== professionId);
      save(SKILL_PROG_KEY, updated);
      return updated;
    });
  }, []);

  return { progress, hydrated, logXp, resetProfession };
}
