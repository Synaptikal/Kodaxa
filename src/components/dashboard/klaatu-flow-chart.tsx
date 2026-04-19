/**
 * klaatu-flow-chart.tsx
 * Pure CSS/SVG chart showing Klaatu income vs expenses over recent sessions.
 * One concern: render a simple bar chart of Klaatu flow per session.
 *
 * No chart library — pure SVG rendering to keep the bundle lean.
 */

'use client';

import type { SessionLog } from '@/types/dashboard';

interface Props {
  sessions: SessionLog[];
}

export function KlaatuFlowChart({ sessions }: Props) {
  // Take last 14 sessions, reversed to chronological order
  const recent = sessions.slice(0, 14).reverse();

  if (recent.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-slate-600 text-xs">
        Log sessions to see your Klaatu flow chart
      </div>
    );
  }

  const maxVal = Math.max(
    ...recent.map((s) => Math.max(s.klaatu_earned, s.klaatu_spent)),
    1,
  );

  const barWidth = 100 / recent.length;

  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Klaatu Flow</h3>
      <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-3">
        <svg viewBox="0 0 100 40" className="w-full h-24" preserveAspectRatio="none">
          {recent.map((session, i) => {
            const x = i * barWidth + barWidth * 0.1;
            const w = barWidth * 0.35;
            const earnedH = (session.klaatu_earned / maxVal) * 36;
            const spentH = (session.klaatu_spent / maxVal) * 36;

            return (
              <g key={session.id}>
                {/* Earned bar (green) */}
                <rect
                  x={x}
                  y={38 - earnedH}
                  width={w}
                  height={earnedH}
                  rx={0.5}
                  fill="rgb(52, 211, 153)"
                  opacity={0.7}
                />
                {/* Spent bar (red) */}
                <rect
                  x={x + w + barWidth * 0.05}
                  y={38 - spentH}
                  width={w}
                  height={spentH}
                  rx={0.5}
                  fill="rgb(248, 113, 113)"
                  opacity={0.7}
                />
              </g>
            );
          })}
          {/* Baseline */}
          <line x1="0" y1="38" x2="100" y2="38" stroke="rgb(51, 65, 85)" strokeWidth="0.3" />
        </svg>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-2">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-sm bg-emerald-400 opacity-70" />
            <span className="text-[10px] text-slate-500">Earned</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-sm bg-red-400 opacity-70" />
            <span className="text-[10px] text-slate-500">Spent</span>
          </div>
          <span className="text-[10px] text-slate-600 ml-auto">Last {recent.length} sessions</span>
        </div>
      </div>
    </div>
  );
}
