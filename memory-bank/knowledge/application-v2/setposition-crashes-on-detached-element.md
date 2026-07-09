---
created: 2026-06-07
modified: 2026-06-07
tags: [foundry-v14, application-v2, rendering, positioning, gotcha]
summary: With position.height "auto", a render right after close() throws "Cannot read properties of null (reading 'offsetWidth')" — _updatePosition measures a detached element; guard on this.element?.isConnected.
module: shared
references: [render-call-style.md, onrender-fires-every-render.md]
---

# setPosition crashes on a detached element (`height: "auto"`)

When an ApplicationV2 uses `position: { height: "auto" }` (or `width: "auto"`),
Foundry runs `setPosition()` → `_updatePosition()` on **every** render, and
`_updatePosition` measures the live element:

```js
ApplicationV2.parseCSSDimension(computedStyle.minWidth, el.parentElement.offsetWidth)
```

If the element exists but is **not attached to the DOM**, `el.parentElement` is
`null` and Foundry throws:

```
Uncaught (in promise) TypeError: Cannot read properties of null (reading 'offsetWidth')
    at _updatePosition (foundry.mjs)
    at setPosition (foundry.mjs)
    at #render (foundry.mjs)
```

It surfaces as an *uncaught promise* (render isn't awaited at the call site), so
the app often still displays — but the error spams the console and the render
half-finishes.

## Trigger

The classic pattern: `this.close()` (removes the element from the DOM) followed
later by `this.render({ force: true })` to reopen — e.g. closing a generator,
showing a progress dialog, then reopening the generator when it finishes. On the
reopen, the auto-height path forces a `setPosition` before the element is
re-attached.

## Fix — skip measuring until the element is connected

Override `_updatePosition` to bail out when detached. Foundry repositions
correctly on the next attached render.

```js
_updatePosition(position) {
  if (!this.element?.isConnected) return position;
  return super._updatePosition(position);
}
```

`this.element` is the `HTMLElement` (or null); `.isConnected` is only true when
it's in the document. This mirrors Foundry's own `if (!this.#element) return position`
guard, extended to also cover the not-yet-attached case.

Real fix: vibe-scene-two `scripts/ui/generator-app.js` (`GeneratorApp`).
