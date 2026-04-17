/**
 * countdown-timer.tsx
 * Countdown display for XP atrophy timers and scheduled events.
 * One concern: live tick-down from a target timestamp with formatted display.
 *
 * Renders HH:MM:SS or D:HH:MM:SS depending on duration.
 * Uses useEffect + setInterval — client-only.
 */

'use client';

import { useState, useEffect } from 'react';

export interface CountdownTimerProps {
  /** ISO timestamp string or Date of when the countdown expires */
  targetDate: Date | string;
  /** Called when the countdown hits zero */
  onExpire?: () => void;
  /** Whether to show "EXPIRED" state after zero instead of "00:00:00" */
  showExpiredLabel?: boolean;
  className?: string;
}

function formatDuration(ms: number): string {
  if (ms <= 0) return '00:00:00';
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const hh = String(hours).padStart(2, '0');
  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');

  if (days > 0) return `${days}d ${hh}:${mm}:${ss}`;
  return `${hh}:${mm}:${ss}`;
}

export function CountdownTimer({
  targetDate,
  onExpire,
  showExpiredLabel = true,
  className = '',
}: CountdownTimerProps) {
  const target = typeof targetDate === 'string' ? new Date(targetDate) : targetDate;

  const [remaining, setRemaining] = useState(() => target.getTime() - Date.now());
  const [expired, setExpired] = useState(remaining <= 0);

  useEffect(() => {
    if (expired) return;

    const tick = () => {
      const ms = target.getTime() - Date.now();
      setRemaining(ms);
      if (ms <= 0) {
        setExpired(true);
        onExpire?.();
      }
    };

    tick(); // run immediately
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target.getTime(), expired]); // eslint-disable-line react-hooks/exhaustive-deps

  if (expired && showExpiredLabel) {
    return (
      <span className={`font-mono text-red-400 ${className}`}>EXPIRED</span>
    );
  }

  const urgency = remaining < 3_600_000; // < 1 hour
  const warning = remaining < 86_400_000; // < 24 hours

  return (
    <span
      className={`font-mono tabular-nums ${
        urgency
          ? 'text-red-400'
          : warning
            ? 'text-amber-400'
            : 'text-teal-400'
      } ${className}`}
    >
      {formatDuration(remaining)}
    </span>
  );
}

/** Static duration display (no live countdown) */
export function DurationDisplay({
  ms,
  className = '',
}: {
  ms: number;
  className?: string;
}) {
  return (
    <span className={`font-mono tabular-nums text-slate-300 ${className}`}>
      {formatDuration(ms)}
    </span>
  );
}
