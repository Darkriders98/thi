import DialogThi from "../api/dialog.mjs";
import {systemPath} from "../../constants.mjs";

/**
 * @import {
 *  SkillCheckProcessConfiguration
 * } from "./_types.mjs"
 */

/**
 * @extends {DialogThi}
 *
 * @param {SkillCheckProcessConfiguration} [config={}]
 * @param {Object} [options={}]
 */
export default class SkillCheckConfigurationDialog extends DialogThi {
  constructor(config = {}, options = {}) {
    super(options);

    this.#baseCardNumber = Math.max(1 + config.mastery.value - (config.harm ? 1 : 0), 1);
    this.#config = config;
  }

  /* -------------------------------------------- */

  /** @override */
  static DEFAULT_OPTIONS = {
    classes: ["skill-check-configuration"],
    form: {
      handler: this.#handleFormSubmission,
      closeOnSubmit: true
    },
    position: {
      width: 400
    },
    buildConfig: null
  };

  /* -------------------------------------------- */

  /** @override */
  static PARTS = {
    display: {
      template: systemPath("templates/cards/skill-check-display.hbs")
    },
    configuration: {
      template: systemPath("templates/cards/skill-check-configuration.hbs")
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
      case "display":
        return this._prepareDisplayContext(context, options);
      case "configuration":
        return this._prepareConfigurationContext(context, options);
      case "buttons":
        return this._prepareButtonsContext(context, options);
      default:
        return context;
    }
  }

  async _prepareDisplayContext(context, options) {
    context.cardNumber = this.cardNumber;
    context.icon = systemPath("ui/official/backs/pip.jpg");

    return context;
  }

  async _prepareConfigurationContext(context, options) {
    context.fields = [
      {
        field: new foundry.data.fields.StringField({
          label: _loc("THI.SkillCheck.CheckConfiguration.IdealConfig.Label"),
          hint: _loc("THI.SkillCheck.CheckConfiguration.IdealConfig.Hint"),
          blank: true,
          initial: this.#currentConfig.ideal
        }),
        name: "ideal",
        options: this.isConfigAllowed("ideal") ? this.#config.ideals : undefined
      },
      {
        field: new foundry.data.fields.StringField({
          label: _loc("THI.SkillCheck.CheckConfiguration.VirtueConfig.Label"),
          hint: _loc("THI.SkillCheck.CheckConfiguration.VirtueConfig.Hint"),
          blank: true,
          initial: this.#currentConfig.virtue
        }),
        name: "virtue",
        options: this.isConfigAllowed("virtue") ?
          this.#config.virtues.map(element => ({value: element, label: element})) :
          undefined
      },
      {
        field: new foundry.data.fields.StringField({
          label: _loc("THI.SkillCheck.CheckConfiguration.BurdenConfig.Label"),
          hint: _loc("THI.SkillCheck.CheckConfiguration.BurdenConfig.Hint"),
          blank: true,
          initial: this.#currentConfig.burden
        }),
        name: "burden",
        options: this.isConfigAllowed("burden") ? this.#config.burdens : undefined
      },
      {
        field: new foundry.data.fields.StringField({
          label: _loc("THI.SkillCheck.CheckConfiguration.ViceConfig.Label"),
          hint: _loc("THI.SkillCheck.CheckConfiguration.ViceConfig.Hint"),
          blank: true,
          initial: this.#currentConfig.vice
        }),
        name: "vice",
        options: this.isConfigAllowed("vice") ?
          this.#config.vices.map(element => ({value: element, label: element})) :
          undefined
      },
      {
        field: new foundry.data.fields.NumberField({
          label: _loc("THI.SkillCheck.CheckConfiguration.CustomMod.Label"),
          hint: _loc("THI.SkillCheck.CheckConfiguration.CustomMod.Hint"),
          blank: true,
          integer: true,
          initial: this.#customMod
        }),
        name: "customMod"
      }
    ];

    return context;
  }

  async _prepareButtonsContext(context, options) {
    context.buttons = {
      check: {
        default: true,
        icon: '<i class="fa-solid fa-star-christmas" inert></i>',
        label: _loc("CARDS.SkillCheck")
      }
    };

    return context;
  }

  /* -------------------------------------------- */
  /*  Properties                                  */
  /* -------------------------------------------- */

  /**
   * @type {SkillCheckProcessConfiguration}
   */
  #config;

  get config() {
    return this.#config;
  }

  /* -------------------------------------------- */

  /**
   * @type {number}
   */
  #baseCardNumber;

  get cardNumber() {
    let drawNumber;
    if (!Object.values(this.#currentConfig).every((value) => value === '')) {
      if (this.#currentConfig.ideal !== '') {
        drawNumber = this.#baseCardNumber - 1 + this.#customMod;
      }
      else if (this.#currentConfig.burden !== '' || this.#currentConfig.vice !== '') {
        drawNumber = this.#baseCardNumber + 1 + this.#customMod;
      }
    }
    else {
      drawNumber = this.#baseCardNumber + this.#customMod;
    }
    return Math.max(drawNumber, 1);
  }

  /* -------------------------------------------- */

  /**
   * @type {number}
   */
  #customMod = 0;

  /* -------------------------------------------- */

  /**
   * @type {Object}
   */
  #currentConfig = {
    ideal: '',
    burden: '',
    vice: '',
    virtue: ''
  };

  isConfigAllowed(type) {
    if (Object.values(this.#currentConfig).every((value) => value === '')) {
      return true;
    }
    if (this.#currentConfig[type] !== '') {
      return true;
    }
    return false;
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
    const user = game.user;
    const socketConfig = {
      user: user._id,
      cardDraw: this.cardNumber,
      suit: this.#config.suit,
      skill: this.#config.skill,
      ideal: formData.ideal,
      virtue: formData.virtue,
      burden: formData.burden,
      vice: formData.vice
    };

    thi.socket.emit("defineSkillCheck", socketConfig);
  }

  /* -------------------------------------------- */

  /** @inheritDoc */
  _onChangeForm(formConfig, event) {
    super._onChangeForm(formConfig, event);

    const formData = new foundry.applications.ux.FormDataExtended(this.form);
    this.#currentConfig.ideal = formData.object.ideal ? formData.object.ideal : '';
    this.#currentConfig.virtue = formData.object.virtue ? formData.object.virtue : '';
    this.#currentConfig.burden = formData.object.burden ? formData.object.burden : '';
    this.#currentConfig.vice = formData.object.vice ? formData.object.vice : '';
    this.#customMod = formData.object.customMod;
    this.render({parts: ["display", "configuration"]});
  }


}