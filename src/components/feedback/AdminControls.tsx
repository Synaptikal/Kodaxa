'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const STATUS_STYLES: Record<string, string> = {
  pending:  'text-amber-400 border-amber-700/50',
  reviewed: 'text-emerald-400 border-emerald-800/50',
};

export default function AdminControls({ id, status }: { id: string; status?: string }) {
  const router  = useRouter();
  const [s, setS]           = useState(status ?? 'pending');
  const [loading, setLoading] = useState(false);

  async function mark(newStatus: string) {
    setLoading(true);
    try {
      const res = await fetch('/api/feedback', {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ id, status: newStatus }),
      });
      if (!res.ok) throw new Error('failed');
      setS(newStatus);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function remove() {
    if (!confirm('Delete this feedback entry? This cannot be undone.')) return;
    setLoading(true);
    try {
      const res = await fetch('/api/feedback', {
        method:  'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error('failed');
      router.refresh();
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }

  const styleClass = STATUS_STYLES[s] ?? STATUS_STYLES.pending;

  return (
    <div className="flex flex-col items-end gap-2 shrink-0">
      <span className={`text-[8px] font-mono uppercase tracking-[0.2em] border px-1.5 py-0.5 ${styleClass}`}>
        {s}
      </span>
      <div className="flex gap-1.5">
        <button
          onClick={() => mark('reviewed')}
          disabled={loading || s === 'reviewed'}
          className="px-2 py-1 text-[9px] font-mono uppercase tracking-wider border border-emerald-800/50 text-emerald-400 hover:bg-emerald-900/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          Reviewed
        </button>
        <button
          onClick={() => mark('pending')}
          disabled={loading || s === 'pending'}
          className="px-2 py-1 text-[9px] font-mono uppercase tracking-wider border border-sr-border text-sr-muted hover:border-sr-border/70 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          Pending
        </button>
        <button
          onClick={remove}
          disabled={loading}
          className="px-2 py-1 text-[9px] font-mono uppercase tracking-wider border border-red-900/50 text-red-400 hover:bg-red-900/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
