const {HandlebarsApplicationMixin} = foundry.applications.api;

/**
 * Mixin method for ApplicationV2-based 5e applications.
 * @template {ApplicationV2} T
 * @param {typeof T} Base                      Application class being extended.
 * @param {object} [options={}]
 * @param {boolean} [options.handlebars=true]  Include HandlebarsApplicationMixin.
 * @returns {typeof BaseApplicationThi}
 * @mixin
 */
export default function ApplicationV2Mixin(Base) {
  return class BaseApplicationThi extends HandlebarsApplicationMixin(Base) {

    /** @override */
    static DEFAULT_OPTIONS = {
      classes: ["thi"]
    };

    /**
     * Handle re-rendering the mode toggle on ownership changes.
     * @protected
     */
    _renderModeToggle() {
      const header = this.element.querySelector(".window-header");
      const toggle = header.querySelector(".mode-slider");
      if (this.isEditable && !toggle) {
        const toggle = document.createElement("slide-toggle");
        toggle.checked = this.isEditMode;
        toggle.classList.add("mode-slider");
        toggle.dataset.action = "changeMode";
        toggle.dataset.tooltip = "THI.SheetMode.Edit";
        toggle.setAttribute("aria-label", game.i18n.localize("THI.SheetMode.Edit"));
        toggle.addEventListener("dblclick", event => event.stopPropagation());
        toggle.addEventListener("pointerdown", event => event.stopPropagation());
        header.prepend(toggle);
      } else if (this.isEditable) {
        toggle.checked = this.isEditMode;
      } else if (!this.isEditable && toggle) {
        toggle.remove();
      }
    }

  };
}