export default class MagicalSourceModel extends foundry.abstract.TypeDataModel {
  /** @inheritdoc */
  static LOCALIZATION_PREFIXES = ["THI.Magic.Source"];

  /** @inheritdoc */
  static defineSchema() {
    const {HTMLField} = foundry.data.fields;
    return {
      description: new HTMLField(),
    };
  }
}