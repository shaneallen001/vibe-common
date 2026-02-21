import { VibeToast } from "./toast-manager.js";
export function registerVibeMenu() {
    Hooks.on("getSceneControlButtons", (controls) => {
        if (!game.user.isGM) return;

        // Foundry V13+ uses an Object for controls, V12 and below use an Array
        const isObjectControls = !Array.isArray(controls);

        // Define our custom tool group
        const vibeGroup = {
            name: "vibe",
            title: "Vibe Suite",
            icon: "fas fa-sparkles",
            layer: "controls", // Lowercase for V13+ compatibility if checking canvas configuration
            visible: true,     // Explicitly mark as visible
            activeTool: "vibe-hub", // Required by newer Foundry versions, use a dummy to avoid auto-firing buttons
            tools: isObjectControls ? {} : []
        };

        const addTool = (tool) => {
            tool.visible = tool.visible !== false; // Ensure the tool is explicitly visible unless set to false
            if (isObjectControls) {
                // Must ensure `vibeGroup.tools` doesn't fall back to an array accidentally in some mixed environments
                vibeGroup.tools[tool.name] = tool;
            } else {
                vibeGroup.tools.push(tool);
            }
        };

        // 0. Dummy Hub (prevents the first button tool from auto-firing when group is selected)
        addTool({
            name: "vibe-hub",
            title: "Vibe Suite",
            icon: "fas fa-sparkles",
            visible: false
        });

        // 1. Actor Generator
        if (game.modules.get("vibe-actor")?.active) {
            addTool({
                name: "vibe-actor",
                title: "Vibe Actor Generator",
                icon: "fas fa-user-plus",
                button: true, // execute onClick immediately without toggling state
                [isObjectControls ? "onChange" : "onClick"]: () => {
                    const VibeActorDialog = game.modules.get("vibe-actor")?.api?.VibeActorDialog;
                    if (VibeActorDialog) {
                        VibeActorDialog.show();
                    } else {
                        VibeToast.warn("Vibe Actor API is not exposed or ready.");
                    }
                }
            });
        }

        // 2. Combat Builder
        if (game.modules.get("vibe-combat")?.active) {
            addTool({
                name: "vibe-combat",
                title: "Vibe Combat Tracker",
                icon: "fas fa-swords",
                button: true,
                [isObjectControls ? "onChange" : "onClick"]: () => {
                    const VibeCombatApp = game.modules.get("vibe-combat")?.api?.VibeCombatApp;
                    if (VibeCombatApp) {
                        // Open the tracker explicitly
                        new VibeCombatApp().render(true);
                    } else {
                        VibeToast.warn("Vibe Combat API is not exposed or ready.");
                    }
                }
            });
        }

        // 3. Scene Generator
        if (game.modules.get("vibe-scenes")?.active) {
            addTool({
                name: "vibe-scene",
                title: "Vibe Scene Generator",
                icon: "fas fa-map-marked-alt",
                button: true,
                [isObjectControls ? "onChange" : "onClick"]: () => {
                    const VibeSceneDialog = game.modules.get("vibe-scenes")?.api?.VibeSceneDialog;
                    if (VibeSceneDialog) {
                        VibeSceneDialog.show();
                    } else {
                        VibeToast.warn("Vibe Scene API is not exposed or ready.");
                    }
                }
            });
        }

        // Ensure we actually have tools before rendering the group
        const hasTools = isObjectControls ? Object.keys(vibeGroup.tools).length > 0 : vibeGroup.tools.length > 0;

        if (hasTools) {
            let placement = "standalone";
            try {
                // Must explicitly specify the namespace here because we aren't using the COMMON_NAMESPACE constant from settings.js directly
                placement = game.settings.get("vibe-common", "menuPlacement");
            } catch (e) {
                // Fallback if settings aren't fully registered 
            }

            if (isObjectControls) {
                if (placement === "standalone") {
                    controls["vibe"] = vibeGroup;
                } else if (placement === "token") {
                    const tokenGroup = controls["tokens"] || controls["token"];
                    if (tokenGroup && tokenGroup.tools) {
                        if (game.modules.get("vibe-actor")?.active) tokenGroup.tools["vibe-actor"] = vibeGroup.tools["vibe-actor"];
                        if (game.modules.get("vibe-combat")?.active) tokenGroup.tools["vibe-combat"] = vibeGroup.tools["vibe-combat"];
                        if (game.modules.get("vibe-scenes")?.active) tokenGroup.tools["vibe-scene"] = vibeGroup.tools["vibe-scene"];
                    }
                }
            } else {
                if (placement === "standalone") {
                    controls.push(vibeGroup);
                } else if (placement === "token") {
                    const tokenGroup = controls.find(c => c.name === "tokens" || c.name === "token");
                    if (tokenGroup && tokenGroup.tools) {
                        if (game.modules.get("vibe-actor")?.active) tokenGroup.tools.push(vibeGroup.tools.find(t => t.name === "vibe-actor"));
                        if (game.modules.get("vibe-combat")?.active) tokenGroup.tools.push(vibeGroup.tools.find(t => t.name === "vibe-combat"));
                        if (game.modules.get("vibe-scenes")?.active) tokenGroup.tools.push(vibeGroup.tools.find(t => t.name === "vibe-scene"));
                        tokenGroup.tools = tokenGroup.tools.filter(t => t); // Filter undefined
                    }
                }
            }
        }
    });
}
