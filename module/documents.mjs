export class THIActorSheet extends ActorSheet {
    get template() {
        return `systems/thi/templates/sheets/${this.object.type}-sheet.hbs`;
    }

    getData(){
        const data = super.getData();
        data.config = CONFIG.THI;
        return data;
    }
}