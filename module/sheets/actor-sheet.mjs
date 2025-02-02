const {api, sheets} = foundry.applications;

/**
 * Extend the basic ActorSheet
 * @extends {ActorSheet}
 */
export class THIActorSheet extends api.HandlebarsApplicationMixin(sheets.ActorSheetV2) {

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["sheet", "actor"],
            width: 600,
            height: 600
        })
    }

    get template() {
        return `systems/thi/templates/sheets/actor/${this.actor.type}-sheet.hbs`;
    }

    getData() {
        const context = super.getData();
        const actorData = context.data;

        context.system = actorData.system;
        context.flags = actorData.flags;
        context.config = CONFIG.THI;

        return context;
    }

    activateListeners(html) {
        super.activateListeners(html);

        if (this.actor.type == 'agent') {
            this._activateAgentListeners(html);
        }
    }

    _activateAgentListeners(html) {
        html.on('click', '.skill-affinity', (ev) => {
            console.log("Hello world")
        })
    }
}