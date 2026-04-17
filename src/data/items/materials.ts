/**
 * materials.ts
 * Item data for inorganic materials: metals, alloys, gemstones, rocks, soils, gases.
 * One concern: raw material definitions sourced from the GUNC reference document.
 *
 * Sources:
 *   - StarsReach_GUNC_Reference.md §4.1–4.6
 */

import type { Item } from '@/types/items';

// ── Raw Metals ───────────────────────────────────────────────────────

export const METAL_ITEMS: Item[] = [
  // Tier 1 — Very Common
  { id: 'bauxite',         name: 'Bauxite',         category: 'metal', subcategory: 'raw_metal', tier: 1, rarity: 'very_common', description: 'Very common ore. Primary source of Aluminum via refining.', sources: ['mining'], confirmed: true },
  { id: 'iron',            name: 'Iron',            category: 'metal', subcategory: 'raw_metal', tier: 1, rarity: 'very_common', description: 'Abundant and durable. Foundation of most basic alloys.', sources: ['mining'], confirmed: true },
  { id: 'magnesium',       name: 'Magnesium',       category: 'metal', subcategory: 'raw_metal', tier: 1, rarity: 'very_common', description: 'Lightweight metal. Burns intensely when ignited.', sources: ['mining'], confirmed: true },
  { id: 'magnetized_iron', name: 'Magnetized Iron', category: 'metal', subcategory: 'raw_metal', tier: 1, rarity: 'very_common', description: 'Iron with a natural magnetic field. Required for Steel production.', sources: ['mining'], confirmed: true },
  { id: 'titanium',        name: 'Titanium',        category: 'metal', subcategory: 'raw_metal', tier: 1, rarity: 'very_common', description: 'Strong and lightweight. Stats vary significantly by planet.', sources: ['mining'], confirmed: true },
  // Tier 2 — Common
  { id: 'chromium',        name: 'Chromium',        category: 'metal', subcategory: 'raw_metal', tier: 2, rarity: 'common', description: 'High-quality metal used in steel alloys and decorative pieces.', sources: ['mining', 'refining'], confirmed: true },
  { id: 'copper',          name: 'Copper',          category: 'metal', subcategory: 'raw_metal', tier: 2, rarity: 'common', description: 'Conductive metal. High potential. Key ingredient in Brass and Bronze.', sources: ['mining', 'refining'], confirmed: true },
  { id: 'manganese',       name: 'Manganese',       category: 'metal', subcategory: 'raw_metal', tier: 2, rarity: 'common', description: 'Balanced alloying metal. Used in Manganese Steel.', sources: ['mining'], confirmed: true },
  { id: 'nickel',          name: 'Nickel',          category: 'metal', subcategory: 'raw_metal', tier: 2, rarity: 'common', description: 'Durable metal with good resilience. Used in Stainless Steel.', sources: ['mining', 'refining'], confirmed: true },
  { id: 'zinc',            name: 'Zinc',            category: 'metal', subcategory: 'raw_metal', tier: 2, rarity: 'common', description: 'Reactive metal. Key ingredient in Brass alongside Copper.', sources: ['mining', 'refining'], confirmed: true },
  // Tier 3 — Uncommon
  { id: 'bismuth',         name: 'Bismuth',         category: 'metal', subcategory: 'raw_metal', tier: 3, rarity: 'uncommon', description: 'Dense metal with a distinctive crystalline structure.', sources: ['mining'], confirmed: true },
  { id: 'cobalt',          name: 'Cobalt',          category: 'metal', subcategory: 'raw_metal', tier: 3, rarity: 'uncommon', description: 'Magnetic metal. Required for Cobalt Steel. Creates blue sheens on items.', sources: ['mining', 'refining'], confirmed: true },
  { id: 'lead',            name: 'Lead',            category: 'metal', subcategory: 'raw_metal', tier: 3, rarity: 'uncommon', description: 'Dense soft metal. Used in Pewter alloy.', sources: ['mining', 'refining'], confirmed: true },
  { id: 'tin',             name: 'Tin',             category: 'metal', subcategory: 'raw_metal', tier: 3, rarity: 'uncommon', description: 'Soft metal. Refined from Cassiterite. Used in Bronze and Pewter.', sources: ['mining', 'refining'], confirmed: true },
  { id: 'tungsten',        name: 'Tungsten',        category: 'metal', subcategory: 'raw_metal', tier: 3, rarity: 'uncommon', description: 'Extremely resilient metal with the highest melting point of any metal.', sources: ['mining'], confirmed: true },
  // Tier 4 — Rare
  { id: 'cadmium',         name: 'Cadmium',         category: 'metal', subcategory: 'raw_metal', tier: 4, rarity: 'rare', description: 'Toxic rare metal. Basis for the Cadmiumin alloy.', sources: ['mining'], confirmed: true },
  { id: 'lithium',         name: 'Lithium',         category: 'metal', subcategory: 'raw_metal', tier: 4, rarity: 'rare', description: 'Highly reactive alkali metal. Refined from Spodumene. Used in Lithalum.', sources: ['mining', 'refining'], confirmed: true },
  { id: 'mercury',         name: 'Mercury',         category: 'metal', subcategory: 'raw_metal', tier: 4, rarity: 'rare', description: 'Liquid metal at room temperature. Refined from Cinnabar.', sources: ['mining', 'refining'], confirmed: true },
  { id: 'silver',          name: 'Silver',          category: 'metal', subcategory: 'raw_metal', tier: 4, rarity: 'rare', description: 'Precious metal with high conductivity. Refined from Argentite.', sources: ['mining', 'refining'], confirmed: true },
  { id: 'uranium',         name: 'Uranium',         category: 'metal', subcategory: 'raw_metal', tier: 4, rarity: 'rare', description: 'Radioactive rare metal. Refined from Pitchblende or Carnotite. Produces Radon gas as byproduct.', sources: ['mining', 'refining'], confirmed: true },
  // Tier 5 — Scarce
  { id: 'anti_gravium',    name: 'Anti-Gravium',    category: 'metal', subcategory: 'raw_metal', tier: 5, rarity: 'scarce', description: 'Exotic material with anti-gravitational properties. Required for Gravity Gun and Grav Mesh.', sources: ['mining'], confirmed: true },
  { id: 'antimatter',      name: 'Antimatter',      category: 'metal', subcategory: 'raw_metal', tier: 5, rarity: 'scarce', description: 'Rarest known substance in the galaxy. Extremely high energy potential.', sources: ['mining'], confirmed: true },
  { id: 'gold',            name: 'Gold',            category: 'metal', subcategory: 'raw_metal', tier: 5, rarity: 'scarce', description: 'Precious metal. Consistently high quality across all worlds. Used in Electrum.', sources: ['mining'], confirmed: true },
  { id: 'palladium',       name: 'Palladium',       category: 'metal', subcategory: 'raw_metal', tier: 5, rarity: 'scarce', description: 'Rare catalytic metal. Basis for Palladiance alloy.', sources: ['mining'], confirmed: true },
  { id: 'platinum',        name: 'Platinum',        category: 'metal', subcategory: 'raw_metal', tier: 5, rarity: 'scarce', description: 'Dense precious metal. Extremely high resilience and quality.', sources: ['mining'], confirmed: true },
];

