/**
 * organics.ts
 * Item data for biological materials: flora, fungi, fruit, wood, animal drops, seedlings.
 * One concern: organic item definitions sourced from the GUNC reference document.
 *
 * Sources:
 *   - StarsReach_GUNC_Reference.md §4.7
 */

import type { Item } from '@/types/items';

// ── Animal Drops ─────────────────────────────────────────────────────

export const ANIMAL_ITEMS: Item[] = [
  // Meat types
  { id: 'meat_raw_alien',   name: 'Raw Alien Meat',   category: 'animal', subcategory: 'meat', description: 'Meat from unknown alien creature types. Properties vary by source.', sources: ['hunting'], confirmed: true },
  { id: 'meat_avian',       name: 'Avian Meat',       category: 'animal', subcategory: 'meat', description: 'Meat from bird-like creatures. Lean protein source.', sources: ['hunting'], confirmed: true },
  { id: 'meat_carnivore',   name: 'Carnivore Meat',   category: 'animal', subcategory: 'meat', description: 'Meat from predatory creatures. High energy content.', sources: ['hunting'], confirmed: true },
  { id: 'meat_fish',        name: 'Fish Meat',        category: 'animal', subcategory: 'meat', description: 'Meat from aquatic creatures. Found in ocean and marsh biomes.', sources: ['hunting'], confirmed: true },
  { id: 'meat_herbivore',   name: 'Herbivore Meat',   category: 'animal', subcategory: 'meat', description: 'Meat from plant-eating creatures. Most common animal drop.', sources: ['hunting'], confirmed: true },
  { id: 'meat_hyper',       name: 'Hyper Meat',       category: 'animal', subcategory: 'meat', description: 'Meat from hyperactive creature types. Unusual biochemistry.', sources: ['hunting'], confirmed: true },
  { id: 'meat_insect',      name: 'Insect Meat',      category: 'animal', subcategory: 'meat', description: 'Meat from insectoid creatures. High protein density.', sources: ['hunting'], confirmed: true },
  { id: 'meat_reptile',     name: 'Reptile Meat',     category: 'animal', subcategory: 'meat', description: 'Meat from reptilian creatures. Found on arid and volcanic planets.', sources: ['hunting'], confirmed: true },
  { id: 'meat_shellfish',   name: 'Shellfish Meat',   category: 'animal', subcategory: 'meat', description: 'Meat from crustacean-type creatures. Found in coastal and ocean biomes.', sources: ['hunting'], confirmed: true },
  // Non-skeletal
  { id: 'hide',             name: 'Hide',             category: 'animal', subcategory: 'hide',     description: 'Skin/hide from creatures. Used in crafting armour and leather goods.', sources: ['hunting'], confirmed: true },
  // Skeletal
  { id: 'bone',             name: 'Bone',             category: 'animal', subcategory: 'skeletal', description: 'Skeletal remains from creatures. Used in crafting and medicine.', sources: ['hunting'], confirmed: true },
  { id: 'horn',             name: 'Horn',             category: 'animal', subcategory: 'skeletal', description: 'Horn or antler material from creatures. Harder than bone.', sources: ['hunting'], confirmed: true },
];

// ── Fruit ────────────────────────────────────────────────────────────

export const FRUIT_ITEMS: Item[] = [
  { id: 'apple',        name: 'Apple',        category: 'flora', subcategory: 'fruit', description: 'Common fruit. Used in Flame Out and Thaw Bones medicine.', sources: ['harvesting', 'farming'], confirmed: true },
  { id: 'banana',       name: 'Banana',       category: 'flora', subcategory: 'fruit', description: 'Tropical fruit. High energy content.', sources: ['harvesting', 'farming'], confirmed: true },
  { id: 'blackberry',   name: 'Blackberry',   category: 'flora', subcategory: 'fruit', description: 'Small dark berry. Grows on bushes in temperate biomes.', sources: ['harvesting', 'farming'], confirmed: true },
  { id: 'blueberry',    name: 'Blueberry',    category: 'flora', subcategory: 'fruit', description: 'Small blue berry. Found in boreal and temperate forests.', sources: ['harvesting', 'farming'], confirmed: true },
  { id: 'cactus_fruit', name: 'Cactus Fruit', category: 'flora', subcategory: 'fruit', description: 'Succulent fruit from cactus plants. Found in desert biomes.', sources: ['harvesting', 'farming'], confirmed: true },
  { id: 'coconut',      name: 'Coconut',      category: 'flora', subcategory: 'fruit', description: 'Large tropical seed-fruit. Found in tropical and coastal biomes.', sources: ['harvesting', 'farming'], confirmed: true },
  { id: 'goji_berry',   name: 'Goji Berry',   category: 'flora', subcategory: 'fruit', description: 'Nutrient-dense red berry. Found in temperate and mountain biomes.', sources: ['harvesting', 'farming'], confirmed: true },
  { id: 'lemon',        name: 'Lemon',        category: 'flora', subcategory: 'fruit', description: 'Acidic citrus fruit. Useful in medicine recipes.', sources: ['harvesting', 'farming'], confirmed: true },
  { id: 'lime',         name: 'Lime',         category: 'flora', subcategory: 'fruit', description: 'Small green citrus fruit. Similar uses to Lemon.', sources: ['harvesting', 'farming'], confirmed: true },
  { id: 'stimberry',    name: 'Stimberry',    category: 'flora', subcategory: 'fruit', description: 'Stimulant-bearing berry. Key ingredient in Go Juice medicine.', sources: ['harvesting', 'farming'], confirmed: true },
  { id: 'strawberry',   name: 'Strawberry',   category: 'flora', subcategory: 'fruit', description: 'Sweet red fruit. Common in temperate biomes. Grown from seedlings.', sources: ['harvesting', 'farming'], confirmed: true },
];

