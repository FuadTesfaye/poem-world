import { Poem } from "../types";
import { ARABIC_POEMS } from "./arabic";
import { OTHER_POEMS } from "./other";

export { ARABIC_POEMS } from "./arabic";
export { OTHER_POEMS } from "./other";

export const POEMS: Poem[] = [...ARABIC_POEMS, ...OTHER_POEMS];

export function getPoem(slug: string): Poem | undefined {
  return POEMS.find((p) => p.slug === slug);
}

export function getPoemsByPoet(poetSlug: string): Poem[] {
  return POEMS.filter((p) => p.poet === poetSlug);
}
