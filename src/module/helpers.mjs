import THI from "./config.mjs";
import {systemID, systemPath} from "./constants.mjs";
import THIActor from "./documents/THIActor.mjs";
import THIUser from "./documents/THIUser.mjs";

export const CCM_ID = "complete-card-management";

/**
 * Searches through an object recursively and localizes strings.
 * @param {Record<string, unknown>} object
 */
export function localizeHelper(object) {
  for (const [key, value] of Object.entries(object)) {
    switch (typeof value) {
      case "object":
        if (value) localizeHelper(value);
        break;
      case "string":
        if (key === "label") object[key] = game.i18n.localize(value);
        break;
    }
  }
}

/* -------------------------------------------------- */

/**
 * Get deck config based on the name in config
 * @param {string} deckName         Name of the deck in config
 * @returns {string|string[]}
 */
export function getDeckConfig(deckName) {
  const config = game.settings.get(systemID, deckName);
  if (config.startsWith("Compendium.")) {
    return config.replace("Compendium.", "").split(".Cards.");
  } else {
    return config.replace("Cards.", "");
  }
}

/* -------------------------------------------------- */

/**
 * Get all items of a given type from an actor
 * @param {THIActor} actor
 * @param {string|string[]} itemType
 * @returns
 */
export function getItemsOfType(actor, itemType) {
  let arr = [];
  actor.items.forEach((doc) => {
    if (typeof itemType === "string") {
      if (doc.type === itemType) {
        arr.push({value: doc.id, label: doc.name});
      }
    }
    else {
      if (itemType.includes(doc.type)) {
        arr.push({value: doc.id, label: doc.name});
      }
    }
  });
  return arr;
}

/* -------------------------------------------- */
/*  Schema definitions                          */
/* -------------------------------------------- */


/**
 *
 * @param {boolean} base
 * @returns
 */
export function defineItemField(base = false) {
  const {BooleanField, SchemaField, StringField, TypedObjectField} = foundry.data.fields;
  let baseItems = THI.baseItems;
  if (base) {
    for (const [key, value] of Object.entries(baseItems)) {
      value.name = _loc(value.name);
    }
  }
  return new TypedObjectField(
    new SchemaField({
      name: new StringField({
        label: _loc("THI.Items.name")
      }),
      used: new BooleanField({
        label: _loc("THI.Items.used")
      }),
      consumable: new BooleanField({
        label: _loc("THI.Items.consumable")
      })
    }),
    {
      initial: base ? baseItems : {}
    }
  );
}

/* -------------------------------------------- */
/*  User hand managements                       */
/* -------------------------------------------- */

/**
 * Get hand of a designated user
 * @param {THIUser} user
 * @returns {THICards}
 */
export function getHandOfUser(user) {
  if (user === undefined) {
    return undefined;
  }
  const handId = user.getFlag(CCM_ID, "playerHand");
  return game.cards.get(handId);
}

/* -------------------------------------------------- */

/**
 * Get fortune hand of a designated
 * @param {THIUser} user
 * @returns {THICards}
 */
export function getFortuneHandOfUser(user) {
  if (user === undefined) {
    return undefined;
  }
  const fortuneId = user.getFlag(systemID, "fortuneHand");
  return game.cards.get(fortuneId);
}

/* -------------------------------------------------- */

/**
 * Return all cards in standard hands (no fortune hand) and the pile in the pip deck
 * @returns {Promise<any[]>}
 */
export function recallPlayerCards() {
  const hands = game.cards.filter(cards => ["hand", "pile"].includes(cards.type));
  const promises = [];
  hands.forEach(cards => promises.push(cards.recall({chatNotification: false})));
  return Promise.all(promises);
}

/* -------------------------------------------------- */

/**
 * Ensure all users have a hand to play with cards.
 * @param {THIUser} user
 */
