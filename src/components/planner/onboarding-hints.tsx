/**
 * onboarding-hints.tsx
 * Collapsible first-use hint panel in the sidebar.
 * One concern: surfacing key planner interactions for new users.
 *
 * Dismissed state is persisted in localStorage so returning users
 * don't see it every session.
 */

'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'sr-planner-hints-dismissed';

const HINTS = [
  {
    icon: '🌿',
    text: 'Pick a profession from the list below to load its skill tree on the canvas.',
  },
  {
    icon: '✅',
    text: 'Click any glowing (available) node to add that skill to your build.',
  },
  {
    icon: '🔁',
    text: 'Click an active skill again to mark it atrophied (you\'ve learned it but rarely use it).',
  },
  {
    icon: '🎒',
    text: 'Equip up to 5 tools via the Tool Loadout. Each tool can hold 2 Specials.',
  },
  {
    icon: '📊',
    text: 'You have 80 active skill slots total — mix professions freely within that cap.',
  },
  {
    icon: '🔗',
    text: 'Use Share to copy a URL of your current build to send to others.',
  },
] as const;

export function OnboardingHints() {
  const [dismissed, setDismissed] = useState(true); // start hidden to avoid flash
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      setDismissed(false);
      setOpen(true);
    }
  }, []);

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, '1');
    setDismissed(true);
  }

  if (dismissed) return null;

  return (
    <div className="rounded-lg border border-cyan-800/50 bg-cyan-950/30 p-3 flex flex-col gap-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-1.5 text-xs font-semibold text-cyan-300 hover:text-cyan-200 transition-colors"
        >
          <span className={`transition-transform duration-150 text-[10px] ${open ? 'rotate-90' : ''}`}>
            ▶
          </span>
          How to use this planner
        </button>
        <button
          onClick={dismiss}
          className="text-[10px] text-slate-500 hover:text-slate-300 transition-colors"
          title="Dismiss forever"
        >
          ✕
        </button>
      </div>

      {/* Hint list */}
      {open && (
        <ul className="space-y-1.5 mt-0.5">
          {HINTS.map((hint, i) => (
            <li key={i} className="flex gap-2 text-[11px] text-slate-300 leading-snug">
              <span className="shrink-0">{hint.icon}</span>
              <span>{hint.text}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Footer dismiss */}
      {open && (
        <button
          onClick={dismiss}
          className="self-end text-[10px] text-slate-500 hover:text-slate-300 transition-colors mt-0.5"
        >
          Got it, don't show again
        </button>
      )}
    </div>
  );
}
