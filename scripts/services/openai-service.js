/**
 * OpenAI Service
 * Handles structured text generation through the Responses API.
 */

function getOutputText(data) {
    if (typeof data?.output_text === "string") return data.output_text;

    const chunks = [];
    for (const item of data?.output || []) {
        for (const part of item?.content || []) {
            if (typeof part?.text === "string") chunks.push(part.text);
            else if (typeof part?.text?.value === "string") chunks.push(part.text.value);
        }
    }
    return chunks.join("");
}

/**
 * Call OpenAI's Responses API for text or JSON output.
 */
export async function callOpenAIResponses({ apiKey, prompt, model = "gpt-5.5", reasoningEffort = "medium", responseSchema, jsonMode = false, abortSignal }) {
    const format = responseSchema
        ? {
            type: "json_schema",
            name: "vibe_actor_response",
            schema: responseSchema,
            strict: false
        }
        : jsonMode
            ? { type: "json_object" }
            : { type: "text" };

    const body = {
        model,
        input: prompt,
        reasoning: { effort: reasoningEffort },
        text: { format }
    };

    let response;
    try {
        response = await fetch("https://api.openai.com/v1/responses", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(body),
            signal: abortSignal
        });
    } catch (error) {
        if (error instanceof TypeError) {
            throw new Error(
                "OpenAI text models cannot be called from a browser tab due to CORS restrictions - " +
                "use the Foundry desktop app, or switch Vibe Common's Actor Generation Model to Gemini Auto."
            );
        }
        throw error;
    }

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new Error(`OpenAI error ${response.status}: ${data?.error?.message || response.statusText}`);
    }

    const text = getOutputText(data);
    if (!text) {
        console.error("Vibe Common | OpenAI raw response:", data);
        throw new Error("No text returned from OpenAI.");
    }
    return text;
}
