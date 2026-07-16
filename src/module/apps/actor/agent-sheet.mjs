import {systemPath, suitIcons} from "../../constants.mjs";
import THIItem from "../../documents/THIItem.mjs";
import {addItem, deleteItem} from "../../helpers.mjs";
import BaseActorSheet from "./api/base-actor-sheet.mjs";
import SkillCheckConfigurationDialog from "../cards/skill-check-configuration-dialog.mjs";
import CreateClockDialog from "./dialog/create-clock.mjs";

/**
 * Extend the basic ActorSheet with some very simple modifications.
 */
export class AgentSheet extends BaseActorSheet {
  /** @inheritdoc */
  static DEFAULT_OPTIONS = {
    classes: ["agent"],
    position: {
      width: 1000,
      height: 800,
    },
    actions: {
      expandDoc: this.#expandDoc,
      skillCheck: this.#skillCheck,
      getHarm: this.#getHarm,
      addClock: this.#addClock,
      updateClock: this.#updateClock,
      removeClock: this.#removeClock,
      addItem: this.#addItem,
      deleteItem: this.#deleteItem,
      useItem: this.#useItem,
      addClass: this.#addClass,
      editClass: this.#editClass,
      deleteClass: this.#deleteClass
    },
    form: {
      submitOnChange: true,
    },
  };

  /* -------------------------------------------------- */

  static TABS = {
    primary: {
      tabs: [
        {
          id: "skills",
        },
        {
          id: "abilities",
        },
        {
          id: "inventory"
        },
        {
          id: "magic",
        },
        {
          id: "self"
        },
        {
          id: "relations"
        },
        {
          id: "biography"
        }
      ],
      initial: "skills",
      labelPrefix: "THI.Sheets.Tabs",
    }
  };

  /* -------------------------------------------------- */

  /** @inheritdoc */
  static PARTS = {
    header: {
      template: systemPath("templates/actor/header.hbs"),
    },
    tabs: {
      template: "templates/generic/tab-navigation.hbs",
    },
    skills: {
      template: systemPath("templates/actor/skills.hbs"),
      scrollable: [""],
    },
    abilities: {
      template: systemPath("templates/actor/abilities.hbs"),
      scrollable: [""],
    },
    inventory: {
      template: systemPath("templates/actor/inventory.hbs"),
      scrollable: [""]
    },
    magic: {
      template: systemPath("templates/actor/magic.hbs"),
      scrollable: [""]
    },
    self: {
      template: systemPath("templates/actor/self.hbs"),
      scrollable: [""]
    },
    relations: {
      template: systemPath("templates/actor/relations.hbs"),
      scrollable: [""]
    },
    biography: {
      template: systemPath("templates/actor/biography.hbs"),
      scrollable: [""]
    }
  };

  /* -------------------------------------------------- */

  /** @inheritdoc */
  _initializeApplicationOptions(options) {
    const initialized = super._initializeApplicationOptions(options);

    initialized.classes.push(initialized.document.type);

    initialized.variables = {};
    Object.defineProperty(initialized.variables, "expandedChild", {
      value: undefined,
      writable: true
    });

    return initialized;
  }


  /* -------------------------------------------------- */

  /** @inheritdoc */
  async _preparePartContext(partId, context) {
    const fields = await this._getFields();
    const items = await this._getItems();
    const actor = this.actor;
    switch (partId) {
      case "header":
        context.field = fields[partId];
        context.class = actor.class;
        break;
      case "skills":
      case "biography":
        context.field = fields[partId];
        context.tab = context.tabs[partId];
        break;
      case "inventory":
        context.field = fields[partId];
        context.class = actor.class;
        context.tab = context.tabs[partId];
        break;
      case "abilities":
        context.field = fields[partId];
        context.class = actor.class;
        context.itemTypes = items["ability"];
        context.tab = context.tabs[partId];
        break;
      case "magic":
        context.itemTypes = [
          items["magicalprof"],
          items["magicalsource"]
        ];
        context.tab = context.tabs[partId];
        break;
      case "self":
        const field = {};
        field.core = fields[partId].fields.filter((field) => {
          if (!field.fieldset) {
            if (["adulthood", "childhood", "fulfilled"].includes(field.field.name)) {
              return true;
            }
          }
          return false;
        });
        field.negative = fields[partId].fields.filter((field) => {
          if (field.fieldset) {
            return field.name === "burden";
          }
          else {
            return field.field.name === "vices";
          }
        });
        field.positive = fields[partId].fields.filter((field) => {
          if (field.fieldset) {
            return field.name === "ideal";
          }
          else {
            return field.field.name === "virtues";
          }
        });
        context.field = field;
        context.itemTypes = [];
        context.tab = context.tabs[partId];
        break;
      case "relations":
        context.itemTypes = items["contact"];
        context.tab = context.tabs[partId];
        break;
    }
    return context;
  }

