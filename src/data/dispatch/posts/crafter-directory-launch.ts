/**
 * crafter-directory-launch.ts
 * Dispatch post — Crafter Directory open enrollment. KDXA-004.
 */

import type { DispatchPost } from '@/types/dispatch';

export const post: DispatchPost = {
  slug: 'crafter-directory-open-enrollment',
  title: 'Open Enrollment — Crafter Directory Now Accepting Registrations',
  category: 'division_brief',
  published_at: '2026-04-15',
  author: 'Commerce Division',
  eyebrow: 'Commerce // Registry Notice',
  ref_id: 'KDXA-004',
  tag: 'DEPLOYMENT',
  summary:
    'The Kodaxa Crafter Directory is open for operative registration. Register your specializations, declare your active professions, and make yourself discoverable to the contractor network.',
  tags: ['commerce', 'directory', 'crafting', 'registration'],
  content: [
    {
      kind: 'paragraph',
      text: 'The Kodaxa Crafter Directory is open for operative registration.',
    },
    {
      kind: 'paragraph',
      text: 'If you are an active crafter in Stars Reach — or planning to be — this is your listing in the contractor network. Commissioning players will use this directory to locate crafters by profession, home sector, and reputation. Your entry is your storefront.',
    },
    {
      kind: 'heading',
      level: 2,
      text: 'What the Directory Tracks',
    },
    {
      kind: 'list',
      items: [
        'Operative handle — your in-game identity',
        'Active professions — the crafting disciplines you currently practice',
        'Skill tier — your declared progression level within each profession (Apprentice / Journeyman / Specialist / Master)',
        'Home sector — your primary planet or system of operation',
        'Availability status — Open to commissions / Currently backlogged / On hiatus',
        'Reputation score — calculated automatically from fulfilled contract ratings',
      ],
    },
    {
      kind: 'callout',
      tone: 'info',
      text: 'Entries are public and searchable. They are not editable by commissioners — only the registered operative can update their own profile.',
    },
    {
      kind: 'heading',
      level: 2,
      text: 'The Reputation System',
    },
    {
      kind: 'paragraph',
      text: "Because Kodaxa cannot enforce escrow — all trades occur in-game — the directory runs on a verified fulfillment model. After a contract is completed, both parties submit a rating of 1–5. Ratings are tallied in real time.",
    },
    {
      kind: 'paragraph',
      text: 'The system is designed to make trust legible. A crafter with 47 fulfilled contracts at 4.8 average is a different proposition than one with 3 contracts at 3.0. Neither is hidden.',
    },
    {
      kind: 'heading',
      level: 2,
      text: 'What Comes Next',
    },
    {
      kind: 'paragraph',
      text: 'The Contract Exchange — the active commission board where work is posted, claimed, and tracked through fulfillment — is currently in internal testing. Crafter Directory entries will integrate directly with the Exchange at launch. Register now to ensure your profile is established before the contract flow opens.',
    },
    {
      kind: 'link_card',
      href: '/directory',
      title: 'Browse the Crafter Directory',
      description: 'Search operatives by profession, planet, and availability.',
    },
  ],
};
