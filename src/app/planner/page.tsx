/**
 * planner/page.tsx
 * Planner route entry — wraps PlannerShell in <Suspense>.
 * One concern: providing the Suspense boundary Next.js 16 requires
 * for useSearchParams().
 *
 * Source: https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout
 */

import { Suspense } from 'react';
import { PlannerShell } from '@/components/planner/planner-shell';

/** Skeleton fallback — mirrors PlannerShell layout while search params resolve */
function PlannerFallback() {
  return (
    <div className="flex flex-col h-dvh bg-sr-bg">
      <div className="h-12 border-b border-sr-border bg-sr-surface/50 shrink-0 skeleton-row" />
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 border-r border-sr-border bg-sr-surface/30 flex flex-col gap-3 p-4">
          <div className="h-2.5 w-20 skeleton-row" />
          <div className="h-8 w-full skeleton-row" />
          <div className="mt-2 h-2.5 w-16 skeleton-row" />
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-6 w-full skeleton-row" />
          ))}
        </aside>
        <div className="flex-1 bg-sr-bg flex items-center justify-center">
          <p className="text-xs font-mono text-sr-subtle tracking-[0.25em] uppercase animate-pulse">
            Establishing uplink…
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PlannerPage() {
  return (
    <Suspense fallback={<PlannerFallback />}>
      <PlannerShell />
    </Suspense>
  );
}
