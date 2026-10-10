import { Poet } from "../types";
import { ARABIC_POETS } from "./arabic";
import { ENGLISH_POETS } from "./english";
import { DATASET_POETS_DIRECTORY } from "./datasetPoetsIndex";
import poetsOffsetsMap from "./poetsOffsetsMap.json";

export { ARABIC_POETS } from "./arabic";
export { ENGLISH_POETS } from "./english";
export const OTHER_POETS = ENGLISH_POETS;

export const POETS: Poet[] = [...ARABIC_POETS, ...ENGLISH_POETS];

export function getPoet(slug: string): Poet | undefined {
  if (!slug) return undefined;

  // 1. Check in-repo curated masters
  const found = POETS.find(
    (p) => p.slug === slug || p.name.toLowerCase() === slug.toLowerCase() || (p.ar && p.ar === slug)
  );
  if (found) return found;

  const decoded = decodeURIComponent(slug).trim();

  // 2. Check dataset landmark registry
  const datasetEntry = DATASET_POETS_DIRECTORY.find(
    (p) => p.id === slug || p.name === decoded || p.id === decoded
  );
  if (datasetEntry) {
    return {
      slug: datasetEntry.id,
      name: datasetEntry.name,
      ar: datasetEntry.name,
      language: "ar",
      years: datasetEntry.era,
      place: datasetEntry.location || "العالم العربي",
      era: datasetEntry.era,
      tag: datasetEntry.desc.slice(0, 120),
      bio: [datasetEntry.desc],
      works: ["ديوان " + datasetEntry.name],
      themes: ["شعر كلاسيكي", datasetEntry.era],
      img: "dpic-arabic",
      pos: "center",
    };
  }

  // 3. Check exact or normalized name in 7,152 poets offsets map
  const map = poetsOffsetsMap as Record<string, { start: number; count: number }>;
  if (map[decoded]) {
    return {
      slug,
      name: decoded,
      ar: decoded,
      language: "ar",
      years: "العصر الذهبي",
      place: "العالم العربي",
      era: "شعر عربي",
      tag: `شاعر من أعيان العربية ورجال الأدب، يضم ديوانه ${map[decoded].count} قصيدة في خزانة الموسوعة.`,
      bio: [`شاعر وأديب من شعراء العربية الخالدين، محفوظ ديوانه كاملاً في خزانة الموسوعة الشعرية.`],
      works: ["ديوان " + decoded],
      themes: ["شعر كلاسيكي"],
      img: "dpic-arabic",
      pos: "center",
    };
  }

  for (const [k, v] of Object.entries(map)) {
    if (k.includes(decoded) || decoded.includes(k)) {
      return {
        slug,
        name: k,
        ar: k,
        language: "ar",
        years: "العصر الذهبي",
        place: "العالم العربي",
        era: "شعر عربي",
        tag: `شاعر من أعيان العربية ورجال الأدب، يضم ديوانه ${v.count} قصيدة في خزانة الموسوعة.`,
        bio: [`شاعر وأديب من شعراء العربية الخالدين، محفوظ ديوانه كاملاً في خزانة الموسوعة الشعرية.`],
        works: ["ديوان " + k],
        themes: ["شعر كلاسيكي"],
        img: "dpic-arabic",
        pos: "center",
      };
    }
  }

  return undefined;
}

