# Progress

**Last Updated:** 2026-02-24

- Centralized memory bank created in `vibe-common`.
- Updated vibe-scene-two pipeline to convert abstract SVG maps into JPEG instances to guide final Imagen 4 generation, and restricted the SVG to only emit macro architectural layouts to prevent minor furniture objects from being physically walled.
- Fixed Foundry scene mapping scale issue by detecting native img dimensions rather than forcing 4000x4000.
- Re-aligned invisible walls / map components by respecting Foundry's internal `sceneX/sceneY` margins.
- Injected `<line>` instruction to Cartographer Gemini to draw doors/passages, and implemented door extraction in `scene-builder.js`.
- Fixed fragile journal mapping so notes correctly assign to rooms matching by `data-room-id`.
- Initialized `vibe-scene-two` git repository and pushed to `shaneallen001/vibe-scene-two` remote.
- Set generative map grid resolution strictly to `40px` instead of `100px` for appropriately scaled Foundry tokens.
- Implemented a UI toggle for generating visual room names, piping state from `GeneratorApp` through `ScenePipeline` directly into AI cartographer and image generator prompt formulations.
- Plumbed `image-generator.js`, `pipeline.js`, and `scene-builder.js` to persist the `-layout.jpg` debug map to the foundry world to allow checking wall boundary discrepancies.
- Implemented and fully reverted an experimental AI Vision module for drawing walls based on image bounding, confirming that relying on SVG coordinates is highly preferable to using generative visual approximations for structural logic.
- Implemented UI enhancements to completely hide the SVG and Image preview windows during long generations while surfacing exact pipeline load states via interactive `VibeToast` popups.
- Scaled up the `<img/>` and `<svg/>` rendering viewports to `60vh` instead of fixed pixel heights to make bounds readable on 1080p+ screens while not hiding the navigation footer buttons.
- Drafted a scaffold `InpaintingPipeline` test service class as a separate codebase flow that users can explicitly check to test mask-driven room-by-room compositional synthesis instead of entire diffusion passes.
- Added a random scene prompt generator (dice button) to Step 1 with 40-item tables for moods, locations, features, and environments to accelerate testing cycles.
- **UI Overhaul**: Redesigned Step 1 prompt window, Step 2 SVG preview (horizontal split layout), and replaced in-window loading with a dedicated `ProgressDialog` featuring scrolling text log and SVG room-blink silhouette animation. Created `styles/vibe-scene-two.css`.
- **SVG Always Includes Labels**: Moved label control from SVG generation to image generation. `svg-generator.js` always emits room name `<text>` elements. `image-generator.js` strips `<text>` nodes from SVG before JPEG conversion when `removeRoomLabels` is true (default).
- **Step 2 Toggleable Options**: Replaced the Step 1 `includeRoomLabels` checkbox with four Step 2 controls: Generate Walls, Tile Overlay, Remove Room Labels, Inpainting Pipeline. Added a scrollable room list panel showing room names and purposes.
- **Scene Builder Enhancements**: `generateWalls` toggle skips wall placement. `includeTileOverlay` saves layout JPEG as a semi-transparent Tile on the scene.
- **SVG Door Orientation Fix**: Added explicit door orientation rules to the prompt — doors must be parallel to the shared wall. Added no-overlap rule (areas, not edges).
- **Progress Dialog Redesign**: Replaced blocky blink animation with construction beam trace animation (SVG stroke-dasharray paths with glow filter). Dark ambient background, glassmorphism log, modern ring spinner.
