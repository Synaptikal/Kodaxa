/**
 * pre-alpha-status-q1.ts
 * Dispatch post — Honest Q1 2026 operational status report. KDXA-005.
 */

import type { DispatchPost } from '@/types/dispatch';

export const post: DispatchPost = {
  slug: 'pre-alpha-status-q1-2026',
  title: 'Status Report — Pre-Alpha Operations, Q1 2026',
  category: 'division_brief',
  published_at: '2026-04-17',
  author: 'Dispatch Division',
  eyebrow: 'Dispatch // Operational Status',
  ref_id: 'KDXA-005',
  tag: 'STATUS',
  summary:
    'A frank operational review of where Kodaxa stands, what\'s running, what\'s coming, and how the community has shaped the platform so far.',
  tags: ['status', 'dispatch', 'community', 'roadmap', 'q1-2026'],
  content: [
    {
      kind: 'paragraph',
      text: "This is an honest account of where Kodaxa stands right now. Not a marketing memo. A status report.",
    },
    {
      kind: 'heading',
      level: 2,
      text: 'Systems Online',
    },
    {
      kind: 'list',
      items: [
        '● LIVE — Skill Planner · Full profession tree, stat simulation, loadout saving',
        '● LIVE — Building Planner · Early access, structural components only',
        '● LIVE — Crafter Directory · Open enrollment active',
        '● LIVE — Schematic Archive · 36 records, ongoing extraction',
        '◌ PENDING — Contract Exchange · Internal testing, Commerce Division',
        '◌ PENDING — Resource Tracker · Blocked pending API or contributor data',
        '◌ PLANNED — Planetary Map · Roadmap Q3 2026',
      ],
    },
    {
      kind: 'heading',
      level: 2,
      text: 'What the Community Has Built',
    },
    {
      kind: 'paragraph',
      text: 'This platform runs on contributor data. Since the OCR pipeline went live, community members have submitted hundreds of in-game screenshots that form the backbone of every record in the archive.',
    },
    {
      kind: 'list',
      items: [
        'The profession tree data is 100% community-sourced. Every one of the 39 indexed professions was confirmed by a player who took time to document what they found.',
        'Several skill dependency errors caught in early testing were flagged by users in #data-corrections before they caused visible bugs. That feedback loop works.',
        "The Building Planner's block catalogue was seeded by four contributors who systematically screenshotted every craftable structure component in the current build.",
      ],
    },
    {
      kind: 'callout',
      tone: 'info',
      text: 'This is not incidental. Kodaxa is a community data project with a professional interface. The data is yours. The tools are ours. The platform is shared.',
    },
    {
      kind: 'heading',
      level: 2,
      text: "What We're Watching",
    },
    {
      kind: 'paragraph',
      text: 'Stars Reach is in active development. Every patch is a potential data event. The following game systems are currently in flux and may invalidate portions of our archive:',
    },
    {
      kind: 'list',
      items: [
        'Profession XP curves (balance pass expected)',
        'Material stack sizes (being revised in current build)',
        'Homestead structure costs (not yet finalized)',
      ],
    },
    {
      kind: 'paragraph',
      text: 'When a patch drops, Intelligence Division audits the relevant records within 48 hours. Corrections are pushed to the live archive and a notice is filed in Dispatch.',
    },
    {
      kind: 'heading',
      level: 2,
      text: 'On the Official API',
    },
    {
      kind: 'paragraph',
      text: "Playable Worlds has signaled intent to release community tooling APIs as development matures. When that happens, Kodaxa's OCR pipeline retires and our data coverage expands from dozens of records to thousands overnight.",
    },
    {
      kind: 'callout',
      tone: 'success',
      text: 'We are not a pre-alpha curiosity. We are pre-positioning.',
    },
    {
      kind: 'paragraph',
      text: "If you've been using the tools, thank you. If you've submitted data, thank you twice. If you've told another player about Kodaxa, that is the most valuable thing you can do right now.",
    },
  ],
};
