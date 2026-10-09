import { Poet } from "../types";
import { ARABIC_POETS } from "./arabic";
import { ENGLISH_POETS } from "./english";

export { ARABIC_POETS } from "./arabic";
export { ENGLISH_POETS } from "./english";
export const OTHER_POETS = ENGLISH_POETS;

export const POETS: Poet[] = [...ARABIC_POETS, ...ENGLISH_POETS];

export function getPoet(slug: string): Poet | undefined {
  return POETS.find((p) => p.slug === slug);
}
