---
created: 2026-06-06
modified: 2026-06-06
tags: [meta, knowledge, memory-bank, foundry]
summary: Categorized, tagged knowledge base of Foundry VTT and AI-service gotchas and patterns for the vibe modules. The searchable single source of truth for hard-won quirks.
---

# Knowledge

The searchable source of truth for Foundry VTT and AI-service gotchas and
patterns across the vibe-* modules. Each entry is one focused gotcha or
pattern in its own file, so agents can find exactly what they need by tag
without reading a giant block.

## What Belongs Here

- Foundry API quirks and version-migration traps (v14/v15)
- ApplicationV2 / DialogV2 patterns and footguns
- Styling rules that fight Foundry's global CSS
- AI-service (Gemini, Imagen, OpenAI) behavior and gotchas
- Any pattern worth not re-discovering the hard way

## Entry Format

Each entry is a single `.md` file with a kebab-case name describing the
gotcha (e.g. `onrender-fires-every-render.md`). Frontmatter:

```yaml
---
created: YYYY-MM-DD
modified: YYYY-MM-DD
tags: [foundry-v14, application-v2, gotcha]
summary: One line.
module: vibe-common | vibe-actor | vibe-combat | shared
references: [relative/path.md]   # optional
---
```

Body: the problem in one or two sentences, then the fix — with a minimal
code example where it helps. Keep each entry to one concern.

## Categories

- **foundry-api/** — Core Foundry API surface: scene controls, FilePicker,
  Handlebars helpers, version-removal migrations.
- **application-v2/** — `ApplicationV2` / `DialogV2` lifecycle and rendering
  patterns and footguns.
- **styling/** — CSS rules that must override Foundry's global styles.
- **ai-services/** — Gemini, Imagen, and OpenAI client behavior and quirks.

## Source

These entries were migrated from the "Known Gotchas" block formerly in
`vibe-common/AGENTS.md` (2026-06-06). Module-specific gotchas still living in
`vibe-actor` / `vibe-combat` AGENTS.md can be migrated here over time, tagged
with the relevant `module:`.

## Navigation

- [Back to memory-bank AGENTS.md](../AGENTS.md)
