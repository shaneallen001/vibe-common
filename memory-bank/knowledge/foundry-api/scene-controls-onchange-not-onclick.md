---
created: 2026-06-06
modified: 2026-06-06
tags: [foundry-v14, scene-controls, hooks, gotcha]
summary: Scene control tools use onChange (not onClick) — onClick was removed in V15; do not confuse with ApplicationV2 header controls, which use onClick.
module: shared
references: [../application-v2/header-controls-use-onclick.md]
---

# Scene Controls: `onChange`, not `onClick`

When adding custom tools to Scene Controls via the `getSceneControlButtons` hook,
`onClick` was deprecated in V13 and removed in V15. In Foundry V14 only `onChange`
is recognized. Defining `onClick` silently does nothing in V14 and throws in V15.

## Fix

Only define `onChange` on scene control tool objects:

```js
Hooks.on("getSceneControlButtons", (controls) => {
  controls.push({
    name: "my-tool",
    title: "My Tool",
    icon: "fas fa-wand-magic",
    onChange: (active) => {
      if (active) doSomething();
    },
  });
});
```

> **Caution:** This is the **opposite** of `ApplicationV2` header controls
> (`getHeaderControlsApplicationV2`), which wire through `onClick`. See
> `../application-v2/header-controls-use-onclick.md`.
