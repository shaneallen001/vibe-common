# Current State

**Last Updated:** 2026-02-22

- We have updated the memory bank to centralize it in the `vibe-common` module.
- `vibe-scene-two` image generator attempts to convert SVGs to JPEG bounds using an offscreen canvas. It now successfully redirects SVG-guided requests through the `gemini-2.5-flash-image:generateContent` or `gemini-3-pro-image-preview:generateContent` APIs (based on user settings) for img2img composition, while falling back to `imagen-4.0-generate-001:predict` for pure text-to-image without a reference layout.
- The pipeline now correctly offsets cartography elements (walls, lights, journals) to match map padding coordinates (`sceneX/Y`), determines the actual image dimensions asynchronously for correct grid scaling, and supports parsing passages/doors from `<line>` SVG elements.
- Journal entries are now deterministically mapped from the text outline to the SVG `<rect>` elements via explicit `id` and `data-room-id` attributes, resolving misalignment issues.
