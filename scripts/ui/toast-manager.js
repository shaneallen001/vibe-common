/**
 * VibeToast
 * A premium, non-blocking notification system.
 */
export class VibeToast {
    static info(message) { this.show(message, "info"); }
    static warn(message) { this.show(message, "warn"); }
    static error(message) { this.show(message, "error"); }
    static success(message) { this.show(message, "success"); }

    static show(message, type = "info") {
        const container = this._getContainer();
        const toast = document.createElement("div");
        toast.className = `vibe-toast vibe-toast-${type}`;

        let icon = "fa-info-circle";
        if (type === "warn") icon = "fa-exclamation-triangle";
        if (type === "error") icon = "fa-times-circle";
        if (type === "success") icon = "fa-check-circle";

        toast.innerHTML = `
            <i class="fas ${icon} vibe-toast-icon"></i>
            <div class="vibe-toast-content">
                <span class="vibe-toast-title">Vibe</span>
                <span class="vibe-toast-message">${message}</span>
            </div>
            <button class="vibe-toast-close"><i class="fas fa-times"></i></button>
        `;

        toast.querySelector('.vibe-toast-close').addEventListener('click', () => {
            this._removeToast(toast);
        });

        container.appendChild(toast);

        // Sub-pixel rendering smooth slide
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                toast.classList.add("vibe-toast-show");
            });
        });

        const autoDismiss = setTimeout(() => {
            this._removeToast(toast);
        }, 5000);

        // Pause timer on hover
        toast.addEventListener('mouseenter', () => clearTimeout(autoDismiss));
        toast.addEventListener('mouseleave', () => {
            setTimeout(() => this._removeToast(toast), 2000);
        });
    }

    static _removeToast(toast) {
        if (!toast.classList.contains("vibe-toast-show")) return;
        toast.classList.remove("vibe-toast-show");
        toast.classList.add("vibe-toast-hide");
        setTimeout(() => {
            if (toast.parentNode) toast.parentNode.removeChild(toast);
        }, 300); // Should match CSS transition duration
    }

    static _getContainer() {
        let container = document.getElementById("vibe-toast-container");
        if (!container) {
            container = document.createElement("div");
            container.id = "vibe-toast-container";
            document.body.appendChild(container);
        }
        return container;
    }
}
