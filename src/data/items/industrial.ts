/**
 * industrial.ts
 * Item data for industrial products and intermediate processing materials.
 * One concern: processed, refined, and intermediate material definitions.
 *
 * Sources:
 *   - StarsReach_GUNC_Reference.md §4.8
 */

import type { Item } from '@/types/items';

// ── Industrial Products (finished processed goods) ───────────────────

export const INDUSTRIAL_PRODUCT_ITEMS: Item[] = [
  { id: 'cement',      name: 'Cement',      category: 'industrial', subcategory: 'industrial_product', description: 'Construction binding agent. Produced from limestone processing.', sources: ['refining'], station: 'refinery', confirmed: true },
  { id: 'ceramic',     name: 'Ceramic',     category: 'industrial', subcategory: 'industrial_product', description: 'Fired clay product. Good quality and resilience for its weight.', sources: ['refining'], station: 'refinery', confirmed: true },
  { id: 'coke',        name: 'Coke',        category: 'industrial', subcategory: 'industrial_product', description: 'Processed coal. Essential ingredient in Steel production.', sources: ['refining'], station: 'refinery', confirmed: true },
  { id: 'glass',       name: 'Glass',       category: 'industrial', subcategory: 'industrial_product', description: 'Produced from Silica Ore or Feldspar. Fragile but high quality.', sources: ['refining'], station: 'refinery', confirmed: true },
  { id: 'gypsum',      name: 'Gypsum',      category: 'industrial', subcategory: 'industrial_product', description: 'Soft sulfate mineral. Used in construction and as a soil amendment.', sources: ['refining'], station: 'refinery', confirmed: true },
  { id: 'plastic',     name: 'Plastic',     category: 'industrial', subcategory: 'industrial_product', description: 'Derived from Oil. Extremely versatile. High versatility stat.', sources: ['refining'], station: 'refinery', confirmed: true },
  { id: 'washed_coal', name: 'Washed Coal', category: 'industrial', subcategory: 'industrial_product', description: 'Cleaned coal with reduced impurities. Higher yield in refining.', sources: ['refining'], station: 'refinery', confirmed: true },
];

// ── Liquids ──────────────────────────────────────────────────────────

export const LIQUID_ITEMS: Item[] = [
  { id: 'acid',        name: 'Acid',        category: 'industrial', subcategory: 'liquid', description: 'Non-water liquid acid. Used in advanced processing and crafting.', sources: ['refining'], station: 'refinery', confirmed: true },
  { id: 'oil',         name: 'Oil',         category: 'industrial', subcategory: 'liquid', description: 'Created from any sedimentary rock. High energy potential. Source of Plastic.', sources: ['refining'], station: 'refinery', confirmed: true },
];

// ── Intermediate Ingredients (ore → metal step) ──────────────────────

