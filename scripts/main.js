import { registerCommonSettings } from "./settings.js";
import { registerVibeMenu } from "./ui/vibe-menu-injector.js";

Hooks.once("init", async () => {
  registerCommonSettings();
  registerVibeMenu();

  const partials = [
    "modules/vibe-common/templates/components/vibe-toggle.hbs",
    "modules/vibe-common/templates/components/vibe-select.hbs"
  ];
  await foundry.applications.handlebars.loadTemplates(partials);
});

Hooks.once("ready", () => {
  if (game.system.id !== "dnd5e") return;
});
