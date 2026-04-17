import { Suspense } from 'react';
import { ClientBuildingShell, BuildingShellSkeleton } from './client-shell';

export const metadata = {
  title: 'Architectural Design Interface | Kodaxa Studios',
  description: 'Plan your homestead in 3D. Calculate materials, detect structural hazards, and share designs.',
};

export default function BuildingPage() {
  return (
    <Suspense fallback={<BuildingShellSkeleton />}>
      <ClientBuildingShell />
    </Suspense>
  );
}