// ── Alloys ───────────────────────────────────────────────────────────

export const ALLOY_ITEMS: Item[] = [
  { id: 'brass',            name: 'Brass',            category: 'alloy', subcategory: 'metal_alloy', description: 'Copper + Zinc. Good conductivity and workability.', sources: ['refining'], station: 'refinery', confirmed: true },
  { id: 'bronze',           name: 'Bronze',           category: 'alloy', subcategory: 'metal_alloy', description: 'Copper + Tin. Durable general-purpose alloy.', sources: ['refining'], station: 'refinery', confirmed: true },
  { id: 'cadmiumin',        name: 'Cadmiumin',        category: 'alloy', subcategory: 'metal_alloy', description: 'Cadmium-based exotic alloy with unusual optical properties.', sources: ['refining'], station: 'refinery', confirmed: true },
  { id: 'chromium_steel',   name: 'Chromium Steel',   category: 'alloy', subcategory: 'metal_alloy', description: 'Chromium + Iron. Harder and more corrosion-resistant than plain steel.', sources: ['refining'], station: 'refinery', confirmed: true },
  { id: 'cobalt_steel',     name: 'Cobalt Steel',     category: 'alloy', subcategory: 'metal_alloy', description: 'Carbon + Cobalt + Tungsten. High-temperature performance alloy.', sources: ['refining'], station: 'refinery', confirmed: true },
  { id: 'electrum',         name: 'Electrum',         category: 'alloy', subcategory: 'metal_alloy', description: 'Silver + Gold blend. Naturally occurring in some worlds; also refined.', sources: ['refining'], station: 'refinery', confirmed: true },
  { id: 'lithalum',         name: 'Lithalum',         category: 'alloy', subcategory: 'metal_alloy', description: 'Lithium-based lightweight alloy with high energy potential.', sources: ['refining'], station: 'refinery', confirmed: true },
  { id: 'manganese_steel',  name: 'Manganese Steel',  category: 'alloy', subcategory: 'metal_alloy', description: 'Manganese + Iron. Excellent wear resistance under impact.', sources: ['refining'], station: 'refinery', confirmed: true },
  { id: 'nickel_silver',    name: 'Nickel Silver',    category: 'alloy', subcategory: 'metal_alloy', description: 'Nickel + Silver blend. High quality and aesthetic appeal.', sources: ['refining'], station: 'refinery', confirmed: true },
  { id: 'palladiance',      name: 'Palladiance',      category: 'alloy', subcategory: 'metal_alloy', description: 'Palladium-based exotic alloy. Extremely rare and valuable.', sources: ['refining'], station: 'refinery', confirmed: true },
  { id: 'pewter',           name: 'Pewter',           category: 'alloy', subcategory: 'metal_alloy', description: 'Lead + Tin blend. Soft, workable alloy used in decorative items.', sources: ['refining'], station: 'refinery', confirmed: true },
  { id: 'stainless_steel',  name: 'Stainless Steel',  category: 'alloy', subcategory: 'metal_alloy', description: 'Chromium + Iron + Nickel. Highly corrosion-resistant.', sources: ['refining'], station: 'refinery', confirmed: true },
  { id: 'steel',            name: 'Steel',            category: 'alloy', subcategory: 'metal_alloy', description: 'Coke + Iron + Magnetized Iron. The workhorse structural alloy.', sources: ['refining'], station: 'refinery', confirmed: true },
  { id: 'stellite',         name: 'Stellite',         category: 'alloy', subcategory: 'metal_alloy', description: 'Cobalt-based high-temperature alloy. Exceptional hardness.', sources: ['refining'], station: 'refinery', confirmed: true },
  { id: 'triadite',         name: 'Triadite',         category: 'alloy', subcategory: 'metal_alloy', rarity: 'exotic', description: 'Exotic triple-metal alloy. Composition classified.', sources: ['refining'], station: 'refinery', confirmed: true },
  { id: 'tungsten_carbide', name: 'Tungsten Carbide', category: 'alloy', subcategory: 'metal_alloy', description: 'Tungsten + Carbon. Extremely hard. Used in cutting and drilling tools.', sources: ['refining'], station: 'refinery', confirmed: true },
  { id: 'ual',              name: 'U-Al (UAl)',        category: 'alloy', subcategory: 'metal_alloy', description: 'Uranium + Aluminum blend. High energy potential. Used in Go Juice medicine.', sources: ['refining'], station: 'refinery', confirmed: true },
  { id: 'uralex',           name: 'Uralex',           category: 'alloy', subcategory: 'metal_alloy', rarity: 'exotic', description: 'Uranium-based exotic alloy with remarkable energy storage properties.', sources: ['refining'], station: 'refinery', confirmed: true },
];

