---
created: 2026-06-06
modified: 2026-06-07
tags: [meta, knowledge, application-v2]
summary: Index of ApplicationV2/DialogV2 lifecycle, rendering patterns, and common footguns.
module: shared
---

# ApplicationV2

ApplicationV2 / DialogV2 lifecycle and rendering patterns and footguns for Foundry VTT v14+.

## Entries

- [onrender-fires-every-render.md](onrender-fires-every-render.md) — `_onRender` fires on every re-render; use an `AbortController` to avoid accumulating event listeners.
- [header-controls-use-onclick.md](header-controls-use-onclick.md) — `getHeaderControlsApplicationV2` hook requires `onClick`, not `onChange`; using `onChange` leaves buttons with no click handler.
- [element-is-htmlelement.md](element-is-htmlelement.md) — `this.element` is a plain `HTMLElement`, not jQuery; use `querySelector`/`addEventListener` instead of `.find()`/`.on()`.
- [render-call-style.md](render-call-style.md) — Open with `new MyApp().render({ force: true })`; re-render in-place with `this.render()`; the V1 `render(true)` boolean is invalid in V2.
- [no-nested-form-with-tag-form.md](no-nested-form-with-tag-form.md) — When `DEFAULT_OPTIONS.tag = "form"`, use a `<div>` as the template's outermost wrapper to avoid invalid nested forms that cause page reloads.
- [setposition-crashes-on-detached-element.md](setposition-crashes-on-detached-element.md) — With `position.height: "auto"`, rendering right after `close()` throws `offsetWidth` of null; guard `_updatePosition` on `this.element?.isConnected`.

## Navigation

[Back to knowledge AGENTS.md](../AGENTS.md)
