# Vibe Suite v2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` for implementation when tasks can run independently, or `superpowers:executing-plans` for sequential release/checkpoint work. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Save, publish, and stabilize the current Vibe Suite work, then add a fast verification layer so future Vibe Actor, Vibe Common, Vibe Combat, and Vibe Scene Two updates can move faster with less manual retesting.

**Architecture:** Treat `vibe-common` as the shared API/settings/test foundation, then verify sibling modules against it before release. Do not add more feature work until the current model-routing, image-routing, Foundry v14, and documentation changes are committed, pushed, tagged, and tested in a live Foundry desktop world.

**Tech Stack:** Foundry VTT v14 desktop app, JavaScript ES modules loaded directly by Foundry, Git/GitHub releases, Node syntax checks, small browser/Foundry smoke harnesses, shared Memory Bank notes in `vibe-common/memory-bank/`.

---

## Operating Rules

- Work in small commits, one module/repo at a time.
- Preserve existing uncommitted work; inspect diffs before editing and do not revert user changes.
- Prefer subagents for independent read/verify/report tasks, but keep final release decisions and live Foundry control in the main agent.
- Always run `node --check` on changed `.js` files before claiming code is ready.
- For Foundry behavior, verify in the Foundry desktop app when OpenAI APIs are involved because browser tabs may hit CORS.
- Batch live verification into as few Foundry sessions as possible. The user should only need to start the game server, keep the sandbox world available, and answer blockers that require local-only context.
- When the game is running, the agent should log in, drive the UI, run console probes/macros, capture browser console output, and summarize pass/fail evidence without asking the user to click through checklists.
- Update changelogs before publishing, and update the Memory Bank at session close.

## Efficiency Model

**User role:** start Foundry, load the sandbox world, keep the server reachable, and leave API keys/settings in place. If credentials changed, tell the agent the login user/password; otherwise the expected user is `Claude` with no password.

**Agent role:** connect to the running game, log in, reload the client when code changes require it, exercise the modules, inspect settings and generated documents through the Foundry console, collect screenshots/logs, and fix release-blocking issues.

**Reachable Foundry URLs:**

- Tailscale/LAN: `http://100.116.91.21:30000/`
- Public fallback: `http://174.53.226.172:30000/`

Use the Tailscale/LAN URL first. Fall back to the public URL if the first is unavailable.

## Phase 0: Inventory And Freeze Scope

**Purpose:** Know exactly what is already changed before committing or publishing.

- [ ] In each repo, run `git status --short`: `vibe-common`, `vibe-actor`, `vibe-combat`, `vibe-scene-two`.
- [ ] In each repo with changes, run a focused `git diff --stat` and inspect changed files.
- [ ] Separate changes into buckets:
  - release-now: model routing, GPT-5.5 actor generation, image routing, v14 fixes, docs/changelog updates.
  - test-next: smoke harnesses, test macros, model health checks.
  - defer: speculative feature work or larger refactors.
- [ ] Confirm there are no local-only secrets, logs, screenshots, generated images, or console dumps staged for commit.
- [ ] If any generated diagnostics should be kept, move them to ignored scratch/dev locations rather than shipping them.

**Efficiency path:** Dispatch one subagent per repo to summarize status, changed files, and release risk in parallel. Main agent reviews the summaries, decides the release scope, and only interrupts the user if a repo contains ambiguous changes that cannot be classified safely.

**2026-07-08 status:** Inventory complete. `vibe-common` and `vibe-actor` have release-now changes; `vibe-combat` and `vibe-scene-two` are clean. `console-logs-latest.txt` is scratch and must not be staged.

## Phase 1: Save And Publish Current Work

**Purpose:** Get the current working improvements safely into GitHub before more changes are layered on top.

### vibe-common

- [ ] Review current changes to `scripts/settings.js`, `scripts/services/gemini-service.js`, `scripts/services/openai-service.js`, `scripts/ui/vibe-menu-injector.js`, docs, and Memory Bank notes.
- [ ] Verify shared settings still register cleanly:
  - `geminiApiKey`
  - `openaiApiKey`
  - `imageGenerationModel`
  - `actorGenerationModel`
  - `menuPlacement`
- [ ] Run `node --check` on all changed JS files.
- [ ] Commit with a message such as `feat: add shared ai model routing settings`.
- [ ] Push the branch/mainline to GitHub.

### vibe-actor

