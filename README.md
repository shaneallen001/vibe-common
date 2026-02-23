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
## Features
- **Shared API Services**: Centralized Gemini API clients, context handling, and SSE streaming utilities.
- **Vibe UI Shell**: Provides cohesive base application classes (`VibeApplicationV2`), pre-styled components (animated toggles, clean selects), and a premium sliding `VibeToast` notification system utilized across all Vibe modules.

## Installation
This module is automatically required by `vibe-combat`, `vibe-actor`, and `vibe-scenes`. Ensure it is installed and enabled in your Foundry VTT world.

## Configuration
Go to **Settings -> Configure Settings -> Vibe Common**:

-   **Gemini API Key**: Required for AI generation in `vibe-combat`, `vibe-actor`, and `vibe-scenes`.
-   **OpenAI API Key**: Required for image generation in `vibe-actor`.

All Vibe modules share these centralized API keys, so you only need to configure them once.

---

## Developer Guide

For information on the module's architecture, API clients, shared data, CSS tokens, and hooks, please see [ARCHITECTURE.md](./ARCHITECTURE.md).

## Future Work & Roadmap

### Common Code Expansion
-   **Unified Settings Manager**: A centralized way to manage API keys and shared preferences across all Vibe modules.
-   **Enhanced Error Handling**: A global error reporting system to catch and log AI-related failures more effectively.

### Large Scale Refactoring
-   **Service Injection**: Move towards a dependency injection pattern for clearer service management.
-   **Type Safety**: Continue migrating core logic to JSDoc/TypeScript for better developer tooling support.

## Recent Changes
- Added the `memory-bank-protocol` skill, defining the project's Memory Bank and global directives, establishing `vibe-common` as the central location for all memory bank state and rules.
- Added `Gemini Imagen 4.0` to the **Image Generation Model** module setting in `vibe-common`.
- Fixed a 404 error during image generation by correctly mapping the 'imagen-3' and 'imagen-4' options to their full respective API model names in the `v1beta` API endpoint.
- Handled potential AI safety filter blocks securely, surfacing these errors to the user instead of generic failures.
- Fixed a deprecation warning related to the global `FilePicker` variable in image saving logic, preparing for Foundry V15.
- Fixed double window spawning when clicking Vibe Suite tools by removing deprecated `onClick` handlers in favor of V13+ `onChange` logic in `vibe-menu-injector.js`.
- Fixed an import error in `image-generator.js` that caused Vibe Actor to fail by properly exporting `getImageGenerationModel` from `vibe-common/scripts/settings.js`.
- (vibe-scene-two) Fixed issue with SVG building too many walls for small props by updating prompt to only allow room/macro shapes.
- (vibe-scene-two) Updated pipeline and image-generator to convert the layout SVG into a base64 JPEG using an offscreen canvas then forward it to Imagen 4.0 as a guiding instance image.
- (vibe-scene-two) Fixed Journal placement bugs by requiring the AI to map unique `id`s to rooms in the outline directly into the SVG using `data-room-id` attributes, ensuring reliable assignment.
- (vibe-scene-two) Scaled the map grid to 40 pixels for appropriate token sizes and added a UI toggle to allow the user to control whether or not room text labels should be generated directly on the image.
## Developer Gotchas & Lessons Learned

### Foundry V13+ Scene Controls `onClick` vs `onChange`
When adding custom tools to the Foundry VTT Scene Controls menu (`getSceneControlButtons` hook), be aware that the `onClick` handler is **deprecated as of Version 13** and will be removed in Version 15. The core software now prefers the `onChange` handler.

**The Gotcha:** If you define *both* `onClick` and `onChange` for a button-type tool (e.g. `button: true`), Foundry will fire both handlers. If the handler's job is to open an application or dialog, defining both will result in **two windows spawning simultaneously**.

**The Solution:** Only define the `onChange` handler for button tools. If backwards compatibility with much older Foundry versions is strictly required, ensure the logic inside checks for an already-open instance before rendering, but for V12/V13+, simply dropping `onClick` entirely is the cleanest approach.

### Foundry Default Input Heights vs Padding
By default, Foundry VTT's core global styles explicitly restrict `input` and `select` elements to `height: 26px`.

**The Gotcha:** When designing custom stylized components with `vibe-theme.css`, adding standard padding (e.g., `padding: 7px 10px;`) without explicitly changing the height will squash the content box to around `10px`, cropping standard `13px` text. But even after increasing the height (`height: 32px;`), retaining vertical padding on native `input` and `select` elements can still cause the text to render misaligned or cropped at the bottom across different browsers.

**The Solution:** Always explicitly declare a custom `height` (e.g., `height: 32px;`) AND remove vertical padding entirely (e.g., `padding: 0 10px;`) on `.vibe-dialog-form input` and `select` elements to ensure the content area reliably displays text vertically centered without clipping.
