# Vibe Common

## Overview
**Vibe Common** is the foundational library for the Vibe Project, a suite of AI-powered modules for Foundry VTT. It serves as the shared runtime dependency for `vibe-combat`, `vibe-actor`, and `vibe-scenes`.

This module does not provide user-facing features on its own. Instead, it centralizes core logic, constants, and API services to ensure consistency and reduce code duplication across the ecosystem.

## Project Structure
The Vibe Project consists of the following modules:

-   **`vibe-common`**: (This module) Shared code, constants, math, API helpers.
-   **`vibe-combat`**: Encounter management, XP budgeting, AI encounter suggestions.
-   **`vibe-actor`**: AI NPC generation, adjustment of existing actors, OpenAI image generation.
-   **`vibe-scenes`**: Procedural dungeon generation, AI asset placement, and scene import.

## Installation
This module is automatically required by `vibe-combat`, `vibe-actor`, and `vibe-scenes`. Ensure it is installed and enabled in your Foundry VTT world.

## Configuration
Go to **Settings -> Configure Settings -> Vibe Common**:

-   **Gemini API Key**: Required for AI generation in `vibe-combat`, `vibe-actor`, and `vibe-scenes`.
-   **OpenAI API Key**: Required for image generation in `vibe-actor`.

All Vibe modules share these centralized API keys, so you only need to configure them once.

---

## Developer Guide

### Module Entry Point (`scripts/main.js`)

`vibe-common`'s `main.js` is intentionally minimal — it just validates the `dnd5e` system ID on `ready`. All shared code is imported by the consuming modules via ES module `import` statements; there is **no global namespace pollution**.

```
Hooks.once("ready")  → Guards on game.system.id === "dnd5e" (no-op otherwise)
```

### Directory Structure

```
scripts/
├── main.js             # Entry point (minimal)
├── constants.js        # All shared constants for D&D 5e math and encounter types
├── services/
│   └── gemini-service.js   # callGemini() + extractJson() — the only Gemini client
└── utils/
    ├── xp-calculator.js    # calculateXpBudgets(), calculateEncounterXp()
    └── actor-helpers.js    # getActorCr(), getActorLevel(), getActorPortrait(), etc.
styles/
└── vibe-theme.css          # CSS custom properties (design tokens) shared across all modules
```

> **Note**: `vibe-actor` and `vibe-combat` each have their own local copy of a `services/gemini-service.js` that simply re-exports from `vibe-common`. `vibe-scenes` has its own expanded `GeminiService` with multi-modal (image) support. See the note below about the two GeminiService versions.

### Key Components

---

#### `scripts/constants.js` — Shared Data Tables

All game-wide constants live here. Consuming modules import from this file using:
```js
import { CR_XP_TABLE, XP_THRESHOLDS_BY_LEVEL, SUGGESTION_TYPES } from "../../vibe-common/scripts/constants.js";
```

| Export                   | Type     | Description                                                                 |
| ------------------------ | -------- | --------------------------------------------------------------------------- |
| `getCrOptions()`         | Function | Returns `["0","1/8","1/4","1/2","1",...,"30"]`                              |
| `CREATURE_TYPES`         | String[] | All 14 D&D 5e creature type strings                                         |
| `SIZE_OPTIONS`           | String[] | D&D 5e size labels                                                          |
| `CR_XP_TABLE`            | Object   | `{ cr: xp }` (DMG p.274) — keys include `"1/8"`, `"1/4"`, `"1/2"`, `1`–`30` |
| `XP_THRESHOLDS_BY_LEVEL` | Object   | `{ level: { low, medium, high, deadly } }` (DMG p.82)                       |
| `SUGGESTION_TYPES`       | Object[] | Six encounter archetypes with `id`, `label`, `description`, `promptHint`    |

> **Important**: `CR_XP_TABLE` keys are **mixed types**: fractional CRs (`"1/8"`, `"1/4"`, `"1/2"`) are strings, whole CRs are numbers. Match carefully when doing lookups.

---

#### `scripts/services/gemini-service.js` — Gemini API Client

This is the canonical Gemini client for all Vibe modules (except `vibe-scenes` which has an extended version with vision support).

**Exports**:
- `callGemini({ apiKey, prompt, responseSchema, abortSignal })` — Makes a POST to `generativelanguage.googleapis.com`
- `extractJson(text)` — Strips markdown fences and parses JSON from a Gemini response string

