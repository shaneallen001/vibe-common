const { ApplicationV2, DialogV2, HandlebarsApplicationMixin } = foundry.applications?.api || {};

export class VibeApplicationV2 extends HandlebarsApplicationMixin(ApplicationV2 || class {}) {
  static DEFAULT_OPTIONS = {
    classes: ["vibe-app-v2", "vibe-theme"],
    window: {
      frame: true,
      positioned: true,
      resizable: true,
      contentClasses: ["vibe-app-content"]
    }
  };

  showLoading(message = "Loading...") {
    if (!this.element) return;
    let overlay = this.element.querySelector(".vibe-loading-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.className = "vibe-loading-overlay";
      overlay.innerHTML = `
        <div class="vibe-loading-spinner"></div>
        <div class="vibe-loading-message">${message}</div>
      `;
      const content = this.element.querySelector(".window-content") || this.element;
      content.appendChild(overlay);
    } else {
      overlay.querySelector(".vibe-loading-message").textContent = message;
    }
    overlay.style.display = "flex";
  }

  hideLoading() {
    if (!this.element) return;
    const overlay = this.element.querySelector(".vibe-loading-overlay");
    if (overlay) overlay.style.display = "none";
  }
}

export class VibeDialogV2 extends (DialogV2 || class {}) {
  static DEFAULT_OPTIONS = {
    classes: ["vibe-dialog-v2", "vibe-theme"],
    window: { frame: true, positioned: true, resizable: false }
  };

  showLoading(message) {
    if (!this.element) return;
    let overlay = this.element.querySelector(".vibe-loading-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.className = "vibe-loading-overlay";
      overlay.innerHTML = `
        <div class="vibe-loading-spinner"></div>
        <div class="vibe-loading-message">${message}</div>
      `;
      const content = this.element.querySelector(".window-content") || this.element;
      content.appendChild(overlay);
    } else {
      overlay.querySelector(".vibe-loading-message").textContent = message;
    }
    overlay.style.display = "flex";
  }

  hideLoading() {
    if (!this.element) return;
    const overlay = this.element.querySelector(".vibe-loading-overlay");
    if (overlay) overlay.style.display = "none";
  }
}
