/**
 * A simple extension that adds a hook at the end of data prep.
 */
export default class THIItem extends foundry.documents.Item {

  /** @inheritdoc */
  prepareDerivedData() {
    super.prepareDerivedData();

    /**
     * Flexible hook for modules to alter derived document data.
     * @param {THIItem} item      The item preparing derived data.
     */
    Hooks.callAll("THI.prepareItemData", this);
  }
}
