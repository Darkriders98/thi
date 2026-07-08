/**
 * A simple extension that adds a hook at the end of data prep.
 */
export default class THIChatMessage extends foundry.documents.ChatMessage {
  /** @inheritdoc */
  prepareDerivedData() {
    super.prepareDerivedData();

    /**
     * Flexible hook for modules to alter derived document data.
     * @param {THIChatMessage} message      The chat message preparing derived data.
     */
    Hooks.callAll("THI.prepareChatMessageData", this);
  }
}
