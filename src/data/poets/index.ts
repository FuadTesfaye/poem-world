import { Poet } from "../types";
import { ARABIC_POETS } from "./arabic";
import { OTHER_POETS } from "./other";

export { ARABIC_POETS } from "./arabic";
export { OTHER_POETS } from "./other";

export const POETS: Poet[] = [...ARABIC_POETS, ...OTHER_POETS];

export function getPoet(slug: string): Poet | undefined {
  return POETS.find((p) => p.slug === slug);
}
