'use client';

import { useState } from 'react';
import { CommissionRequestForm } from './commission-request-form';

interface CommissionButtonProps {
  assigneeId: string;
  assigneeName: string;
}

export function CommissionButton({ assigneeId, assigneeName }: CommissionButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="shrink-0 px-4 py-2 text-[9px] font-mono font-bold uppercase tracking-wider bg-amber-900/30 border border-amber-700/60 text-amber-300 hover:bg-amber-900/50 transition-colors"
      >
        Submit Request →
      </button>

      {open && (
        <CommissionRequestForm
          assigneeId={assigneeId}
          assigneeName={assigneeName}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