// ── Fungi ────────────────────────────────────────────────────────────

export const FUNGUS_ITEMS: Item[] = [
  { id: 'alien_mushroom',   name: 'Alien Mushroom',   category: 'flora', subcategory: 'fungus', description: 'Exotic mushroom of alien origin. Unusual biochemical properties.', sources: ['harvesting', 'farming'], confirmed: true },
  { id: 'amanita',          name: 'Amanita',          category: 'flora', subcategory: 'fungus', description: 'Cap mushroom with distinctive appearance. Used in Stamina Boosters.', sources: ['harvesting', 'farming'], confirmed: true },
  { id: 'brown_shimeji',    name: 'Brown Shimeji',    category: 'flora', subcategory: 'fungus', description: 'Cluster-forming brown mushroom. Common in boreal and forest biomes.', sources: ['harvesting', 'farming'], confirmed: true },
  { id: 'chanterelle',      name: 'Chanterelle',      category: 'flora', subcategory: 'fungus', description: 'Golden funnel-shaped mushroom. Found in temperate forests.', sources: ['harvesting', 'farming'], confirmed: true },
  { id: 'fairy_morel',      name: 'Fairy Morel',      category: 'flora', subcategory: 'fungus', description: 'Delicate honeycomb-capped mushroom. Valued for medicine crafting.', sources: ['harvesting', 'farming'], confirmed: true },
  { id: 'golden_poplar',    name: 'Golden Poplar',    category: 'flora', subcategory: 'fungus', description: 'Bright yellow shelf fungus found on decaying wood.', sources: ['harvesting', 'farming'], confirmed: true },
  { id: 'king_stropheria',  name: 'King Stropheria',  category: 'flora', subcategory: 'fungus', description: 'Large wine-red mushroom. Key ingredient in Cure All medicine.', sources: ['harvesting', 'farming'], confirmed: true },
];

// ── Fiber ────────────────────────────────────────────────────────────

export const FIBER_ITEMS: Item[] = [
  { id: 'cactus_fiber', name: 'Cactus Fiber', category: 'flora', subcategory: 'fiber', description: 'Tough fibrous material from cactus plants. Used in Thaw Bones medicine.', sources: ['harvesting', 'farming'], confirmed: true },
];

// ── Wood ─────────────────────────────────────────────────────────────

export const WOOD_ITEMS: Item[] = [
  { id: 'bamboo',          name: 'Bamboo',          category: 'flora', subcategory: 'wood', description: 'Fast-growing woody grass. Lightweight but strong. Harvested with Xyloslicer.', sources: ['harvesting', 'farming'], confirmed: true },
  { id: 'dark_hard_wood',  name: 'Dark Hard Wood',  category: 'flora', subcategory: 'wood', description: 'Dense hardwood from dark-barked trees. High resilience.', sources: ['harvesting'], confirmed: true },
  { id: 'dark_soft_wood',  name: 'Dark Soft Wood',  category: 'flora', subcategory: 'wood', description: 'Softer wood from dark-barked trees. Easier to work than hard variants.', sources: ['harvesting'], confirmed: true },
  { id: 'light_hard_wood', name: 'Light Hard Wood', category: 'flora', subcategory: 'wood', description: 'Dense hardwood from light-barked trees. Good quality and resilience.', sources: ['harvesting'], confirmed: true },
  { id: 'light_soft_wood', name: 'Light Soft Wood', category: 'flora', subcategory: 'wood', description: 'Softer wood from pale-barked trees. Most workable wood type.', sources: ['harvesting'], confirmed: true },
];

