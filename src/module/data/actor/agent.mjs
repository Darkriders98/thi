import {defineItemField} from "../../helpers.mjs";

const {
  ArrayField,
  BooleanField,
  HTMLField,
  NumberField,
  SchemaField,
  StringField,
  TypedObjectField} = foundry.data.fields;

/**
 * Base data model for dioscorian agents
 */
export default class AgentModel extends foundry.abstract.TypeDataModel {
  /** @inheritdoc */
  static LOCALIZATION_PREFIXES = ["THI.Agent"];

  static defineHarmField() {
    return new SchemaField({
      harm1: new StringField({
        required: true,
        choices: CONFIG.THI.harm,
        initial: "none"
      }),
      harm2: new StringField({
        required: true,
        choices: CONFIG.THI.harm,
        initial: "none"
      })
    },
      {
        label: _loc("THI.Agent.FIELDS.skills.harm")
      });
  }

  static defineSkillField() {
    return new SchemaField({
      value: new NumberField({
        initial: 0,
        integer: true,
        min: 0,
        max: 4
      }),
      canMaster: new BooleanField({
        initial: false,
        label: _loc("THI.Agent.FIELDS.skills.canMaster"),
      })
    });
  }

  static defineXPField() {
    return new NumberField({
      initial: 0,
      integer: true,
      min: 0,
      max: 7,
      label: _loc("THI.Agent.FIELDS.xp")
    });
  }

  /** @inheritdoc */
  static defineSchema() {
    return {
      abilities: new SchemaField({
        xp: this.defineXPField()
      }),
      biography: new SchemaField({
        appearance: new HTMLField(),
        background: new HTMLField(),
        notes: new HTMLField()
      }),
      header: new SchemaField({
        age: new NumberField({
          integer: true
        }),
        culture: new StringField(),
        gender: new StringField(),
        hand: new StringField(),
        storedXP: new NumberField({
          initial: 0,
          integer: true
        })
      }),
      inventory: new SchemaField({
        usages: new NumberField({
          initial: 0,
          integer: true,
          min: 0,
          max: 5
        }),
        baseItems: defineItemField(true),
        customItems: defineItemField(),
        clocks: new TypedObjectField(new SchemaField({
          name: new StringField(),
          progress: new NumberField(),
          max: new NumberField()
        }))
      }),
      self: new SchemaField({
        adulthood: new StringField(),
        childhood: new StringField(),
        burden: new SchemaField({
          xp: this.defineXPField(),
          value: new StringField()
        }),
        ideal: new SchemaField({
          xp: this.defineXPField(),
          value: new StringField()
        }),
        virtues: new ArrayField(new StringField(), {max: 3}),
        vices: new ArrayField(new StringField()),
        fulfilled: new ArrayField(new StringField())
      }),
      skills: new SchemaField({
        swords: new SchemaField({
          xp: this.defineXPField(),
          harm: this.defineHarmField(),
          skirmish: this.defineSkillField(),
          convince: this.defineSkillField(),
          study: this.defineSkillField()
        }),
        wands: new SchemaField({
          xp: this.defineXPField(),
          harm: this.defineHarmField(),
          unleash: this.defineSkillField(),
          perform: this.defineSkillField(),
          channel: this.defineSkillField()
        }),
        cups: new SchemaField({
          xp: this.defineXPField(),
          harm: this.defineHarmField(),
          slip: this.defineSkillField(),
          soothe: this.defineSkillField(),
          mingle: this.defineSkillField()
        }),
        pentacles: new SchemaField({
          xp: this.defineXPField(),
          harm: this.defineHarmField(),
          finesse: this.defineSkillField(),
          bargain: this.defineSkillField(),
          survey: this.defineSkillField()
        })
      })
    };
  }
}