/**
 * charter-v1.ts
 * Dispatch post — Kodaxa Studios founding brief. KDXA-001.
 */

import type { DispatchPost } from '@/types/dispatch';

export const post: DispatchPost = {
  slug: 'kodaxa-charter-v1',
  title: 'Founding Brief — What Is Kodaxa Studios?',
  category: 'charter',
  published_at: '2026-04-01',
  author: 'The Board',
  eyebrow: 'Executive // Charter v1',
  ref_id: 'KDXA-001',
  tag: 'LORE',
  summary:
    'A formal introduction to Kodaxa Studios, its mandate, and why we exist in the frontier systems of Stars Reach.',
  tags: ['charter', 'founding', 'lore', 'divisions'],
  content: [
    {
      kind: 'paragraph',
      text: 'Every frontier needs infrastructure. Not the kind you can mine or fabricate — the kind that turns raw information into decisions, and decisions into outcomes.',
    },
    {
      kind: 'paragraph',
      text: "Kodaxa Studios was established in the pre-alpha window of Stars Reach's colonization era with a single mandate: build the data layer that settlers, crafters, and contractors actually need. The game's systems are deep. Its profession trees are layered. Its economies will be shaped by players who understand the numbers — and exploited by those who don't.",
    },
    {
      kind: 'paragraph',
      text: 'We exist to close that gap.',
    },
    {
      kind: 'heading',
      level: 2,
      text: 'Our Mandate',
    },
    {
      kind: 'paragraph',
      text: 'Kodaxa operates across four divisions, each responsible for a distinct layer of the information stack:',
    },
    {
      kind: 'list',
      items: [
        'Operations — Workforce planning, build optimization, and loadout management. If you\'re deciding how to spend your skill points, Operations has the tooling.',
        'Intelligence — Schematic archives, material dependencies, and resource mapping. Raw data, refined for use.',
        'Commerce — Crafter registry, contract exchange, and pricing intelligence. The marketplace, organized.',
        'Dispatch — Patch monitoring, system advisories, and community bulletins. The signal feed.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'Together, these divisions form a unified platform — not a collection of fan tools, but an operating system for life in the Stars Reach galaxy.',
    },
    {
      kind: 'heading',
      level: 2,
      text: 'On the Pre-Alpha Constraint',
    },
    {
      kind: 'paragraph',
      text: 'We are building this in the dark. Stars Reach has no public API. No official item database. No exportable skill tree.',
    },
    {
      kind: 'paragraph',
      text: 'Our current data pipeline relies on manual extraction, community contribution, and an OCR system that parses in-game screenshots into structured records. Every schematic in our archive was placed there by hand. Every profession tree was verified against live footage.',
    },
    {
      kind: 'callout',
      tone: 'info',
      text: 'This is not a complaint. It is a context. When you use a Kodaxa tool, you are using something that was built under real constraints, by people who care about accuracy, and who will update it every time the game changes.',
    },
    {
      kind: 'heading',
      level: 2,
      text: 'What Comes Next',
    },
    {
      kind: 'paragraph',
      text: 'Building Planner. Crafter Directory. Contract Exchange. Live resource pricing. Planetary data feeds when the API arrives.',
    },
    {
      kind: 'paragraph',
      text: 'The roadmap exists. The systems are being laid. Log in, establish your uplink, and watch this space.',
    },
  ],
};