  /* -------------------------------------------------- */
  /*   Drag and drop                                    */
  /* -------------------------------------------------- */

  /**
   * Callback actions which occur when a dragged element is dropped on a target.
   * @param {DragEvent} event       The originating DragEvent.
   * @protected
   */
  async _onDrop(event) {
    const data = foundry.applications.ux.TextEditor.implementation.getDragEventData(event);
    const item = await foundry.utils.fromUuid(data.uuid);
    const actor = this.actor;
    if (item.type === "class") {
      if (actor.class !== undefined) {
        return;
      }
    }

    super._onDrop(event);
  }

  /* -------------------------------------------------- */
  /*   Event handlers                                   */
  /* -------------------------------------------------- */

  /**
   * @this AgentSheet
   * @param {PointerEvent} event
   * @param {HTMLElement} target
   * @private
   */

  static async #expandDoc(event, target) {
    const doc = this._getEmbeddedDocument(target);
    const child = this.options.variables.expandedChild;

    if (typeof child !== 'undefined') {
      const siblingTarget = child.previousSibling.querySelector('.item-expand');
      if (siblingTarget !== target) {
        if (siblingTarget?.hasAttribute("expanded")) {
          siblingTarget.removeAttribute("expanded");
        }
        target.removeAttribute("expanded");
      }
      const parent = child.parentElement;
      parent.removeChild(child);
      this.options.variables.expandedChild = undefined;
    }

