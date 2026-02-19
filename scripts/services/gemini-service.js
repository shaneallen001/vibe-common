/**
 * Gemini Service
 * Handles interactions with Google's Gemini API
 */

export const GEMINI_MODELS = [
  "gemini-2.5-flash-lite"
];

export const GEMINI_API_VERSIONS = ["v1beta"];

/**
 * Call the Gemini API with fallback for models and versions
 */
export async function callGemini({ apiKey, prompt, responseSchema, abortSignal }) {
  let lastError = null;

  for (const apiVersion of GEMINI_API_VERSIONS) {
    for (const model of GEMINI_MODELS) {
      let attempt = 0;
      const maxRetries = 3;

      while (attempt <= maxRetries) {
        try {
          const requestBody = {
            contents: [
              {
                parts: [{ text: prompt }]
              }
            ],
            generationConfig: {
              temperature: 0.75,
              response_mime_type: responseSchema ? "application/json" : "text/plain",
              ...(responseSchema && { response_schema: responseSchema })
            }
          };

          console.log(`Vibe Common | Gemini Request (${model}, try ${attempt + 1}):`, JSON.stringify(requestBody, null, 2));

          const response = await fetch(
            `https://generativelanguage.googleapis.com/${apiVersion}/models/${model}:generateContent?key=${apiKey}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(requestBody),
              signal: abortSignal
            }
          );

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error(`Vibe Common | Gemini Error (${model}):`, JSON.stringify(errorData, null, 2));

            if (response.status === 429 || response.status === 503) {
              attempt++;
              if (attempt > maxRetries) {
                const errorMessage = errorData.error?.message || response.statusText;
                throw new Error(`Gemini Rate Limit/Unavailable (${model}): ${errorMessage} (Max retries reached)`);
              }

              let delay = Math.pow(2, attempt) * 1000;

              const retryHeader = response.headers?.get?.("Retry-After");
              if (retryHeader) {
                const seconds = parseInt(retryHeader, 10);
                if (!isNaN(seconds)) delay = seconds * 1000;
              }

              console.warn(`Vibe Common | Rate limit/Unavailable (${response.status}). Retrying in ${delay}ms...`);
              await new Promise(resolve => setTimeout(resolve, delay));
              continue;
            }

            if (response.status === 404) {
              break;
            }

            const errorMessage = errorData.error?.message || response.statusText;
            lastError = `Gemini API error (${apiVersion}/${model}): ${response.status} ${response.statusText}. ${errorMessage}`;
            console.warn(lastError);
            break;
          }

          const data = await response.json();
          const text =
            data.candidates?.[0]?.content?.parts?.map((part) => part.text).join("\n") ||
            "";

          if (!text.trim()) {
            lastError = "Gemini returned an empty response.";
            break;
          }
          return text;
        } catch (error) {
          if (error.name === "AbortError") {
            throw error;
          }
          if (error.message && error.message.includes("Max retries reached")) {
            throw error;
          }

          if (error instanceof TypeError || (error.message && error.message.includes("fetch"))) {
            lastError = `Network error calling Gemini API (${apiVersion}/${model}): ${error.message}`;
            console.warn(lastError);
            break;
          }
          lastError = error.message || "Gemini request failed.";
          break;
        }
      }
    }
  }

  throw new Error(lastError || "All Gemini models failed. Please check your API key and model availability.");
}

/**
 * Extract JSON from Gemini response text
 */
export function extractJson(text) {
  let jsonText = text.trim();

  const markdownMatch = jsonText.match(/```json\s*([\s\S]*?)\s*```/i);
  if (markdownMatch?.[1]) {
    jsonText = markdownMatch[1];
  } else if (jsonText.startsWith("```")) {
    const lines = jsonText.split("\n");
    if (lines[0].trim().startsWith("```")) {
      lines.shift();
    }
    if (lines[lines.length - 1].trim() === "```") {
      lines.pop();
    }
    jsonText = lines.join("\n");
  }

  jsonText = jsonText.trim();

  const firstBracket = jsonText.indexOf("[");
  const firstBrace = jsonText.indexOf("{");
  const lastBracket = jsonText.lastIndexOf("]");
  const lastBrace = jsonText.lastIndexOf("}");

  if (firstBracket !== -1 && (firstBracket < firstBrace || firstBrace === -1)) {
    if (lastBracket !== -1) {
      jsonText = jsonText.slice(firstBracket, lastBracket + 1);
    }
  } else if (firstBrace !== -1 && lastBrace !== -1) {
    jsonText = jsonText.slice(firstBrace, lastBrace + 1);
  }

  try {
    return JSON.parse(jsonText);
  } catch (error) {
    if (jsonText.startsWith("{") && jsonText.includes("},{")) {
      try {
        const wrappedJson = "[" + jsonText + "]";
        console.warn("Vibe Common | Auto-fix: Wrapped unwrapped array in brackets.");
        return JSON.parse(wrappedJson);
      } catch (wrapError) {
        // fall through
      }
    }
    console.error("Vibe Common | Failed to parse Gemini response:", jsonText);
    throw new Error("Invalid JSON returned from Gemini. Please try again.");
  }
}
