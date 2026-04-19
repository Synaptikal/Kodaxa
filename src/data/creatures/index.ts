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
 * Taming foods and specific drop rates are NOT publicly documented.
 * Entries marked with confirmed: true have names and behaviors verified
 * from patch notes. Drop items are confirmed where noted; huntingTips
 * draw on patch-note mechanics and community-verified field observations.
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
    image: null,
    biomes: ['temperate_humid', 'temperate_arid', 'hot_humid'],
    drops: [
      { item: 'hide',        confirmed: true },
      { item: 'rabbit_meat', confirmed: true },
      { item: 'bone',        confirmed: true },
    ],
    taming: { status: 'unknown', notes: 'Likely tameable with vegetation. Dev blog mentions taming food system refactor without specifying rabbit preferences.' },
    huntingTips: [
      'Approaches from downwind reduce its flee radius — close quietly before striking.',
      'No aggro even on a miss; it resets quickly. Reliable early-game farm with no risk.',
      'Starter melee tools confirmed effective. No special gear required.',
    ],
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
    image: null,
    biomes: ['temperate_humid', 'temperate_arid'],
    drops: [
      { item: 'hide',        confirmed: true },
      { item: 'rabbit_meat', confirmed: true },
      { item: 'bone',        confirmed: true },
    ],
    taming: { status: 'unknown' },
    abilities: ['high movement speed'],
    huntingTips: [
      'Outpaces walking speed — use ranged weapons or cut off its escape at terrain breaks rather than chasing straight-line.',
      'Confirmed high movement speed ability; do not pursue in open flat ground.',
      'Drops the same loot as a rabbit but requires more effort; worth targeting only if velocirabbits are the dominant spawn.',
    ],
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
    image: null,
    biomes: ['temperate_humid', 'hot_humid'],
    drops: [
      { item: 'hide',      confirmed: true },
      { item: 'deer_meat', confirmed: true },
      { item: 'bone',      confirmed: true },
      { item: 'horn',      confirmed: true },
    ],
    taming: { status: 'unknown' },
    huntingTips: [
      'Larger flee radius than rabbit — approach from cover and wait for it to face away before closing.',
      'Horn (antler) is a confirmed separate drop from bone; worth the extra effort over rabbit farming.',
      'Mid-range weapons can drop it before it hits full sprint speed.',
    ],
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
    image: null,
    biomes: ['temperate_humid', 'cold_humid'],
    drops: [
      { item: 'hide', confirmed: true },
      { item: 'bone', confirmed: true },
      { item: 'horn', confirmed: true },
    ],
    taming: { status: 'unknown' },
    huntingTips: [
      'Defensive — only aggros if startled or cornered. Keep an escape route open and do not box it in until you are ready to fight.',
      'Its talons deal significant close-range damage; kite at medium range or open with a stagger move.',
      'Active in low-light biomes — a torch reduces its ambush advantage in dense canopy terrain.',
    ],
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
    image: null,
    biomes: ['hot_arid', 'volcanic'],
    drops: [
      { item: 'hide', confirmed: true },
      { item: 'bone', confirmed: true },
    ],
    taming: { status: 'unknown' },
    abilities: ['gas emission on aggro'],
    huntingTips: [
      'Aggros when you enter its territory radius — watch for territorial markers and approach the boundary deliberately.',
      'Gas cloud releases on aggro trigger, not on death. Back off immediately when it charges and wait for the cloud to disperse.',
      'Ranged weapons avoid the gas cloud entirely. Melee hunters should close in only after the cloud clears.',
    ],
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
    image: null,
    biomes: ['temperate_arid', 'hot_arid'],
    drops: [
      { item: 'hide', confirmed: true },
      { item: 'bone', confirmed: true },
    ],
    taming: { status: 'unknown' },
    abilities: ['curl armor', 'roll charge'],
    huntingTips: [
      'When it curls into its armored ball, switch to a blunt or high-impact weapon — standard blades lose effectiveness against the plating.',
      'Roll charge is telegraphed by a brief windup animation; sidestep to avoid rather than blocking.',
      'Early-game hunting is tedious without the right tools — bring something with bonus impact damage if targeting these regularly.',
    ],
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
    image: null,
    biomes: ['cold_humid', 'temperate_humid', 'hot_arid'],
    drops: [
      { item: 'hide', confirmed: true },
      { item: 'bone', confirmed: true },
    ],
    taming: { status: 'unknown' },
    abilities: ['pack hunting', 'active aggro'],
    huntingTips: [
      'Pack hunter — always scan for companions before engaging. Twilight update reduced spawn groups to ~8 but they still swarm.',
      'Breaks into active pursuit on detection; find high ground or break line of sight to interrupt aggro before re-engaging.',
      'Use terrain choke points to isolate and fight one at a time — open flat ground is their home turf advantage.',
      'Do not engage in open fields without an exit plan.',
    ],
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
    image: null,
    biomes: ['hot_arid', 'volcanic'],
    drops: [
      { item: 'hide', confirmed: true },
      { item: 'bone', confirmed: true },
    ],
    taming: { status: 'unknown' },
    abilities: ['flight', 'dive attack'],
    huntingTips: [
      'Dive-attacks from high altitude — watch for its shadow directly below as a pre-attack tell.',
      'Ranged weapon required for aerial intercept; melee is only viable when it commits to its dive and is within reach.',
      'Rock overhangs and dense canopy break its dive line — use terrain cover to force it into closer engagement.',
    ],
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
    image: null,
    biomes: ['hot_humid', 'temperate_humid'],
    drops: [
      { item: 'hide', confirmed: true },
      { item: 'bone', confirmed: true },
    ],
    taming: { status: 'unknown' },
    abilities: ['flock swarm', 'coordinated aggro'],
    huntingTips: [
      'Twilight update fixed their pathing — they now coherently swarm rather than circle. Do not expect them to lose your position.',
      'Target the outermost members first to thin numbers before the flock closes distance.',
      'AoE or spread-shot weapons are most effective against tightly clustered groups.',
      'Sprinting through the flock breaks formation and creates openings to isolate single targets.',
    ],
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
    c.drops.some((d) => d.item.toLowerCase().includes(q)) ||
    c.huntingTips?.some((t) => t.toLowerCase().includes(q)),
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
