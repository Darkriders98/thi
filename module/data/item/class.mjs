import BaseItemModel from "./base.mjs";

const { HTMLField, SchemaField, NumberField, StringField, FilePathField, ArrayField, BooleanField } = foundry.data.fields;

export default class ClassModel extends BaseItemModel {
    /** @override */
    static metadata = Object.freeze({
        ...super.metadata,
        type: "class",
        invalidActorTypes: ["npc"]
    })

    /** @override */
    static defineSchema(){
        const schema = super.defineSchema();
        const config = thi.CONFIG;
    }
}