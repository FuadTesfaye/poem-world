import { Poem } from "../../types";
import { OTHER_RENAISSANCE_POEMS } from "./renaissance";
import { OTHER_ROMANTIC_POEMS } from "./romantic";
import { OTHER_VICTORIAN_POEMS } from "./victorian";

export { OTHER_RENAISSANCE_POEMS } from "./renaissance";
export { OTHER_ROMANTIC_POEMS } from "./romantic";
export { OTHER_VICTORIAN_POEMS } from "./victorian";

export const OTHER_POEMS: Poem[] = [
  ...OTHER_RENAISSANCE_POEMS,
  ...OTHER_ROMANTIC_POEMS,
  ...OTHER_VICTORIAN_POEMS,
];