// ── Gemstones ────────────────────────────────────────────────────────

export const GEMSTONE_ITEMS: Item[] = [
  // Common
  { id: 'agate',         name: 'Agate',         category: 'gemstone', subcategory: 'gem_common',   rarity: 'common',   description: 'Banded silicate mineral. Found in many geological formations.', sources: ['mining'], confirmed: true },
  { id: 'amethyst',      name: 'Amethyst',      category: 'gemstone', subcategory: 'gem_common',   rarity: 'common',   description: 'Violet quartz variety. Widely distributed across planets.', sources: ['mining'], confirmed: true },
  { id: 'garnet',        name: 'Garnet',        category: 'gemstone', subcategory: 'gem_common',   rarity: 'common',   description: 'Deep red silicate mineral. Good versatility in crafting.', sources: ['mining'], confirmed: true },
  { id: 'quartz',        name: 'Quartz',        category: 'gemstone', subcategory: 'gem_common',   rarity: 'common',   description: 'Abundant crystalline mineral. Do not confuse with Quartz Crystal (processed).', sources: ['mining'], confirmed: true },
  { id: 'salt',          name: 'Salt',          category: 'gemstone', subcategory: 'gem_common',   rarity: 'common',   description: 'Mineral halite deposits. Used in cooking and industrial processes.', sources: ['mining'], confirmed: true },
  { id: 'zircon',        name: 'Zircon',        category: 'gemstone', subcategory: 'gem_common',   rarity: 'common',   description: 'Zirconium silicate. High resilience for a common gem.', sources: ['mining'], confirmed: true },
  // Uncommon
  { id: 'jade',          name: 'Jade',          category: 'gemstone', subcategory: 'gem_uncommon', rarity: 'uncommon', description: 'Dense ornamental stone. Valued for its quality and appearance.', sources: ['mining'], confirmed: true },
  { id: 'lapis_lazuli',  name: 'Lapis Lazuli',  category: 'gemstone', subcategory: 'gem_uncommon', rarity: 'uncommon', description: 'Deep-blue metamorphic rock. High quality rating.', sources: ['mining'], confirmed: true },
  { id: 'opal',          name: 'Opal',          category: 'gemstone', subcategory: 'gem_uncommon', rarity: 'uncommon', description: 'Amorphous silica with shifting colour play. Good versatility.', sources: ['mining'], confirmed: true },
  { id: 'topaz',         name: 'Topaz',         category: 'gemstone', subcategory: 'gem_uncommon', rarity: 'uncommon', description: 'Silicate mineral. Balanced stats across P/Q/R/V.', sources: ['mining'], confirmed: true },
  { id: 'tourmaline',    name: 'Tourmaline',    category: 'gemstone', subcategory: 'gem_uncommon', rarity: 'uncommon', description: 'Complex boron silicate. Variable composition produces varied stats.', sources: ['mining'], confirmed: true },
  { id: 'turquoise',     name: 'Turquoise',     category: 'gemstone', subcategory: 'gem_uncommon', rarity: 'uncommon', description: 'Copper-bearing phosphate mineral. Prized for crafting inlays.', sources: ['mining'], confirmed: true },
  // Rare
  { id: 'aquamarine',    name: 'Aquamarine',    category: 'gemstone', subcategory: 'gem_rare',     rarity: 'rare',     description: 'Blue-green beryl variety. High quality and resilience.', sources: ['mining'], confirmed: true },
  { id: 'diamond',       name: 'Diamond',       category: 'gemstone', subcategory: 'gem_rare',     rarity: 'rare',     description: 'Hardest natural material. Requires high-Q Chronophaser to extract from host rock.', sources: ['mining'], confirmed: true },
  { id: 'emerald',       name: 'Emerald',       category: 'gemstone', subcategory: 'gem_rare',     rarity: 'rare',     description: 'Green beryl. Excellent quality stat. Rare across most planets.', sources: ['mining'], confirmed: true },
  { id: 'ruby',          name: 'Ruby',          category: 'gemstone', subcategory: 'gem_rare',     rarity: 'rare',     description: 'Red corundum. High potential and quality values.', sources: ['mining'], confirmed: true },
  { id: 'sapphire',      name: 'Sapphire',      category: 'gemstone', subcategory: 'gem_rare',     rarity: 'rare',     description: 'Blue corundum. Exceptional resilience.', sources: ['mining'], confirmed: true },
  // Exotic
  { id: 'armorcryst',    name: 'Armorcryst',    category: 'gemstone', subcategory: 'gem_exotic',   rarity: 'exotic',   description: 'Exotic crystalline material with extraordinary structural integrity.', sources: ['mining'], confirmed: true },
  { id: 'vesuvianite',   name: 'Vesuvianite',   category: 'gemstone', subcategory: 'gem_exotic',   rarity: 'exotic',   description: 'Rare volcanic silicate of unknown planetary origin.', sources: ['mining'], confirmed: true },
  { id: 'quartz_crystal',name: 'Quartz Crystal',category: 'gemstone', subcategory: 'gem_uncommon', rarity: 'uncommon', description: 'Processed crystalline quartz. Distinct from raw Quartz gemstone.', sources: ['refining'], station: 'refinery', confirmed: true },
];

