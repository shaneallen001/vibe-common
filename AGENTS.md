# vibe-common — Shared Library

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
