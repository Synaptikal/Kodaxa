/**
 * landing-config.ts
 * Static configuration data for the Kodaxa Studios homepage.
 * One concern: nav links, quick links, tool card definitions, soon cards,
 *   division panel configs, phase color map, and relay ticker messages.
 *
 * Imported by page.tsx (server component). All values are build-time constants
 * except ToolCardProps which accepts runtime stats injected from page.tsx.
 */

import { Crosshair, Database, Scale, Radio, type LucideIcon } from 'lucide-react';
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
  { href: '/atlas',     label: 'Resource Atlas',        sub: 'Crowdsourced P/Q/R/V mineral data by sector',     phase: 'IN BUILD'  },
  { href: '/market',    label: 'Market Price Index',    sub: 'Community price relay across operational sectors', phase: 'IN BUILD'  },
  { href: '/makers',    label: "Maker's Mark Registry", sub: 'Artisan reputation and portfolio system',          phase: 'IN DESIGN' },
  { href: '/creatures', label: 'Fauna Database',        sub: 'Drop tables and biome distribution mapping',       phase: 'IN DESIGN' },
] as const;

// ── Division panel configuration ───────────────────────────────────────
export type DivisionConfig = {
  label: string;
  name: string;
  href: string;
  div: DivisionName;
  tools: string[];
  borderColor: string;
  hoverStyle: string;
  labelColor: string;
  Icon: LucideIcon;
  imgSrc: string;
};

export const DIVISIONS: DivisionConfig[] = [
  {
    label: 'Operations',   name: 'Workforce Intelligence',
    href: '/planner',      div: 'operations',
    tools: ['Skill Planner', 'Building Planner', 'XP Timer'],
    borderColor: 'border-l-teal-600',
    hoverStyle: 'hover:bg-teal-950/30 hover:border-teal-800/60',
    labelColor: 'text-teal-400',
    Icon: Crosshair,
    imgSrc: '/divisions/ops-lathe.jpg',
  },
  {
    label: 'Intelligence', name: 'Data Terminal',
    href: '/items',        div: 'intelligence',
    tools: ['Material Registry', 'Schematics Archive', 'Resource Atlas'],
    borderColor: 'border-l-cyan-600',
    hoverStyle: 'hover:bg-cyan-950/30 hover:border-cyan-800/60',
    labelColor: 'text-cyan-400',
    Icon: Database,
    imgSrc: '/divisions/intel-pyromycis.jpg',
  },
  {
    label: 'Commerce',     name: 'Market & Registry',
    href: '/directory',    div: 'commerce',
    tools: ['Commerce Registry', 'Material Analytics', "Maker's Mark"],
    borderColor: 'border-l-amber-600',
    hoverStyle: 'hover:bg-amber-950/30 hover:border-amber-800/60',
    labelColor: 'text-amber-400',
    Icon: Scale,
    imgSrc: '/divisions/commerce-beach.jpg',
  },
  {
    label: 'Dispatch',     name: 'Field Reports',
    href: '/patch-notes',  div: 'dispatch',
    tools: ['Patch Notes', 'Division Briefs', 'Recruitment Calls'],
    borderColor: 'border-l-violet-600',
    hoverStyle: 'hover:bg-violet-950/30 hover:border-violet-800/60',
    labelColor: 'text-violet-400',
    Icon: Radio,
    imgSrc: '/divisions/dispatch-portal.jpg',
  },
];

// ── Phase color map for pending-deployment cards ────────────────────────
export const PHASE_COLORS: Record<string, string> = {
  'IN BUILD':  'text-amber-400 border-amber-700/60',
  'IN DESIGN': 'text-violet-400 border-violet-700/60',
  'IN TEST':   'text-cyan-400 border-cyan-700/60',
};

// ── Relay ticker messages ───────────────────────────────────────────────
// Note: dynamic values (totalProf, SKILL_CAP) are injected from page.tsx
// via buildTickerMessages() to keep this file free of runtime imports.
export function buildTickerMessages(totalProf: number, skillCap: number): string[] {
  return [
    'RELAY UPLINK STABLE',
    `${totalProf} PROFESSIONS INDEXED`,
    'CRAFTER DIRECTORY OPEN',
    'SCHEMATICS ARCHIVE CURRENT',
    `${skillCap}-SKILL CAP CONFIRMED`,
    'OCR PIPELINE ACTIVE',
    'PRE-ALPHA · DATA SUBJECT TO CHANGE',
    'BUILDING PLANNER DEPLOYED',
    'SECTOR DATA NOMINAL',
  ];
}

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
      href: '/inventory',
      codexName: 'Logistical Management Suite',
      realName: 'Inventory & Materials',
      description: 'Track your personal stockpile, register tool loadouts, and manage homestead crate access configurations natively.',
      stats: [{ label: 'Local Data', value: '✓' }, { label: 'Fast Add', value: '✓' }],
      accent: 'border-l-2 border-l-teal-700 hover:border-l-teal-500',
      cta: 'text-teal-400',
      deployStatus: 'new',
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
      description: 'Browse the operative profile registry. Claim your artisan listing now — directory infrastructure is live ahead of beta commerce expansion.',
      stats: [{ label: 'Live Data', value: '✓' }, { label: 'Open Access', value: '✓' }],
      accent: 'border-l-2 border-l-amber-700 hover:border-l-amber-500',
      cta: 'text-amber-400',
      deployStatus: 'live',
      division: 'commerce',
    },
    {
      href: '/trade',
      codexName: 'Commercial Operations Tracker',
      realName: 'Trade System',
      description: 'Maintain your vendor kiosk limits, log P2P direct trades, and track market prices manually to map optimal trade routes.',
      stats: [{ label: 'Fee Calc', value: '✓' }, { label: 'Kiosk Cap', value: '100' }],
      accent: 'border-l-2 border-l-amber-700 hover:border-l-amber-500',
      cta: 'text-amber-400',
      deployStatus: 'new',
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
    {
      href: '/dashboard',
      codexName: 'Personal Analytics Dashboard',
      realName: 'My Terminal',
      description: 'Log and review your daily Stars Reach sessions. Chart your Klaatu flow and visualize your skill progression over time.',
      stats: [{ label: 'Local DB', value: '✓' }, { label: 'Activity Log', value: '✓' }],
      accent: 'border-l-2 border-l-slate-600 hover:border-l-slate-400',
      cta: 'text-slate-300',
      deployStatus: 'new',
      division: 'personnel',
    },
  ];
}
