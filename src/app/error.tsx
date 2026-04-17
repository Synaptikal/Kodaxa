'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[kodaxa] unhandled error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-sr-bg flex items-center justify-center px-4">
      <div className="max-w-md w-full border border-red-800/40 bg-red-950/20 p-8 space-y-4 text-center">
        <p className="text-[8px] font-mono uppercase tracking-[0.35em] text-red-700">
          System Fault — Kodaxa Internal
        </p>
        <h1 className="text-xl font-bold font-mono text-red-300">
          SYSTEM ERROR
        </h1>
        <p className="text-xs text-slate-400 leading-relaxed">
          An unhandled fault occurred. The incident has been logged.
          {error.digest && (
            <span className="block mt-1 font-mono text-slate-600 text-[10px]">
              Ref: {error.digest}
            </span>
          )}
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <button
            onClick={reset}
            className="px-4 py-2 text-[9px] font-mono font-bold uppercase tracking-wider border border-red-700/50 text-red-400 hover:bg-red-900/20 transition-colors"
          >
            Retry
          </button>
          <a
            href="/"
            className="px-4 py-2 text-[9px] font-mono font-bold uppercase tracking-wider border border-slate-700 text-slate-400 hover:bg-slate-800 transition-colors"
          >
            Return to HQ
          </a>
        </div>
      </div>
    </div>
  );
}
