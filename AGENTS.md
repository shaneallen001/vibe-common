# vibe-common — Shared Library

## Project Overview

A suite of AI-powered modules for Foundry VTT (v13+) that bring generative AI to tabletop RPG game masters. `vibe-common` is the single shared dependency — all UI base classes, API clients, CSS tokens, and settings live here. Other modules: `vibe-actor` (NPC generation), `vibe-combat` (encounter building), `vibe-scenes` (dungeon generation), `vibe-scene-two` (multi-step scene pipeline).

Source repos: `shaneallen001/vibe-common`, `shaneallen001/vibe-actor`, `shaneallen001/vibe-combat`, `shaneallen001/vibe-scenes`, `shaneallen001/vibe-scene-two`.

## Tech Stack

- **Runtime**: Foundry VTT v13 (build 351+), browser-based (no Node.js in production)
- **Language**: JavaScript ES modules — no CommonJS, no bundlers. Foundry loads scripts directly.
- **Types**: JSDoc `@typedef` / `@param` annotations for IDE support (no TypeScript)
- **AI Services**: Google Gemini API (text/JSON + image generation), OpenAI API (DALL-E portraits/icons)
- **Config**: API keys stored in Foundry module settings via `vibe-common`

## Commands

No build step. No module-specific tests.

## Public API

Other modules import from these files — this defines the cross-module contract.

**`scripts/services/gemini-service.js`**
- `callGemini({ apiKey, prompt, responseSchema, abortSignal })` — Gemini API with model fallback + retry
- `callGeminiStream({ apiKey, prompt, responseSchema, abortSignal })` — Streaming variant
- `extractJson(text)` — Parse JSON from Gemini response (handles fences, auto-slice, auto-wrap)
- `GEMINI_MODELS` — Fallback chain: `["gemini-3.1-pro-preview", "gemini-3.1-flash-preview", "gemini-2.5-flash-lite"]`

**`scripts/constants.js`**
- `CR_XP_TABLE`, `XP_THRESHOLDS_BY_LEVEL`, `SUGGESTION_TYPES`
- `getCrOptions()`, `CREATURE_TYPES`, `SIZE_OPTIONS`

**`scripts/utils/xp-calculator.js`**
- `calculateXpBudgets(partyMembers)`, `calculateEncounterXp(entries)`
- `getXpForCr(cr)`, `getXpThresholdsForLevel(level)`

**`scripts/settings.js`**
- `registerCommonSettings()`, `getGeminiApiKey()`, `getOpenAiApiKey()`, `getImageGenerationModel()`
- Setting keys: `geminiApiKey`, `openaiApiKey`, `imageGenerationModel`, `menuPlacement`

**`scripts/ui/`**
- `VibeToast` — Static methods: `info()`, `warn()`, `error()`, `success()`, `show()`
- `VibeApplicationV2` — ApplicationV2 subclass with loading state
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

### Foundry V13+ Scene Controls: `onClick` vs `onChange`
When adding custom tools to Scene Controls (`getSceneControlButtons` hook), `onClick` is deprecated in V13 and removed in V15. If both are defined on a `button: true` tool, Foundry fires both — causing double window spawns. **Solution:** Only define `onChange`.

### Foundry Default Input Heights
Foundry's global CSS sets `input`/`select` to `height: 26px`. Adding padding without overriding height squashes text. **Solution:** Always set `height: 32px` AND `padding: 0 10px` on styled inputs.

### Imagen API Model Name Mapping
Foundry settings store short names (`imagen-3`, `imagen-4`), but the Google API requires full model names (`imagen-3.0-generate-001`, `imagen-4.0-generate-001`). Always map through the helper in `vibe-common/scripts/settings.js`.

### FilePicker Deprecation
The global `FilePicker` is deprecated in V13 and removed in V15. Use `foundry.applications.api.FilePicker` instead.
