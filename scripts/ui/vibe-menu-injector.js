import { VibeToast } from "./toast-manager.js";

export function registerVibeMenu() {
  Hooks.on("getSceneControlButtons", (controls) => {
    if (!game.user.isGM) return;

    let placement = "standalone";
    try {
      placement = game.settings.get("vibe-common", "menuPlacement");
    } catch (e) {}

    const tools = {};

    tools["vibe-hub"] = {
      name: "vibe-hub",
      title: "Vibe Hub",
      icon: "fas fa-sparkles",
      button: true,
      onChange: () => {}
    };

    if (game.modules.get("vibe-actor")?.active) {
      tools["vibe-actor"] = {
        name: "vibe-actor",
        title: "Vibe Actor Generator",
        icon: "fas fa-user-plus",
        button: true,
        onChange: () => {
          const VibeActorDialog = game.modules.get("vibe-actor")?.api?.VibeActorDialog;
          if (VibeActorDialog) {
            VibeActorDialog.show();
          } else {
            VibeToast.warn("Vibe Actor API is not exposed or ready.");
          }
        }
      };
    }

    if (game.modules.get("vibe-combat")?.active) {
      tools["vibe-combat"] = {
        name: "vibe-combat",
        title: "Vibe Combat Tracker",
        icon: "fas fa-swords",
        button: true,
        onChange: () => {
          const VibeCombatApp = game.modules.get("vibe-combat")?.api?.VibeCombatApp;
          if (VibeCombatApp) {
            new VibeCombatApp().render({ force: true });
          } else {
            VibeToast.warn("Vibe Combat API is not exposed or ready.");
          }
        }
      };
    }

    if (game.modules.get("vibe-scenes")?.active) {
      tools["vibe-scene"] = {
        name: "vibe-scene",
        title: "Vibe Scene Generator",
        icon: "fas fa-map-marked-alt",
        button: true,
        onChange: () => {
          const VibeSceneDialog = game.modules.get("vibe-scenes")?.api?.VibeSceneDialog;
          if (VibeSceneDialog) {
            VibeSceneDialog.show();
          } else {
            VibeToast.warn("Vibe Scene API is not exposed or ready.");
          }
        }
      };
    }

    if (Object.keys(tools).length === 0) return;

    if (placement === "standalone") {
      controls["vibe"] = {
        name: "vibe",
        title: "Vibe Suite",
        icon: "fas fa-sparkles",
        layer: "controls",
        visible: true,
        activeTool: "vibe-hub",
        tools
      };
    } else if (placement === "token") {
      const tokenGroup = controls["tokens"] || controls["token"];
      if (tokenGroup?.tools) {
        if (tools["vibe-actor"]) tokenGroup.tools["vibe-actor"] = tools["vibe-actor"];
        if (tools["vibe-combat"]) tokenGroup.tools["vibe-combat"] = tools["vibe-combat"];
        if (tools["vibe-scene"]) tokenGroup.tools["vibe-scene"] = tools["vibe-scene"];
      }
    }
  });
}
