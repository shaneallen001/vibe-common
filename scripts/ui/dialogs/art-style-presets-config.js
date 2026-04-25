import { COMMON_NAMESPACE, getGeminiApiKey } from "../../settings.js";
import { VibeToast } from "../toast-manager.js";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export class ArtStylePresetsConfig extends HandlebarsApplicationMixin(ApplicationV2) {
  static DEFAULT_OPTIONS = {
    id: "vibe-common-art-style-presets",
    classes: ["vibe-theme"],
    tag: "form",
    window: { title: "Vibe Common: Art Style Presets", resizable: false },
    form: { handler: ArtStylePresetsConfig._onSubmit, closeOnSubmit: true, submitOnChange: false }
  };

  static PARTS = {
    main: { template: "modules/vibe-common/templates/art-style-presets-config.html" }
  };

  #abort = null;

  async _prepareContext(options) {
    const stored = game.settings.get(COMMON_NAMESPACE, "artStylePresets");
    const presets = Array.isArray(stored) && stored.length > 0 ? stored : [];
    return { presets };
  }

  _onRender(context, options) {
    this.#abort?.abort();
    const { signal } = (this.#abort = new AbortController());

    this.element.querySelector("#btn-add-preset")
      .addEventListener("click", () => this._appendRow({ name: "", style: "" }), { signal });

    this.element.addEventListener("click", async (ev) => {
      if (ev.target.closest(".btn-preset-delete")) {
        ev.target.closest(".preset-row").remove();
      }
      if (ev.target.closest(".btn-preset-enhance")) {
        await this._onEnhance(ev.target.closest(".btn-preset-enhance"));
      }
    }, { signal });
  }

  _appendRow({ name, style }) {
    const list = this.element.querySelector("#presets-list");
    const div = document.createElement("div");
    div.className = "preset-row";
    div.innerHTML = `
      <div class="preset-row-fields">
        <input type="text" data-field="name" value="${_escapeHtml(name)}" placeholder="Preset name">
        <textarea data-field="style" rows="3" placeholder="Comma-separated style descriptors...">${_escapeHtml(style)}</textarea>
      </div>
      <div class="preset-row-actions">
        <button type="button" class="btn-preset-enhance" title="Enhance with Gemini">
          <i class="fas fa-wand-magic-sparkles"></i> Enhance
        </button>
        <button type="button" class="btn-preset-delete" title="Delete preset">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `;
    list.appendChild(div);
  }

  async _onEnhance(btn) {
    const row = btn.closest(".preset-row");
    const name = row.querySelector('[data-field="name"]').value.trim();
    const style = row.querySelector('[data-field="style"]').value.trim();

    let apiKey;
    try { apiKey = getGeminiApiKey(); } catch (e) { return; }

    btn.disabled = true;
    const icon = btn.querySelector("i");
    icon.className = "fas fa-spinner fa-spin";

    try {
      const { callGemini } = await import("../../services/gemini-service.js");
      const metaPrompt = `You are a prompt engineer for fantasy RPG portrait image generation. The user is defining an "art style preset" named "${name}" whose text will be appended after a subject and description in an image-generation prompt sent to DALL-E 3 / Imagen / Gemini Image. Their draft style text is: "${style}". Rewrite this as a concise (≤ 40 words) comma-separated list of visual descriptors covering medium, lighting, color palette, mood, and rendering style. Output only the rewritten style text — no preamble, no quotes.`;
      const result = await callGemini({ apiKey, prompt: metaPrompt });
      const enhanced = (result || "").trim();
      if (enhanced) {
        row.querySelector('[data-field="style"]').value = enhanced;
      } else {
        VibeToast.warn("Gemini returned an empty response.");
      }
    } catch (e) {
      console.error("Vibe Common | Enhance preset failed:", e);
      VibeToast.error("Failed to enhance preset. Check console for details.");
    } finally {
      btn.disabled = false;
      icon.className = "fas fa-wand-magic-sparkles";
    }
  }

  static async _onSubmit(event, form, formData) {
    const rows = form.querySelectorAll(".preset-row");
    const presets = Array.from(rows).map(row => ({
      name: row.querySelector('[data-field="name"]').value.trim(),
      style: row.querySelector('[data-field="style"]').value.trim()
    })).filter(p => p.name);
    await game.settings.set(COMMON_NAMESPACE, "artStylePresets", presets);
  }
}

function _escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
