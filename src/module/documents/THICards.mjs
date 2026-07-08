/**
 * A simple extension that adds a hook at the end of data prep.
 */
export default class THICards extends foundry.documents.Cards {
  /** @inheritdoc */
  prepareDerivedData() {
    super.prepareDerivedData();

    /**
     * Flexible hook for modules to alter derived document data.
     * @param {THICards} cards      The cards preparing derived data.
     */
    Hooks.callAll("THI.prepareCardsData", this);
  }

  /** @override */
  get typeLabel(){
    switch (this.type) {
      case "fortuneHand": return _loc("TYPES.Cards.fortuneHand");
      default: return super.typeLabel();
    }
  }
}