export const INTERMEDIATE_ITEMS: Item[] = [
  { id: 'aluminum_int',      name: 'Aluminum',        category: 'industrial', subcategory: 'intermediate', description: 'Refined from Bauxite ×15. Lightweight structural metal.', sources: ['refining'], station: 'refinery', confirmed: true },
  { id: 'ammonium',          name: 'Ammonium',        category: 'industrial', subcategory: 'intermediate', description: 'Nitrogen-hydrogen compound. Intermediate in industrial processing.', sources: ['refining'], station: 'refinery', confirmed: true },
  { id: 'antimatter_gas',    name: 'Antimatter Gas',  category: 'industrial', subcategory: 'intermediate', description: 'Gaseous antimatter state. Intermediate before condensed Antimatter.', sources: ['refining'], station: 'refinery', confirmed: true },
  { id: 'argentite',         name: 'Argentite',       category: 'industrial', subcategory: 'intermediate', description: 'Silver sulfide ore. Refined into Silver.', sources: ['mining'], confirmed: true },
  { id: 'azurite',           name: 'Azurite',         category: 'industrial', subcategory: 'intermediate', description: 'Copper carbonate mineral. Refined into Copper.', sources: ['mining'], confirmed: true },
  { id: 'basalt_powder',     name: 'Basalt Powder',   category: 'industrial', subcategory: 'intermediate', description: 'Ground basalt. Intermediate in construction material processing.', sources: ['refining'], station: 'refinery', confirmed: true },
  { id: 'bismuthite',        name: 'Bismuthite',      category: 'industrial', subcategory: 'intermediate', description: 'Bismuth sulfide ore. Refined into Bismuth metal.', sources: ['mining'], confirmed: true },
  { id: 'calcium_fertilizer',name: 'Calcium Fertilizer', category: 'industrial', subcategory: 'intermediate', description: 'Processed calcium compound. Used to improve soil quality for farming.', sources: ['refining'], station: 'refinery', confirmed: true },
  { id: 'carbon_int',        name: 'Carbon',          category: 'industrial', subcategory: 'intermediate', description: 'Refined from Graphite, Oil, Methane, or Coal Ore. Used in steel alloys.', sources: ['refining'], station: 'refinery', confirmed: true },
  { id: 'carnotite',         name: 'Carnotite',       category: 'industrial', subcategory: 'intermediate', description: 'Uranium vanadate ore. Refines into Uranium metal + Radon gas.', sources: ['mining'], confirmed: true },
  { id: 'cassiterite',       name: 'Cassiterite',     category: 'industrial', subcategory: 'intermediate', description: 'Tin dioxide ore. Primary source of Tin via refining.', sources: ['mining'], confirmed: true },
  { id: 'chalcopyrite',      name: 'Chalcopyrite',    category: 'industrial', subcategory: 'intermediate', description: 'Copper iron sulfide. Primary copper ore. Refines into Copper.', sources: ['mining'], confirmed: true },
  { id: 'chalk_block',       name: 'Chalk Block',     category: 'industrial', subcategory: 'intermediate', description: 'Processed chalk. Construction intermediate.', sources: ['refining'], station: 'refinery', confirmed: true },
  { id: 'cinnabar',          name: 'Cinnabar',        category: 'industrial', subcategory: 'intermediate', description: 'Mercury sulfide ore. Refined into Mercury.', sources: ['mining'], confirmed: true },
  { id: 'coal_ore',          name: 'Coal Ore',        category: 'industrial', subcategory: 'intermediate', description: 'Raw coal ore. Refined into Carbon or Coke. Also a Carbon source.', sources: ['mining'], confirmed: true },
  { id: 'cobaltite',         name: 'Cobaltite',       category: 'industrial', subcategory: 'intermediate', description: 'Cobalt arsenic sulfide ore. Refined into Cobalt metal.', sources: ['mining'], confirmed: true },
  { id: 'cooperite',         name: 'Cooperite',       category: 'industrial', subcategory: 'intermediate', description: 'Platinum group sulfide ore. Refined into Platinum.', sources: ['mining'], confirmed: true },
  { id: 'feldspar',          name: 'Feldspar',        category: 'industrial', subcategory: 'intermediate', description: 'Common aluminium silicate. Refined into Glass (alternative to Silica Ore).', sources: ['mining'], confirmed: true },
  { id: 'galena',            name: 'Galena',          category: 'industrial', subcategory: 'intermediate', description: 'Lead sulfide ore. Primary source of Lead via refining.', sources: ['mining'], confirmed: true },
  { id: 'graphite',          name: 'Graphite',        category: 'industrial', subcategory: 'intermediate', description: 'Crystalline carbon form. Refined into Carbon.', sources: ['mining'], confirmed: true },
  { id: 'hematite',          name: 'Hematite',        category: 'industrial', subcategory: 'intermediate', description: 'Iron oxide ore. One of the primary sources of Iron.', sources: ['mining'], confirmed: true },
  { id: 'ilmenite',          name: 'Ilmenite',        category: 'industrial', subcategory: 'intermediate', description: 'Titanium iron oxide ore. Primary source of Titanium.', sources: ['mining'], confirmed: true },
  { id: 'jasper',            name: 'Jasper',          category: 'industrial', subcategory: 'intermediate', description: 'Opaque microcrystalline silica. Used in industrial processing.', sources: ['mining'], confirmed: true },
  { id: 'lime_ore',          name: 'Lime Ore',        category: 'industrial', subcategory: 'intermediate', description: 'Raw calcium oxide source. Processed into Quicklime.', sources: ['mining'], confirmed: true },
  { id: 'magnesite',         name: 'Magnesite',       category: 'industrial', subcategory: 'intermediate', description: 'Magnesium carbonate ore. Refined into Magnesium metal.', sources: ['mining'], confirmed: true },
  { id: 'magnetite',         name: 'Magnetite',       category: 'industrial', subcategory: 'intermediate', description: 'Magnetic iron oxide ore. Refined into Magnetized Iron.', sources: ['mining'], confirmed: true },
  { id: 'malachite',         name: 'Malachite',       category: 'industrial', subcategory: 'intermediate', description: 'Green copper carbonate ore. Refined into Copper.', sources: ['mining'], confirmed: true },
  { id: 'mica',              name: 'Mica',            category: 'industrial', subcategory: 'intermediate', description: 'Sheet silicate mineral. Layered structure. Used in electronics processing.', sources: ['mining'], confirmed: true },
  { id: 'ochre',             name: 'Ochre',           category: 'industrial', subcategory: 'intermediate', description: 'Iron oxide pigment mineral. Used in dyes and coatings.', sources: ['mining'], confirmed: true },
  { id: 'pentlandite',       name: 'Pentlandite',     category: 'industrial', subcategory: 'intermediate', description: 'Nickel iron sulfide. Primary ore for Nickel production.', sources: ['mining'], confirmed: true },
  { id: 'peridotite',        name: 'Peridotite',      category: 'industrial', subcategory: 'intermediate', description: 'Dense mantle rock. Refined into Chromium.', sources: ['mining'], confirmed: true },
  { id: 'pitchblende',       name: 'Pitchblende',     category: 'industrial', subcategory: 'intermediate', description: 'Uranium oxide ore. Refines into Uranium metal + Radon gas. Handle with care.', sources: ['mining'], confirmed: true },
  { id: 'quartz_crystal_int',name: 'Quartz Crystal',  category: 'industrial', subcategory: 'intermediate', description: 'Processed crystalline quartz. Distinct from raw Quartz gemstone.', sources: ['refining'], station: 'refinery', confirmed: true },
  { id: 'quicklime',         name: 'Quicklime',       category: 'industrial', subcategory: 'intermediate', description: 'Calcium oxide. Produced from Lime Ore. Used in Cement production.', sources: ['refining'], station: 'refinery', confirmed: true },
  { id: 'realgar',           name: 'Realgar',         category: 'industrial', subcategory: 'intermediate', description: 'Arsenic sulfide mineral. Processing yields arsenic intermediates.', sources: ['mining'], confirmed: true },
  { id: 'silica_ore',        name: 'Silica Ore',      category: 'industrial', subcategory: 'intermediate', description: 'Silicon dioxide ore from Sandstone. Primary source of Glass.', sources: ['mining', 'refining'], confirmed: true },
  { id: 'sphalerite',        name: 'Sphalerite',      category: 'industrial', subcategory: 'intermediate', description: 'Zinc sulfide ore. Primary source of Zinc via refining.', sources: ['mining'], confirmed: true },
  { id: 'spodumene',         name: 'Spodumene',       category: 'industrial', subcategory: 'intermediate', description: 'Lithium aluminium silicate. Refined into Lithium metal.', sources: ['mining'], confirmed: true },
  { id: 'sulfide',           name: 'Sulfide',         category: 'industrial', subcategory: 'intermediate', description: 'Sulfide mineral compounds. Found in metamorphic rocks (Gneiss, Schist).', sources: ['mining'], confirmed: true },
  { id: 'talc',              name: 'Talc',            category: 'industrial', subcategory: 'intermediate', description: 'Softest mineral. Used in industrial lubrication and processing.', sources: ['mining'], confirmed: true },
];
