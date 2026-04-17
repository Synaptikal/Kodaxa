/**
 * creatures/index.ts
 * Creature database — Stars Reach confirmed creatures.
 * One concern: static creature data aggregated for the browser.
 *
 * All entries confirmed from:
 *   - Twilight Update patch notes (starsreach.com/twilight-update-notes)
 *   - Brave New Worlds Update (starsreach.com/brave-new-worlds-update)
 *   - Massively OP coverage (April 2026)
 *
 * Taming foods and specific drop tables are NOT publicly documented.
 * Entries marked with confirmed: true have names and behaviors verified
 * from patch notes. Stats, drops, and taming data may be inferred and
 * should be flagged in UI as community-sourced.
 */

import type { Creature } from '@/types/creatures';

export const CREATURES: Creature[] = [
  {
    id: 'rabbit',
    name: 'Rabbit',
    classification: 'mammal',
    size: 'tiny',
    behavior: 'skittish',
    threatTier: 1,
    description:
      'Small common herbivore. Found across temperate biomes. Flees on sight; a reliable early-game source of hide and meat for new crafters.',
    biomes: ['temperate_humid', 'temperate_arid', 'hot_humid'],
    drops: ['hide', 'rabbit_meat', 'bone'],
    taming: { status: 'unknown', notes: 'Likely tameable with vegetation. Dev blog mentions taming food system refactor without specifying rabbit preferences.' },
    confirmed: true,
    sources: ['twilight-update'],
  },
  {
    id: 'velocirabbit',
    name: 'Velocirabbit',
    aliases: ['Speed Rabbit'],
    classification: 'mammal',
    size: 'small',
    behavior: 'skittish',
    threatTier: 2,
    description:
      'Fast-moving rabbit variant. Outpaces most starter tools and fleet enough that hunting requires positioning or ranged weapons.',
    biomes: ['temperate_humid', 'temperate_arid'],
    drops: ['hide', 'rabbit_meat', 'bone'],
    taming: { status: 'unknown' },
    abilities: ['high movement speed'],
    confirmed: true,
    sources: ['twilight-update'],
  },
  {
    id: 'deer',
    name: 'Deer',
    aliases: ['Forest Deer'],
    classification: 'mammal',
    size: 'medium',
    behavior: 'skittish',
    threatTier: 2,
    description:
      'Mid-sized herbivore with multiple regional variants. A primary source of deer meat and larger hide yields than rabbits. Antler drop confirmed.',
    biomes: ['temperate_humid', 'hot_humid'],
    drops: ['hide', 'deer_meat', 'bone', 'horn'],
    taming: { status: 'unknown' },
    confirmed: true,
    sources: ['twilight-update'],
  },
  {
    id: 'owldeer',
    name: 'Owldeer',
    classification: 'hybrid',
    size: 'medium',
    behavior: 'defensive',
    threatTier: 3,
    description:
      'Chimeric creature combining cervid body with raptor head and talons. Active in low-light biomes. Defensive when startled; will engage if cornered.',
    biomes: ['temperate_humid', 'cold_humid'],
    drops: ['hide', 'bone', 'horn'],
    taming: { status: 'unknown' },
    confirmed: true,
    sources: ['twilight-update'],
  },
  {
    id: 'gashog',
    name: 'Gashog',
    classification: 'mammal',
    size: 'medium',
    behavior: 'territorial',
    threatTier: 3,
    description:
      'Porcine-like creature associated with gas-pocket biomes. Emits reactive gas when threatened; hunters should close to melee carefully to avoid the cloud.',
    biomes: ['hot_arid', 'volcanic'],
    drops: ['hide', 'bone'],
    taming: { status: 'unknown' },
    abilities: ['gas emission on aggro'],
    confirmed: true,
    sources: ['twilight-update'],
  },
  {
    id: 'ballhog',
    name: 'Ballhog',
    classification: 'mammal',
    size: 'small',
    behavior: 'defensive',
    threatTier: 2,
    description:
      'Armored rolling creature. Curls into a ball when threatened and can charge. Armor plating makes early-game hunts tedious without the right tools.',
    biomes: ['temperate_arid', 'hot_arid'],
    drops: ['hide', 'bone'],
    taming: { status: 'unknown' },
    abilities: ['curl armor', 'roll charge'],
    confirmed: true,
    sources: ['twilight-update'],
  },
  {
    id: 'prowler',
    name: 'Prowler',
    aliases: ['Prowlers'],
    classification: 'mammal',
    size: 'medium',
    behavior: 'aggressive',
    threatTier: 4,
    description:
      'Apex-predator pack hunter. Active pursuit on detection; spawn group reduced to ~8 in Twilight update. A mid-game combat challenge.',
    biomes: ['cold_humid', 'temperate_humid', 'hot_arid'],
    drops: ['hide', 'bone'],
    taming: { status: 'unknown' },
    abilities: ['pack hunting', 'active aggro'],
    confirmed: true,
    sources: ['twilight-update'],
  },
  {
    id: 'skyshark',
    name: 'Skyshark',
    classification: 'avian',
    size: 'large',
    behavior: 'aggressive',
    threatTier: 4,
    description:
      'Airborne apex predator. Dive-attacks from altitude, making cover and detection tools essential. Flying combat introduces verticality most players must adapt to.',
    biomes: ['hot_arid', 'volcanic'],
    drops: ['hide', 'bone'],
    taming: { status: 'unknown' },
    abilities: ['flight', 'dive attack'],
    confirmed: true,
    sources: ['twilight-update'],
  },
  {
    id: 'kharvix',
    name: 'Kharvix',
    classification: 'avian',
    size: 'small',
    behavior: 'flocking',
    threatTier: 3,
    description:
      'Flocking creature with corrected pathing as of Twilight. No longer circles endlessly; spawn groups now behave coherently. Dangerous in numbers but individually weak.',
    biomes: ['hot_humid', 'temperate_humid'],
    drops: ['hide', 'bone'],
    taming: { status: 'unknown' },
    abilities: ['flock swarm', 'coordinated aggro'],
    confirmed: true,
    sources: ['twilight-update'],
  },
];

