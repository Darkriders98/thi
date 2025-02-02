const { HTMLField, SchemaField, NumberField, StringField, FilePathField, ArrayField, BooleanField } = foundry.data.fields;

/**
 * A base item model
 */
export default class BaseItemModel extends foundry.abstract.TypeDataModel {

    static metadata = Object.freeze({
        type: "base",
        invalidActorTypes: []
    });

    /** @override */
    static defineSchema() {
        const schema = {};

        schema.description = new SchemaField(this.idemDescription);

        return schema;
    }

    static idemDescription() {
        return {
            value: new HTMLField()
        }
    }

    /**
     * Convenient access to the item's actor.
     * @returns {import("../../documents/actor.mjs").THIActor}
     */
    get actor() {
        return this.parent.actor;
    }

    /** @override */
    prepareDerivedData() {
        this.source.prepareData(this.parent._stats?.compendiumSource ?? this.parent.uuid);
    }

    /** @override */
    async _preCreate(data, options, user) {
        const allowed = await super._preCreate(data, options, user);
        if (allowed === false) return false;

        if (this.constructor.metadata.invalidActorTypes?.includes(this.parent.actor?.type)) return false;
    }
}