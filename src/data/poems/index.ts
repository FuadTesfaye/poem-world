import { Poem } from "../types";
import { ARABIC_POEMS } from "./arabic";
import { ENGLISH_POEMS } from "./english";

export { ARABIC_POEMS } from "./arabic";
export { ENGLISH_POEMS } from "./english";
export const OTHER_POEMS = ENGLISH_POEMS;

export const POEMS: Poem[] = [...ARABIC_POEMS, ...ENGLISH_POEMS];

export function getPoem(slug: string): Poem | undefined {
  return POEMS.find((p) => p.slug === slug);
}

export function getPoemsByPoet(poetSlug: string): Poem[] {
  return POEMS.filter((p) => p.poet === poetSlug);
}
