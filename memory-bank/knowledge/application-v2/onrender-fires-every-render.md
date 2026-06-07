---
created: 2026-06-06
modified: 2026-06-06
tags: [foundry-v14, application-v2, lifecycle, event-listeners, gotcha]
summary: ApplicationV2 _onRender fires on every re-render, so naively-added event listeners accumulate; cancel old ones with an AbortController.
module: shared
references: [render-call-style.md, element-is-htmlelement.md]
---

# ApplicationV2 `_onRender` fires on every re-render

`_onRender(context, options)` is called after **every** `render()` call, not
just the first. If you attach event listeners directly inside it, they
accumulate on each re-render and fire multiple times.

## Fix

Hold an `AbortController` and abort the previous one at the top of
`_onRender`, then pass its signal to every `addEventListener`:

```js
#abort = null;

_onRender(context, options) {
  this.#abort?.abort();
  const { signal } = (this.#abort = new AbortController());
  this.element.querySelector("#btn").addEventListener("click", handler, { signal });
}
```

Aborting tears down all listeners from the prior render in one call, so the
next render starts clean.
