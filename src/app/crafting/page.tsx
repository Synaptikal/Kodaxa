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

export default function CraftingPage() {
  return <CraftingClient />;
}
