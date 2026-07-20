import * as apps from "./apps/_module.mjs";
import * as dataModels from "./data/_module.mjs";
import * as documents from "./documents/_module.mjs";
import * as helpers from "./helpers.mjs";
import {log} from "./helpers.mjs";
import {systemID} from "./constants.mjs";
import THI from "./config.mjs";

/**
 * @import {Cards} from "@client/documents/_module.mjs";
 */
export function init() {
  log(`Initializing The Hidden Isle Game System - Version ${game.system.version}\n${THI.ASCII}`);
  CONFIG.THI = THI;
  thi.socket.registerSocketHandlers();

  // Assign document classes
  for (const docCls of Object.values(documents)) {
    CONFIG[docCls.documentName].documentClass = docCls;
  }

  Object.assign(CONFIG.Actor.dataModels, dataModels.Actor.config);
  Object.assign(CONFIG.Combatant.dataModels, dataModels.Combatant.config);
  Object.assign(CONFIG.Item.dataModels, dataModels.Item.config);

  CONFIG.Actor.defaultType = "agent";
  CONFIG.Item.defaultType = "ability";

  // Document Sheets
  foundry.documents.collections.Actors.registerSheet(systemID, apps.Actor.AgentSheet,
    {
      types: ["agent"],
      makeDefault: true,
      label: "THI.Sheets.Labels.AgentSheet",
    });
  foundry.documents.collections.Actors.registerSheet(systemID, apps.Actor.AdversarySheet,
    {
      types: ["adversary"],
      makeDefault: true,
      label: "THI.Sheets.Labels.AdversarySheet"
    }
  )
  foundry.documents.collections.Items.registerSheet(systemID, apps.Item.THIItemSheet,
    {
      makeDefault: true,
      label: "THI.Sheets.Labels.ItemSheet",
    });

  const DocumentSheetConfig = foundry.applications.apps.DocumentSheetConfig;
  DocumentSheetConfig.registerSheet(
    documents.THICards,
    systemID,
    foundry.applications.sheets.CardHandConfig,
    {
      label: "CARDS.CardsFortuneHand",
      types: ["fortuneHand"]
    });
  DocumentSheetConfig.registerSheet(
    documents.THICards,
    helpers.CCM_ID,
    ccm.apps.CardsSheets.HandSheet,
    {
      label: "CCM.Sheets.Hand",
      types: ["fortuneHand"]
    }
  );
  DocumentSheetConfig.registerSheet(
    documents.THICards,
    helpers.CCM_ID,
    ccm.apps.CardsSheets.DockedHandSheet,
    {
      label: "CCM.Sheets.DockedHand",
      types: ["fortuneHand"],
      makeDefault: true
    }
  );

  // Game settings
  game.settings.register(systemID, "PipDeck", {
    name: "THI.Settings.PipDeck.Label",
    hint: "THI.Settings.PipDeck.Hint",
    scope: "world",
    config: true,
    requiresReload: true,
    type: new foundry.data.fields.DocumentUUIDField(
      {
        type: "Cards",
        nullable: false,
        initial: `Compendium.thi.decks.Cards.xYpJgsw04rnokwPo`,
        validationError: "Must be set to make system works"
      }
    ),
  });
  game.settings.register(systemID, "VisionDeck", {
    name: "THI.Settings.VisionDeck.Label",
    hint: "THI.Settings.VisionDeck.Hint",
    scope: "world",
    config: true,
    requiresReload: true,
    type: new foundry.data.fields.DocumentUUIDField(
      {
        type: "Cards",
        nullable: false,
        initial: `Compendium.thi.decks.Cards.tbapE4O1OVUbfeAd`,
        validationError: "Must be set to make system works"
      }
    )
  });
  game.settings.register(systemID, "AutoXP", {
    name: "THI.Settings.AutoXP.Label",
    hint: "THI.Settings.AutoXP.Hint",
    scope: "world",
    config: true,
    requiresReload: false,
    type: new foundry.data.fields.BooleanField({
      initial: true
    })
  });

  // Preload Handlebars helpers & partials
  helpers.registerHandlebarsHelpers();
  helpers.preloadHandlebarsTemplates();

  // Sidebar tabs
  CONFIG.ui.combat = apps.Combat.THICombatTracker;
  log(`The Hidden Isle Game System initialization finished.`);
}

