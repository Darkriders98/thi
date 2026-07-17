const {
  ArrayField,
  BooleanField,
  HTMLField,
  NumberField,
  SchemaField,
  StringField,
  TypedObjectField} = foundry.data.fields;

/**
 * Base data model for adversaries
 */
export default class AdversaryModel extends foundry.abstract.TypeDataModel {
  /** @inheritdoc */
  static LOCALIZATION_PREFIXES = ["THI.Adversary"];

  /** @inheritdoc */
  static defineSchema() {
    return {
      progression: new NumberField({
        integer: true,
        initial: 0,
        min: 0,
        max: 11
      })
    }
  }
}