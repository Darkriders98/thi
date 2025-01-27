import {AgentDataModel} from "./module/data-models.mjs";
import {THIActorSheet} from "./module/documents.mjs";
import {THI} from "./module/config.mjs";
import * as utils from "./module/utils.mjs";

Hooks.on("init", function() {
    console.log(`THE HIDDEN ISLE | Initializing The Hidden Isle game system`)

    CONFIG.THI = THI;

    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("thi", THIActorSheet, {makeDefault: true});

    // Configure system data models
    CONFIG.Actor.dataModels = {
        agent: AgentDataModel
    };
})

Hooks.on("i18nInit", function(){
    utils.performPreLocalization(CONFIG.THI);
})