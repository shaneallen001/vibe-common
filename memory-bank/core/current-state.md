# Current State

**Last Updated:** 2026-02-23

- We have updated the memory bank to centralize it in the `vibe-common` module.
- `vibe-scene-two` image generator attempts to convert SVGs to JPEG bounds using an offscreen canvas. It now successfully redirects SVG-guided requests through the `gemini-2.5-flash-image:generateContent` or `gemini-3-pro-image-preview:generateContent` APIs (based on user settings) for img2img composition, while falling back to `imagen-4.0-generate-001:predict` for pure text-to-image without a reference layout.
- The pipeline now correctly offsets cartography elements (walls, lights, journals) to match map padding coordinates (`sceneX/Y`), determines the actual image dimensions asynchronously for correct grid scaling (now set to 40px base to correct token size), and supports parsing passages/doors from `<line>` SVG elements.
- Journal entries are now deterministically mapped from the text outline to the SVG `<rect>` elements via explicit `id` and `data-room-id` attributes, resolving misalignment issues.
- `vibe-scene-two` layout generation now features a UI toggle giving users explicit control over whether Room text labels are visually painted directly onto the final scene image.
- `vibe-scene-two` image generation pipeline now saves out the intermediate abstract SVG map as a JPEG to the `Data/worlds/<world>/ai-scenes` folder alongside the generated map to allow for wall discrepancy debugging.
- Extracted SVG preview UI to scale `60vh` and auto-fit on smaller screens with description labels fixed below the images. Previews dynamically disappear during `isGenerating` blocks while routing via `VibeToast` loading prompts.
- Added an experimental placeholder `InpaintingPipeline` to test room-by-room generation mapping via individual SVG object extractions to attempt to perfect structure generation.
- Added a 🎲 random prompt generator button on Step 1 of the scene generator UI, pulling from four 40-item word tables (mood, location, feature, environment) for rapid testing.
- `vibe-scene-two` has been initialized and pushed to remote GitHub `shaneallen001/vibe-scene-two`.
- An experimental pass mapping Foundry wall splines via Gemini Vision tracing (Phase 3.5) was developed and subsequently completely reverted due to unreliable structural bounding in complex multi-room logic loops. The codebase operates completely through the standard SVG to Foundry rect conversion logic.
