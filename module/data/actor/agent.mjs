import { defineNumberField } from "../helpers.mjs";
import BaseActorModel from "./base.mjs";

const { HTMLField, SchemaField, NumberField, StringField, FilePathField, ArrayField, BooleanField } = foundry.data.fields;


// Data models declaration
export default class AgentDataModel extends BaseActorModel {
    /** @override */
    static metadata = Object.freeze({
        type: "agent"
    })

    /** @override */
    static defineSchema() {
        const schema = super.defineSchema();

        schema.skillFamilies = new SchemaField({
            sword: new SchemaField({
                skills: new SchemaField({
                    skirmish: defineNumberField(4),
                    convince: defineNumberField(4),
                    study: defineNumberField(4)
                }),
                xp: defineNumberField(7),
                harm: defineNumberField(2)
            }),
            wand: new SchemaField({
                skills: new SchemaField({
                    unleash: defineNumberField(4),
                    perform: defineNumberField(4),
                    channel: defineNumberField(4)
                }),
                xp: defineNumberField(7),
                harm: defineNumberField(2)
            }),
            cup: new SchemaField({
                skills: new SchemaField({
                    slip: defineNumberField(4),
                    soothe: defineNumberField(4),
                    mingle: defineNumberField(4)
                }),
                xp: defineNumberField(7),
                harm: defineNumberField(2)
            }),
            pentacle: new SchemaField({
                skills: new SchemaField({
                    finesse: defineNumberField(4),
                    bargain: defineNumberField(4),
                    survey: defineNumberField(4)
                }),
                xp: defineNumberField(7),
                harm: defineNumberField(2)
            })
        });

        schema.abilities = new ArrayField(new StringField());

        return schema;
    }

    /**
     * Finds the actor's current class
     * @returns {undefined | (Omit<TheHiddenIsleItem, "type" | "system"> & { type: "class", system: import("../item/class.mjs").default})}
     */
    get class() {
        return this.parent.items.find(i => i.type === "class");
    }
}
