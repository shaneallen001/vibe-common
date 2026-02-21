import { VibeToast } from "./ui/toast-manager.js";
/**
 * Vibe Common Settings
 * Registers shared settings across the Vibe project.
 */

export const COMMON_NAMESPACE = "vibe-common";

export function registerCommonSettings() {
    game.settings.register(COMMON_NAMESPACE, "menuPlacement", {
        name: "Vibe Suite Menu Location",
        hint: "Choose where the Vibe Suite buttons should appear: on their own standalone layer, or appended to the existing Tokens group.",
        scope: "client",
        config: true,
        type: String,
        choices: {
            "standalone": "Standalone Menu",
            "token": "Token Tools Menu"
        },
        default: "standalone",
        onChange: () => {
            ui.controls.initialize();
        }
    });

    game.settings.register(COMMON_NAMESPACE, "geminiApiKey", {
        name: "Gemini API Key",
        hint: "Your Google Gemini API key. Used by Vibe Actor, Vibe Combat, and Vibe Scenes for text and image generation.",
        scope: "world",
        config: true,
        type: String,
        default: "",
    });

    game.settings.register(COMMON_NAMESPACE, "openaiApiKey", {
        name: "OpenAI API Key",
        hint: "Your OpenAI API key. Used by Vibe Actor for DALL-E image generation.",
        scope: "world",
        config: true,
        type: String,
        default: "",
    });

    game.settings.register(COMMON_NAMESPACE, "imageGenerationModel", {
        name: "Image Generation Model",
        hint: "Choose which API to use for image generation.",
        scope: "world",
        config: true,
        type: String,
        choices: {
            "dall-e-3": "OpenAI DALL-E 3",
            "imagen-3": "Gemini Imagen 3"
        },
        default: "dall-e-3",
    });
}

/**
 * Retrieves the Gemini API key. Throws an error and notifies the user if not configured.
 * @returns {string} The configured Gemini API key.
 * @throws {Error} If the API key is not configured.
 */
export function getGeminiApiKey() {
    const apiKey = game.settings.get(COMMON_NAMESPACE, "geminiApiKey");
    if (!apiKey || apiKey.trim() === "") {
        VibeToast.error("Gemini API Key is missing. Please configure it in Vibe Common settings.");
        throw new Error("Gemini API Key is not configured in Vibe Common.");
    }
    return apiKey;
}

/**
 * Retrieves the OpenAI API key. Throws an error and notifies the user if not configured.
 * @returns {string} The configured OpenAI API key.
 * @throws {Error} If the API key is not configured.
 */
export function getOpenAiApiKey() {
    const apiKey = game.settings.get(COMMON_NAMESPACE, "openaiApiKey");
    if (!apiKey || apiKey.trim() === "") {
        VibeToast.error("OpenAI API Key is missing. Please configure it in Vibe Common settings.");
        throw new Error("OpenAI API Key is not configured in Vibe Common.");
    }
    return apiKey;
}

/**
 * Retrieves the image generation model.
 * @returns {string} The configured image generation model (e.g., 'dall-e-3' or 'imagen-3').
 */
export function getImageGenerationModel() {
    return game.settings.get(COMMON_NAMESPACE, "imageGenerationModel");
}
