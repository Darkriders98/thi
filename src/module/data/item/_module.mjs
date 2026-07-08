import AbilityModel from "./ability.mjs";
import ClassModel from "./class.mjs";
import ContactModel from "./contact.mjs";
import MagicalProficiencyModel from "./magicalprof.mjs";
import MagicalSourceModel from "./magicalsource.mjs";

const config = {
  ability: AbilityModel,
  class: ClassModel,
  contact: ContactModel,
  magicalprof: MagicalProficiencyModel,
  magicalsource: MagicalSourceModel,
};

export {
  AbilityModel,
  ClassModel,
  ContactModel,
  MagicalProficiencyModel,
  MagicalSourceModel,
  config};