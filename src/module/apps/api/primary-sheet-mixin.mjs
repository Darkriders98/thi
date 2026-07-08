
/**
 * Adds V2 sheet functionality shared between primary document sheets (Actors & Items).
 * @param {typeof Application} Base  The base class being mixed.
 * @returns {typeof PrimarySheetThi}
 */
export default function PrimarySheetMixin(Base) {
  return class PrimarySheetThi extends Base {
    /** @override */
    static DEFAULT_OPTIONS = {
      actions: {
        changeMode: PrimarySheetThi.#changeMode
      }
    };

    /**
     * Available sheet modes.
     * @enum {number}
     */
    static MODES = {
      PLAY: 1,
      EDIT: 2
    };

    /**
     * @type {PrimarySheetThi.MODES|null}
     * @protected
     */
    _mode = null;


    /**
     * @type {boolean}
     */
    get isEditMode() {
      return this._mode === this.constructor.MODES.EDIT;
    }

    static #changeMode(event, target) {
      this._onChangeSheetMode(event, target);
    }

    /* -------------------------------------------- */

    /** @inheritDoc */
    async _prepareContext(options) {
      const context = await super._prepareContext(options);
      context.owner = this.document.isOwner;
      context.locked = !this.isEditable;
      context.editable = this.isEditable && this.isEditMode;
      return context;
    }

    /* -------------------------------------------- */

    /**
     * Handle the user toggling the sheet mode.
     * @param {Event} event         Triggering click event.
     * @param {HTMLElement} target  Button that was clicked.
     * @protected
     */
    async _onChangeSheetMode(event, target = event.currentTarget) {
      const {MODES} = this.constructor;
      const label = game.i18n.localize(`THI.SheetMode.${target.checked ? "Play" : "Edit"}`);
      target.dataset.tooltip = label;
      target.setAttribute("aria-label", label);
      this._mode = target.checked ? MODES.EDIT : MODES.PLAY;
      await this.submit();
      this.render();
    }

    /** @inheritDoc */
    async _onRender(context, options) {
      await super._onRender(context, options);

      // Set toggle state and add status class to frame
      this._renderModeToggle();
      this.element.classList.toggle("editable", this.isEditable && this.isEditMode);
      this.element.classList.toggle("interactable", this.isEditable && (this._mode === this.constructor.MODES.PLAY));
      this.element.classList.toggle("locked", !this.isEditable);
    }

  };
}