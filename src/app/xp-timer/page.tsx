/**
 * xp-timer/page.tsx
 * XP & Atrophy Timer — track skill tree atrophy deadlines.
 * One concern: localStorage-persisted countdown timers per profession.
 *
 * Client-rendered entirely. No server data needed.
 * Game rule: skills go "out of practice" after 1 week without XP in that tree.
 */

import type { Metadata } from 'next';
import { NavHeader } from '@/components/ui/nav-header';
import { XpTimerPanel } from '@/components/xp-timer/xp-timer-panel';

export const metadata: Metadata = {
  title: 'XP & Atrophy Timer — Kodaxa Studios',
  description: 'Track your Stars Reach skill atrophy deadlines. Get warned before your skills go out of practice.',
};

export default function XpTimerPage() {
  return (
    <div className="flex flex-col h-dvh overflow-hidden">
      <NavHeader />
      <XpTimerPanel />
    </div>
  );
}