// ── Stock Flora ───────────────────────────────────────────────────────

export const STOCK_FLORA_ITEMS: Item[] = [
  { id: 'amanita_stock',              name: 'Amanita Stock',              category: 'flora', subcategory: 'stock_flora', description: 'Root stock for Amanita mushroom cultivation. Planted to establish a growth colony.', sources: ['harvesting'], confirmed: true },
  { id: 'brown_shimeji_stock',        name: 'Brown Shimeji Stock',        category: 'flora', subcategory: 'stock_flora', description: 'Root stock for Brown Shimeji mushroom cultivation.', sources: ['harvesting'], confirmed: true },
  { id: 'cactus_root_stock',          name: 'Cactus Root Stock',          category: 'flora', subcategory: 'stock_flora', description: 'Root stock for cactus propagation. Planted in desert biome homesteads.', sources: ['harvesting'], confirmed: true },
  { id: 'chanterelle_stock',          name: 'Chanterelle Stock',          category: 'flora', subcategory: 'stock_flora', description: 'Root stock for Chanterelle mushroom cultivation.', sources: ['harvesting'], confirmed: true },
  { id: 'fairy_morel_stock',          name: 'Fairy Morel Stock',          category: 'flora', subcategory: 'stock_flora', description: 'Root stock for Fairy Morel mushroom cultivation.', sources: ['harvesting'], confirmed: true },
  { id: 'flowering_cactus_root_stock',name: 'Flowering Cactus Root Stock',category: 'flora', subcategory: 'stock_flora', description: 'Root stock for flowering cactus variety. Ornamental and functional.', sources: ['harvesting'], confirmed: true },
  { id: 'golden_poplar_stock',        name: 'Golden Poplar Stock',        category: 'flora', subcategory: 'stock_flora', description: 'Root stock for Golden Poplar fungus cultivation.', sources: ['harvesting'], confirmed: true },
  { id: 'king_stropheria_stock',      name: 'King Stropheria Stock',      category: 'flora', subcategory: 'stock_flora', description: 'Root stock for King Stropheria mushroom cultivation.', sources: ['harvesting'], confirmed: true },
  { id: 'lumipora_root_stock',        name: 'Lumipora Root Stock',        category: 'flora', subcategory: 'stock_flora', description: 'Root stock for bioluminescent Lumipora flora.', sources: ['harvesting'], confirmed: true },
  { id: 'yucca_palm_root_stock',      name: 'Yucca Palm Root Stock',      category: 'flora', subcategory: 'stock_flora', description: 'Root stock for Yucca Palm. Found in arid and desert biomes.', sources: ['harvesting'], confirmed: true },
];

// ── Seedlings ─────────────────────────────────────────────────────────
// Named specimens from the reference doc. Additional variants exist in-game.

