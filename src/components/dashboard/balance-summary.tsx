/**
 * balance-summary.tsx
 * Klaatu balance summary cards for the dashboard header.
 * One concern: render balance, income, expenses, and session stats.
 */

'use client';

import { formatKlaatuAbs, formatDuration } from '@/types/dashboard';

interface Props {
  balance: number;
  income: number;
  expenses: number;
  sessionCount: number;
  totalDuration: number;
}

export function BalanceSummary({ balance, income, expenses, sessionCount, totalDuration }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
      {/* Balance */}
      <div className="bg-slate-800/40 border border-slate-700 rounded-lg px-4 py-3 col-span-2 sm:col-span-1">
        <p className="text-[10px] text-slate-500 uppercase tracking-wider font-mono mb-1">Balance</p>
        <p className={`text-lg font-bold font-mono ${balance >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
          {formatKlaatuAbs(Math.abs(balance))}
        </p>
        <p className="text-[10px] text-slate-600">Klaatu</p>
      </div>

      {/* Income */}
      <div className="bg-slate-800/40 border border-slate-700 rounded-lg px-4 py-3">
        <p className="text-[10px] text-slate-500 uppercase tracking-wider font-mono mb-1">Income</p>
        <p className="text-sm font-bold font-mono text-emerald-400">{formatKlaatuAbs(income)}</p>
        <p className="text-[10px] text-slate-600">total earned</p>
      </div>

      {/* Expenses */}
      <div className="bg-slate-800/40 border border-slate-700 rounded-lg px-4 py-3">
        <p className="text-[10px] text-slate-500 uppercase tracking-wider font-mono mb-1">Expenses</p>
        <p className="text-sm font-bold font-mono text-red-400">{formatKlaatuAbs(expenses)}</p>
        <p className="text-[10px] text-slate-600">total spent</p>
      </div>

      {/* Sessions */}
      <div className="bg-slate-800/40 border border-slate-700 rounded-lg px-4 py-3">
        <p className="text-[10px] text-slate-500 uppercase tracking-wider font-mono mb-1">Sessions</p>
        <p className="text-sm font-bold font-mono text-slate-200">{sessionCount}</p>
        <p className="text-[10px] text-slate-600">logged</p>
      </div>

      {/* Play Time */}
      <div className="bg-slate-800/40 border border-slate-700 rounded-lg px-4 py-3">
        <p className="text-[10px] text-slate-500 uppercase tracking-wider font-mono mb-1">Play Time</p>
        <p className="text-sm font-bold font-mono text-slate-200">{formatDuration(totalDuration)}</p>
        <p className="text-[10px] text-slate-600">total tracked</p>
      </div>
    </div>
  );
}
