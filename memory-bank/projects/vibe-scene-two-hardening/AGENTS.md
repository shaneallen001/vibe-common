---
created: 2026-06-07
modified: 2026-06-07
tags: [project, vibe-scene-two, hardening, foundry-v14, scenes, svg-pipeline]
summary: Bring vibe-scene-two (the SVG-planning scene pipeline) up to the same production level as vibe-actor/vibe-combat and make it THE canonical scenes module. Keeps the vibe-scene-two id (no rename).
module: vibe-scene-two
references: [../AGENTS.md, ../../logs/2026-06-06.md]
---

# Project: vibe-scene-two Hardening

## Status

**COMPLETE (2026-06-07).** All phases done and shipped as **v2.0.0**.
`hardening-v2` merged to `main` (merge `7935c0f`) and pushed; GitHub release
`v2.0.0` is Latest with `module.json` + `vibe-scene-two.zip` assets (manifest
URLs verified 200). User tested the module live in Foundry and confirmed it
working. New gotcha captured at
`knowledge/foundry-api/ambient-light-radii-distance-units.md`.

Possible future follow-ups (not blocking): agent-driven Chrome-extension
verification pass to double-check B1 lights / B2 active model per setting;
screenshots for the README; reconcile the stale remote `v1.5.0` release if
desired.

## What & Why

`vibe-scene-two` is the **phased** scene generator: concept → JSON outline →
architectural **SVG plan** → SVG-guided image render → deterministic
SVG→walls/doors/lights/journals build. It is explicitly NOT the one-shot random
dungeon generator (`vibe-scene` / v1, which the user considers junky).

**Decision (user, 2026-06-07):** this v2 becomes THE production scenes module
for the suite, but **keeps the `vibe-scene-two` module id** — no rename, no
template-path/scene-control churn. The old `vibe-scene` v1 repo is retired
separately (out of scope here).

**Goal:** raise it to the same level as `vibe-actor` / `vibe-combat`:
v14 compatibility, full project scaffolding (AGENTS.md/CLAUDE.md/LICENSE/icon),
correctness fixes, robustness, and a real end-to-end verification pass in a
live Foundry world.

Source review that seeded this project: see [log 2026-06-06](../../logs/2026-06-06.md)
(and the session that created this file).

## Sibling "production level" bar

`vibe-actor` / `vibe-combat` each have:
- `compatibility.minimum: "14"`, `verified: "14.360"`
- `AGENTS.md` (project instructions) + `CLAUDE.md` that is just `@AGENTS.md`
- `LICENSE` (MIT) + `icon.png`
- Polished `README.md` + maintained `CHANGELOG.md`
- No stray dev artifacts tracked in git

vibe-scene-two currently MISSES: v14 compat (it says 13/13.351), AGENTS.md,
CLAUDE.md, LICENSE, icon.png, and tracks a root `testing-loop.js` dev harness.

---

## Task List

### A. Packaging & parity (match siblings) — low risk
- [x] **A1.** Bumped `module.json` `compatibility` to `minimum: "14"`,
  `verified: "14.360"`; refined `description` to a production (non-"experimental") line.
- [x] **A2.** Added `AGENTS.md` (overview, architecture, public API, boundaries,
  Memory Bank section) + `CLAUDE.md` (`@AGENTS.md`) + thin `.agents/skills/
  memory-bank-protocol/SKILL.md` pointer, modeled on siblings.
- [x] **A3.** Added `LICENSE` (MIT, Shane Allen) + generated a themed
  floor-plan `icon.png` (dark + gold, cyan doors).
- [x] **A4.** Rewrote `README.md` to sibling style (overview, 3-phase workflow,
  install, config, usage, dev guide). Moved the "Recent Changes" dump out — it's
  already the CHANGELOG. (No screenshots yet — capture during Phase 4.)
- [x] **A5.** Moved `testing-loop.js` → `dev/testing-loop.js`; removed
  `runFullTestingFlow` from shipped `ScenePipeline` (only the harness used it —
  the harness now calls the three phase methods directly). `.gitignore` aligned
  with siblings (`dev/test-output/`, `*.png` except `icon.png`, etc.).
- [x] **A6.** `package.json` version synced to `1.4.0`; `test:pipeline` script
  repointed to `dev/testing-loop.js`.

### B. Correctness fixes — needs in-Foundry verification
- [x] **B1. (HIGH) Ambient light units bug.** Added `pxToUnits(px) = px /
  scene.grid.size * scene.grid.distance` in `_addElementsFromSvgAndState` and
  applied it to `light.dim`/`bright` (was raw pixels). **Verify live** that
  lights no longer overshoot room walls.
- [x] **B2. Image-model routing.** Added `_resolveImageModel()` to
  `image-generator.js`: honors the `vibe-common` `imageGenerationModel` setting,
  maps Imagen short→full names (`imagen-4` → `imagen-4.0-generate-001`), routes
  Gemini-image models to guided `generateContent` (SVG attached) and Imagen to
  `:predict`, errors clearly on browser-blocked `dall-e-3`, and logs the active
  model + endpoint. When SVG is present but an Imagen/DALL-E model is configured,
  it falls back to `gemini-2.5-flash-image` so the layout is still honored (logs
  a warning). Response parsing now keys on `useGuided`. `inpaintRegion` reuses
  the resolver. README rewritten to not claim a specific "Imagen 4". **Verify
  live** which model actually fires per setting.
