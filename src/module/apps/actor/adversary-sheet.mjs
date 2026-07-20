import {systemPath} from "../../constants.mjs";
import BaseActorSheet from "./api/base-actor-sheet.mjs";

export class AdversarySheet extends BaseActorSheet {
  /** @inheritdoc */
  static DEFAULT_OPTIONS = {
    classes: ["adversary"],
    position: {
      width: 1000,
      height: 800,
    },
    actions: {
    },
    form: {
      submitOnChange: true,
    },
  };

  /* -------------------------------------------------- */

  /** @inheritdoc */
  static PARTS = {
    header: {
      template: systemPath("templates/actor/adversary/header.hbs")
    },
    body: {
      template: systemPath("templates/actor/adversary/body.hbs")
    }
  };
};