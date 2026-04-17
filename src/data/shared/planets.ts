/**
 * planets.ts
 * Known Stars Reach planets and their biome types.
 * One concern: canonical planet list shared across tools (Atlas, Directory, etc.).
 *
 * Source: public dev blogs, patch notes, community testing.
 * Values may change as the game develops.
 */

export type BiomeType =
  | 'terrestrial'
  | 'desert'
  | 'arctic'
  | 'volcanic'
  | 'ocean'
  | 'jungle'
  | 'gas_giant'
  | 'unknown';

export interface Planet {
  id: string;
  name: string;
  biome: BiomeType;
  /** Whether this planet is confirmed in playtest builds */
  confirmed: boolean;
  description?: string;
}

export const PLANETS: Planet[] = [
  {
    id: 'araxis',
    name: 'Araxis',
    biome: 'terrestrial',
    confirmed: true,
    description: 'A temperate terrestrial world with diverse ecosystems.',
  },
  {
    id: 'cinder',
    name: 'Cinder',
    biome: 'volcanic',
    confirmed: true,
    description: 'A volcanic world rich in rare mineral deposits.',
  },
  {
    id: 'frostveil',
    name: 'Frostveil',
    biome: 'arctic',
    confirmed: true,
    description: 'A frozen world with vast ice plains and subterranean caves.',
  },
  {
    id: 'verdania',
    name: 'Verdania',
    biome: 'jungle',
    confirmed: true,
    description: 'A lush jungle world teeming with rare flora and fauna.',
  },
  {
    id: 'sandreach',
    name: 'Sandreach',
    biome: 'desert',
    confirmed: true,
    description: 'An arid desert world with sandstorms and ancient ruins.',
  },
  {
    id: 'pelagos',
    name: 'Pelagos',
    biome: 'ocean',
    confirmed: false,
    description: 'A water-covered world with floating platforms and deep trenches.',
  },
  {
    id: 'unknown',
    name: 'Unknown / Other',
    biome: 'unknown',
    confirmed: true,
  },
] as const;

/** Get all confirmed planets */
export function getConfirmedPlanets(): Planet[] {
  return PLANETS.filter((p) => p.confirmed);
}

/** Get planet by id */
export function getPlanet(id: string): Planet | undefined {
  return PLANETS.find((p) => p.id === id);
}

/** Get planet display name by id (falls back to id) */
export function getPlanetName(id: string): string {
  return getPlanet(id)?.name ?? id;
}

/** Biome display labels */
export const BIOME_LABELS: Record<BiomeType, string> = {
  terrestrial: 'Terrestrial',
  desert: 'Desert',
  arctic: 'Arctic',
  volcanic: 'Volcanic',
  ocean: 'Ocean',
  jungle: 'Jungle',
  gas_giant: 'Gas Giant',
  unknown: 'Unknown',
};

/** Biome color accents for UI */
export const BIOME_COLORS: Record<BiomeType, string> = {
  terrestrial: 'text-green-400',
  desert: 'text-amber-400',
  arctic: 'text-sky-300',
  volcanic: 'text-orange-500',
  ocean: 'text-blue-400',
  jungle: 'text-emerald-400',
  gas_giant: 'text-violet-400',
  unknown: 'text-slate-500',
};
