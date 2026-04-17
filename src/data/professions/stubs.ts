/**
 * stubs.ts
 * Stub profession definitions for trees without detailed public data yet.
 * One concern: placeholder data for known-but-undetailed professions.
 *
 * Each stub has a root node so the profession appears in the sidebar
 * and can be part of build planning even before full tree data exists.
 *
 * Sources:
 *   - Unofficial Wiki: https://www.starsreach.wiki/Professions
 *   - Massively OP skill tree articles (Sep 2025, Apr 2026)
 *   - Open Horizon Update patch notes
 */

import type { Profession, ProfessionCategory } from '@/types/skill-tree';

interface StubDef {
  id: string;
  name: string;
  category: ProfessionCategory;
  description: string;
  toolName: string;
  implemented: boolean;
  branchesTo?: string[];
  branchesFrom?: string[];
}

const STUB_DEFINITIONS: StubDef[] = [
  // Scouting (ranger sub-trees not already detailed)
  { id: 'orienteering', name: 'Orienteering', category: 'scouting', description: 'Hiking, navigation, pitons, stamina management for cliff traversal.', toolName: 'Ranger Kit', implemented: true, branchesFrom: ['ranger'], branchesTo: ['wilderness_survival'] },
  { id: 'cartography', name: 'Cartography', category: 'scouting', description: 'Waypoints, surveying, planetary maps, distance markers.', toolName: 'Survey Tool', implemented: true, branchesFrom: ['ranger'], branchesTo: ['wilderness_survival'] },
  { id: 'wilderness_survival', name: 'Wilderness Survival', category: 'scouting', description: 'Advanced ranger profession. Heat/cold resistance, poison resistance, extreme climate survival.', toolName: 'Ranger Kit', implemented: true, branchesFrom: ['camping', 'concealment', 'orienteering', 'cartography'] },

  // Combat
  { id: 'assault_rifle', name: 'Assault Rifle', category: 'combat', description: 'Primary ranged combat weapon tree.', toolName: 'Assault Rifle', implemented: true },
  { id: 'pistol', name: 'Pistol', category: 'combat', description: 'Skills: Double Tap, Ricochet, Unload, Double Time, Pistol Whip.', toolName: 'Pistol', implemented: true },
  { id: 'grenade_launcher', name: 'Grenade Launcher', category: 'combat', description: 'Skills: Cluster, Repulsor, Implosion, Uplift.', toolName: 'Grenade Launcher', implemented: true },
  { id: 'laserwhip', name: 'Laserwhip', category: 'combat', description: 'Melee/ranged hybrid. Lasso, Laserstrike, Entangle (Bola).', toolName: 'Laserwhip', implemented: true },
  { id: 'healix', name: 'Healix', category: 'combat', description: 'Healing weapon. Includes Siphon (beam-based health drain).', toolName: 'Healix', implemented: true },
  { id: 'combat_engineering', name: 'Combat Engineering', category: 'combat', description: 'Traps, turrets, and defensive structures for combat zones.', toolName: 'Engineering Kit', implemented: false },

  // Crafting
  { id: 'artisan_weaponsmith', name: 'Weaponsmithing', category: 'crafting', description: 'Craft blasters, melee weapons. 5 handgun types: Cryostar, Atomizer, Pulsar, Spitfire, Voltstar.', toolName: 'Crafting Bench', implemented: true },
  { id: 'artisan_tailor', name: 'Tailoring', category: 'crafting', description: 'Craft armor, clothing, and appearance items.', toolName: 'Crafting Bench', implemented: true },
  { id: 'artisan_woodworking', name: 'Woodworking', category: 'crafting', description: 'Craft wooden structures, furniture, tool handles. Wood Slurry recipe.', toolName: 'Crafting Bench', implemented: true },
  { id: 'artisan_metallurgy', name: 'Metallurgy', category: 'crafting', description: 'Refine ores into ingots and alloys. Resource origin affects stats.', toolName: 'Crafting Bench', implemented: true },
  { id: 'machining', name: 'Machining', category: 'crafting', description: 'Precision crafting for mechanical components and advanced gear.', toolName: 'Lathe', implemented: false },

  // Harvesting
  { id: 'mineralogist', name: 'Mineralogist', category: 'harvesting', description: 'Prospecting, mining minerals/gems/gases. Uses Extractor tool.', toolName: 'Extractor', implemented: true },
  { id: 'botanist', name: 'Botanist', category: 'harvesting', description: 'Plant life, forestry, farming, herbalism.', toolName: 'Harvesting Tool', implemented: true },
  { id: 'farming', name: 'Farming', category: 'harvesting', description: 'Plant seeds, manage crops, harvest food ingredients.', toolName: 'Trowel', implemented: false },

  // Social
  { id: 'leadership', name: 'Leadership', category: 'social', description: 'Group buffs, formations, crowd control. Unlocks Politician at high levels.', toolName: 'Rally Banner', implemented: true, branchesTo: ['politician'] },
  { id: 'politician', name: 'Politician', category: 'social', description: 'Create and manage public spaces. Advanced leadership profession.', toolName: 'Rally Banner', implemented: false, branchesFrom: ['leadership'] },
  { id: 'entertainer_music', name: 'Music', category: 'social', description: 'Play instruments. XP earned when performances benefit other players.', toolName: 'Instrument', implemented: false },
  { id: 'entertainer_dance', name: 'Dancing', category: 'social', description: 'Dance performances for buffs. XP earned when your dancing benefits others.', toolName: 'Performance Kit', implemented: false },
  { id: 'journalism', name: 'Journalism', category: 'social', description: 'Writing, reporting, and documentation. Galactopedia contributions.', toolName: 'Data Pad', implemented: false },

  // Science
  { id: 'xenobiology', name: 'Xenobiology', category: 'science', description: 'Gather creature genetics, train and breed pets.', toolName: 'Scanner', implemented: true },
  { id: 'medical', name: 'Medical', category: 'science', description: 'Active healing, craft medicines. Ties into Healix weapon tree.', toolName: 'Med Kit', implemented: true },
  { id: 'pharmacology', name: 'Pharmacology', category: 'science', description: 'Create drugs, stims, and advanced medical supplies.', toolName: 'Lab Kit', implemented: false },

  // Infrastructure
  { id: 'civil_engineering', name: 'Civil Engineering', category: 'infrastructure', description: 'Build roads, bridges, and public infrastructure.', toolName: 'Engineering Tool', implemented: false },
  { id: 'merchanting', name: 'Merchanting', category: 'infrastructure', description: 'Business skills: buying, selling, shop management, transport logistics.', toolName: 'Ledger', implemented: true },
  { id: 'cooking', name: 'Cooking', category: 'infrastructure', description: 'Prepare food that provides buffs. Chef profession.', toolName: 'Cooking Kit', implemented: false },
];

/** Generate stub Profession objects from definitions */
export const PROFESSION_STUBS: Profession[] = STUB_DEFINITIONS.map((def) => ({
  id: def.id,
  name: def.name,
  description: def.description,
  category: def.category,
  tool: {
    name: def.toolName,
    professionId: def.id,
    icon: def.id,
  },
  implemented: def.implemented,
  branchesTo: def.branchesTo ?? [],
  branchesFrom: def.branchesFrom ?? [],
  // Each stub gets a single root node
  nodes: [
    {
      id: `${def.id}.base`,
      name: `${def.name} Basics`,
      description: `Foundation skills for ${def.name}. Full tree data pending.`,
      professionId: def.id,
      position: { x: 400, y: 0 },
      prerequisites: def.branchesFrom?.length
        ? [`${def.branchesFrom[0]}.unlock_${def.id}`]
        : [],
      tier: 0,
      implemented: def.implemented,
    },
  ],
  edges: [],
}));