- [ ] Review current changes to actor generation, image generation, dialog startup, and changelog.
- [ ] Verify the selected actor model chooses the right key:
  - Gemini Auto uses `geminiApiKey`.
  - GPT-5.5 low/medium use `openaiApiKey`.
- [ ] Run `node --check` on all changed JS files.
- [ ] Commit with a message such as `feat: support gpt-5.5 actor generation`.
- [ ] Push the branch/mainline to GitHub.

### vibe-scene-two

- [ ] Review pending image-routing, scene-background, ApplicationV2, and scene-control fixes.
- [ ] Run `node --check` on all changed JS files.
- [ ] Confirm the v14 Level background handling remains in place.
- [ ] Commit with a message such as `fix: harden foundry v14 scene generation`.
- [ ] Push the branch/mainline to GitHub.

### vibe-combat

- [ ] Check whether it needs any compatibility update for shared `vibe-common` settings/API changes.
- [ ] If unchanged, record that it was checked.
- [ ] If changed, run `node --check`, commit, and push.

**Efficiency path:** Use parallel subagents for repo-specific diff review and syntax-check plans. Keep commit/push in the main agent unless explicitly delegated. Do not wait for live Foundry before saving clearly scoped source/doc changes; live verification happens as one batched pass after syntax checks.

## Phase 2: Release Hygiene

**Purpose:** Make GitHub and Foundry releases match the code users should install.

- [ ] Confirm each module has a clean `module.json` version and compatibility range.
- [ ] Confirm changelogs include the released behavior:
  - GPT-5.5 low/medium actor generation.
  - OpenAI GPT Image 2 image generation.
  - Gemini 3.5 Flash text fallback chain.
  - Foundry v14 scene background Level handling.
  - Scene control `onChange` cleanup.
- [ ] Build release zips using the existing release process for each module.
- [ ] Create or update GitHub releases with `module.json` and zip assets.
- [ ] Verify every manifest URL and download URL returns 200.
- [ ] Note release tags and URLs in the Memory Bank session log.

**Subagent option:** One subagent can verify GitHub release URLs and asset availability while the main agent prepares release notes.

## Phase 3: Test Foundation First

**Purpose:** Add fast checks so future work does not require full manual Foundry runs every time.

**Efficiency target:** build the smallest useful harness first. The first pass only needs to catch syntax errors, import/global-shim failures, and model-routing regressions; broader test coverage can wait until after the current work is saved and published.

### Shared Node Checks

- [ ] Add a root or per-repo script that runs `node --check` over all shipped `.js` files while excluding ignored/dev/generated files.
- [ ] Add a lightweight import smoke check for `vibe-common` services that can run with mocked `game`, `foundry`, and `ui` globals where needed.
- [ ] Document the command in each repo README or AGENTS file.

### Vibe Common Model Health

- [ ] Add a small settings-driven health check utility for:
  - Gemini key present.
  - OpenAI key present.
  - actor generation model resolves to the expected provider.
  - image generation model resolves to the expected provider.
- [ ] Expose this as a developer console helper first.
- [ ] Later promote it to a UI button if useful.

### Vibe Actor Smoke Harness

- [ ] Create a dry-run harness that validates prompt assembly and schema parsing without creating an Actor document.
- [ ] Add mocked responses for:
  - Gemini-style JSON.
  - OpenAI Responses-style JSON.
  - invalid JSON followed by repair.
- [ ] Test the model routing matrix:
  - `gemini-auto`
  - `gpt-5.5-medium`
  - `gpt-5.5-low`

### Vibe Scene Two Smoke Harness

- [ ] Add a focused test for image model resolution:
  - `gpt-image-2`
  - `dall-e-3`
  - `imagen-3`
  - `imagen-4`
  - Gemini image preview models.
- [ ] Add a pure check for Foundry v14 Level background update shape.
- [ ] Keep live scene generation as a manual/desktop verification step.

**Efficiency path:** Dispatch one subagent per harness area only after release-now work is committed. If time is tight, do just the shared syntax runner and model-routing checks first, then defer the actor/scene dry-run harnesses.

**2026-07-08 status:** Added repo-local `npm run check` syntax runners to `vibe-common` and `vibe-actor`. Both pass. Ran a no-network routing smoke for OpenAI/Gemini helper decisions; it passes 8 assertions.

## Phase 4: Agent-Driven Live Foundry Verification Loop

**Purpose:** Confirm the suite works in the real runtime after automated checks pass, with the agent doing the clicking, console probes, and evidence capture.

