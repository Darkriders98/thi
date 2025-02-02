/**
 * Extend the base Item document
 * @extends {Item}
 */
export class THIItem extends Item {
    /** @override */
    prepareDerivedData(){
        super.prepareDerivedData();
        Hooks.callAll("thi.prepareItemData", this);
    }
}
