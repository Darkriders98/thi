import { systemID, systemPath } from "../../constants.mjs";
import THIActorSheet from "./base.mjs";

export default class THIAgentSheet extends THIActorSheet {

    static DEFAULT_OPTIONS = {
        classes: ["agent"]
    };

    /** @override */
    static PARTS = {
        header: {
            template: systemPath("templates/actor/agent/header.hbs"),
            templates: ["templates/actor/agent/header.hbs", "templates/parts/mode-toggle.hbs"].map(t => systemPath(t))
        },
        tabs: {
            // Foundry-provided generic template
            template: "templates/generic/tab-navigation.hbs"
        },
        stats: {
            template: systemPath("templates/actor/agent/stats.hbs"),
            scrollabe: [""]
        },
        identity: {
            template: systemPath("templates/actor/agent/identity.hbs"),
            scrollabe: [""]
        }
    }

    /** @override */
    async _preparePartContext(partId, context, options) {
        await super._preparePartContext(partId, context, options);
        switch (partId) {
            case "stats":
                context.skillFamilies = this._getSkillFamilies();
                context.skillFamilies.forEach(skillFamily => {
                    context.skillFamilies[skillFamily] = this._getSkills(skillFamily);
                });
                break;
        }
        return context;
    }

    activateListeners(html) {
        super.activateListeners(html);

        html.on('click', '.skill-affinity', (ev) => {
            console.log("Hello world")
        })
    }

    /**
     * Constructs a string listing the actor skill families
     * @returns {string}
     */
    _getSkillFamilies() {
        const list = this.actor.system.skillFamilies.reduce((skillFamilies, skillFamily) => {
            skillFamily = thi.CONFIG.skillFamilies[skillFamily]?.label;
            if (skillFamily) skillFamilies.push(skillFamily);
            return skillFamilies;
        }, []);
        const formatter = game.i18n.getListFormatter();
        return formatter.format(list);
    }

    /**
     * Constructs a string listing all the actor skills from a skill family
     * @param {string} skillFamily      Skill family
     * @returns {string}
     */
    _getSkills(skillFamily) {
        const list = this.actor.system.skillFamilies[skillFamily]?.reduce((skills, skill) => {
            skill = thi.CONFIG.skillFamilies[skillFamily][skill]?.label;
            if (skill) skills.push(skill);
            return skills;
        }, [])
        const formatter = game.i18n.getListFormatter();
        return formatter.format(list);
    }
}