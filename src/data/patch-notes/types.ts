/**
 * patch-notes/types.ts
 * Shared TypeScript types for the patch notes data layer.
 * One concern: type definitions only — no data.
 */

export type PatchNoteType = 'major' | 'minor' | 'balance' | 'hotfix';

export interface PatchChange {
  type: 'added' | 'changed' | 'fixed' | 'removed';
  text: string;
}

export interface PatchNote {
  id: string;
  version: string;
  date: string;
  title: string;
  type: PatchNoteType;
  summary?: string;
  changes: PatchChange[];
  sourceUrl?: string;
}
