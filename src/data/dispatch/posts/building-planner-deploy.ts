/**
 * building-planner-deploy.ts
 * Dispatch post — Building Planner goes live.
 */

import type { DispatchPost } from '@/types/dispatch';

export const post: DispatchPost = {
  slug: 'building-planner-deployed',
  title: 'Building Planner: Live Deployment',
  category: 'division_brief',
  published_at: '2026-04-15',
  author: 'Operations Division',
  eyebrow: 'Operations // Deployment Notice',
  summary:
    'The 3D homestead canvas is now live. Block placement, material BOM calculation, and structural hazard flagging are active in early access. Report anomalies via Discord relay.',
  tags: ['building', 'operations', 'deployment', 'early-access'],
  content: [
    {
      kind: 'paragraph',
      text: 'The Kodaxa Building Planner has cleared internal review and is now open for all operatives. The 3D canvas lets you design your Stars Reach homestead before committing a single material — place blocks, view per-layer breakdowns, and generate a full bill of materials before you break ground.',
    },
    {
      kind: 'heading',
      level: 2,
      text: 'Active Systems',
    },
    {
      kind: 'list',
      items: [
        'Block palette — all confirmed building materials with durability ratings.',
        'BOM Calculator — full material cost for any canvas state, grouped by type.',
        'Hazard Analyzer — flags unsupported overhangs and structural weak points.',
        'Layer Controls — slice through floors to inspect interior structure.',
        'Blueprint URL export — share a build via a single link.',
      ],
    },
    {
      kind: 'callout',
      tone: 'warn',
      text: 'Stars Reach building mechanics are pre-alpha. Block IDs and durability values may change with future patches. Treat all BOM outputs as estimates until launch.',
    },
    {
      kind: 'paragraph',
      text: 'Submit bug reports and block correction requests in the #building-planner channel on Discord. If a material is missing or a cost looks wrong, flag it — the data pipeline updates within 24 hours of a confirmed patch.',
    },
    {
      kind: 'link_card',
      href: '/building',
      title: 'Open Building Planner',
      description: '3D canvas · BOM calculator · Hazard flagging · Blueprint sharing.',
    },
  ],
};
