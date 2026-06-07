---
created: 2026-06-06
modified: 2026-06-06
tags: [foundry, css, styling, inputs, gotcha]
summary: Foundry's global CSS pins input/select to height 26px — adding padding without overriding height squashes text; always set both height and padding.
module: shared
---

# Foundry default input heights

Foundry's global stylesheet sets:

```css
input, select { height: 26px; }
```

If you add `padding` to an `input` or `select` without also overriding
`height`, the browser honours the fixed height and squashes the text against
the top or bottom edge. The padding appears to do nothing visually.

## Fix

Always set **both** `height` and `padding` when styling inputs:

```css
.my-app input,
.my-app select {
  height: 32px;
  padding: 0 10px;
}
```

The explicit `height` override wins over Foundry's global rule; the `padding`
then applies cleanly within that height.
