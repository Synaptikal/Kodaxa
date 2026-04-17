/**
 * skill-engine.ts
 * Core validation logic for Stars Reach skill builds.
 * One concern: enforcing game constraints on a build.
 *
 * Constraints modeled (all sourced from dev blog/patch notes):
 *   - 80 active skill cap
 *   - 5 tool maximum
 *   - 2 Specials per tool
 *   - Prerequisite chains (must have parent nodes in_practice)
 *   - Cross-tree root node unlocks
 */

import type { Build, BuildValidation, BuildError, BuildWarning } from '@/types/build';
import type { SkillNode, Profession } from '@/types/skill-tree';

/** Game constants — subject to change in pre-alpha */
export const SKILL_CAP = 80;
export const TOOL_CAP = 5;
export const SPECIALS_PER_TOOL = 2;
export const SKILL_CAP_WARNING_THRESHOLD = 70;

/**
 * Validate a build against all Stars Reach constraints.
 * Returns errors (invalid build) and warnings (approaching limits).
 */
export function validateBuild(
  build: Build,
  professions: Map<string, Profession>,
  allNodes: Map<string, SkillNode>
): BuildValidation {
  const errors: BuildError[] = [];
  const warnings: BuildWarning[] = [];

  // 1. Skill cap check
  checkSkillCap(build, errors, warnings);

  // 2. Tool cap check
  checkToolCap(build, errors);

  // 3. Specials cap check
  checkSpecialsCap(build, errors);

  // 4. Prerequisite chains
  checkPrerequisites(build, allNodes, errors);

  // 5. Tool coverage (every active skill's profession needs a tool equipped)
  checkToolCoverage(build, allNodes, professions, warnings);

  // 6. WIP skill warnings
  checkWipSkills(build, allNodes, warnings);

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

function checkSkillCap(
  build: Build,
  errors: BuildError[],
  warnings: BuildWarning[]
): void {
  const count = build.activeSkills.length;

  if (count > SKILL_CAP) {
    errors.push({
      type: 'over_skill_cap',
      message: `${count} active skills exceeds the ${SKILL_CAP}-skill cap by ${count - SKILL_CAP}.`,
    });
  } else if (count >= SKILL_CAP_WARNING_THRESHOLD) {
    warnings.push({
      type: 'approaching_cap',
      message: `${count}/${SKILL_CAP} skill slots used. ${SKILL_CAP - count} remaining.`,
    });
  }
}

function checkToolCap(build: Build, errors: BuildError[]): void {
  const equippedTools = build.toolSlots.filter((t) => t.toolName);
  if (equippedTools.length > TOOL_CAP) {
    errors.push({
      type: 'over_tool_cap',
      message: `${equippedTools.length} tools equipped exceeds the ${TOOL_CAP}-tool limit.`,
    });
  }
}

function checkSpecialsCap(build: Build, errors: BuildError[]): void {
  for (const slot of build.toolSlots) {
    const activeCount = slot.activeSpecials.filter(Boolean).length;
    if (activeCount > SPECIALS_PER_TOOL) {
      errors.push({
        type: 'over_special_cap',
        message: `Tool "${slot.toolName}" has ${activeCount} Specials (max ${SPECIALS_PER_TOOL}).`,
      });
    }
  }
}

function checkPrerequisites(
  build: Build,
  allNodes: Map<string, SkillNode>,
  errors: BuildError[]
): void {
  const activeSet = new Set(build.activeSkills);

  for (const skillId of build.activeSkills) {
    const node = allNodes.get(skillId);
    if (!node) continue;

    for (const prereqId of node.prerequisites) {
      if (!activeSet.has(prereqId)) {
        errors.push({
          type: 'missing_prerequisite',
          message: `"${node.name}" requires "${prereqId}" to be in practice.`,
          nodeIds: [skillId, prereqId],
        });
      }
    }
  }
}

function checkToolCoverage(
  build: Build,
  allNodes: Map<string, SkillNode>,
  professions: Map<string, Profession>,
  warnings: BuildWarning[]
): void {
  const equippedProfessions = new Set(
    build.toolSlots.map((t) => t.professionId).filter(Boolean)
  );

  // Find professions that have active skills but no tool equipped
  const activeProfessions = new Set<string>();
  for (const skillId of build.activeSkills) {
    const node = allNodes.get(skillId);
    if (node) activeProfessions.add(node.professionId);
  }

  for (const profId of activeProfessions) {
    if (!equippedProfessions.has(profId)) {
      const prof = professions.get(profId);
      warnings.push({
        type: 'missing_tool' as any,
        message: `You have active skills in "${prof?.name ?? profId}" but no tool equipped for it. You won't earn XP in this tree without the tool.`,
      });
    }
  }
}

function checkWipSkills(
  build: Build,
  allNodes: Map<string, SkillNode>,
  warnings: BuildWarning[]
): void {
  const wipSkills = build.activeSkills.filter((id) => {
    const node = allNodes.get(id);
    return node && !node.implemented;
  });

  if (wipSkills.length > 0) {
    warnings.push({
      type: 'wip_skill',
      message: `${wipSkills.length} skill(s) in your build are marked WIP and may not be available in-game yet.`,
      nodeIds: wipSkills,
    });
  }
}

/** Count skills per profession for the sidebar breakdown */
export function countSkillsByProfession(
  activeSkills: string[],
  allNodes: Map<string, SkillNode>
): Map<string, number> {
  const counts = new Map<string, number>();
  for (const skillId of activeSkills) {
    const node = allNodes.get(skillId);
    if (!node) continue;
    counts.set(node.professionId, (counts.get(node.professionId) ?? 0) + 1);
  }
  return counts;
}
