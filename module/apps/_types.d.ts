import * as documents from "../documents/_module.mjs";

declare module "./actor-sheet.mjs" {
    export interface THIActorSheet {
        actor: documents.THIActor;
    }
}

declare module "./item-sheet.mjs" {
    export interface THIItemSheet {
        item: documents.THIItem;
    }
}
