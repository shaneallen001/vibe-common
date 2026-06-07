---
created: 2026-06-06
modified: 2026-06-06
tags: [foundry-v14, application-v2, header-controls, hooks, gotcha]
summary: ApplicationV2 header controls require onClick, not onChange — using onChange leaves the button with no click handler.
module: shared
references: [../foundry-api/scene-controls-onchange-not-onclick.md]
---

# ApplicationV2 header controls use `onClick`, not `onChange`

When adding controls via the `getHeaderControlsApplicationV2` hook, the
handler property must be `onClick`. Foundry's `_renderHeaderControl` wires
`control.onClick` directly to the button's click event. If you use `onChange`
instead, the button renders but has no click handler — nothing happens when
the user clicks it.

This is the **opposite** of Scene Controls (which use `onChange` in v14, not
`onClick`). The two APIs are intentionally different and must not be confused.

## Fix

```js
Hooks.on("getHeaderControlsApplicationV2", (app, controls) => {
  controls.push({
    icon: "fa-solid fa-wand-sparkles",
    label: "Generate",
    onClick: () => app.openGenerateDialog(),   // ✓ correct
    // onChange: ...                            // ✗ silently ignored
  });
});
```
