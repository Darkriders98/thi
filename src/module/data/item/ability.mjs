export default class AbilityModel extends foundry.abstract.TypeDataModel {
  /** @inheritdoc */
  static LOCALIZATION_PREFIXES = ["THI.Ability"];

  /** @inheritdoc */
  static defineSchema() {
    const {StringField, HTMLField} = foundry.data.fields;
    return {
      summary: new StringField(),
      description: new HTMLField(),
    };
  }
}