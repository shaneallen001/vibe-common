---
created: 2026-06-06
modified: 2026-06-07
tags: [gemini, openai, image-generation, routing, gotcha]
summary: Route image generation with isOpenAiImageModel() from vibe-common, never substring checks like includes("imagen"), or Gemini image models are silently sent to OpenAI.
module: shared
---

# Image model routing by exclusion

The `imageGenerationModel` setting includes several Gemini options:
`imagen-3`, `imagen-4`, `gemini-3.1-flash-image-preview`, and any future
Gemini image variants. Substring checks like `model.includes("imagen")` fail to
match the `gemini-*` image models and silently route them to the OpenAI client
instead, causing API key mismatches and opaque errors. The mirror bug —
`model.includes("dall-e")` — mis-routes any non-DALL-E OpenAI model (e.g.
`gpt-image-2`) the same way.

## Fix

Use the canonical helper from `vibe-common/scripts/settings.js` — never inline
substring checks:

```js
import { isOpenAiImageModel } from "../../../vibe-common/scripts/settings.js";

const apiKey = isOpenAiImageModel(model) ? getOpenAiApiKey() : getGeminiApiKey();
```

`isOpenAiImageModel` is backed by the `OPENAI_IMAGE_MODELS` list. When a new
OpenAI image model is added to the setting, add it to that one list — every
routing site updates automatically.

## Current OpenAI models in the setting

`gpt-image-2` (latest; vibe-scene-two uses it SVG-guided via images/edits,
vibe-actor uses it for portraits/icons via images/generations) and `dall-e-3`.
vibe-scene-two routes in `SceneImageGenerator._resolveImageModel`
(`kind: "openai"` vs `"unsupported"` for dall-e-3 — dall-e-3 has no edits
endpoint); vibe-actor's four routing sites (dialog, standalone image-generator,
item-image pipeline, service) all go through `isOpenAiImageModel`. OpenAI image
calls only work in the Foundry desktop app — a browser tab blocks
`api.openai.com` via CORS.

## gpt-image-2 vs dall-e-3 request quirks

`gpt-image-2` always returns base64 and **rejects** `response_format`; only send
`response_format: "b64_json"` for `dall-e-*`. `gpt-image-2` also accepts
`background: "transparent"|"opaque"` (good for tokens) and a reference image via
the multipart `images/edits` endpoint (`image[]` + `input_fidelity: "high"`),
which dall-e-3 does not support.
