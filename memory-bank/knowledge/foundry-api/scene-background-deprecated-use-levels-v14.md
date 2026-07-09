---
created: 2026-06-07
modified: 2026-06-07
tags: [foundry-v14, scenes, levels, deprecation, gotcha]
summary: Scene#background / Scene#backgroundColor / Scene#foreground are deprecated in v14 (removed v16) — read and write via the scene's first Level instead.
module: shared
---

# Scene background moved to Levels in v14

Foundry v14 introduced **Levels** on scenes. The background image (and
foreground, fog overlay, background color) no longer live directly on the Scene
document — they live on each `Level`. The old accessors are deprecated **since
v14, removed in v16**:

- `Scene#background` → "Use Level#background and Level#textures instead."
- `Scene#backgroundColor` → "Use Level#background#color instead."
- `Scene#foreground` → "Use Level#foreground.src instead."

The warning only fires on **reads** of the deprecated getter. Reading
`scene.background?.src` after `Scene.create(...)` is enough to trip it.

## Fix — read and write the first Level

```js
// WRONG — deprecated getter, logs a compatibility warning
const src = scene.background?.src;
await scene.update({ "background.src": imagePath });

// CORRECT — go through the scene's first Level
const firstLevel = scene.firstLevel;            // always present after create
const src = firstLevel?.background?.src;
await scene.update({
  levels: [{ _id: firstLevel.id, background: { src: imagePath } }]
});
```

## Creating scenes is still fine with the old shape

`Scene.create({ background: { src } })` does **not** warn — Foundry's
`Scene#_preCreate` automatically migrates a top-level `background` (and
`backgroundColor`, `foreground`, `fog.overlay`) into a default Level, and always
adds a `firstLevel`. So you only need the Level API for post-create reads/updates,
not for the initial create payload. `width`/`height` remain top-level Scene fields.

Property mapping lives in `BaseScene._LEVELS_PROPERTY_MAP`
(`background.anchorX` → `textures.anchorX`, etc.).

Real fix: vibe-scene-two `scripts/services/scene-builder.js` background safety-net.
