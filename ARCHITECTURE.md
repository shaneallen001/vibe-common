# Vibe Common Architecture & Developer Guide

This document is intended for AI agents and human developers working on the `vibe-common` module or any module that depends on it. Complete configuration and usage details are in [README.md](./README.md).

## 1. Entry Points & Hooks (`scripts/main.js`)

`vibe-common`'s `main.js` is intentionally minimal — it just validates the `dnd5e` system ID on `ready`. All shared code is imported by the consuming modules via ES module `import` statements; there is **no global namespace pollution**.

```javascript
Hooks.once("ready")  // Guards on game.system.id === "dnd5e" (no-op otherwise)
```

## 2. Shared Data Tables (`scripts/constants.js`)

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

## 3. Gemini API Client (`scripts/services/gemini-service.js`)

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

## 4. XP Math (`scripts/utils/xp-calculator.js`)

Shared by `vibe-combat`'s difficulty ratings and suggestion service.

- `calculateXpBudgets(partyMembers)` → `{ low, medium, high, deadly }` — sums per-character DMG thresholds
- `calculateEncounterXp(entries)` → `Number` — looks up CR in `CR_XP_TABLE`, multiplies by quantity

## 5. Design Token System (`styles/vibe-theme.css`)

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

## 6. Lessons Learned

#### API Limits & Async Handling
- **Rate Limiting**: Gemini has strict rate limits. Exponential backoff in `callGemini` handles this.
- **Async UI**: Foundry's UI is synchronous by default. AI operations must be wrapped in async flows with progress callbacks and loading states.

#### Module Dependencies
- **Shared ownership**: Moving shared logic to `vibe-common` was essential to prevent duplication between `vibe-combat` and `vibe-actor`.
- **Hook Management**: Each module owns its own hook registrations. `vibe-common` registers no hooks of its own (other than the minimal `ready` guard and the `getSceneControlButtons` hook for the Vibe menu).
