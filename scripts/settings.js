import { VibeToast } from "./ui/toast-manager.js";
import { ArtStylePresetsConfig } from "./ui/dialogs/art-style-presets-config.js";
/**
 * Vibe Common Settings
 * Registers shared settings across the Vibe project.
 */

export const COMMON_NAMESPACE = "vibe-common";

const DEFAULT_ART_STYLE_PRESETS = [
  { name: "Dark Fantasy", style: "dark fantasy, moody lighting, dramatic shadows, intricate armor details, painterly" },
  { name: "Storybook",    style: "storybook illustration, whimsical colors, soft edges, children's book art" },
  { name: "Classic D&D",  style: "classic Dungeons & Dragons art, painted style, rich saturated colors, fantasy illustration" },
  { name: "None",         style: "" }
];

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
        hint: "Choose which API to use for image generation. Note: DALL-E 3 requires an OpenAI key but cannot be called from the browser due to CORS restrictions — use a Gemini model instead.",
        scope: "world",
        config: true,
        type: String,
        choices: {
            "dall-e-3": "OpenAI DALL-E 3 (browser-blocked — use Gemini instead)",
            "imagen-3": "Gemini Imagen 3",
            "imagen-4": "Gemini Imagen 4.0",
            "gemini-3-pro-image-preview": "Gemini 3 Pro Image",
            "gemini-3.1-flash-image-preview": "Gemini 3.1 Flash Image Preview"
        },
        default: "imagen-3",
    });

    game.settings.register(COMMON_NAMESPACE, "artStylePresets", {
        scope: "world",
        config: false,
        type: Array,
        default: DEFAULT_ART_STYLE_PRESETS,
    });

    game.settings.registerMenu(COMMON_NAMESPACE, "artStylePresetsMenu", {
        name: "Art Style Presets",
        label: "Manage Art Style Presets",
        hint: "Configure reusable art style presets for image generation.",
        icon: "fas fa-palette",
        type: ArtStylePresetsConfig,
        restricted: true
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

/**
 * Retrieves the art style presets array, falling back to defaults if missing/malformed.
 * @returns {Array<{name: string, style: string}>}
 */
export function getArtStylePresets() {
    try {
        const stored = game.settings.get(COMMON_NAMESPACE, "artStylePresets");
        if (Array.isArray(stored) && stored.length > 0) return stored;
    } catch (e) {
        // fall through to defaults
    }
    return DEFAULT_ART_STYLE_PRESETS;
}
