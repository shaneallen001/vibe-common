---
created: 2026-06-06
modified: 2026-06-06
tags: [meta, knowledge, foundry-api]
summary: Index of core Foundry API gotchas — scene controls, FilePicker, Handlebars helpers, and version-removal migrations.
---

# Foundry API

Core Foundry API surface: scene controls, FilePicker, Handlebars helpers, and
version-removal migrations (v14/v15).

## Entries

- **[scene-controls-onchange-not-onclick.md](scene-controls-onchange-not-onclick.md)** —
  Scene control tools require `onChange`; `onClick` was removed in v15. Opposite
  of ApplicationV2 header controls.
- **[filepicker-namespace-v14.md](filepicker-namespace-v14.md)** —
  `FilePicker` moved from `foundry.applications.api` to `foundry.applications.apps`
  in v14.
- **[handlebars-helpers-removed-v15.md](handlebars-helpers-removed-v15.md)** —
  Global `renderTemplate` / `loadTemplates` shims removed in v15; use
  `foundry.applications.handlebars.*`.

## Navigation

- [Back to knowledge AGENTS.md](../AGENTS.md)
