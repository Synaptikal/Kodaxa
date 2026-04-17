/**
 * open-horizons-scout-call.ts
 * Dispatch post — recruitment call for scouts in the wake of the
 * Open Horizons Update.
 */

import type { DispatchPost } from '@/types/dispatch';

export const post: DispatchPost = {
  slug: 'open-horizons-scout-call',
  title: 'Open Horizons: Commerce Division Is Hiring Scouts',
  category: 'recruitment',
  published_at: '2026-04-16',
  author: 'Commerce Division',
  eyebrow: 'Commerce // Recruitment Drive',
  summary:
    'With the Open Horizons Update expanding procedural planet generation, Commerce Division is spinning up a dedicated scout cohort. Here is what the track looks like and how to join.',
  tags: ['recruitment', 'atlas', 'scouts', 'open-horizons'],
  content: [
    {
      kind: 'paragraph',
      text:
        'Open Horizons more than doubled the number of generated planet types and introduced new overlay biomes. Our Resource Atlas is only as good as the scouts feeding it. Commerce Division is opening a dedicated Scout Cohort to systematically survey new worlds and file PQRV readings.',
    },
    {
      kind: 'heading',
      level: 2,
      text: 'What a scout does',
    },
    {
      kind: 'list',
      items: [
        'Pick a home planet and sweep its biomes with a consistent kit.',
        'File PQRV readings for each resource you surface (Potential / Quality / Resilience / Versatility).',
        'Tag biome overlays — volcanic, coastal, subterranean — when you find them.',
        'Leave coords hints so the next associate can verify your reading.',
      ],
    },
    {
      kind: 'callout',
      tone: 'success',
      text:
        'Scouts who file 50+ verified readings get an amber Kodaxa scout badge on their Directory listing and priority access to Commerce Division\'s shared homesteads.',
    },
    {
      kind: 'heading',
      level: 2,
      text: 'How to join',
    },
    {
      kind: 'list',
      ordered: true,
      items: [
        'Create a Directory profile if you don\'t have one yet.',
        'Set your home planet and a maker mark if you plan to sell resources.',
        'File your first Atlas reading. The submission form is on /atlas.',
        'Join #commerce-scouts in the Kodaxa Discord and introduce yourself.',
      ],
    },
    {
      kind: 'link_card',
      href: '/atlas',
      title: 'Start scouting',
      description: 'Open the Resource Atlas and file your first PQRV reading.',
    },
    {
      kind: 'link_card',
      href: '/corporation',
      title: 'Learn about Kodaxa',
      description: 'Division structure, conduct code, and associate perks.',
    },
  ],
};
