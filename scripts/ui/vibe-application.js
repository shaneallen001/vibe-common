const { ApplicationV2, DialogV2 } = foundry.applications?.api || {};

/**
 * Base ApplicationV2 class for all Vibe modules.
 * Ensures consistent window framing, CSS classes, and behaviors.
 */
export class VibeApplicationV2 extends (ApplicationV2 || class { }) {
    static DEFAULT_OPTIONS = {
        classes: ["vibe-app-v2", "vibe-theme"],
        window: {
            frame: true,
            positioned: true,
            resizable: true,
            contentClasses: ["vibe-app-content"]
        }
    };

    /**
     * Shows a Vibe-themed loading overlay over the application content.
     * @param {string} message Loading message to display
     */
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

    /**
     * Hides the loading overlay.
     */
    hideLoading() {
        if (!this.element) return;
        const overlay = this.element.querySelector(".vibe-loading-overlay");
        if (overlay) overlay.style.display = "none";
    }
}

/**
 * Base DialogV2 class for all Vibe modules.
 */
export class VibeDialogV2 extends (DialogV2 || class { }) {
    static DEFAULT_OPTIONS = {
        classes: ["vibe-dialog-v2", "vibe-theme"],
        window: {
            frame: true,
            positioned: true,
            resizable: false
        }
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

/**
 * For backwards compatibility or partial migration, 
 * provides a V1 application that sets the vibe-theme class.
 */
export class VibeApplication extends Application {
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["vibe-app", "vibe-theme"]
        });
    }

    showLoading(message = "Loading...") {
        if (!this.element) return;
        const el = this.element[0] || this.element;
        let overlay = el.querySelector(".vibe-loading-overlay");
        if (!overlay) {
            overlay = document.createElement("div");
            overlay.className = "vibe-loading-overlay";
            overlay.innerHTML = `
                <div class="vibe-loading-spinner"></div>
                <div class="vibe-loading-message">${message}</div>
            `;
            el.appendChild(overlay);
        } else {
            overlay.querySelector(".vibe-loading-message").textContent = message;
        }
        overlay.style.display = "flex";
    }

    hideLoading() {
        if (!this.element) return;
        const el = this.element[0] || this.element;
        const overlay = el.querySelector(".vibe-loading-overlay");
        if (overlay) overlay.style.display = "none";
    }
}
