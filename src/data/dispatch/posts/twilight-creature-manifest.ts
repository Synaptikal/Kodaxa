/**
 * twilight-creature-manifest.ts
 * Dispatch post — Intelligence Division field report on the confirmed
 * creature roster from the Twilight Update.
 */

import type { DispatchPost } from '@/types/dispatch';

export const post: DispatchPost = {
  slug: 'twilight-creature-manifest',
  title: 'Field Report: The Twilight Update Creature Manifest',
  category: 'field_report',
  published_at: '2026-04-14',
  author: 'Intelligence Division',
  eyebrow: 'Intelligence // Field Report 007',
  summary:
    'Nine confirmed wildlife species ship with the Twilight Update. Here is the associate-facing briefing: what they are, where they live, and how to handle encounters.',
  tags: ['creatures', 'twilight', 'field-report'],
  content: [
    {
      kind: 'paragraph',
      text:
        'The Twilight Update raised the confirmed wildlife count from zero to nine. Every entry below is grounded in the official patch notes and has an Intelligence-verified record in the Creature Database. UNCONFIRMED secondary behaviors are flagged there, not here — this dispatch only covers what we have on record.',
    },
    {
      kind: 'heading',
      level: 2,
      text: 'Prey column',
    },
    {
      kind: 'list',
      items: [
        'Rabbit — generic prey. Temperate humid + arid. Starter tier.',
        'Velocirabbit — a faster rabbit variant that breaks line-of-sight fast. Temperate plains.',
        'Deer — broadleaf forest prey. Flees at aggro range.',
        'Owldeer — dusk / night variant in cold humid and temperate humid biomes. Harder to track.',
      ],
    },
    {
      kind: 'heading',
      level: 2,
      text: 'Contested column',
    },
    {
      kind: 'list',
      items: [
        'Ballhog — armored tuskbeast. Takes ranged well. Confirmed in temperate arid and hot arid.',
        'Gashog — nests near gas pockets in hot arid and volcanic zones. Avoid melee in the gas cloud.',
      ],
    },
    {
      kind: 'heading',
      level: 2,
      text: 'Threat column',
    },
    {
      kind: 'list',
      items: [
        'Prowler — pack predator. Temperate forests and arid plains. Night ambush behavior.',
        'Skyshark — aerial threat in hot arid thermals and over volcanic plains. Ranged weapon essential.',
        'Kharvix — flocking harasser in hot humid jungles. Individually weak, dangerous in numbers.',
      ],
    },
    {
      kind: 'callout',
      tone: 'warn',
      text:
        'Gashog encounters near gas pockets scale quickly. If you see a gashog in the hot arid band, assume there is a gas zone within sight distance and plan accordingly.',
    },
    {
      kind: 'link_card',
      href: '/creatures',
      title: 'Open the Creature Database',
      description: 'Full entries with behavior tags, threat tiers, drops, and biome mappings.',
    },
  ],
};
