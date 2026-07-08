import {hooks, apps, THISocketHandler} from "./src/module/_module.mjs";

globalThis.thi = {socket: new THISocketHandler()};

Hooks.once("init", hooks.init);

Hooks.once("ready", hooks.ready);

Hooks.once("i18nInit", hooks.i18nInit);

Hooks.on("renderUserConfig", hooks.renderUserConfig);
Hooks.on("renderCombatantConfig", apps.Combatant.hooks.renderCombatantConfig);

Hooks.on("getSceneControlButtons", hooks.getSceneControlButtons);
