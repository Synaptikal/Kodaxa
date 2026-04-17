/**
 * Profession data loader.
 * One concern: importing all profession JSON files and building lookup maps.
 *
 * AUTO-GENERATED section: OCR pipeline professions (do not hand-edit the imports block).
 * Hand-crafted professions: camping.json, concealment.json, ranger.json
 */

import type { Profession, SkillNode, ProfessionSummary } from '@/types/skill-tree';

// Hand-crafted trees (detailed node positions + prerequisite chains)
import rangerData from './ranger.json';
import campingData from './camping.json';
import concealmentData from './concealment.json';

// OCR-generated trees (skill names + descriptions from in-game screenshots)
import botanyData from './botany.json';
import businessData from './business.json';
import combatData from './combat.json';
import cookingData from './cooking.json';
import craftingData from './crafting.json';
import grenade_launchersData from './grenade_launchers.json';
import humanitiesData from './humanities.json';
import leadershipData from './leadership.json';
import medicalData from './medical.json';
import mineralogyData from './mineralogy.json';
import pistolData from './pistol.json';
import vehiclesData from './vehicles.json';
import xenobiologyData from './xenobiology.json';

// Promoted from stubs — full node trees authored from reference data
import weaponsmithingData from './weaponsmithing.json';
import woodworkingData from './woodworking.json';
import metallurgyData from './metallurgy.json';
import merchantingData from './merchanting.json';

// Import remaining stubs for professions not yet in OCR data
import { PROFESSION_STUBS } from './stubs';

/** OCR-sourced professions with full skill lists */
const OCR_PROFESSIONS: Profession[] = [
  botanyData as Profession,
  businessData as Profession,
  combatData as Profession,
  cookingData as Profession,
  craftingData as Profession,
  grenade_launchersData as Profession,
  humanitiesData as Profession,
  leadershipData as Profession,
  medicalData as Profession,
  mineralogyData as Profession,
  pistolData as Profession,
  vehiclesData as Profession,
  xenobiologyData as Profession,
  // Promoted from stubs (Session 2 — April 2026)
  weaponsmithingData as Profession,
  woodworkingData as Profession,
  metallurgyData as Profession,
  merchantingData as Profession,
];

/** Hand-crafted detailed professions */
const HAND_CRAFTED: Profession[] = [
  rangerData as Profession,
  campingData as Profession,
  concealmentData as Profession,
];

/** IDs already covered — filter stubs to avoid duplicates */
const COVERED_IDS = new Set([
  ...OCR_PROFESSIONS.map(p => p.id),
  ...HAND_CRAFTED.map(p => p.id),
]);

const FILTERED_STUBS = PROFESSION_STUBS.filter(p => !COVERED_IDS.has(p.id));

/** All professions: hand-crafted + OCR + remaining stubs */
export function getAllProfessions(): Profession[] {
  return [...HAND_CRAFTED, ...OCR_PROFESSIONS, ...FILTERED_STUBS];
}

/** Build a Map<professionId, Profession> for fast lookups */
export function getProfessionMap(): Map<string, Profession> {
  const map = new Map<string, Profession>();
  for (const prof of getAllProfessions()) {
    map.set(prof.id, prof);
  }
  return map;
}

/** Build a Map<nodeId, SkillNode> across ALL professions */
export function getNodeMap(): Map<string, SkillNode> {
  const map = new Map<string, SkillNode>();
  for (const prof of getAllProfessions()) {
    for (const node of prof.nodes) {
      map.set(node.id, node);
    }
  }
  return map;
}

/** Generate summaries for the sidebar profession browser */
export function getProfessionSummaries(): ProfessionSummary[] {
  return getAllProfessions().map((prof) => ({
    id: prof.id,
    name: prof.name,
    category: prof.category,
    nodeCount: prof.nodes.length,
    implemented: prof.implemented,
    toolName: prof.tool.name,
  }));
}
