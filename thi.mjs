import { AgentDataModel } from "./module/data-models.mjs";
import { THIActorSheet } from "./module/sheets/actor-sheet.mjs";
import { THIActor } from "./module/documents/actor.mjs";
import { THI } from "./module/config.mjs";
import * as utils from "./module/utils.mjs";

Hooks.on("init", function () {
    console.log(`THE HIDDEN ISLE | Initializing The Hidden Isle game system`)

    CONFIG.THI = THI;

    CONFIG.Actor.documentClass = THIActor;

    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("thi", THIActorSheet, {
        makeDefault: true,
        label: "THI.SheetLabels.Actor"
    });

    // Configure system data models
    CONFIG.Actor.dataModels = {
        agent: AgentDataModel
    };

    // Preload Handlebars helpers
    utils.registerHandlebarsHelpers();
})

Hooks.on("i18nInit", function () {
    utils.performPreLocalization(CONFIG.THI);
})