export function registerVibeMenu() {
    Hooks.on("getSceneControlButtons", (controls) => {
        if (!game.user.isGM) return;

        // Define our custom tool group
        const vibeGroup = {
            name: "vibe",
            title: "Vibe Suite",
            icon: "fas fa-sparkles",
            layer: "ControlsLayer",
            tools: []
        };

        // 1. Actor Generator
        if (game.modules.get("vibe-actor")?.active) {
            vibeGroup.tools.push({
                name: "vibe-actor",
                title: "Vibe Actor Generator",
                icon: "fas fa-user-plus",
                button: true, // execute onClick immediately without toggling state
                onClick: () => {
                    const VibeActorDialog = game.modules.get("vibe-actor")?.api?.VibeActorDialog;
                    if (VibeActorDialog) {
                        VibeActorDialog.show();
                    } else {
                        ui.notifications.warn("Vibe Actor API is not exposed or ready.");
                    }
                }
            });
        }

        // 2. Combat Builder
        if (game.modules.get("vibe-combat")?.active) {
            vibeGroup.tools.push({
                name: "vibe-combat",
                title: "Vibe Combat Tracker",
                icon: "fas fa-swords",
                button: true,
                onClick: () => {
                    const VibeCombatApp = game.modules.get("vibe-combat")?.api?.VibeCombatApp;
                    if (VibeCombatApp) {
                        // Open the tracker explicitly
                        new VibeCombatApp().render(true);
                    } else {
                        ui.notifications.warn("Vibe Combat API is not exposed or ready.");
                    }
                }
            });
        }

        // 3. Scene Generator
        if (game.modules.get("vibe-scenes")?.active) {
            vibeGroup.tools.push({
                name: "vibe-scene",
                title: "Vibe Scene Generator",
                icon: "fas fa-map-marked-alt",
                button: true,
                onClick: () => {
                    const VibeSceneDialog = game.modules.get("vibe-scenes")?.api?.VibeSceneDialog;
                    if (VibeSceneDialog) {
                        VibeSceneDialog.show();
                    } else {
                        ui.notifications.warn("Vibe Scene API is not exposed or ready.");
                    }
                }
            });
        }

        // Only add the group to the controls if we have active tools
        if (vibeGroup.tools.length > 0) {
            controls.push(vibeGroup);
        }
    });
}