// ── Rocks ────────────────────────────────────────────────────────────

export const ROCK_ITEMS: Item[] = [
  // Igneous
  { id: 'basalt',       name: 'Basalt',       category: 'rock', subcategory: 'igneous',      description: 'Fine-grained volcanic rock. Abundant on geologically active planets.', sources: ['mining'], confirmed: true },
  { id: 'diorite',      name: 'Diorite',      category: 'rock', subcategory: 'igneous',      description: 'Coarse-grained intrusive rock. Black-and-white speckled appearance.', sources: ['mining'], confirmed: true },
  { id: 'gabbro',       name: 'Gabbro',       category: 'rock', subcategory: 'igneous',      description: 'Dense dark intrusive rock. High resilience.', sources: ['mining'], confirmed: true },
  { id: 'granite',      name: 'Granite',      category: 'rock', subcategory: 'igneous',      description: 'Coarse-grained igneous rock. Very resilient. Common building material.', sources: ['mining'], confirmed: true },
  { id: 'obsidian',     name: 'Obsidian',     category: 'rock', subcategory: 'igneous',      description: 'Volcanic glass. Forms when lava cools rapidly. Sharp fracture edges.', sources: ['mining'], confirmed: true },
  { id: 'pumice',       name: 'Pumice',       category: 'rock', subcategory: 'igneous',      description: 'Highly porous volcanic rock. Lowest density of any rock type.', sources: ['mining'], confirmed: true },
  { id: 'rhyolite',     name: 'Rhyolite',     category: 'rock', subcategory: 'igneous',      description: 'Fine-grained volcanic equivalent of granite.', sources: ['mining'], confirmed: true },
  // Metamorphic
  { id: 'gneiss',       name: 'Gneiss',       category: 'rock', subcategory: 'metamorphic',  description: 'Banded high-grade metamorphic rock. Contains Sulfide deposits.', sources: ['mining'], confirmed: true },
  { id: 'marble',       name: 'Marble',       category: 'rock', subcategory: 'metamorphic',  description: 'Metamorphosed limestone. High quality. Favoured for construction.', sources: ['mining'], confirmed: true },
  { id: 'quartzite',    name: 'Quartzite',    category: 'rock', subcategory: 'metamorphic',  description: 'Metamorphosed sandstone. Very hard and resilient.', sources: ['mining'], confirmed: true },
  { id: 'schist',       name: 'Schist',       category: 'rock', subcategory: 'metamorphic',  description: 'Medium-grade metamorphic rock. Contains Sulfide mineral veins.', sources: ['mining'], confirmed: true },
  { id: 'slate',        name: 'Slate',        category: 'rock', subcategory: 'metamorphic',  description: 'Fine-grained foliated rock. Splits into flat sheets. Good for paving.', sources: ['mining'], confirmed: true },
  // Sedimentary
  { id: 'breccia',      name: 'Breccia',      category: 'rock', subcategory: 'sedimentary',  description: 'Angular-fragment sedimentary rock. Less cohesive than conglomerate.', sources: ['mining'], confirmed: true },
  { id: 'chalk',        name: 'Chalk',        category: 'rock', subcategory: 'sedimentary',  description: 'Soft white limestone composed of shell fragments.', sources: ['mining'], confirmed: true },
  { id: 'chert',        name: 'Chert',        category: 'rock', subcategory: 'sedimentary',  description: 'Fine-grained silica rock. Very hard. Contains flint nodules.', sources: ['mining'], confirmed: true },
  { id: 'coal',         name: 'Coal',         category: 'rock', subcategory: 'sedimentary',  description: 'Combustible sedimentary rock. Refined into Coke. Also yields Methane gas.', sources: ['mining'], confirmed: true },
  { id: 'conglomerate', name: 'Conglomerate', category: 'rock', subcategory: 'sedimentary',  description: 'Rounded-fragment sedimentary rock. Moderate resilience.', sources: ['mining'], confirmed: true },
  { id: 'dolomite',     name: 'Dolomite',     category: 'rock', subcategory: 'sedimentary',  description: 'Carbonate rock similar to limestone. Used in industrial processing.', sources: ['mining'], confirmed: true },
  { id: 'limestone',    name: 'Limestone',    category: 'rock', subcategory: 'sedimentary',  description: 'Common carbonate rock. Refinery source of Fluorine gas. Yields Quicklime.', sources: ['mining'], confirmed: true },
  { id: 'sandstone',    name: 'Sandstone',    category: 'rock', subcategory: 'sedimentary',  description: 'Sand-grain sedimentary rock. Yields Silica Ore. Workable but less resilient.', sources: ['mining'], confirmed: true },
  { id: 'shale',        name: 'Shale',        category: 'rock', subcategory: 'sedimentary',  description: 'Fine-grained clastic rock. Yields Oil and Methane gas.', sources: ['mining'], confirmed: true },
  // Exotic
  { id: 'pyroxene',     name: 'Pyroxene',     category: 'rock', subcategory: 'exotic_rock',  rarity: 'exotic', description: 'Exotic rock-forming mineral of uncertain planetary origin.', sources: ['mining'], confirmed: true },
];

