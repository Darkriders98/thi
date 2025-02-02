import * as documents from "./module/documents/_module.mjs";
import * as applications from "./module/apps/_module.mjs";
import * as utils from "./module/utils.mjs";
import * as data from "./module/data/_module.mjs";
import { THI } from "./module/config.mjs";
import * as THI_CONST from "./module/constants.mjs";

globalThis.thi = {
    documents,
    applications,
    utils,
    data,
    CONST: THI_CONST,
    CONFIG: THI
}

Hooks.on("init", function () {
    console.log(`THE HIDDEN ISLE | Initializing The Hidden Isle game system`)

    CONFIG.THI = THI;

    // Assign document classes
    for (const docCls of Object.values(documents)) {
        if (!foundry.utils.isSubclass(docCls, foundry.abstract.Document)) continue;
        CONFIG[docCls.documentName].documentClass = docCls;
    }

    // Assign data models & setup templates
    for (const [doc, models] of Object.entries(data)) {
        if (!CONST.ALL_DOCUMENT_TYPES.includes(doc)) continue;
        for (const modelCls of Object.values(models)) {
            if (modelCls.metadata?.type) CONFIG[doc].dataModels[modelCls.metadata.type] = modelCls;
            if (modelCls.metadata?.detailsPartial) templates.push(...modelCls.metadata.detailsPartial);
        }
    };

    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet(THI_CONST.systemID, applications.THIAgentSheet, {
        types: ["agent"],
        makeDefault: true,
        label: "THI.Sheet.Labels.Actor"
    });

    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet(THI_CONST.systemID, applications.THIItemSheet, {
        makeDefault: true,
        label: "THI.Sheet.Labels.Item"
    })

    // Preload Handlebars helpers
    utils.registerHandlebarsHelpers();
})

Hooks.on("i18nInit", function () {
    utils.performPreLocalization(CONFIG.THI);
})

Hooks.on("ready", async function (){
    await data.migrations.migrateWorld();

    Hooks.callAll("thi.ready");
    console.log(THI_CONST.ASCII);
})

