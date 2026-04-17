/**
 * patch-notes/index.ts
 * Curated Stars Reach alpha patch notes.
 * One concern: static changelog data from official sources.
 *
 * Sources: starsreach.com/build-notes (official dev blog).
 * Data may be incomplete — community contributions welcome.
 * Last updated: April 12, 2026.
 */

export type PatchNoteType = 'major' | 'minor' | 'balance' | 'hotfix';

export interface PatchChange {
  type: 'added' | 'changed' | 'fixed' | 'removed';
  text: string;
}

export interface PatchNote {
  id: string;
  version: string;
  date: string;
  title: string;
  type: PatchNoteType;
  summary?: string;
  changes: PatchChange[];
  sourceUrl?: string;
}

export const PATCH_NOTES: PatchNote[] = [
  // ─── 2026 ───────────────────────────────────────────────────────────────────
  {
    id: 'open-horizon-hotfix-7-3-2',
    version: '7.3.2',
    date: 'Apr 2026',
    title: 'Open Horizon Hotfix 7.3.2',
    type: 'hotfix',
    summary:
      'Networking fix restoring inventory, skills, and crafting UI visibility. Patched a bug where the /dance emote could heal other players\' wounds.',
    changes: [
      {
        type: 'fixed',
        text: 'Resolved a networking bug that prevented inventory, skills, and crafting UI from appearing on login',
      },
      {
        type: 'fixed',
        text: 'Fixed the ability to heal other players\' wounds via the /dance emote',
      },
      {
        type: 'removed',
        text: 'Removed the dancers from the TPL Space Station (placed as a side-effect of the healing bug)',
      },
    ],
    sourceUrl: 'https://starsreach.com/open-horizon-hotfix-7-3-2/',
  },
  {
    id: 'open-horizon-update',
    version: '7.3',
    date: 'Apr 2026',
    title: 'The Open Horizon Update',
    type: 'major',
    summary:
      'Replaces the linear "on-the-rails" tutorial with the new Challenges system, introduces the Galactopedia, revamps the Skills window, adds Pistol and Grenade Launcher ability trees, and updates Haven\'s starter experience.',
    changes: [
      // New Player Experience
      { type: 'changed', text: 'Replaced linear Haven questline with the new Challenges feature — small, bite-sized tasks players complete at their own pace' },
      { type: 'changed', text: 'Starting experience now begins directly on Haven with Mayor Bob after a short intro, instead of the FTUE Hallways' },
      { type: 'added',  text: 'Haven now features an ongoing Corruption-related terraforming situation for players to participate in' },
      // Galactopedia
      { type: 'added',  text: 'Galactopedia: in-game encyclopedia replacing F1 help screens; entries unlock as players encounter new systems and lore' },
      // Skills Window
      { type: 'changed', text: 'Skills window reworked: updated top bar with currency/profession/XP labels, dynamic detail panel, and zoomable/pannable skill tree view' },
      { type: 'added',  text: 'Skill boxes now show four clear visual states: Not Learned, Learned (In Practice), Learned (Out of Practice), and Work in Progress' },
      { type: 'added',  text: 'Skill kiosks support "Learn Skill", "Stop Practicing", and "Start Practicing" buttons contextually' },
      // Weapons & Skills
      { type: 'changed', text: 'Pistol and Grenade Launcher skill trees moved to their own XP types; trees require using the appropriate weapon to earn XP' },
      { type: 'changed', text: 'Pistol default battery size set to 6; each projectile ability consumes 1 battery with auto-regen after a few seconds' },
      { type: 'added',  text: 'Pistol skills: Double Tap, Ricochet, Unload, Double Time, Pistol Whip' },
      { type: 'added',  text: 'Grenade Launcher skills: Cluster, Repulsor, Implosion, Uplift' },
      { type: 'added',  text: 'Healix skill: Siphon — hold to fire a beam that drains enemy health to restore your own' },
      // Crafting
      { type: 'fixed',  text: 'Besom Scrubs now drop branches when harvested' },
      { type: 'added',  text: 'Wood Slurry Recipe accessible through Refining Other skill box' },
      { type: 'changed', text: 'Grip and Stock recipes now require wood instead of planks' },
      { type: 'fixed',  text: 'Fixed issue where certain specials removed from tools could not be re-added' },
      // QoL & Fixes
      { type: 'added',  text: 'Gamma correction slider added to Graphics settings' },
      { type: 'fixed',  text: 'Server performance: resolved flora scanning slowdowns and item-moving-to-container slowdowns' },
      { type: 'fixed',  text: 'Consumable UI no longer resets on zoning or death' },
      { type: 'added',  text: 'Ballhog enemies now have audio' },
    ],
    sourceUrl: 'https://starsreach.com/the-open-horizon-update/',
  },
  {
    id: 'a-recruit-no-more-crucible-update',
    version: '7.2',
    date: 'Mar 2026',
    title: 'A Recruit No More – The Crucible Update',
    type: 'major',
    summary:
      'Completes the new player pathway by adding Crucible as the third onboarding planet. Introduces Grenade Launchers, ability loadouts, map overhaul, movement balancing, and extensive UI improvements.',
    changes: [
      // Onboarding
      { type: 'added',  text: 'Crucible planet added to the new player pathway (Preamble → Hallway → Haven → Crucible → TPL Starbase)' },
      { type: 'added',  text: 'Crucible: hostile, resource-rich planet with a TPL satellite training base; players earn Space Suit needed for Starbase travel' },
      { type: 'changed', text: 'New characters required to experience Haven & Crucible; existing characters cannot revisit these planets yet' },
      // Systems
      { type: 'added',  text: 'Group travel system for moving all players to/from a planet simultaneously' },
      { type: 'added',  text: 'Enhanced mission system upgraded to support Crucible planet training' },
      // Movement
      { type: 'changed', text: 'Full movement speed balance pass: characters, creatures, and projectiles slowed for better moment-to-moment gameplay' },
      // GravMesh
      { type: 'changed', text: 'GravMesh now uses Battery instead of Stamina, with lower max but faster regen (shorter, more frequent usage)' },
      // Weapons
      { type: 'added',  text: 'Grenade Launcher added: arc projectiles and AoE attacks; crafted via new Crafting skill recipes; Fire Singularity + Uplift combos' },
      { type: 'removed', text: 'Legacy placeholder weapons (Omniblaster, Companion Orbs) no longer acquirable; existing copies kept until next wipe' },
      // Ability Loadouts
      { type: 'added',  text: 'First iteration of Customizable Ability Loadouts: Loadout Kiosks in Camps and the TPL Starbase allow swapping E/Q abilities on Pistols and Grenade Launchers' },
      // Map
      { type: 'changed', text: 'Map overhauled from ASCII-based to dynamic terrain map (M key) that reveals via Pathfinder surveying' },
      // Healix
      { type: 'changed', text: 'Healix model updated and targeting radius slightly increased' },
      // UI
      { type: 'changed', text: 'Public Events, navigation waypoints, nameplates, and World UI transitioned to new rendering system' },
      { type: 'added',  text: 'Chat style customization (color/appearance of messages in ESC > Gameplay)' },
      { type: 'added',  text: 'Key rebinding available via Controls section in ESC menu' },
      { type: 'added',  text: 'Consumable Assignment added to inventory screen with drag-and-drop to radial menus (F key)' },
      // Animation
      { type: 'added',  text: 'New slope movement animations (up and down)' },
      { type: 'changed', text: 'Dodge roll timing extended: 0.5s animation / 0.75s dodge duration (was 0.25s / 0.25s)' },
      { type: 'changed', text: 'Shields simplified: no longer have a passthrough damage threshold; block all projectiles until capacity breaks' },
      // Performance
      { type: 'changed', text: 'Dense forest planet performance greatly improved via custom billboard tech for distant trees' },
      // Bug Fixes
      { type: 'fixed',  text: 'Fixed tool-swap animation issues leaving arm in incorrect position' },
      { type: 'fixed',  text: 'Fixed tools not functioning when holstered while climbing or vaulting' },
      { type: 'fixed',  text: 'Fixed tools on slots 2–4 not functioning properly after loading back in' },
      { type: 'fixed',  text: 'Collections system now more accurately updates on acquisition' },
      // Building
      { type: 'added',  text: 'Building tiles now display outlines when selected with the fabricator' },
      { type: 'added',  text: 'New 2×2 floor tile variations and 1×1 rugs added' },
    ],
    sourceUrl: 'https://starsreach.com/a-recruit-no-more/',
  },
  // ─── 2025 ───────────────────────────────────────────────────────────────────
  {
    id: 'thats-no-moon-haven-update-7-1-2',
    version: '7.1.2',
    date: 'Dec 2025',
    title: "That's No Moon – Haven Update 7.1.2",
    type: 'hotfix',
    summary:
      'Small patch fixing GPU memory leaks, opening Jotania wormgate for testing, and improving server exception logging.',
    changes: [
      { type: 'fixed',   text: 'Fixed one or more significant GPU memory leaks, improving client stability' },
      { type: 'fixed',   text: 'Improved exception logging to capture more useful forensic data' },
      { type: 'changed', text: 'Reduced overall logging volume slightly for minor performance gain' },
      { type: 'added',   text: 'Wormgate to planet Jotania opened for extended traversal and terraforming testing' },
    ],
    sourceUrl: 'https://starsreach.com/thats-no-moon-the-haven-update/',
  },
  {
    id: 'thats-no-moon-haven-update-7-1-1',
    version: '7.1.1',
    date: 'Dec 2025',
    title: "That's No Moon – Haven Update 7.1.1",
    type: 'hotfix',
    summary:
      'Rapid patch smoothing the Haven update launch: fixed building offsets, NPC interactions, mission dialog errors, and multiple Haven-specific bugs.',
    changes: [
      { type: 'fixed',   text: 'Players who skipped Hallway with "I know what I\'m doing" now correctly receive a Grapple' },
      { type: 'fixed',   text: 'Building and object offset on Haven resolved; NPC "G to interact" and rubberbanding caused by invisible collisions fixed' },
      { type: 'fixed',   text: 'Survey point in the Park no longer moves to the roof' },
      { type: 'changed', text: 'Shootery targets now require three hits to destroy (clarifies Overcharge mechanic)' },
      { type: 'fixed',   text: 'Overcharge no longer sticks in the "on" state after first use' },
      { type: 'fixed',   text: 'Cryostar pistol now has audio' },
      { type: 'fixed',   text: 'Minor mission dialog typos corrected' },
      { type: 'fixed',   text: 'Juvenile Ballhogs and Targeting Dummies now stay in their designated locations; Juvenile Ballhogs made invulnerable' },
      { type: 'removed', text: 'Bank Kiosk removed from Haven (confusing new users)' },
      { type: 'changed', text: 'Players can leave Haven even if all missions are abandoned' },
      { type: 'changed', text: 'Day/night cycle extended to 20 minutes each' },
      { type: 'fixed',   text: 'Gravity generator seams in TPL Starbase fixed (no more camera issues)' },
      { type: 'added',   text: 'Crafting tables added to the Starbase (previously absent unless GovBots had progressed)' },
      { type: 'fixed',   text: 'Trowel recipe now correctly awarded when Seed Planting skill is unlocked in Farming' },
      { type: 'changed', text: 'Internal versioning aligned with dev team numbering (now 7.1.1 following 7.1.0)' },
    ],
    sourceUrl: 'https://starsreach.com/thats-no-moon-the-haven-update/',
  },
  {
    id: 'thats-no-moon-haven-update-7-1-0',
    version: '7.1.0',
    date: 'Dec 2025',
    title: "That's No Moon – The Haven Update",
    type: 'major',
    summary:
      'Introduces Haven, the TPL Training Moon, as the first post-Hallway onboarding location. Adds first-person view, BioScanner tool, spatial chat overhaul, targeted emotes, and major mission system rework.',
    changes: [
      // Haven
      { type: 'added',  text: 'Haven: TPL Training Moon township with Mayor Bob and ~12 short onboarding missions covering mining, combat, crafting, etc.' },
      { type: 'added',  text: 'BioScanner tool: non-destructive scanning of Makers and Creatures to add to collection without killing them' },
      { type: 'changed', text: 'New player path updated to: Preamble → Hallway → Haven → (Crucible soon) → TPL Starbase' },
      // Tools & Gameplay
      { type: 'added',  text: 'First-person perspective: scroll mouse forward all the way to enter first-person view (useful for tight spaces)' },
      { type: 'added',  text: '"L" key shortcut to open/close the mission log directly' },
      { type: 'added',  text: 'Interactable items now display a highlight indicating they can be interacted with' },
      { type: 'changed', text: 'When Crafting, "Can Craft" filter toggle now on by default' },
      { type: 'added',  text: 'Mouse sensitivity slider added to Game Options' },
      { type: 'changed', text: 'Nights are brighter; street lamps cast more light' },
      { type: 'added',  text: 'Grappling Hook now shown on HUD with battery status' },
      { type: 'added',  text: 'Discovery flyout notification now appears when a new Discovery occurs' },
      { type: 'added',  text: 'Scanner (TAB + Q) feature on BioScanner, Harvester, and Xyloslicer to locate nearest resource in the world' },
      // Building
      { type: 'changed', text: 'New building tiles and props: concave curve tiles (floor/ceiling), hex lamps, small desktop computer, short cabinet' },
      { type: 'added',  text: 'Homestead limits (tiles, lights, etc.) now shown on Fabricator palette' },
      { type: 'changed', text: 'Seed Planting ability moved from Harvester/Xyloslicer to a new Trowel tool (Farming implement from Toolmaking tree)' },
      // Creatures
      { type: 'changed', text: 'Creatures no longer Discovered by killing them; BioScanner required for Discovery' },
      // Spatial Chat
      { type: 'changed', text: 'Say limited to 25m radius, Yell to 50m, Whisper to 10m' },
      { type: 'added',  text: 'Many new say alternates (moan, carol, accuse, implore, etc.); see /help say' },
      { type: 'added',  text: 'Targeted says and emotes: /say @Bob <msg> or /bow Bob to face target' },
      { type: 'added',  text: 'Whisper added: visible to nearby players as "…whispers to…" but content hidden' },
      { type: 'added',  text: '/reply (/r) command to reply to last tell; /t and /dm as aliases for /tell' },
      { type: 'added',  text: 'One-shot moods and permanent moods via /mood or /<mood> shorthand' },
      { type: 'added',  text: '/help now shows categorized commands: Chat, Moods, Say, Emotes, Commands' },
    ],
    sourceUrl: 'https://starsreach.com/thats-no-moon-the-haven-update/',
  },
  {
    id: 'hidden-fog-1-1',
    version: '6.1.1',
    date: 'Dec 2025',
    title: 'Hidden Fog 1.1 Update',
    type: 'minor',
    summary:
      'Follow-up patch to Hidden Fog: first pass on revised Skill Tree window, server memory improvements eliminating periodic resets, improved graphical settings, and Hallway refinements.',
    changes: [
      { type: 'changed', text: 'Skill Window UI: first iteration of functional rework (aesthetics still in progress, functionality improved)' },
      { type: 'fixed',   text: 'Server memory leaks identified and resolved; servers should no longer require periodic resets during playtests' },
      { type: 'changed', text: 'Volumetric fog now enabled by default (still togglable in Graphics Options)' },
      { type: 'fixed',   text: 'NOTE: Graphics settings not currently saving between logins (to be fixed shortly)' },
      { type: 'changed', text: 'Multiple subtle improvements to the First Time User Experience Hallway based on player feedback' },
    ],
    sourceUrl: 'https://starsreach.com/hidden-fog-1-1-update-notes/',
  },
  {
    id: 'hidden-fog-update',
    version: '6.1',
    date: 'Dec 2025',
    title: 'Hidden Fog Update',
    type: 'major',
    summary:
      'Major visual overhaul introducing volumetric fog, custom light grid, improved global illumination, and terrain tiling. Also revamps Hallway onboarding, replaces stock Unity lighting with a 400× faster custom grid, and improves general stability.',
    changes: [
      // Visuals
      { type: 'added',  text: 'Volumetric fog added (defaults to OFF due to performance impact; enableable in Options)' },
      { type: 'changed', text: 'Replaced stock Unity point/spot light system with custom light grid solution (~400× faster rendering)' },
      { type: 'added',  text: 'Global illumination with ambient occlusion computed dynamically (darker crevices and caves)' },
      { type: 'added',  text: 'Custom reflections implementation supporting flora reflections and better metals' },
      { type: 'added',  text: 'Automatic sky hue for varied sky colors' },
      { type: 'changed', text: 'Improved terrain tiling for dramatic day/night visual difference' },
      // Hallway
      { type: 'changed', text: 'Hallways widened significantly to feel less claustrophobic' },
      { type: 'changed', text: 'Broken elevator shaft replaced with a ladder for clarity' },
      { type: 'removed', text: 'Lava room removed from Hallway entirely' },
      { type: 'removed', text: 'Profession Kiosks removed from end of Hallway (skills moved to training on Haven in next update)' },
      { type: 'added',  text: 'Chat Pane closes while in Hallway to reduce visual clutter, reopens on exit' },
      { type: 'added',  text: 'Crouch obstacle in Hallway now can be rolled under' },
      // Identity
      { type: 'added',  text: 'Identity Kiosk at start of Hallway: choose one of 64 visual appearances (bridge feature until full character customization)' },
      { type: 'changed', text: 'Characters no longer randomly change appearance when zoning' },
      // Preamble
      { type: 'changed', text: 'Preamble cut to two screens (was longer); character type selection simplified' },
      // Starbase
      { type: 'changed', text: 'Starbase basement removed; spawn now in Garden of Life via Respawn Stations' },
      // Misc
      { type: 'changed', text: 'Wild Wormholes turned off in favor of future planet rotation feature' },
      { type: 'added',  text: 'ReLife station now shows a visual effect when used' },
      { type: 'removed', text: 'Soil-to-Metal and Soil-to-Gemstones recipes removed (replaced by "adds" drop system)' },
      { type: 'changed', text: 'GovBot missions require less wood' },
      { type: 'added',  text: 'Many new harvestable fruits; fruit seeds now drop from harvesting fruit instead of chopping trees' },
      { type: 'changed', text: 'Camera defaults to Fixed-Reticle mode (press T to toggle)' },
      { type: 'changed', text: 'Camera behavior in tight spaces greatly improved' },
      { type: 'added',  text: 'Private /tell chat channel between players on the same world' },
      { type: 'added',  text: 'Client prediction re-enabled for all projectile weapons with generic model' },
    ],
    sourceUrl: 'https://starsreach.com/hidden-fog-update/',
  },
  {
    id: 'govbot-update',
    version: '6.0',
    date: 'Nov 2025',
    title: 'GovBot Update',
    type: 'major',
    summary:
      'Introduces the GovBot system — a TPL sequence for establishing and governing townships on new planets, enabling government tools and civic progression.',
    changes: [
      { type: 'added',  text: 'GovBot: TPL construct that guides a group of planetary pioneers through establishing a township on a new planet' },
      { type: 'added',  text: 'GovBot enables government tools for the new township\'s mayor and residents' },
    ],
    sourceUrl: 'https://starsreach.com/govbot-update/',
  },
  {
    id: 'vendor-kiosk-update',
    version: '5.5',
    date: 'Oct 2025',
    title: 'Vendor Kiosk Update',
    type: 'minor',
    summary:
      'Adds the Vendor Kiosk to let players sell goods directly from their Homesteads. Recipe unlock automatic for now via Business skill tree.',
    changes: [
      { type: 'added',  text: 'Vendor Kiosk available: craft via Lathe recipe, place on Homestead to sell goods to other players' },
      { type: 'added',  text: 'Recipe auto-unlocked for everyone temporarily; part of the Business skill tree' },
    ],
    sourceUrl: 'https://starsreach.com/vendor-kiosk-update/',
  },
  {
    id: 'university-update-1-1',
    version: '4.1.1',
    date: 'Oct 2025',
    title: 'Minor Update – University Update 1.1',
    type: 'minor',
    summary:
      'Small followup to University Update: building tile model refresh (first step of larger performance asset overhaul) and misc bug fixes.',
    changes: [
      { type: 'changed', text: 'Building Tiles models updated as first step of a larger performance asset overhaul (appearance of some tiles may slightly change)' },
    ],
    sourceUrl: 'https://starsreach.com/minor-update-university-update-1-1/',
  },
  {
    id: 'university-update',
    version: '4.1',
    date: 'Sep 2025',
    title: 'University Update',
    type: 'major',
    summary:
      'Massively expands visible skill trees to preview future content, adds four new weapon types, introduces the Ecology Kiosk and Servitor Violation system, and overhauls the First-Time User Experience.',
    changes: [
      // Skill Trees
      { type: 'added',  text: 'Skill trees greatly expanded to show future progression: Botany (Herbalism, Forestry, Farming, Foraging), Combat (Ranged, Melee, Drones, Combat Engineer), Cooking, Medical, Mineralogy, Ranger, Vehicles, Xenobiology' },
      { type: 'added',  text: 'New skill trees: Business (Management, Logistics, Advertising), Humanities (Writing, Music, Dance, Acting), Leadership (Inspiration, Group Tactics)' },
      // Weapons
      { type: 'changed', text: 'OmniBlaster renamed to OmniShock; OmniForce (Kinetic damage) added with Artillery and Hunter Seekers specials' },
      { type: 'added',  text: 'Corrosion Drones: Corrosion damage weapon with Acid Bath and Bug Bombs specials' },
      { type: 'added',  text: 'Freeze Ray: Cold damage beam with Snow Globe and Deep Freeze specials' },
      { type: 'changed', text: 'OmniShock specials now cause Electrified status; Companion Orb Ring Nodes cause burn DoT; Gravity Gun knockback increased' },
      // Mining
      { type: 'changed', text: 'Mining through rock/soil now yields bonus drops: Ores, Found Materials (Obsidian Shards, Quicklime), gases, and gems' },
      // Ecology
      { type: 'added',  text: 'Ecology Kiosk on Starbase and every planet: shows Flora, Fauna, and Mineral health stats per world' },
      { type: 'added',  text: 'Servitor Violation system: over-hunting or eradicating resources triggers Servitor Edicts and active penalties (meteor strikes or direct Servitor intervention)' },
      // FTUE
      { type: 'changed', text: '"I know what I\'m doing" character creation option now starts player as Explorer profession with corresponding skills and gear' },
      { type: 'changed', text: 'Lava/Fire Suppressor room revamped for easier navigation' },
      { type: 'changed', text: 'Soldier profession now gets Artillery special + OmniForce pistol; Explorer gets longer camps and unlock stage 2' },
      // Misc
      { type: 'changed', text: 'Portal objects in space replaced — fly through instead of land and run through' },
      { type: 'added',  text: 'Wormhole opening and closing VFX and Audio' },
      { type: 'changed', text: 'Tree spreading rate decreased; extinct species no longer naturally propagate' },
      { type: 'fixed',  text: 'Healix beam fixed and heals characters again' },
      { type: 'fixed',  text: 'Food consumables now work correctly' },
      { type: 'changed', text: 'Chat UI overhauled; pressing ESC minimizes chat pane' },
      { type: 'changed', text: 'Lights optimized greatly' },
      { type: 'added',  text: 'Light volumetric fog added (used sparingly pending further optimization)' },
    ],
    sourceUrl: 'https://starsreach.com/university-update/',
  },
  {
    id: 'dynamic-update',
    version: '4.0',
    date: 'Sep 2025',
    title: 'The Dynamic Update',
    type: 'minor',
    summary:
      'Targets the "zombie" player-death bug where health bar misrepresents death state, plus miscellaneous fixes.',
    changes: [
      { type: 'fixed',  text: 'Actively pursuing the "zombie" bug: non-responsive player state after death where health bar incorrectly shows alive' },
    ],
    sourceUrl: 'https://starsreach.com/dynamic-update/',
  },
  {
    id: 'twilight-update',
    version: '3.0',
    date: 'Aug 2025',
    title: 'Twilight Update',
    type: 'major',
    summary:
      'Major tools/weapons refactor introducing PQRV stat differentiation for all equipment, long-range Terraformer scanning, inventory stack merging, two new shops on the Starbase, new Homesteading workflow, and significant combat rebalancing.',
    changes: [
      // Performance
      { type: 'fixed',  text: 'Netcode bug found and fixed — significant FPS improvements for all players' },
      // Tools Refactor
      { type: 'changed', text: 'Terraformer split into three tools: Terraformer (extraction/scan), Depositor (placing resources), Chronophaser (heat beam, erode/lithify)' },
      { type: 'changed', text: 'Harvester split into two tools: Harvester (harvest/plant bushes/flowers/mushrooms), Pruning Shears (force grow, prune, stunt)' },
      { type: 'changed', text: 'All weapons and remaining tools converted to new code system; TAB-switching modes removed' },
      // PQRV
      { type: 'added',  text: 'PQRV stats now actively affect crafted tool/weapon performance: Chronophaser heat cap, Healix heal rate, Companion Orb damage, Terraformer hopper size' },
      { type: 'changed', text: 'Crafting PQRV formula: sort values descending, drop the lowest, average the remainder for each stat individually' },
      // Scanning
      { type: 'added',  text: 'Long-range resource scanning via Terraformer: TAB to select resource, E to pulse; shows arc indicating direction of nearest deposit' },
      { type: 'changed', text: 'Resource and seed selection now uses a TAB-opened menu instead of mode switching' },
      // Inventory
      { type: 'added',  text: 'Inventory stack merging: drag a stack onto another to merge (lossy — fewer total units; stats averaged; preview dialog shown)' },
      { type: 'changed', text: 'Sorting pulldown added to Crafting and Inventory UIs (sort by Name, P, Q, R, V)' },
      // Shops
      { type: 'added',  text: 'Basic Tool Shop on Starbase: stripped-down Harvester, Terraformer, Xyloslicer, Pathfinder purchasable with Klaatu' },
      { type: 'added',  text: 'Homesteader Shop on Starbase: purchase Homesteader object after unlocking Architect skill' },
      // Homesteading
      { type: 'changed', text: 'Homesteading moved from Ranger to Architect skill tree; Homesteader placed like a Camp; not refunded on disbanding' },
      // Combat
      { type: 'changed', text: 'Combat XP boosted significantly' },
      { type: 'changed', text: 'Frozen and Electrified creature debuff durations reduced to 2s; immunity reduced to 4s' },
      { type: 'removed', text: 'Heat and Cold immunities removed from regular creatures (bosses retain more robust immunities)' },
      { type: 'changed', text: 'Creature spawner: removed lowest-threat variant of each creature; group sizes reduced; spawner maturation slowed for high-threat creatures' },
      { type: 'fixed',  text: 'Creatures now properly regenerate health when out of aggro range' },
      { type: 'fixed',  text: 'Kharvix and Deer flocking AI fixed (no longer circle indefinitely without attacking)' },
      // Other
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
  // ─── 2024 ───────────────────────────────────────────────────────────────────
  {
    id: 'alpha-skill-system',
    version: 'Alpha',
    date: '2024',
    title: 'Skill Tree System — Core Implementation',
    type: 'major',
    summary:
      'Introduction of the skill tree system with 14 professions, XP trees, and the 80-skill cap.',
    changes: [
      { type: 'added', text: '14 profession skill trees implemented' },
      { type: 'added', text: '80-skill active cap with atrophy mechanic (1-week inactivity)' },
      { type: 'added', text: 'Tool loadout system: up to 5 tools, 2 Specials per tool' },
      { type: 'added', text: 'Skills enter "out of practice" state after 1 week without XP' },
    ],
  },
];
