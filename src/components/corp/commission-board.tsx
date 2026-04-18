'use client';

import { useState, useTransition } from 'react';
import type { Commission, CommissionStatus, CorpRole } from '@/types/corp';
import { COMMISSION_STATUS_LABELS, COMMISSION_STATUS_COLORS, canManageRoster } from '@/types/corp';
import { updateCommissionStatus } from '@/lib/corp/actions';

const FILTER_TABS: { label: string; value: string }[] = [
  { label: 'All',         value: 'all' },
  { label: 'Pending',     value: 'pending' },
  { label: 'In Progress', value: 'accepted' },
  { label: 'Delivered',   value: 'completed' },
  { label: 'Declined',    value: 'declined' },
];

interface CommissionBoardProps {
  commissions: Commission[];
  currentUserId: string;
  userRole: CorpRole;
}

export function CommissionBoard({ commissions, currentUserId, userRole }: CommissionBoardProps) {
  const [filter, setFilter] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = filter === 'all' ? commissions : commissions.filter((c) => c.status === filter);

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div className="space-y-1">
        <p className="text-xs font-mono text-sr-muted uppercase tracking-[0.3em]">Corp HQ // Commission Board</p>
        <h1 className="text-xl font-bold font-mono text-slate-100">Commission Board</h1>
        <p className="text-xs text-slate-500">{commissions.length} total request{commissions.length !== 1 ? 's' : ''} on file</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 border-b border-sr-border pb-0">
        {FILTER_TABS.map((tab) => {
          const count = tab.value === 'all' ? commissions.length : commissions.filter((c) => c.status === tab.value).length;
          return (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`px-3 py-1.5 text-xs font-mono font-semibold uppercase tracking-wider transition-colors border-b-2 -mb-px ${
                filter === tab.value
                  ? 'border-cyan-500 text-cyan-300'
                  : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              {tab.label} <span className="opacity-50">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Commission list */}
      {filtered.length === 0 ? (
        <p className="text-xs text-sr-muted font-mono text-center py-8 border border-sr-border">
          No commissions in this category
        </p>
      ) : (
        <div className="space-y-2">
          {filtered.map((c) => (
            <CommissionRow
              key={c.id}
              commission={c}
              isExpanded={expandedId === c.id}
              onToggle={() => setExpandedId(expandedId === c.id ? null : c.id)}
              currentUserId={currentUserId}
              userRole={userRole}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CommissionRow({
  commission: c,
  isExpanded,
  onToggle,
  currentUserId,
  userRole,
}: {
  commission: Commission;
  isExpanded: boolean;
  onToggle: () => void;
  currentUserId: string;
  userRole: CorpRole;
}) {
  const [isPending, startTransition] = useTransition();
  const [notes, setNotes] = useState(c.assignee_notes ?? '');

  const isAssignee = c.assignee_id === currentUserId;
  const isClient   = c.client_id === currentUserId;
  const canAct     = isAssignee || canManageRoster(userRole);

  function handleStatus(status: CommissionStatus) {
    startTransition(async () => {
      await updateCommissionStatus(c.id, status, notes || undefined);
    });
  }

  return (
    <div className="border border-sr-border bg-sr-surface/40">
      {/* Row header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-800/30 transition-colors text-left"
      >
        <span className={`text-xs font-mono font-bold px-1.5 py-0.5 border shrink-0 ${COMMISSION_STATUS_COLORS[c.status]}`}>
          {COMMISSION_STATUS_LABELS[c.status]}
        </span>
        <span className="text-xs font-mono text-slate-200 flex-1 truncate">{c.title}</span>
        {c.item_type && (
          <span className="text-xs font-mono text-sr-muted shrink-0 hidden sm:inline">{c.item_type}</span>
        )}
        <span className="text-xs font-mono text-slate-500 shrink-0">
          {c.assignee?.in_game_name ?? '—'}
        </span>
        <span className="text-xs font-mono text-sr-subtle shrink-0">
          {new Date(c.created_at).toLocaleDateString()}
        </span>
        <span className={`text-xs text-sr-muted shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>▾</span>
      </button>

      {/* Expanded detail */}
      {isExpanded && (
        <div className="border-t border-sr-border px-4 py-4 space-y-4 bg-sr-bg/40">
          <div className="grid sm:grid-cols-2 gap-4 text-xs">
            <Field label="Client"       value={c.client?.in_game_name ?? '—'} />
            <Field label="Assignee"     value={c.assignee?.in_game_name ?? '—'} />
            <Field label="Quantity"     value={String(c.quantity)} />
            {c.item_type   && <Field label="Item Type"    value={c.item_type} />}
            {c.budget_hint && <Field label="Budget"       value={c.budget_hint} />}
            {c.planet      && <Field label="Planet"       value={c.planet} />}
            {c.delivery_hint && <Field label="Delivery"   value={c.delivery_hint} />}
            {c.deadline_hint && <Field label="Deadline"   value={c.deadline_hint} />}
          </div>

          {c.description && (
            <div>
              <p className="text-xs font-mono text-sr-muted uppercase tracking-widest mb-1">Description</p>
              <p className="text-xs text-slate-300 leading-relaxed">{c.description}</p>
            </div>
          )}

          {c.client_notes && (
            <div>
              <p className="text-xs font-mono text-sr-muted uppercase tracking-widest mb-1">Client Notes</p>
              <p className="text-xs text-slate-400">{c.client_notes}</p>
            </div>
          )}

          {/* Assignee response */}
          {canAct && c.status === 'pending' && (
            <div className="space-y-2 border-t border-sr-border pt-4">
              <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">Response / Counter-offer</p>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Optional notes for the client..."
                className="w-full bg-sr-bg border border-sr-border px-2 py-1.5 text-xs font-mono text-slate-300 focus:border-cyan-700 focus:outline-none resize-none h-16"
              />
              <div className="flex gap-2">
                <ActionButton label="ACCEPT" onClick={() => handleStatus('accepted')} color="teal" disabled={isPending} />
                <ActionButton label="DECLINE" onClick={() => handleStatus('declined')} color="red" disabled={isPending} />
              </div>
            </div>
          )}

          {canAct && c.status === 'accepted' && (
            <div className="border-t border-sr-border pt-4">
              <ActionButton label="MARK DELIVERED" onClick={() => handleStatus('completed')} color="cyan" disabled={isPending} />
            </div>
          )}

          {isClient && c.status === 'pending' && (
            <div className="border-t border-sr-border pt-4">
              <ActionButton label="CANCEL REQUEST" onClick={() => handleStatus('cancelled')} color="red" disabled={isPending} />
            </div>
          )}

          {c.assignee_notes && (
            <div>
              <p className="text-xs font-mono text-sr-muted uppercase tracking-widest mb-1">Operative Notes</p>
              <p className="text-xs text-slate-400">{c.assignee_notes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-mono text-sr-muted uppercase tracking-widest">{label}</p>
      <p className="text-xs text-slate-300 mt-0.5">{value}</p>
    </div>
  );
}

function ActionButton({ label, onClick, color, disabled }: {
  label: string; onClick: () => void; color: 'teal'|'red'|'cyan'; disabled?: boolean;
}) {
  const colors = {
    teal: 'border-teal-700/50 text-teal-400 hover:bg-teal-900/20',
    red:  'border-red-700/50  text-red-400  hover:bg-red-900/20',
    cyan: 'border-cyan-700/50 text-cyan-400 hover:bg-cyan-900/20',
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider border transition-colors disabled:opacity-40 ${colors[color]}`}
    >
      {label}
    </button>
  );
}
