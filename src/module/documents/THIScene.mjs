/**
 * A simple extension that adds a hook at the end of data prep.
 */
export default class THIScene extends foundry.documents.Scene {
  /** @inheritdoc */
  prepareDerivedData() {
    super.prepareDerivedData();

    /**
     * Flexible hook for modules to alter derived document data.
     * @param {THIScene} scene      The scene preparing derived data.
     */
    Hooks.callAll("THI.prepareSceneData", this);
  }
}
