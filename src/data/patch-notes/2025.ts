/**
 * patch-notes/2025.ts
 * Stars Reach patch notes — Feb–Aug 2025 entries.
 * One concern: static changelog data for early 2025.
 *
 * Sep–Dec 2025 entries live in 2025-late.ts
 * Sources: starsreach.com/build-notes (official dev blog).
 */

import type { PatchNote } from './types';

export const PATCH_NOTES_2025_EARLY: PatchNote[] = [
  {
    id: 'twilight-update',
    version: '3.0',
    date: 'Aug 2025',
    title: 'Twilight Update',
    type: 'major',
    summary:
      'Major tools/weapons refactor introducing PQRV stat differentiation for all equipment, long-range Terraformer scanning, inventory stack merging, two new shops on the Starbase, new Homesteading workflow, and significant combat rebalancing.',
    changes: [
      { type: 'fixed',  text: 'Netcode bug found and fixed — significant FPS improvements for all players' },
      { type: 'changed', text: 'Terraformer split into three tools: Terraformer (extraction/scan), Depositor (placing resources), Chronophaser (heat beam, erode/lithify)' },
      { type: 'changed', text: 'Harvester split into two tools: Harvester (harvest/plant bushes/flowers/mushrooms), Pruning Shears (force grow, prune, stunt)' },
      { type: 'changed', text: 'All weapons and remaining tools converted to new code system; TAB-switching modes removed' },
      { type: 'added',  text: 'PQRV stats now actively affect crafted tool/weapon performance: Chronophaser heat cap, Healix heal rate, Companion Orb damage, Terraformer hopper size' },
      { type: 'changed', text: 'Crafting PQRV formula: sort values descending, drop the lowest, average the remainder for each stat individually' },
      { type: 'added',  text: 'Long-range resource scanning via Terraformer: TAB to select resource, E to pulse; shows arc indicating direction of nearest deposit' },
      { type: 'changed', text: 'Resource and seed selection now uses a TAB-opened menu instead of mode switching' },
      { type: 'added',  text: 'Inventory stack merging: drag a stack onto another to merge (lossy — fewer total units; stats averaged; preview dialog shown)' },
      { type: 'changed', text: 'Sorting pulldown added to Crafting and Inventory UIs (sort by Name, P, Q, R, V)' },
      { type: 'added',  text: 'Basic Tool Shop on Starbase: stripped-down Harvester, Terraformer, Xyloslicer, Pathfinder purchasable with Klaatu' },
      { type: 'added',  text: 'Homesteader Shop on Starbase: purchase Homesteader object after unlocking Architect skill' },
      { type: 'changed', text: 'Homesteading moved from Ranger to Architect skill tree; Homesteader placed like a Camp; not refunded on disbanding' },
      { type: 'changed', text: 'Combat XP boosted significantly' },
      { type: 'changed', text: 'Frozen and Electrified creature debuff durations reduced to 2s; immunity reduced to 4s' },
      { type: 'removed', text: 'Heat and Cold immunities removed from regular creatures (bosses retain more robust immunities)' },
      { type: 'changed', text: 'Creature spawner: removed lowest-threat variant of each creature; group sizes reduced; spawner maturation slowed for high-threat creatures' },
      { type: 'fixed',  text: 'Creatures now properly regenerate health when out of aggro range' },
      { type: 'fixed',  text: 'Kharvix and Deer flocking AI fixed (no longer circle indefinitely without attacking)' },
      { type: 'added',  text: 'Klaatu now tradeable between players' },
      { type: 'changed', text: 'Terraformer hopper drops "Tailings" instead of Gravel; Tailings decay into appropriate world dirt over time' },
      { type: 'changed', text: 'Many recipe batch sizes increased (blocks, alloys, ores, etc.)' },
      { type: 'added',  text: 'Audio cue when creatures aggro on player; improved space audio' },
      { type: 'changed', text: 'Night slightly brighter; lighting colors tweaked' },
      { type: 'changed', text: 'HUD fully reconstructed (some temporary assets still in place)' },
    ],
    sourceUrl: 'https://starsreach.com/twilight-update-notes/',
  },
  {
    id: 'brave-new-worlds-update',
    version: '2.5',
    date: 'Jul 2025',
    title: 'Brave New Worlds Update',
    type: 'major',
    summary:
      'Fast-turnaround update following the 36-hour stress test. Addresses critical issues discovered during community testing to enable continued gameplay before the next major content update.',
    changes: [
      { type: 'fixed',  text: 'Multiple critical issues addressed from the 36-hour playtest feedback' },
    ],
    sourceUrl: 'https://starsreach.com/brave-new-worlds-update/',
  },
  {
    id: 'cosmic-calibration-update',
    version: '2.4',
    date: 'Jul 2025',
    title: 'Cosmic Calibration Update',
    type: 'minor',
    summary:
      'Extensive network upgrade with stress testing of flora and creature densities. Community invited to test pushed limits.',
    changes: [
      { type: 'changed', text: 'Extensive network infrastructure upgrade deployed' },
      { type: 'changed', text: 'Flora and creature density settings adjusted dynamically during stress tests to assess performance limits' },
    ],
    sourceUrl: 'https://starsreach.com/cosmic-calibration-update-notes/',
  },
  {
    id: 'wild-wormholes-update',
    version: '2.3',
    date: 'Jun 2025',
    title: 'Wild Wormholes Update',
    type: 'major',
    summary:
      'Introduces Wild Wormholes: random, temporary planet connections for exploration and resource discovery. Planet Rotation concept previewed.',
    changes: [
      { type: 'added',  text: 'Wild Wormholes: random connections between planets that open temporarily for exploration' },
      { type: 'added',  text: 'Note: Players logged out on the Wild planet will appear on a random stable planet upon next login' },
    ],
    sourceUrl: 'https://starsreach.com/wild-wormholes-update/',
  },
  {
    id: 'better-homes-and-gardens-update',
    version: '2.2',
    date: 'May 2025',
    title: 'Better Homes & Gardens Update',
    type: 'major',
    summary:
      'Comprehensive quality-of-life patch: full XP refund, flora system reset, soft grouping for XP sharing, loot distribution improvements, movement and flora system overhauls, new crafting skill branches, and Refinery station.',
    changes: [
      { type: 'added',  text: 'Full XP refund for all existing characters' },
      { type: 'changed', text: 'Flora system reset and overhauled' },
      { type: 'added',  text: 'Soft grouping: automatic XP sharing when players are near each other during combat/gathering' },
      { type: 'added',  text: 'New crafting skill branches: Architect, Civil Engineering, Refining, Toolmaking' },
      { type: 'added',  text: 'New crafting stations: Lathe, Stove, Toolmaker, Refinery' },
      { type: 'added',  text: '400+ Refinery recipes for ore transmutation and alloy creation' },
      { type: 'added',  text: 'Resource stat system: Potential (P), Quality (Q), Resilience (R), Versatility (V)' },
      { type: 'added',  text: 'Stat drop mechanic: lowest stat dropped per ingredient during crafting' },
      { type: 'changed', text: 'Building blocks now require crafted materials from the Lathe' },
      { type: 'changed', text: 'Improved loot distribution in group scenarios' },
      { type: 'added',  text: 'Visual appearance customization for crafted blocks and decor' },
    ],
    sourceUrl: 'https://starsreach.com/better-homes-gardens/',
  },
  {
    id: 'alpha-physics-midterm',
    version: 'Alpha',
    date: 'May 2025',
    title: 'Physics Midterm — Stat System Documentation',
    type: 'major',
    summary:
      'Official breakdown of how P/Q/R/V resource stats work in crafting, plus heavy data changes requiring a player and world wipe.',
    changes: [
      { type: 'added',  text: 'Stat calculation formula: sort values descending, drop N lowest, average remainder (drop 1 for ≥2 ingredients, drop 2 for ≥5 ingredients)' },
      { type: 'added',  text: 'All 4 stats (P/Q/R/V) calculated independently per ingredient' },
      { type: 'changed', text: 'Stats are planet-specific — same resource can have different PQRV on different worlds' },
      { type: 'changed', text: 'Player and world wipe required due to extent of data changes' },
    ],
    sourceUrl: 'https://starsreach.com/physics-midterm/',
  },
  {
    id: 'world-reset-2025',
    version: 'Alpha',
    date: 'Apr 2025',
    title: 'World Reset — Post-Kickstarter Restore',
    type: 'minor',
    summary:
      'Post-Kickstarter world and character reset to restore the intended new player experience. Characters now start with fewer tools; XP boxes must be earned.',
    changes: [
      { type: 'changed', text: 'New character experience restored to intended design: fewer starting tools, XP boxes earned through gameplay' },
      { type: 'changed', text: 'Intent to reduce frequency of future world resets going forward' },
    ],
    sourceUrl: 'https://starsreach.com/world-reset/',
  },
  {
    id: 'procedural-creatures-update',
    version: 'Alpha',
    date: 'Mar 2025',
    title: 'Procedural Creatures Update',
    type: 'major',
    summary:
      'Major under-the-hood creatures system overhaul to support procedural world generation. Sets up data architecture for future procgen creature generation.',
    changes: [
      { type: 'changed', text: 'Entire creatures system overhauled for rapid data manipulation in preparation for procedural generation pipeline' },
    ],
    sourceUrl: 'https://starsreach.com/procedural-creatures-update/',
  },
  {
    id: 'seasons-skies-public-events-update',
    version: 'Alpha',
    date: 'Mar 2025',
    title: 'Seasons, Skies, and Public Events Update',
    type: 'major',
    summary:
      'Part 1 of the Seasons system, new procedural sky rendering, and the introduction of Public Events (meteor storms, boss invasions).',
    changes: [
      { type: 'added',  text: 'Seasons system Part 1: worlds now have active seasonal cycles affecting flora state' },
      { type: 'changed', text: 'Procedural sky rendering improved for varied planetary environments' },
      { type: 'added',  text: 'Public Events system: meteor storms, boss invasions shown on left-side screen HUD' },
    ],
    sourceUrl: 'https://starsreach.com/seasons-skies-and-public-events/',
  },
  {
    id: 'escarion-qol-update',
    version: 'Alpha',
    date: 'Feb 2025',
    title: 'Escarion & Quality of Life Update',
    type: 'major',
    summary:
      'Introduces Escarion as a new buildable world with new threats, alongside a broad quality-of-life pass fixing many small annoyances ahead of player influx.',
    changes: [
      { type: 'added',  text: 'Planet Escarion: new building-suitable world with higher-tier enemies' },
      { type: 'changed', text: 'Broad quality-of-life improvements across UI, missions, and interactions' },
    ],
    sourceUrl: 'https://starsreach.com/escarion-and-quality-of-life-update/',
  },
];
