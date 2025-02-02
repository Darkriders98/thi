import { systemID } from "../constants.mjs";

export async function migrateWorld(){
    if (!game.users.activeGM?.isSelf){
        console.log("Not the active GM");
        return;
    }
}