**Behavior**:
- Iterates over `GEMINI_MODELS` (currently `["gemini-2.5-flash-lite"]`) and `GEMINI_API_VERSIONS` (`["v1beta"]`)
- Retries up to 3 times on HTTP 429 / 503, using exponential backoff (or `Retry-After` header if present)
- Breaks on 404 (invalid model/version) and falls through to the next model
- Throws if all models/versions fail
- If `responseSchema` is provided, sets `response_mime_type: "application/json"` and `response_schema` in `generationConfig` for constrained structured output
- Supports `abortSignal` for cancellation

**`extractJson(text)`** handles:
1. Markdown triple-backtick fences (` ```json ... ``` `)
2. Leading/trailing code fences without language
3. Auto-slicing to the first `[`/`{` and last `]`/`}` for robustness
4. Auto-wrapping `{...},{...}` patterns as an array (auto-fix fallback)

---

#### `scripts/utils/xp-calculator.js` — XP Math

Shared by `vibe-combat`'s difficulty ratings and suggestion service.

- `calculateXpBudgets(partyMembers)` → `{ low, medium, high, deadly }` — sums per-character DMG thresholds
- `calculateEncounterXp(entries)` → `Number` — looks up CR in `CR_XP_TABLE`, multiplies by quantity

> The CR lookup normalizes fractional CRs by converting numeric values that correspond to fractions (e.g. `0.5` → `"1/2"`). If a CR is not found in the table, it contributes `0` XP. Monitor console warnings for unresolved CRs.

---

#### `styles/vibe-theme.css` — Design Token System

All UI styling across Vibe modules references CSS custom properties defined here. Modules do **not** load this file directly — it is declared in `vibe-common`'s `module.json` `styles` array and Foundry loads it automatically.

**Key token categories**:
```css
--vibe-bg-primary / --vibe-bg-secondary / --vibe-bg-tertiary  /* Panel backgrounds */
--vibe-text-primary / --vibe-text-muted                        /* Text colors */
--vibe-accent-primary / --vibe-accent-hover                    /* Button/link accents */
--vibe-border-color / --vibe-border-subtle                     /* Borders */
--vibe-success / --vibe-danger / --vibe-warning                /* Status colors */
--vibe-radius-sm / --vibe-radius-md / --vibe-radius-lg         /* Border radii */
--vibe-shadow-card / --vibe-shadow-elevated                    /* Box shadows */
```

**Reusable utility classes**:
- `.vibe-dialog-form` — Applied to `<form>` roots inside dialogs
- `.vibe-btn-primary` / `.vibe-btn-cancel` — Action button styles
- `.vibe-section-header` — Section heading inside panels

> **Rule**: Never hardcode hex colors or pixel values in module-specific CSS. Always use `var(--vibe-*)` tokens. This keeps all modules visually consistent and easy to retheme.

---

### Lessons Learned

#### API Limits & Async Handling
- **Rate Limiting**: Gemini has strict rate limits. Exponential backoff in `callGemini` handles this, but long generation chains (vibe-scenes wishlist) can still hit limits. The wishlist generator uses a concurrency pool to limit simultaneous requests.
- **Async UI**: Foundry's UI is synchronous by default. AI operations must be wrapped in async flows with progress callbacks and loading states.

#### Module Dependencies
- **Shared ownership**: Moving shared logic to `vibe-common` was essential to prevent duplication between `vibe-combat` and `vibe-actor`.
- **Hook Management**: Each module owns its own hook registrations. `vibe-common` registers no hooks of its own (other than the minimal `ready` guard).

#### Two GeminiService Versions
- **`vibe-common/scripts/services/gemini-service.js`**: Text-only, used by vibe-actor and vibe-combat via re-export.
- **`vibe-scenes/scripts/services/gemini-service.js`**: Extended version with multi-modal support (can send base64 image data). Used exclusively by vibe-scenes for the visual review pass. If you update the common service, consider whether the scenes version also needs updating.

## Future Work & Roadmap

### Common Code Expansion
-   **Unified Settings Manager**: A centralized way to manage API keys and shared preferences across all Vibe modules.
-   **Enhanced Error Handling**: A global error reporting system to catch and log AI-related failures more effectively.

### Large Scale Refactoring
-   **Service Injection**: Move towards a dependency injection pattern for clearer service management.
-   **Type Safety**: Continue migrating core logic to JSDoc/TypeScript for better developer tooling support.
