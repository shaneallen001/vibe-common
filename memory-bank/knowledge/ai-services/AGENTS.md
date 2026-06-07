---
created: 2026-06-06
modified: 2026-06-06
tags: [meta, knowledge, ai-services]
module: shared
---

# AI Services

Documents Gemini, Imagen, and OpenAI client behavior and quirks encountered in the vibe-* module suite.

## Entries

- [imagen-model-name-mapping.md](imagen-model-name-mapping.md) — Foundry stores short Imagen names; the Google API requires full versioned model strings.
- [image-model-routing-by-exclusion.md](image-model-routing-by-exclusion.md) — Route image generation by excluding `dall-e-3`, not by checking `includes("imagen")`, or Gemini image models get sent to OpenAI.
- [gemini-constrained-json-extra-fields.md](gemini-constrained-json-extra-fields.md) — Gemini fills every optional schema field with placeholder values; keep schemas lean to avoid validation errors.

## Navigation

[Back to knowledge AGENTS.md](../AGENTS.md)
