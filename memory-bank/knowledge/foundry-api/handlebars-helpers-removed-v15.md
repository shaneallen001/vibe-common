---
created: 2026-06-06
modified: 2026-06-06
tags: [foundry-v15, handlebars, templates, migration, gotcha]
summary: Global renderTemplate and loadTemplates shims are removed in Foundry v15 — use foundry.applications.handlebars.* instead.
module: shared
---

# Global Handlebars helpers removed in v15

The top-level `renderTemplate()` and `loadTemplates()` globals (shims carried
forward from v1–v12) are gone in Foundry v15. Calling them throws a reference
error.

## Fix

Always use the namespaced versions:

```js
// WRONG — removed in v15
await renderTemplate("modules/my-module/templates/foo.hbs", data);
await loadTemplates(["modules/my-module/templates/foo.hbs"]);

// CORRECT
await foundry.applications.handlebars.renderTemplate(
  "modules/my-module/templates/foo.hbs",
  data
);
await foundry.applications.handlebars.loadTemplates([
  "modules/my-module/templates/foo.hbs",
]);
```
