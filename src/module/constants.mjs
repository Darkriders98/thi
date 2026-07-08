export const systemID = "thi";

export const suitIcons = {
  cups: "ICONS.Cups",
  pentacles: "ICONS.Pentacles",
  swords: "ICONS.Swords",
  wands: "ICONS.Wands"
}

export const difficulty = {
  easy: 2,
  medium: 3,
  hard: 4
}

/**
 * Translates repository paths to Foundry Data paths.
 * @param {string} path - A path relative to the root of this repository.
 * @returns {string} The path relative to the Foundry data folder.
 */
export const systemPath = (path) => `systems/${systemID}/${path}`;

