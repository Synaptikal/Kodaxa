/**
 * build-validation.tsx
 * Sidebar widget showing build errors and warnings from the skill engine.
 * One concern: rendering validation feedback so players can fix constraint violations.
 */

'use client';

import type { BuildValidation } from '@/types/build';

export interface BuildValidationProps {
  validation: BuildValidation;
}

export function BuildValidationPanel({ validation }: BuildValidationProps) {
  const { errors, warnings } = validation;

  if (errors.length === 0 && warnings.length === 0) {
    return (
      <div className="flex items-center gap-1.5 p-2 rounded-md bg-teal-950/30 border border-teal-800/40">
        <span className="w-2 h-2 rounded-full bg-teal-400" />
        <span className="text-xs text-teal-300">Build is valid</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      {errors.map((err, i) => (
        <div
          key={`err-${i}`}
          className="flex items-start gap-1.5 p-2 rounded-md bg-red-950/30 border border-red-800/40"
        >
          <span className="w-2 h-2 mt-0.5 rounded-full bg-red-400 shrink-0" />
          <span className="text-xs text-red-300">{err.message}</span>
        </div>
      ))}
      {warnings.map((warn, i) => (
        <div
          key={`warn-${i}`}
          className="flex items-start gap-1.5 p-2 rounded-md bg-amber-950/30 border border-amber-800/40"
        >
          <span className="w-2 h-2 mt-0.5 rounded-full bg-amber-400 shrink-0" />
          <span className="text-xs text-amber-300">{warn.message}</span>
        </div>
      ))}
    </div>
  );
}
