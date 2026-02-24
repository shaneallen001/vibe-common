# Current State

**Last Updated:** 2026-02-24

- Memory bank centralized in `vibe-common`.
- `vibe-scene-two` is on branch `dev-phase2-polish`, pushed to `shaneallen001/vibe-scene-two`.
- **SVG Generator** always includes room name text labels. The old conditional `includeRoomLabels` toggle from Step 1 has been removed. Label stripping now happens downstream in `image-generator.js` via DOM manipulation (`removeRoomLabels` option, default true).
- **SVG Prompt** includes explicit layout rules: rooms must share walls (edges touching), no area overlap, and door `<line>` elements must be parallel to their shared wall edge (vertical edge = vertical line, horizontal edge = horizontal line).
- **Step 2 UI** now has 4 toggleable checkboxes: Generate Walls (default ON), Include Layout as Tile Overlay (default OFF), Remove Room Names from Final Image (default ON), Experimental Inpainting Pipeline. A scrollable room list panel shows each room's name and purpose from the outline.
- **Scene Builder** respects `generateWalls` (skips wall placement when false) and `includeTileOverlay` (saves layout JPEG as a semi-transparent Tile on the scene when true).
- **Progress Dialog** redesigned with: animated gradient progress bar, phase badge (Designing/Rendering), glassmorphism log area with custom scrollbar, construction beam trace animation (SVG stroke-dasharray paths with per-room hue + glow filter), modern ring spinner. Dark ambient background replaces old brown monotone. Active rooms glow warm gold, completed rooms transition to cool teal.
- **Pipeline** passes `state.options` (including `removeRoomLabels`, `generateWalls`, `includeTileOverlay`) through to `image-generator.js` `generateFinalPrompt()` and `generateImage()`.
- InpaintingPipeline is fully implemented with room-by-room mask generation, QA validation, and retry logic.
