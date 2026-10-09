import { Poem } from "../../types";
import { ARABIC_CLASSICAL_POEMS } from "./classical";
import { ARABIC_UMAYYAD_POEMS } from "./umayyad";
import { ARABIC_ABBASID_POEMS } from "./abbasid";
import { ARABIC_ANDALUSIAN_POEMS } from "./andalusian";
import { ARABIC_MODERN_POEMS } from "./modern";

export { ARABIC_CLASSICAL_POEMS } from "./classical";
export { ARABIC_UMAYYAD_POEMS } from "./umayyad";
export { ARABIC_ABBASID_POEMS } from "./abbasid";
export { ARABIC_ANDALUSIAN_POEMS } from "./andalusian";
export { ARABIC_MODERN_POEMS } from "./modern";

export const ARABIC_POEMS: Poem[] = [
  ...ARABIC_CLASSICAL_POEMS,
  ...ARABIC_UMAYYAD_POEMS,
  ...ARABIC_ABBASID_POEMS,
  ...ARABIC_ANDALUSIAN_POEMS,
  ...ARABIC_MODERN_POEMS,
];
