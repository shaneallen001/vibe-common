---
created: 2026-06-06
modified: 2026-06-06
tags: [foundry-v14, application-v2, rendering, gotcha]
summary: ApplicationV2 render() takes an options object, not a boolean — render(true) from V1 is invalid and silently fails.
module: shared
references: [onrender-fires-every-render.md]
---

# ApplicationV2 render call style

ApplicationV2's `render()` signature changed from V1. The V1 boolean shorthand
`render(true)` is **not valid** in V2 and will not open the application. Pass
an options object instead.

## Fix

```js
// WRONG — V1 style, silently ignored in V2
new MyApp().render(true);

// CORRECT — open a new instance
new MyApp().render({ force: true });

// CORRECT — re-render an already-open instance in place
this.render();
```

`force: true` is required when opening a fresh instance; without it Foundry
may skip the render if it thinks the app is already rendered. Omit `force`
for in-place re-renders triggered from inside the app itself (e.g. after
saving state).