export async function ensureHandsForUser(user) {
  const handId = user.getFlag(CCM_ID, "playerHand");
  let hand = game.cards.get(handId);

  if (hand === undefined) {
    const possibleHand = game.cards.find((cardStack) => {
      if (cardStack.type !== "hand") {
        return false;
      }
      const ownersId = Object.keys(cardStack.ownership).filter(key => cardStack.ownership[key] === 3);
      return ownersId.includes(user._id) && ownersId.length === 1;
    });

    if (possibleHand) {
      hand = possibleHand;
    }
    else {
      hand = await Cards.create({
        name: _loc("CARDS.Hands.Main", {name: user.name}),
        type: "hand",
        ownership: {
          [user.id]: CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER
        },
      });
    }
    user.setFlag(CCM_ID, "playerHand", hand._id);
  }

  if (hand.name !== _loc("CARDS.Hands.Main", {name: user.name})) {
    hand.update({
      name: _loc("CARDS.Hands.Main", {name: user.name})
    });
  }

  const fortuneId = user.getFlag(systemID, "fortuneHand");
  let fortuneHand = game.cards.get(fortuneId);
  if (fortuneHand === undefined) {
    const possibleHand = game.cards.find((cardStack) => {
      if (cardStack.type !== "fortuneHand") {
        return false;
      }
      const ownersId = Object.keys(cardStack.ownership).filter(key => cardStack.ownership[key] === 3);
      return ownersId.includes(user._id) && ownersId.length === 1;
    });

    if (possibleHand) {
      fortuneHand = possibleHand;
    }
    else {
      fortuneHand = await Cards.create({
        name: _loc("CARDS.Hands.Fortune", {name: user.name}),
        type: "fortuneHand",
        ownership: {
          [user.id]: CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER
        },
      });
    }
    user.setFlag(systemID, "fortuneHand", fortuneHand._id);
  }

  if (fortuneHand.name !== _loc("CARDS.Hands.Fortune", {name: user.name})) {
    fortuneHand.update({
      name: _loc("CARDS.Hands.Fortune", {name: user.name})
    });
  }

  const folderHand = hand.folder;
  const folderFortuneHand = fortuneHand.folder;
  let parentFolder = undefined;
  if (folderHand === folderFortuneHand) {
    if (folderHand === null) {
      const folder = await Folder.create({
        name: _loc("CARDS.Hands.Folder", {name: user.name}),
        color: user.color,
        type: "Cards",
        ownership: {
          [user.id]: CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER
        }
      });
      hand.update({
        folder: folder
      });
      fortuneHand.update({
        folder: folder
      });
    }
  }
  else {
    if (folderHand) {
      fortuneHand.update({
        folder: folderHand
      });
      parentFolder = folderHand;
    }
    else if (folderFortuneHand) {
      hand.update({
        folder: folderFortuneHand
      });
      parentFolder = folderFortuneHand;
    }
  }
  if (parentFolder && parentFolder.name !== _loc("CARDS.Hands.Folder", {name: user.name})) {
    parentFolder.update({
      name: _loc("CARDS.Hands.Folder", {name: user.name})
    });
  }
  if (parentFolder && parentFolder?.color !== user.color) {
    parentFolder.update({
      color: user.color
    });
  }
}

/* -------------------------------------------------- */

/**
 * Prepare the data structure for Active Effects which are currently embedded in an Actor or Item.
 * @param {ActiveEffect[]} effects    A collection or generator of Active Effect documents to prepare sheet data for.
 * @return {Object}                   Data for rendering.
 */
export function prepareActiveEffectCategories(effects) {
  const categories = {
    temporary: {
      type: "temporary",
      label: game.i18n.localize("THI.Effect.Temporary"),
      effects: [],
    },
    passive: {
      type: "passive",
      label: game.i18n.localize("THI.Effect.Passive"),
      effects: [],
    },
    inactive: {
      type: "inactive",
      label: game.i18n.localize("THI.Effect.Inactive"),
      effects: [],
    },
  };

  // Iterate over active effects, classifying them into categories
  for (const effect of effects) {
    if (!effect.active) categories.inactive.effects.push(effect);
    else if (effect.isTemporary) categories.temporary.effects.push(effect);
    else categories.passive.effects.push(effect);
  }

  // Sort each category
  for (const c of Object.values(categories)) {
    c.effects.sort((a, b) => (a.sort || 0) - (b.sort || 0));
  }
  return categories;
}


/* -------------------------------------------------- */

/**
 *
 * @returns List of vision choices with label
 */
export function defineVisionChoices() {
  const toReturn = {};
  Object.assign(toReturn, CONFIG.THI.arcana.major);
  Object.assign(toReturn, CONFIG.THI.arcana.court);
  return toReturn;
}

/* -------------------------------------------------- */

