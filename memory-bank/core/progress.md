# Progress

**Last Updated:** 2026-02-23

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
