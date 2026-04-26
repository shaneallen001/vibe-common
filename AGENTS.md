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

### Foundry V14+ Scene Controls: `onClick` vs `onChange`
When adding custom tools to Scene Controls (`getSceneControlButtons` hook), `onClick` is deprecated in V13 and removed in V15. In V14 only `onChange` is recognized. Only define `onChange`.

**Do NOT apply this to ApplicationV2 header controls.** The `getHeaderControlsApplicationV2` hook uses `onClick` (not `onChange`) — Foundry's `_renderHeaderControl` wires `control.onClick` directly to the button's click event. Using `onChange` there leaves the button with no click handler.

### Foundry Default Input Heights
Foundry's global CSS sets `input`/`select` to `height: 26px`. Adding padding without overriding height squashes text. **Solution:** Always set `height: 32px` AND `padding: 0 10px` on styled inputs.

### Imagen API Model Name Mapping
Foundry settings store short names (`imagen-3`, `imagen-4`), but the Google API requires full model names (`imagen-3.0-generate-001`, `imagen-4.0-generate-001`). Always map through the helper in `vibe-common/scripts/settings.js`.

### FilePicker Namespace (v14)
In v14, FilePicker moved from `foundry.applications.api.FilePicker` to `foundry.applications.apps.FilePicker`. Use the v14 path.

### Global Handlebars Helpers Removed in v15
`renderTemplate` and `loadTemplates` global shims are removed in Foundry v15. Always use:
- `foundry.applications.handlebars.renderTemplate(...)`
- `foundry.applications.handlebars.loadTemplates(...)`

### ApplicationV2 this.element is HTMLElement (not jQuery)
In `ApplicationV2`, `this.element` is a plain `HTMLElement`. Use `querySelector`/`querySelectorAll` instead of jQuery `.find()`. Use `addEventListener` instead of `.on()`. Use `el.disabled = true` instead of `.prop("disabled", true)`.

### ApplicationV2 _onRender fires on every re-render
`_onRender(context, options)` is called after every `render()` call. Use an `AbortController` to cancel old event listeners before adding new ones, otherwise they accumulate:
```js
#abort = null;
_onRender(context, options) {
  this.#abort?.abort();
  const { signal } = (this.#abort = new AbortController());
  this.element.querySelector("#btn").addEventListener("click", handler, { signal });
}
```

### render() call style in V2
`new MyApp().render({ force: true })` to open. `this.render()` to re-render in-place. The V1 `render(true)` boolean arg is not valid in V2.

### ApplicationV2 `tag: "form"` — do NOT wrap the template in `<form>`
When `DEFAULT_OPTIONS.tag = "form"`, the application's root element is already a `<form>`. Wrapping your Handlebars template content in another `<form>` creates invalid nested forms — the browser breaks out of the outer form and the inner one submits to the page URL (full reload). Use a `<div>` for the outermost wrapper in templates instead:
```html
<!-- WRONG — nested form causes page reload on submit -->
<form class="vibe-dialog-form">...</form>

<!-- CORRECT -->
<div class="vibe-dialog-form">...</div>
```
Add a `<button type="submit">` anywhere inside the `<div>` to trigger the ApplicationV2 form handler.

### Image generation model routing: use `model !== "dall-e-3"`, not `model.includes("imagen")`
The `imageGenerationModel` setting has multiple Gemini options (`imagen-3`, `imagen-4`, `gemini-3.1-flash-image-preview`, etc.). Checking `model.includes("imagen")` misses the `gemini-*` image models and routes them to OpenAI by mistake. Always route by exclusion:
```js
const useGemini = model !== "dall-e-3";
const apiKey = useGemini ? getGeminiApiKey() : getOpenAiApiKey();
```

### Gemini constrained JSON output adds unexpected fields from schema
When `response_mime_type: "application/json"` is used with a `response_schema`, Gemini will attempt to populate every optional field it sees in the schema, often with invalid placeholder values (e.g. `spend: 0` when the schema requires `>= 1`). Keep schemas lean — only include fields that downstream code actually reads. Remove optional fields that exist purely as pass-through hints if they cause validation noise.
