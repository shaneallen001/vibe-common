---
created: 2026-06-06
modified: 2026-06-06
tags: [gemini, imagen, image-generation, settings, gotcha]
summary: Foundry settings store short Imagen names, but the Google API requires full model name strings — always map through the settings helper.
module: shared
---

# Imagen API model name mapping

Foundry settings store short names (`imagen-3`, `imagen-4`), but the Google
API requires the full versioned strings (`imagen-3.0-generate-001`,
`imagen-4.0-generate-001`). Passing the short name directly to the API causes
a 404 / invalid-model error.

## Fix

Never pass the raw setting value to the API. Always map through the helper in
`vibe-common/scripts/settings.js`, which maintains the short→full table:

```js
import { getImageGenerationModel } from "../../vibe-common/scripts/settings.js";

// returns the full API name, e.g. "imagen-3.0-generate-001"
const model = getImageGenerationModel();
```

Add new Imagen versions to the mapping table in `settings.js`; do not
hard-code full names in call sites.
