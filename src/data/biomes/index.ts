/**
 * biomes/index.ts
 * Biome Field Guide database — Stars Reach procedural biomes.
 * One concern: static biome data aggregated for the field guide browser.
 *
 * All biome IDs are the canonical slugs referenced by creature entries
 * in src/data/creatures/index.ts. Keep in sync with creature `biomes` arrays.
 *
 * Sources:
 *   - Twilight Update patch notes (starsreach.com/twilight-update-notes)
 *   - Brave New Worlds Update (starsreach.com/brave-new-worlds-update)
 *   - Massively OP coverage (April 2026)
 *
 * All ecological detail (specific creatures, resources) is grounded in
 * published patch notes; secondary features are marked confirmed: false
 * where they are extrapolated from community observation.
 */

import type { Biome } from '@/types/biomes';

export const BIOMES: Biome[] = [
  {
    id: 'cold_arid',
    name: 'Cold Arid',
    aliases: ['Tundra', 'Steppe', 'Cold Desert'],
    temperature: 'cold',
    moisture: 'arid',
    description:
      'Open wind-scoured plains at low temperature with scarce precipitation. Sparse ground cover, permafrost layers, and long sight lines make this the classic exposed-biome challenge.',
    terrain: ['permafrost', 'gravel flats', 'wind-polished outcrops'],
    flora: ['lichen', 'hardy moss', 'low shrubs'],
    creatures: [],
    resources: ['ice_ore', 'stone', 'cold_crystal'],
    hazard: 'moderate',
    hazards: ['hypothermia at night', 'visibility loss in gusts'],
    preparation: ['insulated gear', 'cold-resistant canteen'],
    confirmed: false,
    sources: ['community-extrapolation'],
  },
  {
    id: 'cold_humid',
    name: 'Cold Humid',
    aliases: ['Boreal', 'Snow Forest', 'Taiga'],
    temperature: 'cold',
    moisture: 'humid',
    description:
      'Snow-laden forests and bog systems at freezing temperatures. Dense canopies muffle sound and shrink sight lines, favoring ambush predators. Owldeer are documented here.',
    terrain: ['snowpack', 'frozen bogs', 'conifer stands'],
    flora: ['pine analogs', 'snowberry', 'ice lichen'],
    creatures: ['owldeer', 'prowler'],
    resources: ['timber', 'resin', 'bone_chips'],
    hazard: 'moderate',
    hazards: ['hypothermia', 'low-visibility ambush terrain'],
    preparation: ['insulated gear', 'melee or close-range ranged weapon'],
    confirmed: true,
    sources: ['twilight-update'],
  },
  {
    id: 'temperate_arid',
    name: 'Temperate Arid',
    aliases: ['Grassland', 'Savanna', 'Plains'],
    temperature: 'temperate',
    moisture: 'arid',
    description:
      'Rolling grasslands and scattered woodland at mild temperature and low moisture. The most forgiving biome for new settlers; home to rabbits, velocirabbits, and armored ballhogs.',
    terrain: ['grass plains', 'rocky outcrops', 'seasonal riverbeds'],
    flora: ['grasses', 'scrub brush', 'scattered hardwoods'],
    creatures: ['rabbit', 'velocirabbit', 'ballhog', 'prowler'],
    resources: ['stone', 'iron_ore', 'hide', 'timber'],
    hazard: 'low',
    preparation: ['basic starter tools', 'water canteen'],
    confirmed: true,
    sources: ['twilight-update'],
  },
  {
    id: 'temperate_humid',
    name: 'Temperate Humid',
    aliases: ['Temperate Forest', 'Woodland'],
    temperature: 'temperate',
    moisture: 'humid',
    description:
      'Broadleaf forests and river valleys under mild, wet weather. The most biodiverse early-game biome; nearly every confirmed prey species spawns here, drawing predators in turn.',
    terrain: ['broadleaf forest', 'river valleys', 'soft soil'],
    flora: ['broadleaf trees', 'ferns', 'berry bushes', 'mushrooms'],
    creatures: ['rabbit', 'velocirabbit', 'deer', 'owldeer', 'prowler', 'kharvix'],
    resources: ['timber', 'iron_ore', 'clay', 'hide'],
    hazard: 'low',
    hazards: ['prowler pack ambush at night'],
    preparation: ['basic starter tools', 'torch for low-light canopy'],
    confirmed: true,
    sources: ['twilight-update'],
  },
  {
    id: 'hot_arid',
    name: 'Hot Arid',
    aliases: ['Desert', 'Badlands'],
    temperature: 'hot',
    moisture: 'arid',
    description:
      'Sand seas, dunes, and sun-baked badlands. Water is scarce and heatstroke is a constant risk. Skysharks patrol the thermals; gashogs nest near gas pockets; ballhogs and prowlers travel the scrubline.',
    terrain: ['dunes', 'dry canyons', 'salt flats'],
    flora: ['cactus analogs', 'desert grass', 'heat-flowering bloom'],
    creatures: ['ballhog', 'prowler', 'skyshark', 'gashog'],
    resources: ['stone', 'copper_ore', 'crystal', 'salt'],
    hazard: 'high',
    hazards: ['heatstroke', 'dehydration', 'sandstorms', 'gas pockets near gashog dens'],
    preparation: [
      'heat-resistant gear',
      'extra water',
      'ranged weapon for skysharks',
      'avoid gashog gas clouds at melee range',
    ],
    confirmed: true,
    sources: ['twilight-update', 'brave-new-worlds'],
  },
  {
    id: 'hot_humid',
    name: 'Hot Humid',
    aliases: ['Jungle', 'Rainforest', 'Wetland'],
    temperature: 'hot',
    moisture: 'humid',
    description:
      'Dense rainforests and bayous under heavy rainfall. Rich soils and prolific flora, but visibility is poor and kharvix flocks harass travellers. Not as immediately dangerous as the hot arid biome, but fatigue compounds fast.',
    terrain: ['dense canopy', 'mud flats', 'hanging vines', 'flooded basins'],
    flora: ['broadleaf canopy', 'vines', 'flowering fruits', 'fungal mats'],
    creatures: ['rabbit', 'deer', 'kharvix'],
    resources: ['hardwood', 'rubber_analog', 'exotic_fruit', 'clay'],
    hazard: 'moderate',
    hazards: ['kharvix swarm aggro', 'fatigue/humidity', 'flash floods'],
    preparation: ['breathable gear', 'ranged weapon for flocks', 'machete or cutting tool'],
    confirmed: true,
    sources: ['twilight-update'],
  },

  // ── Overlay / specialty biomes ───────────────────────────────────────

  {
    id: 'volcanic',
    name: 'Volcanic',
    aliases: ['Magma Fields', 'Caldera'],
    temperature: null,
    moisture: null,
    description:
      'Active lava flows, sulfur vents, and ash plains. An overlay biome that can appear on any temperature band when a planet has active geology. Rare mineral rewards, extreme risk.',
    terrain: ['lava flows', 'ash plains', 'obsidian shelves', 'sulfur vents'],
    flora: ['ember moss', 'sulfur bloom'],
    creatures: ['gashog', 'skyshark'],
    resources: ['obsidian', 'sulfur', 'rare_ore', 'magma_crystal'],
    hazard: 'extreme',
    hazards: ['burn damage on lava', 'toxic gas vents', 'ash inhalation', 'collapsing crust'],
    preparation: [
      'heat-resistant gear tier 2+',
      'gas mask',
      'ranged tools only — avoid prolonged stationary work',
    ],
    confirmed: true,
    sources: ['twilight-update'],
  },
  {
    id: 'coastal',
    name: 'Coastal',
    aliases: ['Shoreline', 'Beach', 'Tidal'],
    temperature: null,
    moisture: null,
    description:
      'Tidal zones where any biome meets open water. Salt-rich resources and distinct flora. Tidal cycles alter harvestable flora and exposed resources on short timers.',
    terrain: ['beach', 'rocky shore', 'tidal flats', 'reef shallows'],
    flora: ['seagrass', 'kelp', 'coral analogs', 'salt flower'],
    creatures: [],
    resources: ['salt', 'shell', 'pearl_analog', 'sand'],
    hazard: 'low',
    hazards: ['tidal surges at high tide'],
    preparation: ['waterproof pouch', 'harvesting tool'],
    confirmed: false,
    sources: ['community-extrapolation'],
  },
  {
    id: 'subterranean',
    name: 'Subterranean',
    aliases: ['Caves', 'Deep Hollows'],
    temperature: null,
    moisture: null,
    description:
      'Cave systems, natural tunnels, and deep hollows beneath any surface biome. Richest source of ore veins and crystal nodes, but pathing is dangerous and line of sight is limited.',
    terrain: ['cave networks', 'crystal grottos', 'underground rivers'],
    flora: ['glow fungi', 'cave lichen'],
    creatures: [],
    resources: ['iron_ore', 'copper_ore', 'gem_crystal', 'rare_ore'],
    hazard: 'moderate',
    hazards: ['fall damage', 'low light', 'pocket gas buildup'],
    preparation: ['light source', 'rope or climbing gear', 'mapped entrances'],
    confirmed: false,
    sources: ['community-extrapolation'],
  },
];

