import { COMMON_NAMESPACE, getGeminiApiKey } from "../../settings.js";
import { VibeToast } from "../toast-manager.js";

export class ArtStylePresetsConfig extends FormApplication {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "vibe-common-art-style-presets",
      title: "Vibe Common: Art Style Presets",
      template: "modules/vibe-common/templates/art-style-presets-config.html",
      width: 560,
      height: "auto",
      closeOnSubmit: true,
      submitOnChange: false,
      submitOnClose: false
    });
  }

  getData(options = {}) {
    const stored = game.settings.get(COMMON_NAMESPACE, "artStylePresets");
    const presets = Array.isArray(stored) && stored.length > 0 ? stored : [];
    return { ...(super.getData?.(options) ?? {}), presets };
  }

  activateListeners(html) {
    super.activateListeners(html);

    // Delete row
    html.on("click", ".btn-preset-delete", (ev) => {
      $(ev.currentTarget).closest(".preset-row").remove();
    });

    // Add blank row
    html.find("#btn-add-preset").click(() => {
      this._appendRow(html, { name: "", style: "" });
    });

    // Enhance with Gemini
    html.on("click", ".btn-preset-enhance", async (ev) => {
      const btn = $(ev.currentTarget);
      const row = btn.closest(".preset-row");
      const name = row.find('[data-field="name"]').val().trim();
      const style = row.find('[data-field="style"]').val().trim();

      let apiKey;
      try {
        apiKey = getGeminiApiKey();
      } catch (e) {
        return;
      }

      btn.prop("disabled", true);
      const icon = btn.find("i");
      icon.removeClass("fa-wand-magic-sparkles").addClass("fa-spinner fa-spin");

      try {
        const { callGemini } = await import("../../services/gemini-service.js");
        const metaPrompt = `You are a prompt engineer for fantasy RPG portrait image generation. The user is defining an "art style preset" named "${name}" whose text will be appended after a subject and description in an image-generation prompt sent to DALL-E 3 / Imagen / Gemini Image. Their draft style text is: "${style}". Rewrite this as a concise (≤ 40 words) comma-separated list of visual descriptors covering medium, lighting, color palette, mood, and rendering style. Output only the rewritten style text — no preamble, no quotes.`;

        const result = await callGemini({ apiKey, prompt: metaPrompt });
        const enhanced = (result || "").trim();
        if (enhanced) {
          row.find('[data-field="style"]').val(enhanced);
        } else {
          VibeToast.warn("Gemini returned an empty response.");
        }
      } catch (e) {
        console.error("Vibe Common | Enhance preset failed:", e);
        VibeToast.error("Failed to enhance preset. Check console for details.");
      } finally {
        btn.prop("disabled", false);
        icon.removeClass("fa-spinner fa-spin").addClass("fa-wand-magic-sparkles");
      }
    });
  }

  _appendRow(html, { name, style }) {
    const list = html.find("#presets-list");
    const row = $(`
      <div class="preset-row">
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
      </div>
    `);
    list.append(row);
  }

  async _updateObject(event, _formData) {
    const rows = this.element[0].querySelectorAll(".preset-row");
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
