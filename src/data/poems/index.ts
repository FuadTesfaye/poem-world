import { Poem } from "../types";
import { ARABIC_POEMS } from "./arabic";
import { ENGLISH_POEMS } from "./english";
import { getPoemTranslation } from "../translations";

export { ARABIC_POEMS } from "./arabic";
export { ENGLISH_POEMS } from "./english";
export const OTHER_POEMS = ENGLISH_POEMS;

export const POEMS: Poem[] = [...ARABIC_POEMS, ...ENGLISH_POEMS].map((p) => {
  const trans = getPoemTranslation(p.slug);
  if (trans) {
    return {
      ...p,
      translation: p.translation || trans.translation,
      translator: p.translator || trans.translator,
      aboutAr: p.aboutAr || trans.aboutAr,
    };
  }
  return p;
});

export function getPoem(slug: string): Poem | undefined {
  return POEMS.find((p) => p.slug === slug);
}

export function getPoemsByPoet(poetSlug: string): Poem[] {
  return POEMS.filter((p) => p.poet === poetSlug);
}
