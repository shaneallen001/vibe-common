---
created: 2026-06-06
modified: 2026-06-06
tags: [gemini, openai, image-generation, routing, gotcha]
summary: Route image generation by excluding dall-e-3, not by checking for "imagen", or Gemini image models are silently sent to OpenAI.
module: shared
---

# Image model routing by exclusion

The `imageGenerationModel` setting includes several Gemini options:
`imagen-3`, `imagen-4`, `gemini-3.1-flash-image-preview`, and any future
Gemini image variants. Checking `model.includes("imagen")` fails to match the
`gemini-*` image models and silently routes them to the OpenAI client instead,
causing API key mismatches and opaque errors.

## Fix

Route by exclusion: anything that is not `dall-e-3` is a Gemini model.

```js
const useGemini = model !== "dall-e-3";
const apiKey = useGemini ? getGeminiApiKey() : getOpenAiApiKey();
```

When a new OpenAI image model is added to the setting, extend the exclusion
list (`model !== "dall-e-3" && model !== "new-openai-model"`) rather than
switching back to an inclusion check.
