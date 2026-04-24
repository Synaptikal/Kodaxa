/**
 * patch-notes/2026.ts
 * Stars Reach patch notes — 2026 entries.
 * One concern: static changelog data for the 2026 calendar year.
 *
 * Sources: starsreach.com/build-notes (official dev blog).
 * Last updated: April 12, 2026.
 */

import type { PatchNote } from './types';

export const PATCH_NOTES_2026: PatchNote[] = [
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
];
