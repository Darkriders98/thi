import {difficulty, suitIcons, systemID} from "./constants.mjs";
import * as helpers from "./helpers.mjs";

export default class THISocketHandler {
  constructor() {
    this.identifier = `system.${systemID}`;
  }

  /* -------------------------------------------------- */

  /**
   * Sets up socket reception.
   */
  registerSocketHandlers() {
    game.socket.on(this.identifier, ({type, payload}) => {
      switch (type) {
        case "defineSkillCheck":
          this.#defineSkillCheck(payload);
          break;
        case "showHand":
          this.#showHand(payload);
          break;
        default:
          throw new Error("Unknown type");
      }
    });
  }

  /* -------------------------------------------------- */

  /**
   *
   * @param {string} type
   * @param {object} payload
   * @returns
   */
  emit(type, payload) {
    return game.socket.emit(this.identifier, {type, payload});
  }

  /**
   * Asking for users to render their hands on screen
   * @param {object} payload
   * @param {string[]} payload.users    id of users we want to render hand
   */
  #showHand(payload) {
    if (!payload.users.includes(game.user._id)) return;
    helpers.getHandOfUser(game.user).sheet.render(true);
  }

  /**
   * Delegate for asking active GM to define skill check difficulty
   * @param {object} payload
   * @param {string} payload.user               Id of user from which skill check comes from
   * @param {number} payload.cardDraw           Card to draw for skill check
   * @param {string} payload.suit               Suit from which the skill is attached
   * @param {string} payload.skill              Skill actually checked
   * @param {string|undefined} payload.ideal    Potential ideal used in skill check
   * @param {string|undefined} payload.virtue   Potential virtue used in skill check
   * @param {string|undefined} payload.burden   Potential burden used in skill check
   * @param {string|undefined} payload.vice     Potential vice used in skill check
   */
  async #defineSkillCheck(payload) {
    if (!game.user.isActiveGM) return;
    if (game.user._id === payload.user) return;

    const targetUser = game.users.get(payload.user);
    const difficultyOptions = foundry.applications.fields.createSelectInput({
      name: "difficulty",
      options: [
        {
          value: "easy",
          label: _loc("THI.SkillCheck.DifficultyConfiguration.Difficulty.Easy")
        }, {
          value: "medium",
          label: _loc("THI.SkillCheck.DifficultyConfiguration.Difficulty.Medium")
        }, {
          value: "hard",
          label: _loc("THI.SkillCheck.DifficultyConfiguration.Difficulty.Hard")
        }]
    });
    const difficultyForm = foundry.applications.fields.createFormGroup({
      label: _loc("THI.SkillCheck.DifficultyConfiguration.Difficulty.Label"),
      input: difficultyOptions
    });

    const customCardOptions = foundry.applications.fields.createNumberInput({
      name: "customCard",
      min: 0,
      max: 40 - payload.cardDraw,
      step: 1,
      type: "range"
    });
    const customCardForm = foundry.applications.fields.createFormGroup({
      label: _loc("THI.SkillCheck.DifficultyConfiguration.CustomCard"),
      input: customCardOptions
    });

    const content = window.document.createElement("div");
    const header = window.document.createElement("h1");
    header.innerHTML = _loc("THI.SkillCheck.DifficultyConfiguration.Header",
      {
        name: targetUser.character ? targetUser.character.name : targetUser.name,
        skill: payload.skill
      });
    content.append(header);
    content.append(difficultyForm, customCardForm);

    const skillCheckOptions = await foundry.applications.api.DialogV2.input({
      window: {
        title: _loc("THI.SkillCheck.DifficultyConfiguration.Title"),
        icon: _loc(suitIcons[payload.suit])
      },
      content
    });

    if (skillCheckOptions === null) return;

    const GMCardDraw = [null, 0].includes(skillCheckOptions.customCard) ?
      difficulty[skillCheckOptions.difficulty] :
      skillCheckOptions.customCard;

    await helpers.recallPlayerCards();

    const pipDeck = CONFIG.THI.decks.pip;
    pipDeck.shuffle({
      chatNotification: false
    });

    const userHand = helpers.getHandOfUser(targetUser);
    const gmHand = helpers.getHandOfUser(game.user);

    pipDeck.deal(
      [userHand],
      payload.cardDraw,
      {
        how: CONST.CARD_DRAW_MODES.RANDOM
      }
    );
    pipDeck.deal(
      [gmHand],
      GMCardDraw,
      {
        how: CONST.CARD_DRAW_MODES.RANDOM
      }
    );

    thi.socket.emit(
      "showHand",
      {
        users: [payload.user]
      }
    );

    helpers.getHandOfUser(game.user).sheet.render(true);
  }
}