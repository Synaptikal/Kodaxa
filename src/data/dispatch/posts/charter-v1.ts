/**
 * charter-v1.ts
 * Dispatch post — Kodaxa Studios founding charter announcement.
 */

import type { DispatchPost } from '@/types/dispatch';

export const post: DispatchPost = {
  slug: 'kodaxa-charter-v1',
  title: 'Kodaxa Studios: Founding Charter',
  category: 'charter',
  published_at: '2026-04-10',
  author: 'The Board',
  eyebrow: 'Corporate // Charter v1',
  summary:
    'Kodaxa Studios is a player-run conglomerate in Stars Reach. The charter defines who we are, what we build, and how associates coordinate across divisions.',
  tags: ['charter', 'divisions', 'guild'],
  content: [
    {
      kind: 'paragraph',
      text:
        'Kodaxa Studios was founded on the conviction that the best things in Stars Reach are made collaboratively — that a world of procedurally generated planets, craft economies, and shared infrastructure rewards groups who treat the game as a civilization, not a solo run. We are a player-run conglomerate. We organize like one.',
    },
    {
      kind: 'heading',
      level: 2,
      text: 'Six Divisions, One Call Sign',
    },
    {
      kind: 'paragraph',
      text:
        'Every associate picks a home division but is free to contribute to any of them. Division color codes stay consistent across our tools, our Discord, and our in-game coordination channels.',
    },
    {
      kind: 'list',
      items: [
        'Operations — logistics, homestead coordination, fleet movement.',
        'Intelligence — terrain survey, creature census, biome mapping.',
        'Commerce — directory, market prices, maker mark registry, crafting calc.',
        'Workforce — skill planning, mentorship, onboarding.',
        'Engineering — building, prefab libraries, infrastructure tests.',
        'Dispatch — field comms, patch recaps, outward-facing press.',
      ],
    },
    {
      kind: 'heading',
      level: 2,
      text: 'What we build',
    },
    {
      kind: 'paragraph',
      text:
        'The Kodaxa stack is everything in the tool bar: the Data Terminal, Crafting Calc, Building Planner, Skill Planner, Creature Database, Biome Field Guide, Resource Atlas, Maker\'s Mark, Market Prices, and this Dispatch. All are free to use by any Stars Reach player. Associates get extra coordination surface: a private Discord, shared homesteads, bulk-order fulfillment, and the Kodaxa badge on their directory listing.',
    },
    {
      kind: 'callout',
      tone: 'info',
      text:
        'Everything Kodaxa publishes is open-data by default. We take correction seriously — if a patch note contradicts an entry, we update the entry and re-publish.',
    },
    {
      kind: 'heading',
      level: 2,
      text: 'Associate Code',
    },
    {
      kind: 'list',
      ordered: true,
      items: [
        'Cite sources. Patch notes, dev streams, first-hand observation — all acceptable.',
        'Label speculation. Community-extrapolated entries are always marked UNCONFIRMED.',
        'No gatekeeping. Help newer associates the way you wish you had been helped.',
        'Honor marks. When a maker signs a deliverable, it carries our reputation too.',
      ],
    },
    {
      kind: 'link_card',
      href: '/corporation',
      title: 'Visit Kodaxa Corporate',
      description: 'Full division breakdown, recruitment tracks, and the associate code of conduct.',
    },
  ],
};
