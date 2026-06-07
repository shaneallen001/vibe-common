---
created: 2026-06-06
modified: 2026-06-06
tags: [foundry-v14, filepicker, namespace, migration, gotcha]
summary: FilePicker moved from foundry.applications.api.FilePicker to foundry.applications.apps.FilePicker in v14 — use the new path.
module: shared
---

# FilePicker namespace changed in v14

In Foundry v14, `FilePicker` moved out of `foundry.applications.api` and into
`foundry.applications.apps`. Using the old path throws a reference error.

## Fix

Always use the v14 path:

```js
// WRONG (v13 and earlier)
const picker = new foundry.applications.api.FilePicker({ ... });

// CORRECT (v14+)
const picker = new foundry.applications.apps.FilePicker({ ... });
```