    if (!target.hasAttribute("expanded")) {
      const element = document.createElement("li");
      element.classList.add(
        "description",
        "flexcol");
      element.innerHTML = doc.system.description;
      const parentElement = target.closest("li");
      parentElement.after(element);
      this.options.variables.expandedChild = element;
      target.setAttribute("expanded", null);
    }
    else {
      target.removeAttribute("expanded");
    }
  }

  /* -------------------------------------------------- */

  /**
   * Create a skill check
   *
   * @this AgentSheet
   * @param {PointerEvent} event
   * @param {HTMLElement} target
   * @private
   */
  static async #skillCheck(event, target) {
    const currentUser = game.user;
    const actor = this.actor;
    const suit = target.dataset.suit;
    const skill = target.dataset.skill;

    const mastery = actor.system.skills[suit][skill];
    const harm = actor.system.skills[suit].harm;
    const harmConsequences = harm.harm1 !== 'none' && harm.harm2 !== 'none';

    const idealOptions = [foundry.utils.getProperty(actor, "system.self.ideal")];
    const virtueOptions = foundry.utils.getProperty(actor, "system.self.virtues");
    const burdenOptions = [foundry.utils.getProperty(actor, "system.self.burden")];
    const viceOptions = foundry.utils.getProperty(actor, "system.self.vices");

    const skillDialog = new SkillCheckConfigurationDialog(
      {
        user: currentUser,
        suit: suit,
        skill: skill,
        mastery: mastery,
        harm: harmConsequences,
        ideals: idealOptions,
        virtues: virtueOptions,
        burdens: burdenOptions,
        vices: viceOptions
      },
      {
        window: {
          title: "THI.SkillCheck.CheckConfiguration.Title",
          icon: _loc(suitIcons[suit]),
          minimizable: false,
        }
      }
    );

    skillDialog.render({force: true});
  }

  /* -------------------------------------------------- */

  /**
   *
   * @param {PointerEvent} event
   * @param {HTMLElement} target
   */
  static async #getHarm(event, target) {
    const actor = this.actor;
    const harm = foundry.utils.getProperty(actor, target.dataset.path);
    if (harm === undefined) {
      return;
    }
    if (harm !== 'none') {
      // Can't define harm if we already have one
      return;
    }
    const newHarm = await foundry.applications.api.DialogV2.wait({
      window: {
        title: _loc('THI.Harm.Prompt.Title')
      },
      content: `<h2>${_loc('THI.Harm.Prompt.Content')}</h2>`,
      buttons: [{
        action: "physical",
        label: _loc('THI.Harm.Physical')
      },
      {
        action: "spiritual",
        label: _loc('THI.Harm.Spiritual')
      },
      {
        action: "trauma",
        label: _loc('THI.Harm.Trauma')
      }]
    });

    if (newHarm !== "none") {
      this.document.update({
        [target.dataset.path]: newHarm
      });
    }
  }

  /* -------------------------------------------------- */

  static async #addClock(event, target) {
    const fieldset = target.closest("fieldset[class=clocks]");
    const clockDialog = new CreateClockDialog({
      actor: this.actor,
      fieldPath: fieldset.dataset.fieldPath,
      clockMaxes: CONFIG.THI.clockMaxes
    }, {
      window: {
        title: 'DOCUMENT.Clocks.Add.Prompt.Title',
        minimizable: false,
      }
    });

    clockDialog.render({force: true});
  }

  /* -------------------------------------------------- */

  static async #updateClock(event, target) {
    const fieldset = target.closest("fieldset[class=clocks]");
    const clock = target.closest("div.clock");
    const id = clock.dataset.id;
    const clockPath = fieldset.dataset.fieldPath + "." + id;

    const value = foundry.utils.getProperty(this.actor, clockPath);
    if (value.progress >= value.max) {
      return;
    }

    value.progress += 1;
    if (value.progress == value.max) {
      const deleteClock = await foundry.applications.api.DialogV2.confirm({
        window: {
          title: _loc('DOCUMENT.Clocks.Delete.Prompt.Title')
        },
        content: _loc('DOCUMENT.Clocks.Delete.Prompt.Content'),
        rejectClose: false
      });

      if (deleteClock) {
        this.actor.update({
          [clockPath]: _del
        });
        return;
      }
    }

    this.actor.update({
      [clockPath]: value
    });
  }

  /* -------------------------------------------------- */

  static async #removeClock(event, target) {
    const fieldset = target.closest("fieldset[class=clocks]");
    const clock = target.closest("div.clock");
    const id = clock.dataset.id;
    const clockPath = fieldset.dataset.fieldPath + "." + id;

    this.actor.update({
      [clockPath]: _del
    });
  }

  /* -------------------------------------------------- */

  static async #addItem(event, target) {
    const path = target.dataset.path + "."
    addItem(this.actor, path);
  }
  /* -------------------------------------------------- */

  static async #deleteItem(event, target) {
    const path = target.closest("li.item").dataset.fieldPath;
    deleteItem(this.actor, path);
  }

  /* -------------------------------------------------- */

  static async #useItem(event, target) {
    const list = target.closest("li.item");
    const itemActor = foundry.utils.getProperty(this.actor, list.dataset.fieldPath);
    const itemClass = foundry.utils.getProperty(this.actor.class, list.dataset.fieldPath);

    if (itemActor === undefined && itemClass === undefined) {
      return;
    }

    const item = itemActor ? itemActor : itemClass;
    if (item.used) {
      return;
    }

    const usagesPath = "system.inventory.usages";
    const usages = foundry.utils.getProperty(this.actor, usagesPath);
    if (usages >= 5) {
      return;
    }

    const fullPath = list.dataset.fieldPath + ".used";

    if (itemActor !== undefined) {
      this.actor.update({
        [usagesPath]: usages + 1,
        [fullPath]: true
      });
    }
    else {
      this.actor.update({
        [usagesPath]: usages + 1
      });
      this.actor.class.update({
        [fullPath]: true
      });
    }
  }

  /* -------------------------------------------------- */

  static async #addClass(event, target) {
    await game.packs.get("thi.classes").getDocuments({type: "class"});
    const classes = game.items.filter(doc => doc.type === "class")
      .map(element => ({
        value: element.uuid,
        label: element.name
      }))
      .concat(
        game.packs.get("thi.classes").filter(doc => doc.type === "class")
          .map(element => ({
            value: element.uuid,
            label: element.name
          })));

    const form = foundry.applications.fields.createFormGroup({
      label: _loc('DOCUMENT.Class.Add.Prompt.Label'),
      input: foundry.applications.fields.createSelectInput({
        name: "class",
        options: classes
      })
    });

    const content = window.document.createElement("div");
    content.append(form);

    const uuid = await foundry.applications.api.DialogV2.input({
      window: {title: _loc('DOCUMENT.Class.Add.Prompt.Title')},
      content,
      ok: {
        label: _loc('DOCUMENT.Class.Add.Prompt.Confirm')
      }
    });

    if (uuid === null) {
      return;
    }

    const item = await foundry.utils.fromUuid(uuid.class);
    if (item === undefined) {
      return;
    }

    const keepId = !this.actor.items.has(item.id);
    const data = item.inCompendium ?
      game.items.fromCompendium(item, {clearFolder: true, keepId}) :
      item.toObject();
    const result = await THIItem.implementation.create(data, {parent: this.actor, keepId});
    return result ?? null;
  }

  static #editClass(event, target) {
    const actorClass = this.actor.class;
    if (actorClass === undefined) {
      return;
    }

    actorClass.sheet.render(true);
  }

  /* -------------------------------------------------- */

  static async #deleteClass(event, target) {
    const deleteClass = await foundry.applications.api.DialogV2.confirm({
      window: {
        title: _loc('DOCUMENT.Class.Delete.Prompt.Title')
      },
      content: _loc('DOCUMENT.Class.Delete.Prompt.Content'),
      rejectClose: false
    });

    if (deleteClass) {
      this.actor.class.delete();
    }
  }
}
