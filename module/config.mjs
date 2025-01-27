import { preLocalize } from "./utils.mjs";

export const THI = {};

/**
 * Configuration data for skill families
 * 
 * @typedef {object} SkillFamilyConfiguration
 * @property {string} label                                     Localized label
 * @property {Record<string, SkillConfiguration>} skills        Skills related to this family
 * @property {number} xp                                        Experience gained inside of this family
 * @property {number} harm                                      Harm level associated to this family
 */

/**
 * Configuration data for skills
 * @typedef {object} SkillConfiguration
 * @property {string} label                                     Localized label
 * @property {number} affinity                                  Affinity with this skill
 */

/**
 * The set of skills used in this system
 * @enum {SkillFamilyConfiguration}
 */

THI.skillFamilies = {
    sword: {
        label: "THI.SkillFamily.Sword.Label",
        skills: {
            skirmish: {
                label: "THI.SkillFamily.Sword.Skirmish",
                affinity: 0
            },
            convince: {
                label: "THI.SkillFamily.Sword.Convince",
                affinity: 0
            },
            study: {
                label: "THI.SkillFamily.Sword.Study",
                affinity: 0
            }
        },
        xp: 0,
        harm: 0
    },
    wand: {
        label: "THI.SkillFamily.Wand.Label",
        skills: {
            unleash: {
                label: "THI.SkillFamily.Wand.Unleash",
                affinity: 0
            },
            perform: {
                label: "THI.SkillFamily.Wand.Perform",
                affinity: 0
            },
            channel: {
                label: "THI.SkillFamily.Wand.Channel",
                affinity: 0
            }
        },
        xp: 0,
        harm: 0
    },
    cup: {
        label: "THI.SkillFamily.Cup.Label",
        skills: {
            slip: {
                label: "THI.SkillFamily.Cup.Slip",
                affinity: 0
            },
            soothe: {
                label: "THI.SkillFamily.Cup.Soothe",
                affinity: 0
            },
            mingle: {
                label: "THI.SkillFamily.Cup.Mingle",
                affinity: 0
            }
        },
        xp: 0,
        harm: 0
    },
    pentacle: {
        label: "THI.SkillFamily.Pentacle.Label",
        skills: {
            finesse: {
                label: "THI.SkillFamily.Pentacle.Finesse",
                affinity: 0
            },
            bargain: {
                label: "THI.SkillFamily.Pentacle.Bargain",
                affinity: 0
            },
            survey: {
                label: "THI.SkillFamily.Pentacle.Survey",
                affinity: 0
            }
        },
        xp: 0,
        harm: 0
    }
};
preLocalize("skillFamilies", {keys: ["label"]})

/**
 * Character identity options
 * @enum {string}
 */

THI.Identity = {
    label: "THI.Identity.Label",
    biography: "THI.Identity.Biography",
    name: "THI.Identity.Name",
    age: "THI.Identity.Age",
    culture: "THI.Identity.Culture"
}
