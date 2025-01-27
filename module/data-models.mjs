const {HTMLField, SchemaField, NumberField, StringField, FilePathField, ArrayField, BooleanField} = foundry.data.fields;

export class AgentDataModel extends foundry.abstract.TypeDataModel {
    static defineSchema(){
        return {
            identity: new SchemaField({
                biography: new HTMLField(),
                name: new StringField(),
                age: new StringField(),
                culture: new StringField()
            }),
            skills: new SchemaField({
                sword: new SchemaField({
                    skirmish: defineNumberField(4),
                    convince: defineNumberField(4),
                    study: defineNumberField(4),
                    xp: defineNumberField(7),
                    harm: defineNumberField(2)
                }),
                wand: new SchemaField({
                    unleash: defineNumberField(4),
                    perform: defineNumberField(4),
                    channel: defineNumberField(4),
                    xp:defineNumberField(7),
                    harm:defineNumberField(2)
                }),
                cup: new SchemaField({
                    slip: defineNumberField(4),
                    soothe: defineNumberField(4),
                    mingle: defineNumberField(4),
                    xp:defineNumberField(7),
                    harm:defineNumberField(2)
                }),
                pentacle: new SchemaField({
                    finesse: defineNumberField(4),
                    bargain: defineNumberField(4),
                    survey: defineNumberField(4),
                    xp:defineNumberField(7),
                    harm:defineNumberField(2)
                })
            }),
            abilities: new ArrayField(new StringField())
        };
    }
}

function defineNumberField(maxNumber){
    return new NumberField({
        required: true,
        integer: true,
        min:0,
        intial:0,
        max: maxNumber
    })
}