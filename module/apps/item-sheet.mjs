import { systemPath } from "../constants.mjs";

const { api, sheets } = foundry.applications;

/**
 * AppV2-based for all item classes
 */
export class THIItemSheet extends api.HandlebarsApplicationMixin(sheets.ItemSheetV2) {

    /** @override */
    static DEFAULT_OPTIONs = {
        classes: ["thi", "item"],
        actions: {
            editImage: this._onEditImage,
            toggleMode: this._toggleMode,
            updateSource: this._updateSource,
            editHTML: this._editHTML,
            viewDoc: this._viewEffect,
            createDoc: this._createEffect,
            deleteDoc: this._deleteEffect,
            toggleEffect: this._toggleEffect
        },
        form: {
            submitOnChange: true
        },
        dragDrop: [{ dragSelector: ".draggable", dropSelector: null }]
    }

    /** @override */
    static PARTS = {
        header: {
            template: systemPath("templates/item/header.hbs"),
            templates: ["templates/item/header.hbs", "templates/parts/mode-toggle.hbs"].map(t => systemPath(t))
        },
    }

    static MODES = {
        PLAY: 1,
        EDIT: 2
    };

    /**
     * The mode the sheet is currently in.
     * @type {ActorSheetV2.MODES}
     */
    #mode = this.isEditable ? THIItemSheet.MODES.EDIT : THIItemSheet.MODES.PLAY;

    /**
     * Is this sheet in Play Mode?
     * @returns {boolean}
     */
    get isPlayMode() {
        return this.#mode === THIItemSheet.MODES.PLAY;
    }

    /**
     * Is this sheet in Edit Mode?
     * @returns {boolean}
     */
    get isEditMode() {
        return this.#mode === THIItemSheet.MODES.EDIT;
    }


}