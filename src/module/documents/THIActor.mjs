import THIItem from "./THIItem.mjs";

/**
 * A simple extension that adds a hook at the end of data prep.
 */
export default class THIActor extends foundry.documents.Actor {

  /**
 * Lazily computed store of classes, subclasses, background, and species.
 * @type {Record<string, Record<string, THIItem|THIItem[]>>}
 */
  _lazy = {};

  /* -------------------------------------------- */
  /*  Properties                                  */
  /* -------------------------------------------- */

  /**
   * Class belonging to this Actor.
   * @type {Record<string, Item5e>}
   */
  get class() {
    if (this._lazy?.class !== undefined) return this._lazy.class;
    return this._lazy.class = this.itemTypes.class[0];
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  prepareData() {
    this._clearCachedValues();
    super.prepareData();
  }

  /* --------------------------------------------- */

  /**
   * Clear cached class collections.
   * @internal
   */
  _clearCachedValues() {
    this._lazy = {};
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  prepareDerivedData() {
    super.prepareDerivedData();

    /**
     * Flexible hook for modules to alter derived document data.
     * @param {THIActor} actor      The actor preparing derived data.
     */
    Hooks.callAll("THI.prepareActorData", this);
  }
}
