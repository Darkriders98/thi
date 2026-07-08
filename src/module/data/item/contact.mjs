import {defineVisionChoices} from "../../helpers.mjs";

export default class ContactModel extends foundry.abstract.TypeDataModel {
  /** @inheritdoc */
  static LOCALIZATION_PREFIXES = ["THI.Contact"];

  /** @inheritdoc */
  static defineSchema() {
    const {StringField, NumberField} = foundry.data.fields;
    return {
      affection: new NumberField({
        initial: 0,
        integer: true,
        min: 0,
        max: 6
      }),
      description: new StringField(),
      arcana: new StringField({
        required: true,
        choices: defineVisionChoices(),
        initial: "fool"
      }),
      distance: new NumberField({
        initial: 0,
        integer: true,
        min: 0,
        max: 3
      })
    };
  }
}