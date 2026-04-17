/**
 * ocr-pipeline-brief.ts
 * Dispatch post — OCR pipeline transparency report.
 */

import type { DispatchPost } from '@/types/dispatch';

export const post: DispatchPost = {
  slug: 'ocr-pipeline-transparency',
  title: 'Schematics Pipeline: Transparency Report',
  category: 'field_report',
  published_at: '2026-04-11',
  author: 'Intelligence Division',
  eyebrow: 'Intelligence // Data Provenance Report',
  summary:
    'All schematic and skill data in the Kodaxa system is sourced from a custom OCR pipeline running against in-game screenshots. This post explains what that means for data accuracy and how corrections are filed.',
  tags: ['data', 'ocr', 'transparency', 'intelligence', 'schematics'],
  content: [
    {
      kind: 'paragraph',
      text: 'The Stars Reach game client does not expose a public data API. Every recipe, skill node, item stat, and resource weight in the Kodaxa databases was extracted by processing in-game screenshots through a custom OCR pipeline. The pipeline parses text regions, normalizes field names, and writes the output to structured JSON files that feed this site.',
    },
    {
      kind: 'heading',
      level: 2,
      text: 'Pipeline Architecture',
    },
    {
      kind: 'list',
      items: [
        'Screenshots are captured manually from the pre-alpha client during play sessions.',
        'A Python OCR pipeline segments UI panels and extracts text with layout context.',
        'Parsed records are validated against known schema shapes before being committed.',
        'Ambiguous or low-confidence reads are flagged UNCONFIRMED in the data layer.',
        'Corrections submitted via Discord are reviewed and applied within 24 hours.',
      ],
    },
    {
      kind: 'callout',
      tone: 'warn',
      text: 'Pre-alpha data changes frequently. If a value looks wrong — a recipe cost, a stat modifier, a skill prerequisite — assume the patch hit after our last capture run and file a correction. We rely on the community to keep the pipeline accurate.',
    },
    {
      kind: 'heading',
      level: 2,
      text: 'Filing a Correction',
    },
    {
      kind: 'paragraph',
      text: 'The fastest correction path is the #data-corrections channel on the Kodaxa Discord. Include: the field name, the current value in the tool, the correct value you observed in-game, and the patch version if known. Screenshots welcome. We cross-reference against the OCR raw output and update the JSON source files directly.',
    },
    {
      kind: 'link_card',
      href: 'https://discord.gg/kodaxa',
      title: 'Join the Discord',
      description: 'File corrections in #data-corrections or ask questions in #general.',
    },
  ],
};
