# vibe-common — Shared Library

## Project Overview

A suite of AI-powered modules for Foundry VTT (v14+) that bring generative AI to tabletop RPG game masters. `vibe-common` is the single shared dependency — all UI base classes, API clients, CSS tokens, and settings live here. Other modules: `vibe-actor` (NPC generation), `vibe-combat` (encounter building), `vibe-scenes` (dungeon generation), `vibe-scene-two` (multi-step scene pipeline).

Source repos: `shaneallen001/vibe-common`, `shaneallen001/vibe-actor`, `shaneallen001/vibe-combat`, `shaneallen001/vibe-scenes`, `shaneallen001/vibe-scene-two`.

## Tech Stack

- **Runtime**: Foundry VTT v14 (build 360+), browser-based (no Node.js in production)
- **Language**: JavaScript ES modules — no CommonJS, no bundlers. Foundry loads scripts directly.
- **Types**: JSDoc `@typedef` / `@param` annotations for IDE support (no TypeScript)
- **AI Services**: Google Gemini API (text/JSON + image generation), OpenAI API (DALL-E portraits/icons)
- **Config**: API keys stored in Foundry module settings via `vibe-common`

## Commands

No build step. No module-specific tests.

## Active Plan

At session start, also read [`v2-plan.md`](v2-plan.md). It is the current
suite-level roadmap: save/publish the present work to GitHub first, add the
test/smoke harness layer next, then continue the remaining hardening and feature
work. Consider subagents for independent repo inventory, test harness, and
verification tasks to save time and cost.

## Public API

Other modules import from these files — this defines the cross-module contract.

**`scripts/services/gemini-service.js`**
- `callGemini({ apiKey, prompt, responseSchema, abortSignal })` — Gemini API with model fallback + retry
- `callGeminiStream({ apiKey, prompt, responseSchema, abortSignal })` — Streaming variant
- `extractJson(text)` — Parse JSON from Gemini response (handles fences, auto-slice, auto-wrap)
- `GEMINI_MODELS` — Fallback chain: `["gemini-3.5-flash", "gemini-3.1-pro-preview", "gemini-3.1-flash-preview", "gemini-2.5-flash-lite"]`

**`scripts/constants.js`**
- `CR_XP_TABLE`, `XP_THRESHOLDS_BY_LEVEL`, `SUGGESTION_TYPES`
- `getCrOptions()`, `CREATURE_TYPES`, `SIZE_OPTIONS`

**`scripts/utils/xp-calculator.js`**
- `calculateXpBudgets(partyMembers)`, `calculateEncounterXp(entries)`
- `getXpForCr(cr)`, `getXpThresholdsForLevel(level)`

**`scripts/settings.js`**
- `registerCommonSettings()`, `getGeminiApiKey()`, `getOpenAiApiKey()`, `getImageGenerationModel()`
- `getActorGenerationModel()`, `getActorGenerationApiKey()`, `isOpenAiActorGenerationModel()`
- Setting keys: `geminiApiKey`, `openaiApiKey`, `imageGenerationModel`, `actorGenerationModel`, `menuPlacement`

**`scripts/ui/`**
- `VibeToast` — Static methods: `info()`, `warn()`, `error()`, `success()`, `show()`
- `VibeApplicationV2` — `HandlebarsApplicationMixin(ApplicationV2)` subclass with loading state; extend this for all app UIs
- `VibeDialogV2` — DialogV2 subclass with loading state
- `registerVibeMenu()` — Scene control button injection

## Boundaries

- **IMPORTANT**: Changes here break dependent modules. Test across all vibe-* modules.
- Settings keys are referenced by string — renaming is a breaking change.
- CSS design tokens in `vibe-theme.css` must remain backwards-compatible.
- `gemini-service.js` is canonical — no module-local copies (exception: vibe-scenes extends it with vision).

## Gemini Client Behavior

- Iterates `GEMINI_MODELS` × `GEMINI_API_VERSIONS` — retries up to 3× on 429/503 with exponential backoff
- Breaks on 404 (invalid model/version), falls through to next combination
- When `responseSchema` is provided: sets `response_mime_type: "application/json"` for constrained output
- `extractJson()` quirks: auto-slices to first `{`/`[`, auto-wraps comma-separated `{...},{...}` as array

## Known Gotchas

Foundry / AI-service gotchas now live in the **Memory Bank** as individual,
tagged, searchable entries — see [`memory-bank/knowledge/`](memory-bank/knowledge/AGENTS.md):

- **[foundry-api/](memory-bank/knowledge/foundry-api/AGENTS.md)** — scene controls (`onChange` not `onClick`), FilePicker v14 namespace, Handlebars helpers removed in v15.
- **[application-v2/](memory-bank/knowledge/application-v2/AGENTS.md)** — `this.element` is an HTMLElement, `_onRender` fires every render, `render({force:true})` call style, no nested `<form>` with `tag:"form"`, header controls use `onClick`.
- **[styling/](memory-bank/knowledge/styling/AGENTS.md)** — Foundry default input heights (set `height:32px` + `padding:0 10px`).
- **[ai-services/](memory-bank/knowledge/ai-services/AGENTS.md)** — Imagen model-name mapping, image-model routing by exclusion, Gemini constrained-JSON extra fields.

Add new gotchas as `knowledge/` entries, not back into this file.

## Memory Bank

This module hosts the shared **Memory Bank** for the whole vibe-* suite at
[`memory-bank/`](memory-bank/AGENTS.md) — persistent cross-session context:
daily `logs/`, the `knowledge/` base above, multi-session `projects/`, and
local `scratch/`. The read/write protocol is the `memory-bank-protocol`
skill at `.agents/skills/memory-bank-protocol/SKILL.md`.

**Sibling modules** (`vibe-actor`, `vibe-combat`) reference this bank
cross-repo via `../vibe-common/memory-bank/`. At session start, boot from
`memory-bank/AGENTS.md` and the latest log; at session end, follow the
closing protocol (update the log, touched projects, and any new knowledge).
