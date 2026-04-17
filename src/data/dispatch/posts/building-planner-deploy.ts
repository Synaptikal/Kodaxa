/**
 * building-planner-deploy.ts
 * Dispatch post — Building Planner deployment notice. KDXA-002.
 */

import type { DispatchPost } from '@/types/dispatch';

export const post: DispatchPost = {
  slug: 'building-planner-deployed',
  title: 'System Deployment — Building Planner Now Live',
  category: 'division_brief',
  published_at: '2026-04-10',
  author: 'Operations Division',
  eyebrow: 'Operations // Deployment Notice',
  ref_id: 'KDXA-002',
  tag: 'DEPLOYMENT',
  summary:
    'The Kodaxa Building Planner enters early access. Plan your homestead in 3D, calculate material bills, and flag hazards before you break ground.',
  tags: ['building', 'operations', 'deployment', 'early-access'],
  content: [
    {
      kind: 'paragraph',
      text: 'After internal testing across multiple build configurations, the Kodaxa Building Planner has been cleared for early access deployment. The system is live at /building. No credentials required.',
    },
    {
      kind: 'heading',
      level: 2,
      text: "What's Deployed",
    },
    {
      kind: 'paragraph',
      text: 'The Building Planner gives you a canvas to design your Stars Reach homestead before committing a single material in-game. Current capabilities:',
    },
    {
      kind: 'list',
      items: [
        '3D block canvas — Place and arrange structure components on an isometric grid',
        'Bill of Materials — Automatic calculation of raw material requirements based on your placed blocks',
        'Skill dependency check — Flags any build components that require professions or skill nodes you haven\'t planned for',
        'Save & load builds — Store multiple homestead configurations under your operative profile',
        'Export summary — Generate a readable build sheet you can reference in-session',
      ],
    },
    {
      kind: 'heading',
      level: 2,
      text: 'Known Limitations (Early Access)',
    },
    {
      kind: 'callout',
      tone: 'warn',
      text: 'This is a pre-alpha deployment. Schematic data may lag behind in-game updates by 24–72 hours. Block placement does not yet model terrain elevation. Furniture and interior fixtures are not yet catalogued. Mobile layout is functional but not optimized — full experience on desktop recommended.',
    },
    {
      kind: 'heading',
      level: 2,
      text: 'Reporting Anomalies',
    },
    {
      kind: 'paragraph',
      text: 'If a material count looks wrong, a block is miscategorized, or a dependency link is broken, file a report via the Discord relay in the #data-corrections channel. Include the build ref ID shown in your planner header.',
    },
    {
      kind: 'paragraph',
      text: 'Every correction improves the archive for all operatives.',
    },
    {
      kind: 'link_card',
      href: '/building',
      title: 'Open Building Planner',
      description: '3D canvas · BOM calculator · Hazard flagging · Blueprint sharing',
    },
  ],
};
