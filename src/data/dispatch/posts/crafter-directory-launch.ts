/**
 * crafter-directory-launch.ts
 * Dispatch post — Crafter Directory open enrollment.
 */

import type { DispatchPost } from '@/types/dispatch';

export const post: DispatchPost = {
  slug: 'crafter-directory-open-enrollment',
  title: 'Crafter Directory: Open Enrollment',
  category: 'division_brief',
  published_at: '2026-04-12',
  author: 'Commerce Division',
  eyebrow: 'Commerce // Registry Notice',
  summary:
    'The Commerce Registry is now accepting operative listings. Register your specializations, set availability by sector, and make yourself discoverable to contract issuers.',
  tags: ['commerce', 'directory', 'crafting', 'registration'],
  content: [
    {
      kind: 'paragraph',
      text: 'The Kodaxa Crafter Directory is live. Any Stars Reach operative can create a public profile, list their active professions, and indicate which planetary sectors they operate in. Contract issuers searching for a specific crafter type get a filtered grid — name, specialization, rating, and availability at a glance.',
    },
    {
      kind: 'heading',
      level: 2,
      text: 'What Listing Gets You',
    },
    {
      kind: 'list',
      items: [
        'Discoverable by profession, planet, and availability status.',
        'Public profile with specialization tags and a 5-star rating system.',
        'Kodaxa badge on your listing once your account is verified.',
        'Direct Discord handle display — contract issuers reach you where you already are.',
      ],
    },
    {
      kind: 'callout',
      tone: 'info',
      text: 'Registration is free and open to all Stars Reach players — no Kodaxa membership required. Associates get an additional verified badge on their listing.',
    },
    {
      kind: 'paragraph',
      text: 'The directory is seeded with early-access registrations from pre-alpha. If your listing data is incorrect or your specializations have changed, edit your profile at any time from the My Terminal page.',
    },
    {
      kind: 'link_card',
      href: '/directory',
      title: 'Browse the Crafter Directory',
      description: 'Search operatives by profession, planet, and availability.',
    },
  ],
};
