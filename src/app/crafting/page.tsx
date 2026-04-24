/**
 * crafting/page.tsx
 * Crafting Calculator route — recipe explorer + stat optimizer.
 * One concern: composing the crafting UI layout.
 *
 * Layout: left panel (recipe explorer) + right panel (recipe detail).
 * Similar split-pane pattern to the skill planner.
 */



import type { Metadata } from 'next';
import CraftingClient from '@/components/crafting/CraftingClient';

export const metadata: Metadata = {
  title: 'Crafting Calculator — Kodaxa Studios',
  description:
    'Crafting calculator and recipe explorer for Stars Reach — plan materials, optimize stats, and calculate chains.',
  openGraph: {
    title: 'Crafting Calculator — Kodaxa Studios',
    description:
      'Crafting calculator and recipe explorer for Stars Reach — plan materials, optimize stats, and calculate chains.',
  },
};

interface CraftingPageProps {
  searchParams: Promise<{ resources?: string }>;
}

export default async function CraftingPage({ searchParams }: CraftingPageProps) {
  const params = await searchParams;
  const bomHandoff = params.resources
    ? params.resources.split(',').flatMap((part) => {
        const [resourceId, rawQty] = part.split(':');
        const quantity = Number(rawQty);
        return resourceId && !isNaN(quantity) && quantity > 0
          ? [{ resourceId, quantity }]
          : [];
      })
    : undefined;

  return <CraftingClient bomHandoff={bomHandoff?.length ? bomHandoff : undefined} />;
}
