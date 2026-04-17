'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

// R3F requires client-side rendering because it references window/document
// In Next.js 16+, next/dynamic with ssr: false MUST be placed inside a Client Component.
export const ClientBuildingShell = dynamic(
  () => import('@/components/building/building-shell').then((mod) => mod.BuildingShell),
  { 
    ssr: false,
    loading: () => <BuildingShellSkeleton />
  }
);

export function BuildingShellSkeleton() {
  return (
    <div className="flex flex-col h-screen bg-stone-950 text-stone-200">
      {/* Mock Header */}
      <div className="h-16 border-b border-stone-800 flex items-center px-6">
        <div className="w-8 h-8 rounded bg-stone-800 animate-pulse" />
        <div className="ml-4 w-48 h-5 rounded bg-stone-800 animate-pulse" />
      </div>
      
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center flex flex-col items-center">
          <Loader2 className="w-10 h-10 text-cyan-500 animate-spin mb-4" />
          <p className="text-stone-400 animate-pulse uppercase tracking-widest text-sm">
            Initializing Editor...
          </p>
        </div>
      </div>
    </div>
  );
}
