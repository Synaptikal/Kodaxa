/**
 * extract-costs.mjs
 * One-off migration: parse OCR cost data from profession JSON description fields
 * and add a structured `costs` field to each skill node.
 *
 * Run from skill-planner/ with: node scripts/extract-costs.mjs
 *
 * OCR pattern: "[TREE_NAME] [EXP] KLAATU [KLAATU_VALUE] [description...]"
 * Example: "MINERALOGY 750 KLAATU 750 DISPLAYS CONVERSION AND QUANTITY DATA"
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROFESSIONS_DIR = join(__dirname, '../src/data/professions');

// Matches: [WORD] [NUMBER] [optional OCR noise] KLAATU [NUMBER] [rest...]
// Handles comma-formatted numbers (1,500) and OCR noise words like "ee", "ie." between fields
const COST_PREFIX = /^[A-Z_]+\s+([\d,]+)\s+(?:[a-z]{1,4}\.?\s+)?KLAATU\s+([\d,]+)\s*/i;

// Matches: KLAATU [NUMBER] [rest...] (EXP value missing from OCR)
const KLAATU_ONLY = /^KLAATU\s+([\d,]+)\s*/i;

function parseNum(str) {
  return parseInt(str.replace(/,/g, ''), 10);
}

function processFile(filePath) {
  const raw = readFileSync(filePath, 'utf8');
  const data = JSON.parse(raw);
  let changed = 0;

  for (const node of data.nodes) {
    const desc = node.description ?? '';

    const fullMatch = desc.match(COST_PREFIX);
    if (fullMatch) {
      const exp = parseNum(fullMatch[1]);
      const klaatu = parseNum(fullMatch[2]);
      node.costs = { exp, klaatu };
      node.description = desc.slice(fullMatch[0].length).trim();
      changed++;
      continue;
    }

    const klOnly = desc.match(KLAATU_ONLY);
    if (klOnly) {
      const klaatu = parseNum(klOnly[1]);
      // EXP value lost to OCR — use klaatu as best estimate
      node.costs = { exp: klaatu, klaatu };
      node.description = desc.slice(klOnly[0].length).trim();
      changed++;
    }
  }

  if (changed > 0) {
    writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
    console.log(`  ${data.id}: ${changed} node(s) updated`);
  } else {
    console.log(`  ${data.id}: no OCR patterns found`);
  }
}

const files = readdirSync(PROFESSIONS_DIR).filter((f) => f.endsWith('.json'));
console.log(`Processing ${files.length} profession files...\n`);

for (const file of files) {
  processFile(join(PROFESSIONS_DIR, file));
}

console.log('\nDone. Verify the description fields look correct before committing.');
