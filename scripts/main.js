/**
 * Vibe Common Module
 * Shared runtime for Vibe modules.
 */

Hooks.once("ready", () => {
  if (game.system.id !== "dnd5e") return;
});
