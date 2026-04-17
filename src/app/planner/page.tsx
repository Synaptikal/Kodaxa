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

/** Loading fallback while search params resolve */
function PlannerFallback() {
  return (
    <div className="flex h-dvh items-center justify-center bg-sr-bg">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-sr-muted">Loading planner...</p>
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
