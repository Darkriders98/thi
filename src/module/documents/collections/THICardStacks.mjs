/**
 * A simple extention that adds a hook at the end of data prep.
 */
export default class THICardStacks extends foundry.documents.collections.CardStacks {
  /** @inheritdoc */
  prepareDerivedData() {
    super.prepareDerivedData();

    /**
     * Flexible hook for modules to alter derived document data.
     * @param {THICardStacks} stack
     */
    Hooks.callAll("THI.prepareCardStacksData", this);
  }
}