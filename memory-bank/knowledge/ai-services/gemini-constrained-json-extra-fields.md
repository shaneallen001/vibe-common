---
created: 2026-06-06
modified: 2026-06-06
tags: [gemini, json, response-schema, gotcha]
summary: Gemini with response_schema fills every optional field it sees, often with invalid placeholder values — keep schemas lean to avoid validation noise.
module: shared
---

# Gemini constrained JSON output adds unexpected fields from schema

When `response_mime_type: "application/json"` is combined with a
`response_schema`, Gemini attempts to populate **every** optional field
declared in the schema. It often fills them with invalid placeholder values —
for example, `spend: 0` when the schema specifies `minimum: 1`. This triggers
downstream validation failures that have nothing to do with the prompt.

## Fix

Keep schemas lean. Only declare fields that downstream code actually reads.
Remove optional fields that exist purely as pass-through hints or documentation
aids; if they appear in the schema Gemini will try to fill them.

```js
// WRONG — "notes" is never read downstream; Gemini invents bad values for it
const schema = {
  type: "object",
  properties: {
    spend:  { type: "integer", minimum: 1 },
    notes:  { type: "string" }          // ← causes noise, remove it
  }
};

// CORRECT — only what downstream code consumes
const schema = {
  type: "object",
  properties: {
    spend: { type: "integer", minimum: 1 }
  },
  required: ["spend"]
};
```

If a field is genuinely optional and its absence is acceptable, omit it from
the schema entirely rather than marking it optional.