// ── Soils ────────────────────────────────────────────────────────────

export const SOIL_ITEMS: Item[] = [
  // Carbon soils
  { id: 'black_soil',    name: 'Black Soil',    category: 'soil', subcategory: 'carbon_soil', description: 'Rich carbon-heavy soil. Excellent for farming and composting.', sources: ['mining', 'farming'], confirmed: true },
  { id: 'peat',          name: 'Peat',          category: 'soil', subcategory: 'carbon_soil', description: 'Partially decomposed organic matter. Found in bogs and wetlands.', sources: ['mining'], confirmed: true },
  // Clay soils
  { id: 'chalky_soil',   name: 'Chalky Soil',   category: 'soil', subcategory: 'clay_soil',   description: 'Calcium-rich soil. Can be converted to Clay at the Refinery.', sources: ['mining'], confirmed: true },
  { id: 'clay',          name: 'Clay',          category: 'soil', subcategory: 'clay_soil',   description: 'Plastic, workable soil. Refined from Chalky or Laterite soil. Used in Ceramic production.', sources: ['mining', 'refining'], confirmed: true },
  { id: 'laterite_soil', name: 'Laterite Soil', category: 'soil', subcategory: 'clay_soil',   description: 'Iron-rich red soil. Found in tropical biomes. Can be converted to Clay.', sources: ['mining'], confirmed: true },
  // Rocky soils
  { id: 'gravel',        name: 'Gravel',        category: 'soil', subcategory: 'rocky_soil',  description: 'Loose rock fragments. Common surface layer on rocky planets.', sources: ['mining'], confirmed: true },
  // Sandy soils
  { id: 'sand',          name: 'Sand',          category: 'soil', subcategory: 'sandy_soil',  description: 'Fine mineral particles. Lithification converts sand back to Sandstone.', sources: ['mining'], confirmed: true },
  { id: 'sandy_dirt',    name: 'Sandy Dirt',    category: 'soil', subcategory: 'sandy_soil',  description: 'Mixed sand and organic matter. Transitional soil type.', sources: ['mining'], confirmed: true },
  // Silty soils
  { id: 'alluvial_soil', name: 'Alluvial Soil', category: 'soil', subcategory: 'silty_soil',  description: 'Deposited by water flow. High mineral content from upstream erosion.', sources: ['mining'], confirmed: true },
  { id: 'loam',          name: 'Loam',          category: 'soil', subcategory: 'silty_soil',  description: 'Balanced sand-silt-clay mix. Ideal for farming.', sources: ['mining'], confirmed: true },
  { id: 'mud',           name: 'Mud',           category: 'soil', subcategory: 'silty_soil',  description: 'Waterlogged silty soil. Found near rivers, swamps, and marshes.', sources: ['mining'], confirmed: true },
  { id: 'red_soil',      name: 'Red Soil',      category: 'soil', subcategory: 'silty_soil',  description: 'Iron oxide-rich silty soil. Common on arid and tropical worlds.', sources: ['mining'], confirmed: true },
  { id: 'silt',          name: 'Silt',          category: 'soil', subcategory: 'silty_soil',  description: 'Fine-grained sediment. Intermediate particle size between sand and clay.', sources: ['mining'], confirmed: true },
];

