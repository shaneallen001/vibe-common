---
created: 2026-06-07
modified: 2026-06-07
tags: [foundry-api, lighting, scenes, units, gotcha]
summary: AmbientLight dim/bright radii are in scene distance units (grid "feet"), not pixels — convert pixel geometry before writing them.
module: shared
---

# Ambient light radii are distance units, not pixels

`AmbientLightDocument` `config.dim` / `config.bright` are expressed in the
scene's **distance units** (the grid `distance`, e.g. 5 ft per square), NOT in
canvas pixels. Code that derives a light radius from pixel geometry (image
coordinates, SVG sizes, wall spans) and writes it straight into `dim`/`bright`
makes lights blast far past the room they belong to — a 200px "radius" becomes a
200-**foot** light.

## Fix

Convert pixels → units with the scene grid before assigning:

```js
const gridSizePx = scene.grid?.size || 100;      // pixels per square
const gridDistance = scene.grid?.distance || 5;  // units per square (feet)
const pxToUnits = (px) => (px / gridSizePx) * gridDistance;

light.config.dim = pxToUnits(radiusPx * 2);
light.config.bright = pxToUnits(radiusPx);
```

Seen in `vibe-scene-two` `scene-builder.js` (v2.0.0 hardening): placeholder room
lights were written in pixels. Same trap applies to token sight/vision ranges
and any measured template radius.
