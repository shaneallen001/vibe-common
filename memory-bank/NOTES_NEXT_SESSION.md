# Notes for Next Session

**Last Updated:** 2026-02-24

- Memory Bank system is active in `vibe-common`. Maintain protocols accordingly.
- **Current branch**: `dev-phase2-polish` on `shaneallen001/vibe-scene-two`.
- **Recent Changes (this session)**:
  - SVG generator always includes room labels; stripping happens in `image-generator.js` `_svgToBase64Jpeg()` via DOM removal of `<text>` elements.
  - Step 2 has 4 toggles (walls, tile overlay, remove labels, inpainting) + scrollable room list.
  - Progress dialog rewritten with light-trace beam animation (stroke-dasharray SVG overlay paths with glow filter).
  - SVG prompt updated with explicit door orientation rules (parallel to shared wall) and no-overlap rule (rooms share edges, areas don't overlap).
  - Scene builder supports `generateWalls` (skip walls) and `includeTileOverlay` (add layout as Tile).
- **Testing needed**:
  1. Verify SVG door orientation is now correct (doors run parallel to shared walls, not perpendicular)
  2. Verify rooms still share edges (no gaps between rooms)
  3. Verify the construction beam trace animation plays correctly in the progress dialog
  4. Test "Generate Walls" OFF → confirm no walls placed
  5. Test "Tile Overlay" ON → confirm layout JPEG added as semi-transparent tile
  6. Test "Remove Room Labels" toggle in both states
- **InpaintingPipeline** is fully implemented but marked experimental. QA validation uses `gemini-2.5-flash-lite`.
- **Not yet merged to main** — still on `dev-phase2-polish`.
