/**
 * A simple extension that adds a hook at the end of data prep.
 */
export default class THIActiveEffect extends foundry.documents.ActiveEffect {
  /** @inheritdoc */
  prepareDerivedData() {
    super.prepareDerivedData();

    /**
     * Flexible hook for modules to alter derived document data.
     * @param {THIActiveEffect} effect      The effect preparing derived data.
     */
    Hooks.callAll("THI.prepareActiveEffectData", this);
  }
}
