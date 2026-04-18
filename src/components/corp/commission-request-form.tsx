'use client';

import { useState, useTransition } from 'react';
import { submitCommission } from '@/lib/corp/actions';

interface CommissionRequestFormProps {
  assigneeId: string;
  assigneeName: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CommissionRequestForm({
  assigneeId, assigneeName, onClose, onSuccess,
}: CommissionRequestFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    title: '', description: '', itemType: '', quantity: '1',
    budgetHint: '', planet: '', deliveryHint: '', deadlineHint: '', clientNotes: '',
  });

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      setError('Title and description are required.');
      return;
    }
    startTransition(async () => {
      const res = await submitCommission({
        assigneeId,
        title:        form.title.trim(),
        description:  form.description.trim(),
        itemType:     form.itemType.trim() || undefined,
        quantity:     parseInt(form.quantity) || 1,
        budgetHint:   form.budgetHint.trim() || undefined,
        planet:       form.planet.trim() || undefined,
        deliveryHint: form.deliveryHint.trim() || undefined,
        deadlineHint: form.deadlineHint.trim() || undefined,
        clientNotes:  form.clientNotes.trim() || undefined,
      });

      if (res.success) {
        setSuccess(true);
        onSuccess?.();
      } else {
        setError(res.error ?? 'Submission failed. Please try again.');
      }
    });
  }

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-lg bg-sr-bg border border-sr-border shadow-2xl overflow-y-auto max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-sr-border bg-sr-surface/60">
          <div>
            <p className="text-xs font-mono text-sr-muted uppercase tracking-[0.3em]">Commission Request</p>
            <p className="text-sm font-bold font-mono text-slate-200">
              → <span className="text-cyan-400">{assigneeName}</span>
            </p>
          </div>
          <button onClick={onClose} className="text-slate-600 hover:text-slate-300 text-lg font-mono">✕</button>
        </div>

        {success ? (
          <div className="px-5 py-10 text-center space-y-3">
            <p className="text-teal-400 font-mono text-lg">◎ REQUEST SUBMITTED</p>
            <p className="text-xs text-slate-400">
              Your commission request has been filed. <span className="text-cyan-400">{assigneeName}</span> will review it and respond shortly.
            </p>
            <button onClick={onClose} className="mt-4 px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider border border-cyan-700/50 text-cyan-400 hover:bg-cyan-900/20 transition-colors">
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-5 py-5 space-y-4">
            {error && (
              <p className="text-xs font-mono text-red-400 border border-red-800/40 bg-red-900/10 px-3 py-2">{error}</p>
            )}

            <Field label="Commission Title *" hint="Brief description of what you need">
              <input
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
                placeholder="e.g. Tier 3 Plasma Rifle × 2"
                className={INPUT_CLS}
                required
              />
            </Field>

            <Field label="Detailed Requirements *" hint="Specifics, quality tier, stats if relevant">
              <textarea
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                placeholder="Describe exactly what you need..."
                className={`${INPUT_CLS} h-24 resize-none`}
                required
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Item Type" hint="e.g. Weapon, Building Block">
                <input value={form.itemType} onChange={(e) => set('itemType', e.target.value)} placeholder="Optional" className={INPUT_CLS} />
              </Field>
              <Field label="Quantity">
                <input type="number" min={1} value={form.quantity} onChange={(e) => set('quantity', e.target.value)} className={INPUT_CLS} />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Budget" hint="Free-text, e.g. ~5000cr">
                <input value={form.budgetHint} onChange={(e) => set('budgetHint', e.target.value)} placeholder="Negotiable" className={INPUT_CLS} />
              </Field>
              <Field label="Your Planet">
                <input value={form.planet} onChange={(e) => set('planet', e.target.value)} placeholder="e.g. Caldera Prime" className={INPUT_CLS} />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Delivery Method">
                <input value={form.deliveryHint} onChange={(e) => set('deliveryHint', e.target.value)} placeholder="e.g. Kiosk drop, in-person" className={INPUT_CLS} />
              </Field>
              <Field label="Deadline">
                <input value={form.deadlineHint} onChange={(e) => set('deadlineHint', e.target.value)} placeholder="e.g. Within 3 days" className={INPUT_CLS} />
              </Field>
            </div>

            <Field label="Additional Notes">
              <textarea
                value={form.clientNotes}
                onChange={(e) => set('clientNotes', e.target.value)}
                placeholder="Anything else the operative should know..."
                className={`${INPUT_CLS} h-16 resize-none`}
              />
            </Field>

            <div className="flex items-center justify-between pt-2 border-t border-sr-border">
              <button type="button" onClick={onClose} className="text-xs font-mono text-sr-muted hover:text-slate-400 transition-colors">
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="px-5 py-2 text-xs font-mono font-bold uppercase tracking-wider bg-cyan-900/30 border border-cyan-700/60 text-cyan-300 hover:bg-cyan-900/50 transition-colors disabled:opacity-40"
              >
                {isPending ? 'Submitting...' : 'Submit Commission'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

const INPUT_CLS = 'w-full bg-sr-bg border border-sr-border px-2 py-1.5 text-xs font-mono text-slate-300 focus:border-cyan-700 focus:outline-none';

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-mono uppercase tracking-widest text-slate-500">
        {label}{hint && <span className="text-sr-subtle normal-case tracking-normal ml-1">— {hint}</span>}
      </label>
      {children}
    </div>
  );
}
