/* -------------------------------------------- */
/*  Config Pre-Localization                     */
/* -------------------------------------------- */

/**
 * Storage for pre-localization configuration.
 * @type {object}
 * @private
 */
const _preLocalizationRegistrations = {};

/**
 * Mark the provided config key to be pre-localized during the init stage.
 * @param {string} configKeyPath          Key path within `CONFIG.DND5E` to localize.
 * @param {object} [options={}]
 * @param {string} [options.key]          If each entry in the config enum is an object,
 *                                        localize and sort using this property.
 * @param {string[]} [options.keys=[]]    Array of localization keys. First key listed will be used for sorting
 *                                        if multiple are provided.
 * @param {boolean} [options.sort=false]  Sort this config enum, using the key if set.
 */
export function preLocalize(configKeyPath, { key, keys = [], sort = false } = {}) {
    if (key) keys.unshift(key);
    _preLocalizationRegistrations[configKeyPath] = { keys, sort };
}

/**
* Execute previously defined pre-localization tasks on the provided config object.
* @param {object} config  The `CONFIG.DND5E` object to localize and sort. *Will be mutated.*
*/
export function performPreLocalization(config) {
    for (const [keyPath, settings] of Object.entries(_preLocalizationRegistrations)) {
        const target = foundry.utils.getProperty(config, keyPath);
        if (!target) continue;
        _localizeObject(target, settings.keys);
        if (settings.sort) foundry.utils.setProperty(config, keyPath, sortObjectEntries(target, settings.keys[0]));
    }
}