// ── Query helpers ─────────────────────────────────────────────────────

export function getAllCreatures(): Creature[] {
  return CREATURES;
}

export function getCreatureById(id: string): Creature | undefined {
  return CREATURES.find((c) => c.id === id);
}

export function getCreaturesByBiome(biomeId: string): Creature[] {
  return CREATURES.filter((c) => c.biomes.includes(biomeId));
}

export function getCreaturesByBehavior(behavior: Creature['behavior']): Creature[] {
  return CREATURES.filter((c) => c.behavior === behavior);
}

export function getCreaturesByThreatTier(tier: Creature['threatTier']): Creature[] {
  return CREATURES.filter((c) => c.threatTier === tier);
}

export function searchCreatures(query: string): Creature[] {
  const q = query.toLowerCase().trim();
  if (!q) return CREATURES;
  return CREATURES.filter((c) =>
    c.name.toLowerCase().includes(q) ||
    c.aliases?.some((a) => a.toLowerCase().includes(q)) ||
    c.description.toLowerCase().includes(q) ||
    c.drops.some((d) => d.toLowerCase().includes(q)),
  );
}

export function getCreatureStats() {
  return {
    total: CREATURES.length,
    confirmed: CREATURES.filter((c) => c.confirmed).length,
    byBehavior: {
      docile:      CREATURES.filter((c) => c.behavior === 'docile').length,
      skittish:    CREATURES.filter((c) => c.behavior === 'skittish').length,
      defensive:   CREATURES.filter((c) => c.behavior === 'defensive').length,
      territorial: CREATURES.filter((c) => c.behavior === 'territorial').length,
      aggressive:  CREATURES.filter((c) => c.behavior === 'aggressive').length,
      flocking:    CREATURES.filter((c) => c.behavior === 'flocking').length,
    },
  };
}