// ── Query helpers ─────────────────────────────────────────────────────

export function getAllBiomes(): Biome[] {
  return BIOMES;
}

export function getBiomeById(id: string): Biome | undefined {
  return BIOMES.find((b) => b.id === id);
}

export function getBiomeName(id: string): string {
  return getBiomeById(id)?.name ?? id.replace(/_/g, ' ');
}

export function getGridBiomes(): Biome[] {
  return BIOMES.filter((b) => b.temperature !== null && b.moisture !== null);
}

export function getOverlayBiomes(): Biome[] {
  return BIOMES.filter((b) => b.temperature === null || b.moisture === null);
}

export function searchBiomes(query: string): Biome[] {
  const q = query.toLowerCase().trim();
  if (!q) return BIOMES;
  return BIOMES.filter(
    (b) =>
      b.name.toLowerCase().includes(q) ||
      b.aliases?.some((a) => a.toLowerCase().includes(q)) ||
      b.description.toLowerCase().includes(q) ||
      b.flora.some((f) => f.toLowerCase().includes(q)) ||
      b.resources.some((r) => r.toLowerCase().includes(q)) ||
      b.creatures.some((c) => c.toLowerCase().includes(q)),
  );
}

export function getBiomeStats() {
  return {
    total: BIOMES.length,
    confirmed: BIOMES.filter((b) => b.confirmed).length,
    gridBiomes: getGridBiomes().length,
    overlayBiomes: getOverlayBiomes().length,
  };
}
