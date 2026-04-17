/**
 * visibility-toggle.tsx
 * Toggle for showing/hiding a crafter profile in the public directory.
 * One concern: calling setProfileVisibility action and reflecting state.
 */

'use client';

import { useState, useTransition } from 'react';

export interface VisibilityToggleProps {
  isVisible: boolean;
  onToggle: (visible: boolean) => Promise<{ success: boolean; error?: string }>;
}

export function VisibilityToggle({ isVisible, onToggle }: VisibilityToggleProps) {
  const [visible, setVisible] = useState(isVisible);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const toggle = () => {
    setError(null);
    startTransition(async () => {
      const result = await onToggle(!visible);
      if (result.success) {
        setVisible((v) => !v);
      } else {
        setError(result.error ?? 'Failed to update visibility.');
      }
    });
  };

  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-xs text-slate-300">
          {visible ? 'Profile is visible in the directory' : 'Profile is hidden from the directory'}
        </p>
        <p className="text-[10px] text-slate-500 mt-0.5">
          {visible
            ? 'Other players can find and contact you.'
            : 'Your profile exists but is not publicly listed.'}
        </p>
        {error && <p className="text-[10px] text-red-400 mt-1">{error}</p>}
      </div>

      <button
        onClick={toggle}
        disabled={isPending}
        role="switch"
        aria-checked={visible}
        className={`relative shrink-0 w-10 h-5 rounded-full transition-colors disabled:opacity-50 ${
          visible ? 'bg-cyan-600' : 'bg-slate-600'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
            visible ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}