// ── Gases ────────────────────────────────────────────────────────────

export const GAS_ITEMS: Item[] = [
  // Inert
  { id: 'helium',   name: 'Helium',   category: 'gas', subcategory: 'inert_gas',    description: 'Lightest inert gas. Found in subsurface pockets. Required for crafting some tools.', sources: ['gas_harvest'], confirmed: true },
  { id: 'neon',     name: 'Neon',     category: 'gas', subcategory: 'inert_gas',    description: 'Noble gas. Used in lighting and specialized equipment.', sources: ['gas_harvest'], confirmed: true },
  { id: 'nitrogen', name: 'Nitrogen', category: 'gas', subcategory: 'inert_gas',    description: 'Atmospheric gas. Relatively safe to harvest but still requires care underground.', sources: ['gas_harvest'], confirmed: true },
  { id: 'radon',    name: 'Radon',    category: 'gas', subcategory: 'inert_gas',    description: 'Radioactive noble gas. Byproduct of Uranium ore refining. Mining hazard.', sources: ['gas_harvest', 'refining'], confirmed: true },
  { id: 'xenon',    name: 'Xenon',    category: 'gas', subcategory: 'inert_gas',    description: 'Heavy noble gas. Found in deep subsurface pockets. Rare.', sources: ['gas_harvest'], confirmed: true },
  // Reactive — also mining hazards
  { id: 'ammonia',  name: 'Ammonia',  category: 'gas', subcategory: 'reactive_gas', description: 'Reactive gas found in certain soils. Mining hazard. Source: some flora types.', sources: ['gas_harvest'], confirmed: true },
  { id: 'chlorine', name: 'Chlorine', category: 'gas', subcategory: 'reactive_gas', description: 'Toxic reactive gas. Found in subsurface rock pockets. Mining hazard.', sources: ['gas_harvest'], confirmed: true },
  { id: 'fluorine', name: 'Fluorine', category: 'gas', subcategory: 'reactive_gas', description: 'Corrosive reactive gas. Refined from Limestone. Mining hazard.', sources: ['gas_harvest', 'refining'], confirmed: true },
  { id: 'hydrogen', name: 'Hydrogen', category: 'gas', subcategory: 'reactive_gas', description: 'Explosive gas. Found in rock pockets. Mining hazard. Used in energy applications.', sources: ['gas_harvest'], confirmed: true },
  { id: 'methane',  name: 'Methane',  category: 'gas', subcategory: 'reactive_gas', description: 'Flammable gas. Refined from Coal or Shale. Explosive mining hazard.', sources: ['gas_harvest', 'refining'], confirmed: true },
];
