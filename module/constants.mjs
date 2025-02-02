export const systemID = "thi";

/**
 * Translates repository paths to Foundry Data paths
 * @param {string} path - A path relative to the root of this repository
 * @returns {string} The path relative to the Foundry data folder
 */
export const systemPath = (path) => `systems/${systemID}/${path}`;
export const ASCII = `
___________.__               ___ ___ .__    .___  .___              .___       .__          
\__    ___/|  |__   ____    /   |   \|__| __| _/__| _/____   ____   |   | _____|  |   ____  
  |    |   |  |  \_/ __ \  /    ~    \  |/ __ |/ __ |/ __ \ /    \  |   |/  ___/  | _/ __ \ 
  |    |   |   Y  \  ___/  \    Y    /  / /_/ / /_/ \  ___/|   |  \ |   |\___ \|  |_\  ___/ 
  |____|   |___|  /\___  >  \___|_  /|__\____ \____ |\___  >___|  / |___/____  >____/\___  >
                \/     \/         \/         \/    \/    \/     \/           \/          \/ 
`;