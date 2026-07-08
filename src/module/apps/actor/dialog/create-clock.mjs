import DialogThi from "../../api/dialog.mjs";
import {systemPath} from "../../../constants.mjs";

export default class CreateClockDialog extends DialogThi {
  constructor(config = {}, options = {}) {
    super(options);
    this.#config = config;
  }

  /* -------------------------------------------- */

  /** @override */
  static DEFAULT_OPTIONS = {
    classes: ["create-clock"],
    form: {
      handler: this.#handleFormSubmission,
      closeOnSubmit: true
    },
    position: {
      width: 600
    },
    buildConfig: null
  };

  /* -------------------------------------------- */

  /** @override */
  static PARTS = {
    configuration: {
      template: systemPath("templates/actor/dialog/create-clock-configuration.hbs")
    },
    buttons: {
      template: systemPath("templates/shared/dialog/dialog-buttons.hbs")
    }
  };

  /* -------------------------------------------- */
  /*  Rendering                                   */
  /* -------------------------------------------- */

  /** @inheritdoc */
  async _preparePartContext(partId, context, options) {
    context = await super._preparePartContext(partId, context, options);
    switch (partId) {
      case "configuration":
        return this._prepareConfigurationContext(context, options);
      case "buttons":
        return this._prepareButtonsContext(context, options);
      default:
        return context;
    }
  }

  async _prepareConfigurationContext(context, options) {
    context.fields = [
      {
        field: new foundry.data.fields.StringField({
          label: _loc("DOCUMENT.Clocks.Add.Prompt.Name")
        }),
        name: "clockName"
      },
      {
        field: new foundry.data.fields.NumberField({
          label: _loc("DOCUMENT.Clocks.Add.Prompt.Max")
        }),
        name: "max",
        options: this.#config.clockMaxes.map(element => ({value: element, label: element.toString()}))
      }
    ];

    return context;
  }

  async _prepareButtonsContext(context, options) {
    context.buttons = {
      create: {
        default: true,
        icon: `<i class="${_loc('ICONS.Clock')}" inert></i>`,
        label: _loc('DOCUMENT.Clocks.Add.Button')
      }
    };

    return context;
  }

  /* -------------------------------------------- */
  /*  Properties                                  */
  /* -------------------------------------------- */

  #config;

  get config() {
    return this.#config;
  }

  /* -------------------------------------------- */
  /*  Event Listeners and Handlers                */
  /* -------------------------------------------- */

  /**
   * @this {SkillCheckConfigurationDialog}
   * @param {Event|SubmitEvent} event
   * @param {HTMLFormElement} form
   * @param {FormDataExtended} formData
   */
  static async #handleFormSubmission(event, form, formData) {
    const clockName = formData.object.clockName;
    if (clockName === '') {
      return;
    }

    const clockMax = formData.object.max;
    const id = Math.random().toString(16).slice(2);
    const clockPath = this.#config.fieldPath + "." + id
    const value = {
      name: clockName,
      progress: 0,
      max: clockMax
    };

    this.#config.actor.update({
      [clockPath]: value
    });
  }
}