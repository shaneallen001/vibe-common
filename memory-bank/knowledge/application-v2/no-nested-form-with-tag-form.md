---
created: 2026-06-06
modified: 2026-06-06
tags: [foundry-v14, application-v2, forms, templates, gotcha]
summary: When DEFAULT_OPTIONS.tag is "form", wrapping the Handlebars template in a <form> creates invalid nested forms that cause a full page reload on submit.
module: shared
---

# Do not nest a `<form>` inside `tag: "form"` ApplicationV2

When `DEFAULT_OPTIONS.tag = "form"`, Foundry renders the application's root
element as a `<form>`. If your Handlebars template also opens with a `<form>`
tag, browsers see invalid nested forms. The inner `<form>` is broken out of the
outer one and its submit action defaults to the page URL — clicking the submit
button causes a **full page reload** instead of calling the ApplicationV2 form
handler.

## Fix

Use a `<div>` as the outermost wrapper in the template. A `<button type="submit">`
anywhere inside the `<div>` still triggers the ApplicationV2 form handler
correctly because it is a child of the root `<form>` element.

```html
<!-- WRONG — nested <form> causes full-page reload on submit -->
<form class="vibe-dialog-form">
  <div class="field">...</div>
  <button type="submit">Save</button>
</form>

<!-- CORRECT — outer wrapper is a <div>; root <form> is supplied by Foundry -->
<div class="vibe-dialog-form">
  <div class="field">...</div>
  <button type="submit">Save</button>
</div>
```