export function i18nInit() {
  // Localizing the system's CONFIG object
  helpers.localizeHelper(CONFIG.THI);
  log(`The Hidden Isle Game System translation finished.`);
}

export async function ready() {
  if (game.user.isGM) {
    log(`Setup The Hidden Isle Game System`);
    log(`Started gathering pip and vision deck`);
    const pipConfig = helpers.getDeckConfig("PipDeck");
    const visionConfig = helpers.getDeckConfig("VisionDeck");
    CONFIG.THI.decks = {};

    if (Array.isArray(pipConfig)) {
      const compendium = game.packs.get(pipConfig[0]);
      const pip = await game.cards.importFromCompendium(
        compendium,
        pipConfig[1]
      );
      CONFIG.THI.decks.pip = pip;
    }
    else {
      CONFIG.THI.decks.pip = game.cards.get(pipConfig);
    }

    if (CONFIG.THI.decks.pip.name !== _loc("CARDS.BaseDeck.PipDeck")) {
      CONFIG.THI.decks.pip.update({
        name: _loc("CARDS.BaseDeck.PipDeck")
      });
    }

    if (Array.isArray(visionConfig)) {
      const compendium = game.packs.get(visionConfig[0]);
      const vision = await game.cards.importFromCompendium(
        compendium,
        visionConfig[1]
      );
      CONFIG.THI.decks.vision = vision;
    }
    else {
      CONFIG.THI.decks.vision = game.cards.get(visionConfig);
    }

    if (CONFIG.THI.decks.vision.name !== _loc("CARDS.BaseDeck.VisionDeck")) {
      CONFIG.THI.decks.vision.update({
        name: _loc("CARDS.BaseDeck.VisionDeck")
      });
    }
    log(`Successfuly gather pip and vision deck`);

    log(`Ensuring having at least one Pile to use`);
    const pile = game.cards.find(card => card.type === "pile");
    if (pile) {
      if (pile.name !== _loc("CARDS.BaseDeck.CommonPile")) {
        pile.update({
          name: _loc("CARDS.BaseDeck.CommonPile")
        });
      }
      if (pile.ownership.default !== CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER) {
        pile.update({
          ownership: {
            default: CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER
          }
        });
      }
    }
    else {
      Cards.create({
        name: _loc("CARDS.BaseDeck.CommonPile"),
        type: "pile",
        ownership: {
          default: CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER
        },
      });
    }
    log(`Successfuly ensured having a Pile`);

    log(`Game Master started ensuring all users have a hand`);
    game.users.forEach(user => {
      log(`Ensuring ${user.name} have a hand`);
      helpers.ensureHandsForUser(user);
    });
    log(`Game Master successfully ensured all users have a hand`);

    game.settings.set(systemID, "PipDeck", CONFIG.THI.decks.pip._uuid);
    game.settings.set(systemID, "VisionDeck", CONFIG.THI.decks.vision._uuid);
  }
  log(`The Hidden Isle | Ready`);
}

export function renderUserConfig(app, html) {
  const PCDisplay = html.querySelector("fieldset:nth-child(2)");
  const cardSelect = document.createElement("fieldset");
  const legend = document.createElement("legend");
  legend.innerText = game.system.title;
  PCDisplay.after(cardSelect);
  cardSelect.prepend(legend);

  /** @type {User} */
  const user = app.document;
  const fortuneId = user.getFlag(systemID, "fortuneHand");
  const options = game.cards.reduce((arr, doc) => {
    if (!doc.visible || (doc.type !== "fortuneHand") || !doc.canUserModify(game.user, "update")) return arr;
    arr.push({value: doc.id, label: doc.name});
    return arr;
  }, []);

  const fortuneSelect = foundry.applications.fields.createSelectInput({
    name: `flags.${systemID}.fortuneHand`,
    value: fortuneId,
    options,
    blank: "",
  });

  const fortuneSelectGroup = foundry.applications.fields.createFormGroup({
    label: "THI.UserConfig.FortuneHand",
    localize: true,
    input: fortuneSelect,
  });

  cardSelect.append(fortuneSelectGroup);
}

