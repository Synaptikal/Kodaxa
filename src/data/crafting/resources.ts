/**
 * resources.ts
 * Resource definitions for Stars Reach crafting.
 * One concern: defining all known resources with base stats.
 *
 * Base stats are educated defaults — actual stats vary per planet.
 * The optimizer lets players input their scouted values.
 *
 * Sources:
 *   - GUNC Wiki (Lathing page — confirmed resource names)
 *   - starsreach.com/mining-in-stars-reach/ (resource categories)
 *   - starsreach.com/physics-midterm/ (stat system: P/Q/R/V)
 */

import type { Resource } from '@/types/crafting';
import { statsFrom } from '@/lib/crafting/stat-optimizer';

/** All known resources in Stars Reach */
export const RESOURCES: Resource[] = [
  // ── Metals (confirmed from Lathing wiki) ────────────────────────
  { id: 'iron', name: 'Iron', category: 'metal', tier: 1, baseStats: statsFrom(40, 50, 70, 60), description: 'Common metal. Strong and heavy. Stats vary by planet.' },
  { id: 'copper', name: 'Copper', category: 'metal', tier: 1, baseStats: statsFrom(70, 50, 40, 65), description: 'Conductive metal. High potential for energy delivery.' },
  { id: 'aluminum', name: 'Aluminum', category: 'metal', tier: 1, baseStats: statsFrom(50, 55, 35, 75), description: 'Lightweight metal. Highly versatile and workable.' },
  { id: 'zinc', name: 'Zinc', category: 'metal', tier: 1, baseStats: statsFrom(45, 50, 45, 60), description: 'Reactive metal. Used in alloys like brass.' },
  { id: 'nickel', name: 'Nickel', category: 'metal', tier: 2, baseStats: statsFrom(55, 60, 65, 50), description: 'Durable metal. Good resilience and quality.' },
  { id: 'chromium', name: 'Chromium', category: 'metal', tier: 2, baseStats: statsFrom(50, 75, 70, 45), description: 'High-quality metal. Excellent for decorative items.' },
  { id: 'cobalt', name: 'Cobalt', category: 'metal', tier: 2, baseStats: statsFrom(65, 60, 60, 50), description: 'Magnetic metal. Creates blue sheens on crafted items.' },
  { id: 'manganese', name: 'Manganese', category: 'metal', tier: 2, baseStats: statsFrom(55, 55, 60, 55), description: 'Alloying metal. Balanced stats.' },
  { id: 'tungsten', name: 'Tungsten', category: 'metal', tier: 3, baseStats: statsFrom(60, 70, 85, 35), description: 'Extremely resilient metal. High melting point.' },
  { id: 'titanium', name: 'Titanium', category: 'metal', tier: 3, baseStats: statsFrom(55, 75, 80, 50), description: 'Strong and light. Stats vary significantly by planet.' },
  { id: 'gold', name: 'Gold', category: 'metal', tier: 3, baseStats: statsFrom(80, 85, 30, 70), description: 'Precious metal. Consistently high quality across all worlds.' },

  // ── Stones (confirmed from Lathing wiki) ────────────────────────
  { id: 'granite', name: 'Granite', category: 'stone', baseStats: statsFrom(30, 60, 75, 30), description: 'Igneous rock. Very resilient.' },
  { id: 'marble', name: 'Marble', category: 'stone', baseStats: statsFrom(35, 80, 50, 40), description: 'Metamorphic rock. High quality.' },
  { id: 'slate', name: 'Slate', category: 'stone', baseStats: statsFrom(30, 55, 65, 35), description: 'Fine-grained stone. Good for flat surfaces.' },
  { id: 'sandstone', name: 'Sandstone', category: 'stone', baseStats: statsFrom(25, 45, 40, 50), description: 'Sedimentary rock. Workable but less resilient.' },
  { id: 'diorite', name: 'Diorite', category: 'stone', baseStats: statsFrom(30, 55, 70, 30), description: 'Coarse-grained igneous rock.' },
  { id: 'gabbro', name: 'Gabbro', category: 'stone', baseStats: statsFrom(35, 50, 75, 25), description: 'Dense dark igneous rock.' },
  { id: 'gneiss', name: 'Gneiss', category: 'stone', baseStats: statsFrom(30, 60, 65, 35), description: 'Banded metamorphic rock.' },
  { id: 'breccia', name: 'Breccia', category: 'stone', baseStats: statsFrom(25, 40, 55, 30), description: 'Coarse sedimentary rock with angular fragments.' },
  { id: 'conglomerate', name: 'Conglomerate', category: 'stone', baseStats: statsFrom(25, 45, 50, 35), description: 'Rounded-fragment sedimentary rock.' },
  { id: 'limestone', name: 'Limestone', category: 'stone', baseStats: statsFrom(35, 50, 45, 45), description: 'Common sedimentary rock.' },
  { id: 'sedimentary_rock', name: 'Sedimentary Rock', category: 'stone', baseStats: statsFrom(30, 45, 45, 40), description: 'Generic sedimentary stone. Used in oil production.' },

  // ── Processed / Special ─────────────────────────────────────────
  { id: 'glass', name: 'Glass', category: 'processed', baseStats: statsFrom(40, 70, 20, 60), description: 'Produced from melted sand. Fragile but high quality.' },
  { id: 'carbon', name: 'Carbon', category: 'processed', baseStats: statsFrom(75, 65, 55, 50), description: 'Versatile element. Used in steel alloys.' },
  { id: 'anti_gravium', name: 'Anti-Gravium', category: 'processed', baseStats: statsFrom(90, 80, 40, 60), description: 'Exotic material. Very high potential and quality.' },
  { id: 'clay', name: 'Clay', category: 'processed', baseStats: statsFrom(30, 50, 35, 70), description: 'Made from Chalky or Laterite soils. Very workable.' },
  { id: 'ceramic', name: 'Ceramic', category: 'processed', baseStats: statsFrom(35, 65, 60, 30), description: 'Fired from clay. Good quality and resilience.' },
  { id: 'oil', name: 'Oil', category: 'liquid', baseStats: statsFrom(80, 50, 20, 65), description: 'Created from any sedimentary rock. High energy potential.' },
  { id: 'plastic', name: 'Plastic', category: 'processed', baseStats: statsFrom(50, 45, 45, 80), description: 'Derived from oil. Extremely versatile.' },

  // ── Soils ───────────────────────────────────────────────────────
  { id: 'soil', name: 'Soil', category: 'soil', baseStats: statsFrom(40, 40, 30, 50), description: 'Basic soil.' },
  { id: 'chalky_soil', name: 'Chalky Soil', category: 'soil', baseStats: statsFrom(35, 45, 25, 55), description: 'Can be converted to clay.' },
  { id: 'laterite_soil', name: 'Laterite Soil', category: 'soil', baseStats: statsFrom(35, 40, 30, 55), description: 'Iron-rich soil. Can be converted to clay.' },

  // ── Tiered generic metals (used in decor recipes) ───────────────
  { id: 'tier1_metal', name: 'Tier 1 Metal', category: 'metal', tier: 1, baseStats: statsFrom(45, 50, 50, 60), description: 'Any tier 1 metal (Iron, Copper, Aluminum, Zinc).' },
  { id: 'tier2_metal', name: 'Tier 2 Metal', category: 'metal', tier: 2, baseStats: statsFrom(55, 60, 60, 50), description: 'Any tier 2 metal (Nickel, Chromium, Cobalt, Manganese).' },
  { id: 'tier3_metal', name: 'Tier 3 Metal', category: 'metal', tier: 3, baseStats: statsFrom(65, 75, 65, 50), description: 'Any tier 3 metal (Tungsten, Titanium, Gold).' },

  // ── Wood ────────────────────────────────────────────────────────
  { id: 'wood', name: 'Wood', category: 'organic', baseStats: statsFrom(45, 50, 40, 65), description: 'Harvested from trees. Workable and renewable.' },
];

/** Map for fast resource lookups */
export function getResourceMap(): Map<string, Resource> {
  return new Map(RESOURCES.map((r) => [r.id, r]));
}

/** Get resources filtered by category */
export function getResourcesByCategory(category: string): Resource[] {
  return RESOURCES.filter((r) => r.category === category);
}

/** Get resources filtered by tier */
export function getResourcesByTier(tier: number): Resource[] {
  return RESOURCES.filter((r) => r.tier === tier);
}
