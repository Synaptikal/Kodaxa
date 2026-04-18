/**
 * price-report-form.tsx
 * Client form to submit a buy/sell price observation.
 * One concern: capture fields + dispatch submitPriceReport action.
 */

'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { submitPriceReport } from '@/lib/market/actions';
import {
  MARKET_CATEGORIES,
  MARKET_CATEGORY_LABELS,
  type MarketCategory,
  type MarketSide,
} from '@/types/market';

export interface PriceReportFormProps {
  isAuthenticated: boolean;
}

interface FormState {
  item_name: string;
  category: MarketCategory | '';
  planet: string;
  vendor_hint: string;
  side: MarketSide;
  quantity: string;
  total_price: string;
  notes: string;
}

const EMPTY: FormState = {
  item_name: '',
  category: '',
  planet: '',
  vendor_hint: '',
  side: 'sell',
  quantity: '1',
  total_price: '',
  notes: '',
};

export function PriceReportForm({ isAuthenticated }: PriceReportFormProps) {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (!isAuthenticated) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 space-y-3">
        <p className="text-xs font-mono uppercase tracking-[0.2em] text-violet-500">
          Trader Contribution
        </p>
        <h2 className="text-base font-bold font-mono text-slate-100">Transmit Price Observation</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          Establish uplink to file buy/sell observations. Aggregated relay data
          is visible to all operatives — only the filing operative may amend or purge a report.
        </p>
        <Link
          href="/auth/sign-in?next=/market"
          className="inline-block text-xs px-3 py-2 bg-violet-900/30 text-violet-300 border border-violet-800/50 font-mono uppercase tracking-wide hover:bg-violet-900/50 transition-colors"
        >
          Establish Uplink →
        </Link>
      </div>
    );
  }

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setError(null);
    setSuccess(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const qty = Math.max(1, Math.floor(Number(form.quantity) || 1));
    const total = Math.floor(Number(form.total_price) || 0);

    startTransition(async () => {
      const result = await submitPriceReport({
        item_name:     form.item_name.trim(),
        item_category: form.category === '' ? null : form.category,
        planet:        form.planet.trim(),
        vendor_hint:   form.vendor_hint.trim() || null,
        side:          form.side,
        quantity:      qty,
        total_price:   total,
        notes:         form.notes.trim() || null,
      });

      if (!result.success) {
        setError(result.error ?? 'Submission failed.');
        return;
      }
      setSuccess(true);
      setForm({ ...EMPTY, side: form.side, planet: form.planet });
    });
  }

  const unitPrice =
    Number(form.total_price) > 0 && Number(form.quantity) > 0
      ? Number(form.total_price) / Number(form.quantity)
      : 0;

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-4"
    >
      <header className="space-y-1">
        <p className="text-xs font-mono uppercase tracking-[0.2em] text-violet-500">
          Trader Contribution
        </p>
        <h2 className="text-base font-bold text-slate-100">Report a price observation</h2>
        <p className="text-xs text-slate-500">
          Snapshots build the 30-day rolling market view. Back-date the observation if needed.
        </p>
      </header>

      {/* Side toggle */}
      <div className="grid grid-cols-2 gap-2">
        <SideButton
          active={form.side === 'sell'}
          onClick={() => update('side', 'sell')}
          tone="amber"
          label="Seen for sale"
        />
        <SideButton
          active={form.side === 'buy'}
          onClick={() => update('side', 'buy')}
          tone="emerald"
          label="Seen buying"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Item name" required>
          <input
            type="text"
            value={form.item_name}
            onChange={(e) => update('item_name', e.target.value)}
            placeholder='e.g. "Tier 3 Iron Ingot"'
            required
            maxLength={120}
            className={INPUT_CLS}
          />
        </Field>

        <Field label="Category">
          <select
            value={form.category}
            onChange={(e) => update('category', e.target.value as MarketCategory | '')}
            className={INPUT_CLS}
          >
            <option value="">—</option>
            {MARKET_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {MARKET_CATEGORY_LABELS[c]}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Planet" required>
          <input
            type="text"
            value={form.planet}
            onChange={(e) => update('planet', e.target.value)}
            placeholder="e.g. Crucible"
            required
            maxLength={60}
            className={INPUT_CLS}
          />
        </Field>

        <Field label="Vendor hint">
          <input
            type="text"
            value={form.vendor_hint}
            onChange={(e) => update('vendor_hint', e.target.value)}
            placeholder='e.g. "Kiosk at Kodaxa Agora"'
            maxLength={120}
            className={INPUT_CLS}
          />
        </Field>

        <Field label="Quantity" required>
          <input
            type="number"
            min={1}
            step={1}
            value={form.quantity}
            onChange={(e) => update('quantity', e.target.value)}
            required
            className={INPUT_CLS}
          />
        </Field>

        <Field label="Total price (credits)" required>
          <input
            type="number"
            min={0}
            step={1}
            value={form.total_price}
            onChange={(e) => update('total_price', e.target.value)}
            placeholder="e.g. 5000"
            required
            className={INPUT_CLS}
          />
        </Field>
      </div>

      {unitPrice > 0 && (
        <p className="text-xs font-mono text-slate-500">
          Unit price →{' '}
          <span className="text-violet-300">
            {unitPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })} cr
          </span>{' '}
          per unit
        </p>
      )}

      <Field label="Notes">
        <textarea
          value={form.notes}
          onChange={(e) => update('notes', e.target.value)}
          placeholder="Tier / quality / context. Max 500 chars."
          maxLength={500}
          rows={2}
          className={INPUT_CLS}
        />
      </Field>

      {error && (
        <p className="text-xs text-red-400 bg-red-900/20 border border-red-800/40 px-2.5 py-1.5 rounded">
          {error}
        </p>
      )}
      {success && (
        <p className="text-xs text-emerald-400 bg-emerald-900/20 border border-emerald-800/40 px-2.5 py-1.5 rounded">
          Report filed. Market data updated.
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full text-xs px-4 py-2 rounded-md bg-violet-800/40 text-violet-200 border border-violet-700/50 hover:bg-violet-800/60 disabled:opacity-50 transition-colors font-mono uppercase tracking-wider"
      >
        {isPending ? 'Filing…' : 'File Observation'}
      </button>
    </form>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────

const INPUT_CLS =
  'w-full px-2.5 py-1.5 rounded-md bg-slate-900 border border-slate-700 ' +
  'text-xs text-slate-100 placeholder-slate-600 focus:outline-none ' +
  'focus:border-violet-600 focus:ring-1 focus:ring-violet-600/40 transition-colors';

function Field(props: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-mono uppercase tracking-wider text-slate-500">
        {props.label}
        {props.required && <span className="text-violet-500"> *</span>}
      </span>
      {props.children}
    </label>
  );
}

function SideButton({
  active,
  onClick,
  tone,
  label,
}: {
  active: boolean;
  onClick: () => void;
  tone: 'amber' | 'emerald';
  label: string;
}) {
  const toneCls =
    tone === 'amber'
      ? active
        ? 'bg-amber-900/50 text-amber-200 border-amber-700/60'
        : 'bg-slate-900 text-slate-500 border-slate-700 hover:border-amber-800/50'
      : active
        ? 'bg-emerald-900/50 text-emerald-200 border-emerald-700/60'
        : 'bg-slate-900 text-slate-500 border-slate-700 hover:border-emerald-800/50';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-xs px-3 py-2 rounded-md border font-mono uppercase tracking-wider transition-colors ${toneCls}`}
    >
      {label}
    </button>
  );
}
