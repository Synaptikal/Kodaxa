/**
 * use-saved-builds.ts
 * Hook for persisting named builds to localStorage.
 * One concern: save, load, and delete builds without requiring an account.
 *
 * Saved builds are stored as a JSON array under a single localStorage key.
 * Max 20 saved builds; oldest is evicted when limit is reached.
 */

'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import type { Build } from '@/types/build';
import { createClient } from '@/lib/supabase/client';
import { pushBuilds, pullBuilds, mergeBuilds } from '@/lib/player-sync/builds-sync';

const STORAGE_KEY = 'sr_saved_builds';
const MAX_SAVES = 20;

export interface SavedBuild {
  id: string;
  name: string;
  savedAt: string;
  build: Build;
  /** Brief stat summary for the list view */
  summary: {
    activeSkillCount: number;
    professionIds: string[];
  };
}

/**
 * Standalone (non-hook) read of the most recently saved build.
 * Used by the Building Planner's skills panel to validate required skills
 * against the player's active build without mounting the full hook.
 */
export function getLatestSave(): SavedBuild | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const saves = JSON.parse(raw) as SavedBuild[];
    return saves[0] ?? null;
  } catch {
    return null;
  }
}

function loadFromStorage(): SavedBuild[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SavedBuild[];
  } catch {
    return [];
  }
}

function writeToStorage(saves: SavedBuild[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saves));
  } catch {
    // Storage full — silently ignore
  }
}

function buildSummary(build: Build): SavedBuild['summary'] {
  // Extract unique profession IDs from active skill IDs (format: "professionId.skillId")
  const professionIds = Array.from(
    new Set(build.activeSkills.map((id) => id.split('.')[0]).filter(Boolean)),
  );
  return { activeSkillCount: build.activeSkills.length, professionIds };
}

export interface SavedBuildsHook {
  savedBuilds: SavedBuild[];
  saveBuild: (build: Build) => void;
  loadBuild: (id: string) => Build | null;
  deleteBuild: (id: string) => void;
  hasSave: (name: string) => boolean;
}

export function useSavedBuilds(): SavedBuildsHook {
  const [savedBuilds, setSavedBuilds] = useState<SavedBuild[]>([]);
  const supabase = useRef(createClient()).current;
  const userIdRef = useRef<string | null>(null);

  // Hydrate from localStorage immediately, then merge from Supabase if authenticated
  useEffect(() => {
    const local = loadFromStorage();
    setSavedBuilds(local);

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      userIdRef.current = user.id;
      pullBuilds(supabase, user.id).then((remote) => {
        if (remote.length === 0) return;
        const merged = mergeBuilds(remote, local);
        setSavedBuilds(merged);
        writeToStorage(merged);
      });
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-sync when the user logs in after the component is already mounted
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          userIdRef.current = session.user.id;
          pullBuilds(supabase, session.user.id).then((remote) => {
            if (remote.length === 0) return;
            setSavedBuilds((current) => {
              const merged = mergeBuilds(remote, current);
              writeToStorage(merged);
              return merged;
            });
          });
        } else if (event === 'SIGNED_OUT') {
          userIdRef.current = null;
        }
      },
    );
    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveBuild = useCallback((build: Build) => {
    setSavedBuilds((prev) => {
      // Replace existing save with same name, or prepend new
      const filtered = prev.filter(
        (s) => s.name.toLowerCase() !== build.name.toLowerCase(),
      );
      const newSave: SavedBuild = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name: build.name,
        savedAt: new Date().toISOString(),
        build,
        summary: buildSummary(build),
      };
      const updated = [newSave, ...filtered].slice(0, MAX_SAVES);
      writeToStorage(updated);
      if (userIdRef.current) {
        pushBuilds(supabase, userIdRef.current, updated).catch(() => {});
      }
      return updated;
    });
  }, [supabase]);

  const loadBuild = useCallback(
    (id: string): Build | null => {
      const save = savedBuilds.find((s) => s.id === id);
      return save?.build ?? null;
    },
    [savedBuilds],
  );

  const deleteBuild = useCallback((id: string) => {
    setSavedBuilds((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      writeToStorage(updated);
      if (userIdRef.current) {
        pushBuilds(supabase, userIdRef.current, updated).catch(() => {});
      }
      return updated;
    });
  }, [supabase]);

  const hasSave = useCallback(
    (name: string) =>
      savedBuilds.some((s) => s.name.toLowerCase() === name.toLowerCase()),
    [savedBuilds],
  );

  return { savedBuilds, saveBuild, loadBuild, deleteBuild, hasSave };
}