export function getSceneControlButtons(hudButtons) {
  if (game.user.isGM) {
    hudButtons.tokens.tools.drawFortune = {
      name: "drawFortune",
      title: "THI.ControlButtons.DrawFortune.Label",
      icon: _loc("THI.ControlButtons.DrawFortune.Icon"),
      button: true,
      onChange: drawFortune
    };
    hudButtons.tokens.tools.givePlayerXP = {
      name: "givePlayerXP",
      title: "THI.ControlButtons.GivePlayerXP.Label",
      icon: _loc("THI.ControlButtons.GivePlayerXP.Icon"),
      button: true,
      onChange: givePlayerXP
    };
    hudButtons.tokens.tools.resetUsedItems = {
      name: "resetUsedItems",
      title: "THI.ControlButtons.ResetUsedItems.Label",
      icon: _loc('THI.ControlButtons.ResetUsedItems.Icon'),
      button: true,
      onChange: resetUsedItems
    };
  }
}

async function drawFortune(event, active) {
  if (active) {
    /** @type {THICards} */
    const pipDeck = CONFIG.THI.decks.pip;
    pipDeck.recall({
      chatNotification: false
    });
    pipDeck.shuffle({
      chatNotification: false
    });
    const fortuneHands = [];
    game.users.forEach(async (user) => {
      if (user.active && !user.isActiveGM) {
        const fortuneHand = helpers.getFortuneHandOfUser(user);
        fortuneHands.push(fortuneHand);
      }
    });

    pipDeck.deal(
      fortuneHands,
      2,
      {
        how: CONST.CARD_DRAW_MODES.RANDOM
      }
    );
  }
}

async function givePlayerXP(event, active) {
  if (active) {
    let XPGiven;
    try {
      XPGiven = await foundry.applications.api.DialogV2.prompt({
        window: {title: "Choose a number of XP to give to player"},
        content: `<input name="guess" type="number" autofocus>`,
        ok: {
          label: "Submit",
          callback: (event, button, dialog) => button.form.elements.guess.valueAsNumber
        }
      });
    } catch {
      return;
    }
    game.users.forEach((user) => {
      if (user.active && user !== game.user) {
        const character = user.character;
        if (character) {
          const finalXP = character.system.header.storedXP + XPGiven;
          character.update({
            ["system.header.storedXP"]: finalXP
          });
        }
        else {
          ui.notifications.warn("NOTIFICATIONS.Warning.MissingCharacter", {
            localize: true,
            console: false,
            format: {
              name: user.name
            }
          });
        }
      }
    });
  }
}

async function resetUsedItems(event, active) {
  if (active) {
    const agents = game.actors.filter(doc => doc.type === "agent");
    agents.forEach(agent => {
      const baseItems = foundry.utils.getProperty(agent, "system.inventory.baseItems");
      const customItems = foundry.utils.getProperty(agent, "system.inventory.customItems");

      const actorUpdates = {
        ["system.inventory.usages"]: 0
      };

      for (const [key, value] of Object.entries(baseItems)) {
        const itemPath = "system.inventory.baseItems." + key + ".used";
        actorUpdates[itemPath] = false;
      }
      for (const [key, value] of Object.entries(customItems)) {
        const itemPath = "system.inventory.customItems." + key;
        actorUpdates[itemPath] = _del;
      }
      agent.update(actorUpdates);

      const agentClass = agent.class;
      if (agentClass === undefined) {
        return;
      }

      const classItems = foundry.utils.getProperty(agentClass, "system.items");
      const classUpdates = {};
      for (const [key, value] of Object.entries(classItems)) {
        const itemPath = "system.items." + key + ".used";
        classUpdates[itemPath] = false;
      }
      agentClass.update(classUpdates);

    });
  }
}