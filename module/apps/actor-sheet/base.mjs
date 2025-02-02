import { THIItem } from "../../documents/item.mjs";
import { THIItemSheet } from "../item-sheet.mjs";

const { api, sheets } = foundry.applications;

/**
 * AppV2-based sheet for all actor classes
 */
export default class THIActorSheet extends api.HandlebarsApplicationMixin(sheets.ActorSheetV2) {
    /** @override */
    static DEFAULT_OPTIONS = {
        classes: ["thi", "actor"],
        position: {
            width: 600,
            height: 600
        },
        actions: {
            editImage: this._onEditImage,
            toggleMode: this._toggleMode,
            viewDoc: this._viewDoc,
            createDoc: this._createDoc,
            deleteDoc: this._deleteDoc,
            toggleEffect: this._toggleEffect,
            roll: this._onRoll,
            useAbility: this._useAbility
        },
        // Custom property that's merged into `this.options`
        dragDrop: [{ dragSelector: ".draggable", dropSelector: null }],
        form: {
            submitOnChange: true
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
     * The mode the sheet is currently in.
     * @type {ActorSheetV2.MODES}
     */
    #mode = THIActorSheet.MODES.PLAY;

    /**
     * Is this sheet in Play Mode?
     * @returns {boolean}
     */
    get isPlayMode() {
        return this.#mode === THIActorSheet.MODES.PLAY;
    }

    /**
     * Is this sheet in Edit Mode?
     * @returns {boolean}
     */
    get isEditMode() {
        return this.#mode === THIActorSheet.MODES.EDIT;
    }

    /** @override */
    _configureRenderOptions(options) {
        super._configureRenderOptions(options);
        if (options.mode && this.isEditable) this.#mode = options.mode;
        // TODO: Refactor to use _configureRenderParts in v13
        if (this.document.limited) {
            options.parts = ["header", "tabs", "biography"];
        }
    }

    /* -------------------------------------------- */

    /** @override */
    async _prepareContext(options) {
        const context = {
            isPlay: this.isPlayMode,
            // Validates both permissions and compendium status
            editable: this.isEditable,
            owner: this.document.isOwner,
            limited: this.document.limited,
            gm: game.user.isGM,
            // Add the actor document.
            actor: this.actor,
            // Add the actor's data to context.data for easier access, as well as flags.
            system: this.actor.system,
            systemSource: this.actor.system._source,
            flags: this.actor.flags,
            // Adding a pointer to thi.CONFIG
            config: thi.CONFIG,
            tabs: this._getTabs(options.parts),
            // Necessary for formInput and formFields helpers
            fields: this.document.schema.fields,
            systemFields: this.document.system.schema.fields,
            datasets: this._getDatasets()
        };

        return context;
    }

    /** @override */
    async _preparePartContext(partId, context, options) {
        await super._preparePartContext(partId, context, options);
        switch (partId) {
            case "stats":
                context.tab = context.tabs[partId];
                break;
            case "identity":
                context.tab = context.tabs[partId];
                context.biography = await TextEditor.enrichHTML(
                    this.acot.system.identity.biography,
                    {
                        secrets: this.document.isOwner,
                        rollData: this.actor.getRollData(),
                        relativeTo: this.actor
                    }
                )
                break;
        }
        return context;
    }

    /* -------------------------------------------------- */
    /*   Actions                                          */
    /* -------------------------------------------------- */

    /**
     * Handle changing a Document's image.
     * TODO: Copied from v13 implementation, can be removed after
     * @this THIActorSheet
     * @param {PointerEvent} _event   The originating click event
     * @param {HTMLElement} target   The capturing HTML element which defined a [data-action]
     * @returns {Promise}
     * @protected
     */
    static async _onEditImage(_event, target) {
        if (target.nodeName !== "IMG") {
            throw new Error("The editImage action is available only for IMG elements.");
        }
        const attr = target.dataset.edit;
        const current = foundry.utils.getProperty(this.document._source, attr);
        const defaultArtwork = this.document.constructor.getDefaultArtwork?.(this.document._source) ?? {};
        const defaultImage = foundry.utils.getProperty(defaultArtwork, attr);
        const fp = new FilePicker({
            current,
            type: "image",
            redirectToRoot: defaultImage ? [defaultImage] : [],
            callback: path => {
                target.src = path;
                if (this.options.form.submitOnChange) {
                    const submit = new Event("submit");
                    this.element.dispatchEvent(submit);
                }
            },
            top: this.position.top + 40,
            left: this.position.left + 10
        });
        await fp.browse();
    }

    /**
     * Toggle Edit vs. Play mode
     *
     * @this THIActorSheet
     * @param {PointerEvent} event   The originating click event
     * @param {HTMLElement} target   The capturing HTML element which defined a [data-action]
     */
    static async _toggleMode(event, target) {
        if (!this.isEditable) {
            console.error("You can't switch to Edit mode if the sheet is uneditable");
            return;
        }
        this.#mode = this.isPlayMode ? THIActorSheet.MODES.EDIT : THIActorSheet.MODES.PLAY;
        this.render();
    }

    /**
     * Renders an embedded document's sheet
     *
     * @this THIActorSheet
     * @param {PointerEvent} event   The originating click event
     * @param {HTMLElement} target   The capturing HTML element which defined a [data-action]
     * @protected
     */
    static async _viewDoc(event, target) {
        const doc = this._getEmbeddedDocument(target);
        doc.sheet.render(true);
    }

    /**
     * Handles item deletion
     *
     * @this THIActorSheet
     * @param {PointerEvent} event   The originating click event
     * @param {HTMLElement} target   The capturing HTML element which defined a [data-action]
     * @protected
     */
    static async _deleteDoc(event, target) {
        const doc = this._getEmbeddedDocument(target);
        await doc.deleteDialog();
    }

    /**
     * Handle creating a new Owned Item or ActiveEffect for the actor using initial data defined in the HTML dataset
     *
     * @this THIActorSheet
     * @param {PointerEvent} event   The originating click event
     * @param {HTMLElement} target   The capturing HTML element which defined a [data-action]
     * @private
     */
    static async _createDoc(event, target) {
        const docCls = getDocumentClass(target.dataset.documentClass);
        const docData = {
            name: docCls.defaultName({ type: target.dataset.type, parent: this.actor })
        };
        // Loop through the dataset and add it to our docData
        for (const [dataKey, value] of Object.entries(target.dataset)) {
            // These data attributes are reserved for the action handling
            if (["action", "documentClass", "renderSheet"].includes(dataKey)) continue;
            // Nested properties use dot notation like `data-system.prop`
            foundry.utils.setProperty(docData, dataKey, value);
        }

        await docCls.create(docData, { parent: this.actor, renderSheet: target.dataset.renderSheet });
    }

    /**
     * Determines effect parent to pass to helper
     *
     * @this THIActorSheet
     * @param {PointerEvent} event   The originating click event
     * @param {HTMLElement} target   The capturing HTML element which defined a [data-action]
     * @private
     */
    static async _toggleEffect(event, target) {
        const effect = this._getEmbeddedDocument(target);
        await effect.update({ disabled: !effect.disabled });
    }

    /**
     * Handle clickable rolls.
     *
     * @this THIActorSheet
     * @param {PointerEvent} event   The originating click event
     * @param {HTMLElement} target   The capturing HTML element which defined a [data-action]
     * @protected
     */
    static async _onRoll(event, target) {
        event.preventDefault();
        const dataset = target.dataset;

        // Handle item rolls.
        switch (dataset.rollType) {
            case "characteristic":
                return this.actor.rollCharacteristic(dataset.characteristic);
        }
    }

    /**
     * Handle clickable rolls.
     *
     * @this THIActorSheet
     * @param {PointerEvent} event   The originating click event
     * @param {HTMLElement} target   The capturing HTML element which defined a [data-action]
     * @protected
     */
    static async _useAbility(event, target) {
        const item = this._getEmbeddedDocument(target);
        if (item?.type !== "ability") {
            console.error("This is not an ability!", item);
            return;
        }
        await item.system.use({ event });
    }

}