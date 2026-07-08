/**
 * A simple extension that adds a hook at the end of data prep.
 */
export default class THICombatant extends foundry.documents.Combatant {
  /** @inheritdoc */
  prepareDerivedData() {
    super.prepareDerivedData();

    /**
     * Flexible hook for modules to alter derived document data.
     * @param {THICombatant} combatant      The combatant preparing derived data.
     */
    Hooks.callAll("THI.prepareCombatantData", this);
  }

  /**
   *
   * @param {string} formula
   * @returns {import("@common/dice/").Roll} roll
   */
  getInitiativeRoll(formula){
    return new foundry.dice.Roll("1d10", {});
  }
}