- [ ] User starts Foundry and loads the sandbox world.
- [ ] Agent connects to `http://100.116.91.21:30000/`; if unavailable, use `http://174.53.226.172:30000/`.
- [ ] Agent logs in as `Claude` with no password unless told otherwise.
- [ ] Agent reloads the client once after any code changes so Foundry loads the current module scripts.
- [ ] Agent verifies Vibe Common settings render and retain all new model choices:
  - `actorGenerationModel`
  - `imageGenerationModel`
  - `geminiApiKey`
  - `openaiApiKey`
- [ ] Agent runs a console preflight and records the output:
  - active Foundry version/build.
  - enabled `vibe-*` modules and versions.
  - configured actor/image generation models.
  - whether Gemini/OpenAI keys are present, without printing secret values.
- [ ] Agent generates one actor with Gemini Auto.
- [ ] Agent generates one actor with GPT-5.5 low.
- [ ] Agent generates one actor with GPT-5.5 medium.
- [ ] Agent generates one actor portrait with `gpt-image-2`.
- [ ] Agent generates one custom item icon with `gpt-image-2`.
- [ ] Agent generates one Vibe Scene Two scene using the preferred image model.
- [ ] Agent confirms through the Foundry console that the generated scene has a first Level background image, not only an overlay tile.
- [ ] Agent captures screenshots or document summaries for successful actor/portrait/icon/scene outputs.
- [ ] Agent captures console errors/warnings and fixes only release-blocking issues.

**Subagent option:** Subagents can inspect saved logs and summarize console errors, but live UI driving should stay with one controlling agent to avoid state collisions.

**Manual fallback:** If browser automation cannot reach the game, ask the user for a fresh console log export and one screenshot per failed workflow. This is a fallback, not the primary path.

**2026-07-08 status:** Agent connected to `http://100.116.91.21:30000/`, logged in as `Claude`, verified Vibe Common settings render with both keys present and the new model choices, verified the shared Vibe Suite menu exposes Vibe Actor, Vibe Combat, and Vibe Scene, generated one Gemini Auto direct-pipeline CR 0 actor with images disabled (`Clockwork Moth Scout`), and opened Vibe Scene/Vibe Combat successfully. OpenAI live calls were intentionally skipped in the browser to avoid CORS failures and API spend.

## Phase 5: Remaining Hardening And Quality Work

**Purpose:** Once releases and tests are in place, resume improvements with faster feedback.

- [ ] Centralize provider/model routing into a dedicated shared module, likely `vibe-common/scripts/services/ai-model-router.js`.
- [ ] Add friendly user-facing model/provider diagnostics.
- [ ] Add fallback policy:
  - GPT-5.5 low can retry with GPT-5.5 medium after repeated schema failures.
  - OpenAI CORS errors explain desktop app requirement.
  - Gemini 404s fall through cleanly and log the selected fallback.
- [ ] Add generated-by metadata where practical:
  - actor generation model.
  - image generation model.
  - timestamp.
- [ ] Improve Vibe Actor retry repair to patch invalid fields rather than regenerate everything when feasible.
- [ ] Add README screenshots after the UI and model settings stabilize.
- [ ] Update Memory Bank knowledge entries for any new Foundry/OpenAI/Gemini gotchas.

## Phase 6: Final Suite Release

**Purpose:** Ship the stabilized v2 line as a coherent suite.

- [ ] Confirm all repos are clean except intentionally ignored local files.
- [ ] Run all Node checks and smoke harnesses.
- [ ] Run the live Foundry verification checklist once.
- [ ] Bump versions consistently across modules.
- [ ] Tag releases.
- [ ] Publish GitHub releases.
- [ ] Verify manifest/download URLs.
- [ ] Write a Memory Bank log summarizing:
  - commits
  - tags
  - release URLs
  - verification results
  - known follow-ups

## Recommended Execution Order

1. Inventory all repos in parallel.
2. Commit and push the current release-now work.
3. Add the smallest useful syntax/model-routing checks.
4. Ask the user to start Foundry once.
5. Agent logs in and runs the full live verification checklist.
6. Fix only release blockers found in that pass.
7. Publish current releases.
8. Continue the broader smoke harnesses and remaining hardening.
9. Publish the final stabilized suite release.

This order matters: it minimizes user effort, protects the current working state early, and turns the expensive live Foundry pass into one batched agent-driven session instead of a back-and-forth manual checklist.
