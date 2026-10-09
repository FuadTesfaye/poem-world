import { Poem } from "../../types";
import { ENGLISH_OLD_MIDDLE_POEMS } from "./old_middle";
import { ENGLISH_RENAISSANCE_POEMS } from "./renaissance";
import { ENGLISH_ROMANTIC_POEMS } from "./romantic";
import { ENGLISH_VICTORIAN_POEMS } from "./victorian";
import { ENGLISH_AMERICAN_POEMS } from "./american";
import { ENGLISH_MODERNIST_POEMS } from "./modernist";

export { ENGLISH_OLD_MIDDLE_POEMS } from "./old_middle";
export { ENGLISH_RENAISSANCE_POEMS } from "./renaissance";
export { ENGLISH_ROMANTIC_POEMS } from "./romantic";
export { ENGLISH_VICTORIAN_POEMS } from "./victorian";
export { ENGLISH_AMERICAN_POEMS } from "./american";
export { ENGLISH_MODERNIST_POEMS } from "./modernist";

export const ENGLISH_POEMS: Poem[] = [
  ...ENGLISH_OLD_MIDDLE_POEMS,
  ...ENGLISH_RENAISSANCE_POEMS,
  ...ENGLISH_ROMANTIC_POEMS,
  ...ENGLISH_VICTORIAN_POEMS,
  ...ENGLISH_AMERICAN_POEMS,
  ...ENGLISH_MODERNIST_POEMS
];
