export default class MagicalProficiencyModel extends foundry.abstract.TypeDataModel {
  /** @inheritdoc */
  static LOCALIZATION_PREFIXES = ["THI.Magic.Proficiency"];

  /** @inheritdoc */
  static defineSchema() {
    const {NumberField, StringField, HTMLField} = foundry.data.fields;
    return {
      xp: new NumberField({
        initial: 0,
        integer: true,
        min: 0,
        max: 6
      }),
      mastery: new NumberField({
        initial: 1,
        integer: true,
        min: 1,
        max: 3
      }),
      summary: new StringField(),
      description: new HTMLField(),
    };
  }

}