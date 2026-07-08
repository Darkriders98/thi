import {defineItemField} from "../../helpers.mjs";

export default class ClassModel extends foundry.abstract.TypeDataModel {
  /** @inheritdoc */
  static LOCALIZATION_PREFIXES = ["THI.Class"];

  /** @inheritdoc */
  static defineSchema() {
    const {StringField} = foundry.data.fields;
    return {
      guild: new StringField(),
      items: defineItemField()
    };
  }
}