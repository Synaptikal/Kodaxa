---
id: KDXA-003
title: "Data Advisory — How Our Schematics Are Sourced"
division: INTELLIGENCE
date: 2026-04-12
status: PUBLISHED
tag: ADVISORY
excerpt: "A transparent account of how Kodaxa extracts, validates, and maintains schematic and skill data without an official game API."
---

# TRANSMISSION · KODAXA DISPATCH
**FILED:** 2026-04-12 · **DIVISION:** INTELLIGENCE  
**CLASSIFICATION:** PUBLIC · **REF:** KDXA-003

---

## Data Advisory — How Our Schematics Are Sourced

Transparency is a core operating principle at Kodaxa. This dispatch explains exactly where our data comes from, how it is validated, and what our error tolerances look like.

You deserve to know what you're working with.

---

### The Problem: No Official API

Stars Reach does not currently publish a public data API. There is no official item database, no exported skill tree, and no machine-readable schematic archive. This is standard for an in-development title.

It means that every structured record in the Kodaxa archive — every material, every skill node, every recipe dependency — was extracted by humans from in-game sources.

---

### The Solution: The OCR Pipeline

Our primary data acquisition system is a Python-based OCR pipeline that processes in-game screenshots submitted by community contributors. The pipeline:

1. **Ingests** a screenshot of an in-game crafting panel, skill menu, or material readout
2. **Segments** the image into labeled regions using layout inference
3. **Extracts** text, numbers, and relationship data using optical character recognition
4. **Normalizes** the output into structured JSON matching our schema
5. **Queues** the record for human review before it enters the live archive

No record enters the database without passing at least one manual verification step. High-confidence records (clean screenshots, known item categories) are fast-tracked. Ambiguous records are held in a review queue until a second contributor confirms or corrects them.

---

### Current Data Coverage

| Category | Records | Confidence |
|---|---|---|
| Professions | 39 | HIGH |
| Skill Nodes | 198+ | HIGH |
| Schematics | 36 | MEDIUM |
| Materials | In progress | VARIABLE |
| Structures | In progress | VARIABLE |

**Confidence ratings:**
- **HIGH** — Multiple source confirmations, cross-referenced against video and patch notes
- **MEDIUM** — Single confirmed source, plausible against known game mechanics
- **VARIABLE** — Partial extraction, pending additional contributor data

---

### What Changes When the API Arrives

When Playable Worlds releases an official data API, this pipeline retires. All OCR-sourced records will be validated against the canonical feed and corrected automatically. Coverage will expand from dozens of records to thousands overnight.

Until then, we maintain the pipeline, accept community submissions, and keep the accuracy advisory visible at the top of every tool.

---

### How to Contribute

If you have in-game access and a few minutes, screenshot submissions are the most valuable contribution you can make to the archive right now. Instructions are pinned in `#data-submissions` on the Discord relay.

Every screenshot is a record. Every record is a better tool.

**— Intelligence Division, Kodaxa Studios**

