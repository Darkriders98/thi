/**
 * Extend the base Actor document
 * @extends {Actor}
 */
export class THIActor extends Actor {
    prepareData(){
        super.prepareData();
    }

    prepareBaseData(){
        super.prepareBaseData();
    }

    prepareDerivedData(){
        const actorData = this;
        const systemData = actorData.system;
        const flags = actorData.flags.thi || {};

        this._prepareAgentData(actorData);
    }

    _prepareAgentData(actorData){
        if (actorData.type !== 'agent') return;

        const systemData = actorData.system;
    }
}