export async function addItem(target, systemPath) {
  const nameForm = foundry.applications.fields.createFormGroup({
    label: _loc('DOCUMENT.AgentItem.Prompt.Name'),
    input: foundry.applications.fields.createTextInput({
      name: "name"
    })
  });
  const consumableForm = foundry.applications.fields.createFormGroup({
    label: _loc('DOCUMENT.AgentItem.Prompt.Consumable'),
    input: foundry.applications.fields.createCheckboxInput({
      name: "consumable"
    })
  });
  const usedForm = foundry.applications.fields.createFormGroup({
    label: _loc('DOCUMENT.AgentItem.Prompt.Used'),
    input: foundry.applications.fields.createCheckboxInput({
      name: "used",
      initial: false
    })
  });

  const content = window.document.createElement("div");
  content.append(nameForm, consumableForm, usedForm);

  const data = await foundry.applications.api.DialogV2.input({
    window: {title: _loc('DOCUMENT.AgentItem.Prompt.Title')},
    content,
    ok: {
      label: _loc('DOCUMENT.AgentItem.Prompt.Confirm')
    }
  });

  if (data === null) {
    return;
  }

  const id = Math.random().toString(16).slice(2);
  const fullPath = systemPath + id;

  target.update({
    [fullPath]: data
  });
}

/* -------------------------------------------------- */

export async function deleteItem(target, systemPath) {
  const deleteItem = await foundry.applications.api.DialogV2.confirm({
    window: {
      title: _loc('DOCUMENT.AgentItem.Delete.Prompt.Title')
    },
    content: _loc('DOCUMENT.AgentItem.Delete.Prompt.Content'),
    rejectClose: false
  });

  if (deleteItem) {
    target.update({
      [systemPath]: _del
    });
  }
}

/* -------------------------------------------- */
/*  Logging                                     */
/* -------------------------------------------- */

/**
 * Log a console message with the "The Hidden Isle" prefix and styling.
 * @param {string} message                    Message to display.
 * @param {object} [options={}]
 * @param {string} [options.color="#0d6e00"]  Color to use for the log.
 * @param {any[]} [options.extras=[]]         Extra options passed to the logging method.
 * @param {string} [options.level="log"]      Console logging method to call.
 */
export function log(message, {color = "#0d6e00", extras = [], level = "log"} = {}) {
  console[level](
    `%cThe Hidden Isle | %c${message}`, `color: ${color}`, "color: revert", ...extras
  );
}


/* -------------------------------------------- */
/*  Handlebars Template Helpers                 */
/* -------------------------------------------- */

/**
 * Define a set of template paths to pre-load. Pre-loaded templates are compiled and cached for fast access when
 * rendering. These paths will also be available as Handlebars partials by using the file name
 * @returns {Promise}
 */
export async function preloadHandlebarsTemplates() {
  const partials = [
    // Fields partials
    systemPath("templates/shared/fields/field-class-item.hbs"),
    systemPath("templates/shared/fields/field-harm.hbs"),
    systemPath("templates/shared/fields/field-html.hbs"),
    systemPath("templates/shared/fields/field-item.hbs"),
    systemPath("templates/shared/fields/field-magical-prof.hbs"),
    systemPath("templates/shared/fields/field-magical-source.hbs"),
    systemPath("templates/shared/fields/field-mastery.hbs"),
    systemPath("templates/shared/fields/field-self-minor.hbs"),
    systemPath("templates/shared/fields/field-self-major.hbs"),
    systemPath("templates/shared/fields/field-xp.hbs"),
  ];

  const paths = {};
  for (const path of partials) {
    paths[path.replace(".hbs", ".html")] = path;
    paths[`thi.${path.split("/").pop().replace(".hbs", "")}`] = path;
  }

  return foundry.applications.handlebars.loadTemplates(paths);
}

/* -------------------------------------------- */

/**
 * Register custom Handlebars helpers.
 */
export function registerHandlebarsHelpers() {
  Handlebars.registerHelper({
    'replace': replace,
    'times': times,
    'visionLabel': visionLabel,
    'empty': empty
  });
}

/* -------------------------------------------- */
/*  Handlebars Helpers                          */
/* -------------------------------------------- */

function times(n, block) {
  var accum = '';
  for (var index = 0; index < n; ++index) {
    accum += block.fn(index);
  }
  return accum;
}

/* -------------------------------------------- */

function visionLabel(label) {
  const arcana = CONFIG.THI.arcana;
  if (label in arcana.court) {
    return arcana.court[label].label;
  }
  else {
    return arcana.major[label].label;
  }
}

/* -------------------------------------------- */

function replace(string, pattern, replacement) {
  return new Handlebars.SafeString(string.replace(pattern, replacement));
}

/* -------------------------------------------- */

function empty(obj) {
  return Object.keys(obj).length === 0;
}