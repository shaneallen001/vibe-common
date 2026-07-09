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
        hint: "Your OpenAI API key. Used by Vibe Actor for OpenAI image generation and GPT-5.5 actor generation, and by Vibe Scene for GPT Image 2 map rendering.",
        scope: "world",
        config: true,
        type: String,
        default: "",
    });

    game.settings.register(COMMON_NAMESPACE, "imageGenerationModel", {
        name: "Image Generation Model",
        hint: "Choose which API to use for image generation. OpenAI models (GPT Image 2, DALL-E 3) need an OpenAI key and only work in the Foundry desktop app - a browser tab blocks them via CORS. Gemini models work everywhere.",
        scope: "world",
        config: true,
        type: String,
        choices: {
            "gpt-image-2": "OpenAI GPT Image 2 (SVG-guided, desktop app only)",
            "dall-e-3": "OpenAI DALL-E 3 (browser-blocked - desktop app only)",
            "imagen-3": "Gemini Imagen 3",
            "imagen-4": "Gemini Imagen 4.0",
            "gemini-3-pro-image-preview": "Gemini 3 Pro Image",
            "gemini-3.1-flash-image-preview": "Gemini 3.1 Flash Image Preview"
        },
        default: "imagen-3",
    });

    game.settings.register(COMMON_NAMESPACE, "actorGenerationModel", {
        name: "Actor Generation Model",
        hint: "Choose the text model used by Vibe Actor for creature data, adjustments, and custom items. OpenAI GPT-5.5 options need an OpenAI key and the Foundry desktop app; Gemini Auto uses the shared Gemini fallback chain.",
        scope: "world",
        config: true,
        type: String,
        choices: {
            "gemini-auto": "Gemini Auto (shared fallback chain)",
            "gpt-5.5-medium": "OpenAI GPT-5.5 (medium reasoning)",
            "gpt-5.5-low": "OpenAI GPT-5.5 (low reasoning)"
        },
        default: "gemini-auto",
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
 * Retrieves the actor text-generation model.
 * @returns {string} The configured actor generation model.
 */
export function getActorGenerationModel() {
    return game.settings.get(COMMON_NAMESPACE, "actorGenerationModel");
}

/**
 * Image-generation models that route to the OpenAI API/key. Everything else
 * (Imagen + Gemini image models) routes to Gemini. Route by this list, never by
 * substring checks like `includes("imagen")` - those silently mis-route the
 * `gemini-*-image` models. Add new OpenAI models here when they're offered.
 */
export const OPENAI_IMAGE_MODELS = ["dall-e-3", "gpt-image-2"];

/**
 * @param {string} model - An `imageGenerationModel` value.
 * @returns {boolean} True if the model is served by OpenAI (uses the OpenAI key).
 */
export function isOpenAiImageModel(model) {
    return OPENAI_IMAGE_MODELS.includes(model);
}

export const OPENAI_ACTOR_GENERATION_MODELS = {
    "gpt-5.5-medium": { model: "gpt-5.5", reasoningEffort: "medium" },
    "gpt-5.5-low": { model: "gpt-5.5", reasoningEffort: "low" }
};

/**
 * @param {string} model - An `actorGenerationModel` value.
 * @returns {boolean} True if the model is served by OpenAI (uses the OpenAI key).
 */
export function isOpenAiActorGenerationModel(model) {
    return Object.prototype.hasOwnProperty.call(OPENAI_ACTOR_GENERATION_MODELS, model);
}

/**
 * @param {string} model - An `actorGenerationModel` value.
 * @returns {{model: string, reasoningEffort: string}|null}
 */
export function resolveOpenAiActorGenerationModel(model) {
    return OPENAI_ACTOR_GENERATION_MODELS[model] || null;
}

/**
 * Retrieves the API key for the configured actor text model.
 * @returns {string} The configured API key.
 */
export function getActorGenerationApiKey() {
    const model = getActorGenerationModel();
    return isOpenAiActorGenerationModel(model) ? getOpenAiApiKey() : getGeminiApiKey();
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
