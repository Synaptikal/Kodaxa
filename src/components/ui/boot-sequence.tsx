/**
 * boot-sequence.tsx
 * Kodaxa OS boot sequence — plays once per session on first visit.
 * One concern: animated terminal init scroll, then fades out and unmounts.
 *
 * Skippable via any keypress or click. Uses sessionStorage to play only once.
 * Pure CSS animation — no external deps. Mounts over the page, z-[200].
 */

'use client';

import { useEffect, useRef, useState } from 'react';

const BOOT_LINES = [
  '> KODAXA OS v0.1-α initializing…',
  '> Loading kernel modules…                   [OK]',
  '> Authenticating satellite uplink…          [OK]',
  '> Handshaking relay network…                [OK]',
  '> Mounting Schematics Archive…              [OK]',
  '> Mounting Material Registry…               [OK]',
  '> Mounting Commerce Registry…               [OK]',
  '> Mounting Workforce Intelligence System…   [OK]',
  '> Synchronizing data pipeline…              [OK]',
  '> Verifying personnel records…              [OK]',
  '> Galaxy-scale data integrity check…        [OK]',
  '> All systems nominal.',
  '> Welcome to Kodaxa Studios.',
  '',
];

const SESSION_KEY = 'kdx_boot_seen';
const LINE_DELAY_MS = 80;   // ms between lines
const HOLD_MS       = 600;  // pause after last line before fade
const FADE_MS       = 500;  // CSS fade-out duration

export function BootSequence() {
  const [visible, setVisible]         = useState(false);
  const [lines, setLines]             = useState<string[]>([]);
  const [fading, setFading]           = useState(false);
  const [done, setDone]               = useState(false);
  const dismissed                     = useRef(false);

  const dismiss = () => {
    if (dismissed.current) return;
    dismissed.current = true;
    setFading(true);
    setTimeout(() => setDone(true), FADE_MS);
  };

  useEffect(() => {
    // Only run once per browser session
    if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem(SESSION_KEY)) {
      setDone(true);
      return;
    }

    setVisible(true);
    sessionStorage?.setItem(SESSION_KEY, '1');

    // Print lines one by one
    let i = 0;
    const interval = setInterval(() => {
      if (dismissed.current) { clearInterval(interval); return; }
      setLines((prev) => [...prev, BOOT_LINES[i] ?? '']);
      i++;
      if (i >= BOOT_LINES.length) {
        clearInterval(interval);
        setTimeout(dismiss, HOLD_MS);
      }
    }, LINE_DELAY_MS);

    // Allow skip on any keypress or click
    const skip = () => { clearInterval(interval); dismiss(); };
    window.addEventListener('keydown', skip, { once: true });
    window.addEventListener('click',   skip, { once: true });

    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', skip);
      window.removeEventListener('click',   skip);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (done || !visible) return null;

  return (
    <div
      className="fixed inset-0 z-[200] bg-sr-bg flex flex-col justify-center px-8 sm:px-16 lg:px-32"
      style={{
        transition: `opacity ${FADE_MS}ms ease`,
        opacity: fading ? 0 : 1,
      }}
      aria-live="polite"
      aria-label="Kodaxa boot sequence"
    >
      {/* Top classification bar */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-2 border-b border-sr-border">
        <span className="text-xs font-mono text-slate-700 uppercase tracking-[0.35em]">
          Kodaxa OS · Boot Sequence
        </span>
        <span className="text-xs font-mono text-slate-700 uppercase tracking-[0.25em]">
          Press any key to skip
        </span>
      </div>

      {/* Logo */}
      <div className="mb-8">
        <p className="text-3xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400 tracking-tight">
          KODAXA
        </p>
        <p className="text-xs font-mono text-slate-600 uppercase tracking-[0.4em] mt-0.5">
          Multi-Planetary Data &amp; Software Systems
        </p>
      </div>

      {/* Boot log */}
      <div className="space-y-0.5 font-mono text-xs max-w-xl">
        {lines.map((line, i) => (
          <p
            key={i}
            className={
              line.includes('[OK]')
                ? 'text-teal-500'
                : line.startsWith('> Welcome')
                ? 'text-cyan-300 font-semibold'
                : line === ''
                ? 'h-2'
                : 'text-slate-500'
            }
          >
            {line}
          </p>
        ))}
        {/* Blinking cursor */}
        {!fading && lines.length < BOOT_LINES.length && (
          <span className="inline-block w-2 h-3.5 bg-cyan-400 animate-pulse" />
        )}
      </div>

      {/* Bottom bar */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-6 py-2 border-t border-sr-border">
        <span className="text-xs font-mono text-slate-700 uppercase tracking-[0.25em]">
          © Kodaxa Studios · Unofficial Fan Project
        </span>
        <span className="text-xs font-mono text-slate-800 tabular-nums">
          {new Date().toISOString().slice(0, 10)}
        </span>
      </div>
    </div>
  );
}
