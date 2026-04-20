"use client";

import { useState } from 'react';

export default function AdminControls({ id, status }: { id: string; status?: string }) {
  const [loading, setLoading] = useState(false);
  const [s, setS] = useState(status ?? 'pending');

  async function mark(newStatus: string) {
    setLoading(true);
    try {
      const res = await fetch('/api/feedback', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (!res.ok) throw new Error('failed');
      setS(newStatus);
      // optimistic update: update status text in DOM if present
      try {
        const li = (document.currentScript as any)?.ownerDocument ? null : null;
        const root = (document.querySelector(`[data-feedback-id="${id}"]`));
        if (root) {
          const statusEl = root.querySelector('.feedback-status-text');
          if (statusEl) statusEl.textContent = newStatus;
        }
      } catch (e) {
        // noop
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function remove() {
    if (!confirm('Delete this feedback?')) return;
    setLoading(true);
    try {
      const res = await fetch('/api/feedback', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error('failed');
      // Optimistic DOM removal
      try {
        const el = document.querySelector(`[data-feedback-id="${id}"]`);
        if (el && el.parentElement) el.parentElement.removeChild(el);
      } catch (e) {
        location.reload();
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex gap-2">
        <button className="px-2 py-1 text-xs bg-amber-600 text-white rounded" onClick={() => mark('reviewed')} disabled={loading || s === 'reviewed'}>
          Mark Reviewed
        </button>
        <button className="px-2 py-1 text-xs bg-slate-700 text-white rounded" onClick={() => mark('pending')} disabled={loading || s === 'pending'}>
          Mark Pending
        </button>
        <button className="px-2 py-1 text-xs bg-rose-600 text-white rounded" onClick={remove} disabled={loading}>
          Delete
        </button>
      </div>
      <div className="text-xs text-slate-400">{s}</div>
    </div>
  );
}
