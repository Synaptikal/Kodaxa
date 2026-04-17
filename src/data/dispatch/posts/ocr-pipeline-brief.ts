/**
 * ocr-pipeline-brief.ts
 * Dispatch post — Data sourcing transparency report. KDXA-003.
 */

import type { DispatchPost } from '@/types/dispatch';

export const post: DispatchPost = {
  slug: 'ocr-pipeline-transparency',
  title: 'Data Advisory — How Our Schematics Are Sourced',
  category: 'field_report',
  published_at: '2026-04-12',
  author: 'Intelligence Division',
  eyebrow: 'Intelligence // Data Provenance Report',
  ref_id: 'KDXA-003',
  tag: 'ADVISORY',
  summary:
    'A transparent account of how Kodaxa extracts, validates, and maintains schematic and skill data without an official game API.',
  tags: ['data', 'ocr', 'transparency', 'intelligence', 'schematics'],
  content: [
    {
      kind: 'paragraph',
      text: "Transparency is a core operating principle at Kodaxa. This dispatch explains exactly where our data comes from, how it is validated, and what our error tolerances look like. You deserve to know what you're working with.",
    },
    {
      kind: 'heading',
      level: 2,
      text: 'The Problem: No Official API',
    },
    {
      kind: 'paragraph',
      text: 'Stars Reach does not currently publish a public data API. There is no official item database, no exported skill tree, and no machine-readable schematic archive. This is standard for an in-development title.',
    },
    {
      kind: 'paragraph',
      text: 'It means that every structured record in the Kodaxa archive — every material, every skill node, every recipe dependency — was extracted by humans from in-game sources.',
    },
    {
      kind: 'heading',
      level: 2,
      text: 'The Solution: The OCR Pipeline',
    },
    {
      kind: 'paragraph',
      text: 'Our primary data acquisition system is a Python-based OCR pipeline that processes in-game screenshots submitted by community contributors:',
    },
    {
      kind: 'list',
      ordered: true,
      items: [
        'Ingests a screenshot of an in-game crafting panel, skill menu, or material readout',
        'Segments the image into labeled regions using layout inference',
        'Extracts text, numbers, and relationship data using optical character recognition',
        'Normalizes the output into structured JSON matching our schema',
        'Queues the record for human review before it enters the live archive',
      ],
    },
    {
      kind: 'callout',
      tone: 'info',
      text: 'No record enters the database without passing at least one manual verification step. High-confidence records are fast-tracked. Ambiguous records are held in a review queue until a second contributor confirms or corrects them.',
    },
    {
      kind: 'heading',
      level: 2,
      text: 'Current Data Coverage',
    },
    {
      kind: 'list',
      items: [
        'Professions — 39 records · Confidence: HIGH (multiple source confirmations, cross-referenced against video and patch notes)',
        'Skill Nodes — 198+ records · Confidence: HIGH',
        'Schematics — 36 records · Confidence: MEDIUM (single confirmed source, plausible against known game mechanics)',
        'Materials — In progress · Confidence: VARIABLE (partial extraction, pending additional contributor data)',
        'Structures — In progress · Confidence: VARIABLE',
      ],
    },
    {
      kind: 'heading',
      level: 2,
      text: 'What Changes When the API Arrives',
    },
    {
      kind: 'paragraph',
      text: 'When Playable Worlds releases an official data API, this pipeline retires. All OCR-sourced records will be validated against the canonical feed and corrected automatically. Coverage will expand from dozens of records to thousands overnight.',
    },
    {
      kind: 'paragraph',
      text: 'Until then, we maintain the pipeline, accept community submissions, and keep the accuracy advisory visible at the top of every tool.',
    },
    {
      kind: 'heading',
      level: 2,
      text: 'How to Contribute',
    },
    {
      kind: 'paragraph',
      text: 'If you have in-game access and a few minutes, screenshot submissions are the most valuable contribution you can make to the archive right now. Instructions are pinned in #data-submissions on the Discord relay.',
    },
    {
      kind: 'callout',
      tone: 'success',
      text: 'Every screenshot is a record. Every record is a better tool.',
    },
  ],
};
