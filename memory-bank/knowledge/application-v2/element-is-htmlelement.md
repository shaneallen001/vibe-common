---
created: 2026-06-06
modified: 2026-06-06
tags: [foundry-v14, application-v2, dom, jquery, gotcha]
summary: In ApplicationV2, this.element is a plain HTMLElement — jQuery methods like .find() and .on() do not exist on it.
module: shared
references: [onrender-fires-every-render.md]
---

# `this.element` is a plain `HTMLElement` in ApplicationV2

ApplicationV2 does not wrap its root element in jQuery. Calling jQuery
methods on `this.element` throws a runtime error or silently does nothing,
depending on how jQuery is loaded.

## Fix

Replace jQuery patterns with native DOM equivalents:

```js
// BEFORE (jQuery — breaks in ApplicationV2)
this.element.find("#my-btn").on("click", handler);
this.element.find("input").prop("disabled", true);

// AFTER (native DOM — correct)
this.element.querySelector("#my-btn").addEventListener("click", handler);
this.element.querySelector("input").disabled = true;
```

Use `querySelectorAll` when you need a list of elements:

```js
for (const el of this.element.querySelectorAll(".row")) {
  el.classList.toggle("active", el.dataset.id === selectedId);
}
```
