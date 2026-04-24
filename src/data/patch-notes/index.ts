/**
 * patch-notes/index.ts
 * Barrel export + combined PATCH_NOTES array for the Stars Reach changelog.
 * One concern: aggregating year-sliced data files and re-exporting types.
 *
 * Split from a 578-line monolith on 2026-04-23 (weekly auto-audit).
 * Data files: 2026.ts · 2025-late.ts · 2025.ts · legacy.ts
 * Types: types.ts
 */

export type { PatchNote, PatchChange, PatchNoteType } from './types';
export { PATCH_NOTES_2026 } from './2026';
export { PATCH_NOTES_2025_LATE } from './2025-late';
export { PATCH_NOTES_2025_EARLY } from './2025';
export { PATCH_NOTES_LEGACY } from './legacy';

import { PATCH_NOTES_2026 } from './2026';
import { PATCH_NOTES_2025_LATE } from './2025-late';
import { PATCH_NOTES_2025_EARLY } from './2025';
import { PATCH_NOTES_LEGACY } from './legacy';
import type { PatchNote } from './types';

/** All patch notes, most-recent first. */
export const PATCH_NOTES: PatchNote[] = [
  ...PATCH_NOTES_2026,
  ...PATCH_NOTES_2025_LATE,
  ...PATCH_NOTES_2025_EARLY,
  ...PATCH_NOTES_LEGACY,
];