- [x] **B3. Inpainting mask edge case.** Generalized the background blackout
  selector from `rect:not([data-room-id])` to all shapes
  (`rect,circle,ellipse,polygon,polyline,path`) without a `data-room-id`.

### C. Robustness & features
- [x] **C1. Cancel/abort.** Added a Cancel button + `AbortController` to
  `ProgressDialog` (`_onCancel` aborts; styled `.cancel-btn`). `generator-app`
  creates the controller per step, passes it to the dialog and threads
  `abortSignal` through `pipeline.generateOutline/generateSvg/generateImage` →
  generators → `callGemini`/`generateImage`/`inpaintRegion`. Inpainting also
  checks `abortSignal.aborted` between rooms. **Verify live** that Cancel stops
  a run promptly.
- [x] **C2. Outline via jsonMode.** `scene-outline-generator.js` now calls
  `callGemini({ jsonMode: true, abortSignal })` (was `responseSchema: null`);
  still runs the result through `extractJson` for robustness.
- [x] **C3. Error-state UX.** Both `_onNextStep` branches now keep the user on
  the failed step and re-render the generator (existing `finally`), and
  distinguish `AbortError` (info "Generation cancelled.") from real errors.
  Also fixed the stale "Rendering map with Imagen 4…" status → "Rendering map…".
  **Verify live** that retry after a failure reopens cleanly.

### D. End-to-end verification (live Foundry)
- [x] **D1–D3.** User tested the module live in Foundry (2026-06-07) and
  reports it working. (Self-verified by Shane rather than agent-driven via the
  Chrome extension.)
- [x] **D4.** Captured the light-units gotcha as
  `knowledge/foundry-api/ambient-light-radii-distance-units.md` (image-model
  routing/Imagen-mapping gotchas already existed in `knowledge/ai-services/`).

### E. Release
- [x] **E1.** Released **v2.0.0**. CHANGELOG entry + `module.json`/`package.json`
  bumped to 2.0.0; added `.gitattributes` export-ignore for clean release zips.
  Merged `hardening-v2` → `main` (merge `7935c0f`), pushed, tagged `v2.0.0`,
  and created the GitHub release with `module.json` + `vibe-scene-two.zip`
  assets. Verified Latest + manifest/download URLs resolve (200).

---

## Implementation Order

Ordered to land low-risk parity first, then fixes that need a running Foundry,
then verification, then release. Each phase is a natural subagent batch.

1. **Phase 1 — Packaging parity (A1–A6).** Pure file/scaffolding work, no
   runtime needed. Get the module *looking* like a sibling. Safe to parallelize
   across subagents (e.g. one does scaffolding A2–A4, one does A1/A5/A6).
2. **Phase 2 — Correctness code fixes (B1, B2, B3).** Code changes that DON'T
   yet require Foundry to write, but DO require Foundry to verify. Do B1 first
   (highest impact). B2 is a decision + small routing/doc fix. B3 last.
3. **Phase 3 — Robustness (C1–C3).** Layer on after the core is correct.
4. **Phase 4 — Live verification (D1–D4).** Spin up Foundry, drive the UI via
   the Claude Chrome extension, exercise both pipelines, fix fallout. This is
   where B1/B2 actually get confirmed. Loop back to Phase 2/3 as bugs surface.
5. **Phase 5 — Release (E1).** CHANGELOG + version bump + tag once verified.

Rationale: parity work is risk-free and makes the module shippable-looking
immediately; correctness fixes are written before the test pass so verification
covers them in one Foundry session; release is gated on a clean end-to-end run.

---

## Testing / Verification Setup (for the implementing session)

- **Foundry world is running.** Drive it via the **Claude Chrome extension**
  (`mcp__claude-in-chrome__*`; load schemas via ToolSearch). Foundry's canvas is
  WebGL — prefer the module's own console logs + DOM/snapshot for assertions,
  and screenshots for the visual map result.
  - Local: `http://192.168.86.48:30000/`
  - Internet: `http://174.53.226.172:30000/`
- **Login:** log in **using Claude** (the "Claude" world/user) — **no password**.
- The module exposes `game.modules.get("vibe-scene-two").api.GeneratorApp`, and
  a scene-control button ("Vibe Scene Two (Experimental)") under the tokens
  group. Generated scenes land in `worlds/<world>/ai-scenes/`.
- Requires a valid Gemini API key in vibe-common settings
  (`game.settings.get("vibe-common","geminiApiKey")`) for any real generation.
- Watch the browser console for `ScenePipeline | ... PHASE N` and
  `SceneBuilder | Placed N wall segments ...` log lines as phase checkpoints.

## Next Session

Start fresh, boot the Memory Bank (AGENTS.md → latest log → this file →
`knowledge/` for `application-v2` / `foundry-api` / `ai-services`), then begin
**Phase 1 (packaging parity)**. Launch subagents per phase as needed; verify
each fix in live Foundry before checking it off. Update this file's checkboxes
and Status as you go.

## Navigation
- [Back to projects index](../AGENTS.md)
