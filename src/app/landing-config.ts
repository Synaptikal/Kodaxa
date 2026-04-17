/**
 * landing-config.ts
 * Static configuration data for the Kodaxa Studios homepage.
 * One concern: nav links, quick links, tool card definitions, soon cards.
 *
 * Imported by page.tsx (server component). All values are build-time constants
 * except ToolCardProps which accepts runtime stats injected from page.tsx.
 */

import type { BadgeVariant, DivisionName } from '@/components/ui/badge';

export type ToolCardProps = {
  href: string;
  codexName: string;
  realName: string;
  description: string;
  stats: { label: string; value: string }[];
  accent: string;
  cta: string;
  deployStatus: Extract<BadgeVariant, 'live' | 'new' | 'soon' | 'beta' | 'wip'>;
  division: DivisionName;
};

export const NAV_LINKS = [
  { href: '/planner',   label: 'Workforce Intelligence' },
  { href: '/crafting',  label: 'Material Analytics' },
  { href: '/items',     label: 'Data Terminal' },
  { href: '/recipes',   label: 'Schematics Archive' },
  { href: '/directory', label: 'Commerce Registry' },
] as const;

export const SOON = [
  { href: '/atlas',     label: 'Resource Atlas',        sub: 'Crowdsourced P/Q/R/V mineral data by sector' },
  { href: '/market',    label: 'Market Price Index',    sub: 'Community price relay across operational sectors' },
  { href: '/makers',    label: "Maker's Mark Registry", sub: 'Artisan reputation and portfolio system' },
  { href: '/creatures', label: 'Fauna Database',        sub: 'Drop tables and biome distribution mapping' },
] as const;

/** Build tool card definitions with runtime stats injected from page.tsx */
export function buildTools(params: {
  skillCap: number;
  toolCap: number;
  totalProf: number;
  liveNodes: number;
  totalRecipes: number;
  totalResources: number;
  totalStations: number;
  totalItems: number;
}): ToolCardProps[] {
  const { skillCap, toolCap, totalProf, liveNodes, totalRecipes, totalResources, totalStations, totalItems } = params;

  return [
    {
      href: '/planner',
      codexName: 'Workforce Intelligence System',
      realName: 'Skill Planner',
      description: `Plan your ${skillCap}-skill build across ${totalProf} profession trees. Manage your ${toolCap}-tool loadout. Share builds via URL.`,
      stats: [{ label: 'Skill Cap', value: String(skillCap) }, { label: 'Live Skills', value: `${liveNodes}+` }],
      accent: 'border-l-2 border-l-teal-700 hover:border-l-teal-500',
      cta: 'text-teal-400',
      deployStatus: 'live',
      division: 'operations',
    },
    {
      href: '/crafting',
      codexName: 'Material Analytics Suite',
      realName: 'Crafting Calculator',
      description: `Optimize P/Q/R/V resource stats across ${totalRecipes} recipes. Full chain resolver and stat optimizer.`,
      stats: [{ label: 'Recipes', value: String(totalRecipes) }, { label: 'Resources', value: String(totalResources) }],
      accent: 'border-l-2 border-l-amber-700 hover:border-l-amber-500',
      cta: 'text-amber-400',
      deployStatus: 'live',
      division: 'commerce',
    },
    {
      href: '/directory',
      codexName: 'Commerce Registry',
      realName: 'Crafter Directory',
      description: 'Locate registered artisans by profession, sector, and availability. Issue your listing so contract issuers can find you.',
      stats: [{ label: 'Live Data', value: '✓' }, { label: 'Open Access', value: '✓' }],
      accent: 'border-l-2 border-l-amber-700 hover:border-l-amber-500',
      cta: 'text-amber-400',
      deployStatus: 'live',
      division: 'commerce',
    },
    {
      href: '/building',
      codexName: 'Architectural Design Interface',
      realName: 'Building Planner',
      description: 'Plan your homestead in 3D. Place blocks, calculate material requirements, and flag structural hazards before you build.',
      stats: [{ label: '3D Canvas', value: '✓' }, { label: 'BOM Calc', value: '✓' }],
      accent: 'border-l-2 border-l-teal-700 hover:border-l-teal-500',
      cta: 'text-teal-400',
      deployStatus: 'new',
      division: 'operations',
    },
    {
      href: '/items',
      codexName: 'Data Terminal',
      realName: 'Material Registry',
      description: `Browse all Stars Reach items, materials, equipment, and consumables. ${totalItems}+ entries across 12 categories.`,
      stats: [{ label: 'Records', value: `${totalItems}+` }, { label: 'Categories', value: '12' }],
      accent: 'border-l-2 border-l-cyan-700 hover:border-l-cyan-500',
      cta: 'text-cyan-400',
      deployStatus: 'new',
      division: 'intelligence',
    },
    {
      href: '/recipes',
      codexName: 'Schematics Archive',
      realName: 'Recipe Database',
      description: `Browse and filter all ${totalRecipes} crafting schematics by station and output type. Full ingredient chain reference.`,
      stats: [{ label: 'Schematics', value: String(totalRecipes) }, { label: 'Stations', value: String(totalStations) }],
      accent: 'border-l-2 border-l-cyan-700 hover:border-l-cyan-500',
      cta: 'text-cyan-400',
      deployStatus: 'new',
      division: 'intelligence',
    },
  ];
}
