const { HTMLField, SchemaField, NumberField, StringField, FilePathField, ArrayField, BooleanField } = foundry.data.fields;

export default class BaseActorModel extends foundry.abstract.TypeDataModel {
    /**
     * Key information about this Actor subtype
     */
    static metadata = Object.freeze({});

    /** @override */
    static defineSchema() {
        const schema = {};

        schema.identity = new SchemaField(this.actorIdentity())

        return schema;
    }

    /**
     * Helper function to fill in the "identity" property
     */
    static actorIdentity() {
        return {
            biography: new HTMLField(),
            name: new StringField(),
            age: new StringField(),
            culture: new StringField()
        }
    }

    /** @override */
    prepareBaseData() {
        super.prepareBaseData();
    }

    /** @override */
    prepareDerivedData() {
        super.prepareDerivedData();
    }

    /**
     * @override
     * @param {object} changed            The differential data that was changed relative to the documents prior values
     * @param {object} options            Additional options which modify the update request
     * @param {string} userId             The id of the User requesting the document update
     * @protected
     * @internal
     */
    _onUpdate(changed, options, userId) {
        super._onUpdate(changed, options, userId);
    }

}