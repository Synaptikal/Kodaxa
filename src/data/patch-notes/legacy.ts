/**
 * patch-notes/legacy.ts
 * Stars Reach patch notes — Alpha/2024 era entries.
 * One concern: static changelog data pre-dating the versioned update system.
 *
 * Sources: starsreach.com/build-notes (official dev blog).
 */

import type { PatchNote } from './types';

export const PATCH_NOTES_LEGACY: PatchNote[] = [
  // ─── 2024 ───────────────────────────────────────────────────────────────────
  {
    id: 'alpha-skill-system',
    version: 'Alpha',
    date: '2024',
    title: 'Skill Tree System — Core Implementation',
    type: 'major',
    summary:
      'Introduction of the skill tree system with 14 professions, XP trees, and the 80-skill cap.',
    changes: [
      { type: 'added', text: '14 profession skill trees implemented' },
      { type: 'added', text: '80-skill active cap with atrophy mechanic (1-week inactivity)' },
      { type: 'added', text: 'Tool loadout system: up to 5 tools, 2 Specials per tool' },
      { type: 'added', text: 'Skills enter "out of practice" state after 1 week without XP' },
    ],
  },
];
