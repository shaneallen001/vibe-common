# Progress

**Last Updated:** 2026-02-22

- Centralized memory bank created in `vibe-common`.
- Updated vibe-scene-two pipeline to convert abstract SVG maps into JPEG instances to guide final Imagen 4 generation, and restricted the SVG to only emit macro architectural layouts to prevent minor furniture objects from being physically walled.
- Fixed Foundry scene mapping scale issue by detecting native img dimensions rather than forcing 4000x4000.
- Re-aligned invisible walls / map components by respecting Foundry's internal `sceneX/sceneY` margins.
- Injected `<line>` instruction to Cartographer Gemini to draw doors/passages, and implemented door extraction in `scene-builder.js`.
- Fixed fragile journal mapping so notes correctly assign to rooms matching by `data-room-id`.
