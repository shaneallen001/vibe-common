# Pre-Release Polish & Feature List

Based on the [marketplace_plan.md](file:///c:/Users/allen/AppData/Local/FoundryVTT/Data/modules/vibe-combat/marketplace_plan.md) and an analysis of the module architecture in the READMEs, here is a comprehensive list of polish items and technical debt that should be addressed prior to a general public release of the Vibe Suite.

## 🔴 High Priority (Release Blockers for Premium Quality)

### ~~1. ApplicationV2 / DialogV2 Full Migration~~ **(RESOLVED)**
~~Foundry v16 will entirely remove the V1 application framework. Relying on it makes the modules look outdated and risks breakage.~~
*   ~~**vibe-scenes**: Migrate `VibeSceneDialog`, [VibeStudio](file:///c:/Users/allen/AppData/Local/FoundryVTT/Data/modules/vibe-scenes/scripts/ui/vibe-studio-dialog.js#11-147), `AssetLibrary`, and its sub-dialogs from V1 [Dialog](file:///c:/Users/allen/AppData/Local/FoundryVTT/Data/modules/vibe-actor/scripts/ui/dialogs/vibe-actor-dialog.js#12-109)/`Application` to `ApplicationV2`.~~ 
*   ~~**vibe-combat**: Update any remaining V1 dialogs (e.g., save, load, and actor adjustment dialogs) to `ApplicationV2` or `DialogV2`.~~
*   ~~*(This is the largest piece of technical debt currently tracked).*~~

### ~~2. Unified Settings & API Key Handling~~ **(RESOLVED)**
~~Currently, a user has to set their Gemini API key multiple times (e.g., in `vibe-combat` and `vibe-scenes` individually).~~
*   ~~**Fix**: Move the core API key configuration into `vibe-common` and have the other modules read from it. This provides a single "Vibe Project" configuration hub.~~
*   ~~**Error Handling**: If a user attempts to run an AI task but the API key is missing, invalid, or exhausted, display a friendly `ui.notifications.error` or an in-app warning linking them directly to the settings configuration, rather than failing silently or throwing a red console error.~~

### ~~3. Graceful Dependency Checks~~ **(RESOLVED)**
~~`vibe-actor`, `vibe-combat`, and `vibe-scenes` all rely heavily on `vibe-common`. If a user installs a module but doesn't enable `vibe-common` (or uninstalls it), the child modules will currently throw script errors and break.~~
*   ~~**Fix**: Add a check in the `init` or `ready` hook of the child modules to verify `game.modules.get("vibe-common")?.active` is true. If not, trigger a polite `ui.notifications.error` and abort module initialization cleanly.~~

---

## 🟡 Medium Priority (UX and Maintainability)

### ~~4. Code Deduplication: Centralize the AI Agent Pipeline~~ **(RESOLVED)**
~~Both `vibe-actor` and `vibe-combat` contain nearly identical duplicate copies of the NPC generation pipeline (`ArchitectAgent`, `QuartermasterAgent`, `BlacksmithAgent`, and `GeminiPipeline`).~~
*   **Resolution**: Since `vibe-combat` no longer actively needs to generate *completely new* NPCs during standard Encounter Suggestion flows (it uses the world/compendium catalog), the duplicate pipeline code was entirely deleted from `vibe-combat`. If other modules need generation, `vibe-actor` now exposes its `GeminiPipeline` as a public API via `game.modules.get("vibe-actor").api`.

### 5. Localization (i18n) Support
Premium Foundry modules should not have hardcoded English strings embedded in their HTML templates and JS logic. 
*   **Fix**: Extract all user-facing text (button labels, dialog headers, notifications) into `lang/en.json` files. Use `game.i18n.localize()` strings in the UI. This is a hallmark of a polished, marketplace-ready module.

### ~~6. Robust Progress Indicators & Cancellation~~ **(RESOLVED)**
~~AI generation can be slow, especially for full dungeon generation in `vibe-scenes` or complex NPC generation in `vibe-actor`.~~
*   ~~**Fix**: Ensure every AI task has a clear loading overlay or progress bar (currently `vibe-scenes` has some, but confirm they cover the entire flow).~~
*   ~~**Cancellation**: Ensure `AbortSignal` is fully wired up so users can cancel long-running requests without having to refresh the browser.~~

### ~~7. Compendium Index Auto-Refresh~~ **(RESOLVED)**
~~In `vibe-combat`, the `PACK_INDEX_CACHE` caches compendium indices for fast AI lookups.~~
*   ~~**Issue**: If a GM creates a new custom item or actor and adds it to a compendium during a session, the AI won't see it until next load.~~
*   ~~**Fix**: Hook into Foundry document create/update events for Compendiums to automatically invalidate or update the `PACK_INDEX_CACHE`.~~

---

## 🟢 Low Priority (Nice-to-Haves & Extra Polish)

### ~~8. AI Error Boundaries & Auto-Retries~~ **(RESOLVED)**
~~Gemini can occasionally return malformed JSON or ignore the requested schema, especially with the smaller/faster models.~~
*   ~~**Fix**: Implement a robust fallback UI. If `extractJson` completely fails to parse a response, the UI should show: *"The AI returned unexpected data. [Click to Retry]"* rather than breaking the application flow.~~

### ~~9. Unified "Vibe Menu" App~~ **(RESOLVED)**
~~Instead of distinct UI buttons scattered around the Foundry interface (one in Actors tab, one in Combat tab, one in Scenes tab), consider adding a unified standalone "Vibe Suite" control button to the main tool controls (the left-hand sidebar) with a sleek fly-out menu giving access to the Actor Generator, Combat Builder, and Scene Generator.~~

### ~~10. `vibe-scenes` Asset Optimization~~ **(RESOLVED)**
~~As the `library.json` grows with hundreds of AI-generated SVG textures and items, the `AssetLibrary` UI might lag when loading.~~
*   ~~**Fix**: Introduce lazy-loading or pagination for the `AssetLibrary` viewport. Ensure sanitized SVGs are as small as possible before writing to disk.~~

---

## 🔮 Phase 2 Polish & Architecture (New Ideas)

Now that Phase 1 items (ApplicationV2 migration, unified settings, API key deduplication) are largely resolved, here are the deeper structural and UI concepts to elevate the Vibe suite into a highly cohesive, world-class Foundry package. The following items are sorted in a recommended logical order of operations, including complexity estimates.

### 11. System for AI Developer Context (README System)
**Complexity:** Low
*   **Rationale for Order:** Establishing documentation standards provides a solid foundation before tackling complex code changes. This ensures any downstream AI assistance has maximum context.
*   **Idea**: Establish a split documentation system.
    *   **User README.md**: Focuses purely on features, configuration, installation, and how to use the UI. (The user "bible").
    *   **Developer `ARCHITECTURE.md` (or `AI_CONTEXT.md`)**: A standardized AI-optimized markdown file in *every* module containing:
        1. **Data Flow Diagrams**: e.g., The multi-stage pipeline of Architect -> Quartermaster -> Blacksmith -> Builder.
        2. **State Management**: Clearly label whether a manager is *Instance-scoped in memory* (like `EncounterManager`) vs. *Disk-backed JSON* (like `AssetLibraryService`).
        3. **Entry Points & Hooks**: Exactly which Foundry Hooks injected the UI buttons and at which stage.
        4. **Gemini Payloads**: Examples of the exact JSON schema the module expects from Gemini.
*   **Impact**: When an AI developer is asked to add a feature, they can ingest `ARCHITECTURE.md` and immediately know where the state lives and how the modules communicate without blindly reading directory trees. The `README.md` acts as the user bible, as requested in global rules.

### 12. Public API Exports for the Entire Ecosystem
**Complexity:** Low
*   **Rationale for Order:** A quick win that exposes existing logic without requiring major frontend or backend structural changes.
*   **Idea**: `vibe-actor` already exposes its `GeminiPipeline` as a public API (`game.modules.get("vibe-actor").api`), allowing other scripts to generate NPCs programmatically. This pattern should be standardized across the suite.
    *   **`vibe-combat` API**: Export the `EncounterSuggestionService` and `calculateXpBudgets` logic.
    *   **`vibe-scenes` API**: Export `DungeongenService.generate()` and `AiAssetService.generateSVG()`.
*   **Impact**: Transforms the Vibe suite from isolated tools into a powerful AI computing layer for Foundry that other developers can build upon.

### 13. Unify the "Vibe UI Shell" Pattern
**Complexity:** Medium
*   **Rationale for Order:** Sets the foundational UI architecture in `vibe-common` that the next steps will build inside.
*   **Idea**: Vibe Combat introduced a sleek, modern ApplicationV2 layout that feels premium. Currently, UI structures mirror this logic but use distinct, siloed definitions per module. Extract the Vibe Combat shell container (window frame, header, navigation tabs, loading overlay) into a reusable `VibeApplicationV2` or `VibeDialogV2` base class exported from `vibe-common`.
*   **Impact**: Ensure `vibe-actor`, `vibe-scenes`, and `vibe-combat` all share the *exact* same layout proportions, form group patterns, button classes, font weights, and color tokens. This guarantees visual consistency and makes adding new modules painless.

### 14. Shared Component Library
**Complexity:** Medium
*   **Rationale for Order:** Naturally builds upon the unified UI Shell to standardize the specific inputs, toggles, and sliders inside the windows.
*   **Idea**: Beyond just CSS variables, create reusable logic components in `vibe-common` for UI elements: custom select dropdowns, animated toggle switches, stylized scrollbars.
*   **Impact**: Removes boilerplate HTML from `vibe-actor` and `vibe-scenes` Handlebars templates, ensuring Vibe Combat’s sleek inputs are ubiquitous across the entire software suite.

### 15. Premium Notification & Toast System
**Complexity:** Low/Medium
*   **Rationale for Order:** An isolated UI improvement that can be safely built on top of the newly standardized design tokens.
*   **Idea**: Standard `ui.notifications` are functional but visually mundane. Implement a custom, non-blocking toast notification manager in `vibe-common`.
*   **Impact**: AI progress ("Generating Blueprint...", "Painting Textures...") and errors ("Gemini API Rate Limit Reached") appear in beautiful, Vibe-branded slide-in notifications that match the dark/glassmorphic aesthetic of the tools.

### 16. Streaming Prompt Responses
**Complexity:** High
*   **Rationale for Order:** Requires refactoring the core `GeminiService` and how UI components subscribe to data. Best done once the UI components themselves are stable.
*   **Idea**: High-latency AI calls (especially for `vibe-actor` biographies or `vibe-scenes` flavor text) can feel slow while waiting for the full JSON response. Refactor `GeminiService` to use `stream: true` where appropriate, updating the UI with a typing effect for conversational/flavor text generation.
*   **Impact**: Greatly improves perceived performance and provides visual feedback during long generations.

### 17. Real-time RAG Context Sharing (The "World Lore" Index)
**Complexity:** Very High
*   **Rationale for Order:** The most ambitious and difficult feature. Requires cross-module communication, storage, and dynamic prompt injection.
*   **Idea**: Currently, generation is "stateless"—`vibe-actor` generates an NPC without knowing about the dungeon `vibe-scenes` just built. Introduce a lightweight, shared "World Lore" or "Active Context" text pool in `vibe-common` that records recent AI actions, generation summaries, or GM notes.
*   **Impact**: When `vibe-actor` generates a guard, the prompt automatically injects: "Context: The party is currently in the Sunken Keep of Baelor." The generated NPC's biography will natively reference the location generated by `vibe-scenes`.
