/**
 * Vibe Common Module
 * Shared runtime for Vibe modules.
 */

import { registerCommonSettings } from "./settings.js";
import { registerVibeMenu } from "./ui/vibe-menu-injector.js";

Hooks.once("init", () => {
  registerCommonSettings();
  registerVibeMenu();
});

Hooks.once("ready", () => {
  if (game.system.id !== "dnd5e") return;
});