export const SEEDLING_ITEMS: Item[] = [
  { id: 'seedling_agave',           name: 'Agave',           category: 'seedling', description: 'Succulent plant. Desert biome. Source of fiber and liquid.', sources: ['harvesting', 'farming'], confirmed: true },
  { id: 'seedling_aloe',            name: 'Aloe',            category: 'seedling', description: 'Medicinal succulent. Used in medicine crafting.', sources: ['harvesting', 'farming'], confirmed: true },
  { id: 'seedling_arctic_lupine',   name: 'Arctic Lupine',   category: 'seedling', description: 'Hardy flowering plant. Arctic and alpine biomes.', sources: ['harvesting', 'farming'], confirmed: true },
  { id: 'seedling_barrel_cactus',   name: 'Barrel Cactus',   category: 'seedling', description: 'Cylindrical cactus. Desert biome. Produces Cactus Fruit.', sources: ['harvesting', 'farming'], confirmed: true },
  { id: 'seedling_blackberry_bush', name: 'Blackberry Bush', category: 'seedling', description: 'Thorny shrub producing Blackberries. Temperate biomes.', sources: ['harvesting', 'farming'], confirmed: true },
  { id: 'seedling_boston_fern',     name: 'Boston Fern',     category: 'seedling', description: 'Lush fern variety. Temperate and tropical biomes.', sources: ['harvesting', 'farming'], confirmed: true },
  { id: 'seedling_bromeliad',       name: 'Bromeliad',       category: 'seedling', description: 'Tropical flowering plant. Collects moisture in its rosette.', sources: ['harvesting', 'farming'], confirmed: true },
  { id: 'seedling_cactus',          name: 'Cactus',          category: 'seedling', description: 'Standard cactus. Desert biome staple. Produces Cactus Fiber and Fruit.', sources: ['harvesting', 'farming'], confirmed: true },
  { id: 'seedling_campanula',       name: 'Campanula',       category: 'seedling', description: 'Bell-shaped flowering plant. Temperate and alpine biomes.', sources: ['harvesting', 'farming'], confirmed: true },
  { id: 'seedling_cordyline',       name: 'Cordyline',       category: 'seedling', description: 'Tropical shrub with long blade-like leaves.', sources: ['harvesting', 'farming'], confirmed: true },
  { id: 'seedling_dragon_leaf',     name: 'Dragon Leaf',     category: 'seedling', description: 'Large exotic leaf plant. Tropical biomes.', sources: ['harvesting', 'farming'], confirmed: true },
  { id: 'seedling_hosta',           name: 'Hosta',           category: 'seedling', description: 'Shade-tolerant foliage plant. Temperate forest floors.', sources: ['harvesting', 'farming'], confirmed: true },
  { id: 'seedling_ilima',           name: 'Ilima',           category: 'seedling', description: 'Small flowering shrub. Coastal and tropical biomes.', sources: ['harvesting', 'farming'], confirmed: true },
  { id: 'seedling_mangrove_palm',   name: 'Mangrove Palm',   category: 'seedling', description: 'Coastal palm adapted to waterlogged soil. Mangrove biomes.', sources: ['harvesting', 'farming'], confirmed: true },
  { id: 'seedling_monstera',        name: 'Monstera',        category: 'seedling', description: 'Large-leafed tropical plant with distinctive split leaves.', sources: ['harvesting', 'farming'], confirmed: true },
  { id: 'seedling_pampas_grass',    name: 'Pampas Grass',    category: 'seedling', description: 'Tall ornamental grass. Prairie and grassland biomes.', sources: ['harvesting', 'farming'], confirmed: true },
  { id: 'seedling_pineapple',       name: 'Pineapple',       category: 'seedling', description: 'Bromeliad producing edible fruit. Tropical biomes.', sources: ['harvesting', 'farming'], confirmed: true },
  { id: 'seedling_prickly_pear',    name: 'Prickly Pear',    category: 'seedling', description: 'Flat-pad cactus. Desert biome. Produces edible fruit.', sources: ['harvesting', 'farming'], confirmed: true },
  { id: 'seedling_pumpkin',         name: 'Pumpkin',         category: 'seedling', description: 'Large gourd. Farmable. Used in food crafting.', sources: ['harvesting', 'farming'], confirmed: true },
  { id: 'seedling_strawberry',      name: 'Strawberry Plant',category: 'seedling', description: 'Low-growing plant producing Strawberries. Temperate biomes.', sources: ['harvesting', 'farming'], confirmed: true },
  { id: 'seedling_wheat',           name: 'Wheat',           category: 'seedling', description: 'Grain crop. Farmable staple. Used in food recipes.', sources: ['harvesting', 'farming'], confirmed: true },
  // Gas-producing flora (noted in reference doc)
  { id: 'seedling_emberbloom_torch',  name: 'Emberbloom Torch',  category: 'seedling', description: 'Flora that emits reactive gases. Handle with care near open flames.', sources: ['harvesting'], confirmed: true },
  { id: 'seedling_blushing_bonnet',   name: 'Blushing Bonnet',   category: 'seedling', description: 'Cap-shaped flora. Emits reactive gases when disturbed.', sources: ['harvesting'], confirmed: true },
  { id: 'seedling_hexavine_spires',   name: 'Hexavine Spires',   category: 'seedling', description: 'Alien spire-shaped flora. Releases reactive gas compounds.', sources: ['harvesting'], confirmed: true },
  { id: 'seedling_skunk_cabbage',     name: 'Skunk Cabbage',     category: 'seedling', description: 'Wetland plant. Emits reactive gases. Found in marsh biomes.', sources: ['harvesting'], confirmed: true },
  { id: 'seedling_brimmed_bonnet',    name: 'Brimmed Bonnet',    category: 'seedling', description: 'Flora that emits inert noble gases. Safe to handle.', sources: ['harvesting'], confirmed: true },
  { id: 'seedling_lilac_dandy',       name: 'Lilac Dandy',       category: 'seedling', description: 'Flowering plant that releases inert gases.', sources: ['harvesting'], confirmed: true },
  { id: 'seedling_luminweave_tendril',name: 'Luminweave Tendril',category: 'seedling', description: 'Bioluminescent vine-type flora. Emits inert gas.', sources: ['harvesting'], confirmed: true },
  { id: 'seedling_witchs_ringlet',    name: "Witch's Ringlet",   category: 'seedling', description: 'Ring-forming alien fungal flora. Source of inert gas.', sources: ['harvesting'], confirmed: true },
];
