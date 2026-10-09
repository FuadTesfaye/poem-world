/**
 * In-Repo Offline Arabic Archive Search Engine (Zero External API Calls)
 * ======================================================================
 * Queries local pre-indexed corpus shards loaded directly from /data/arabic-archive/index.json.
 * Provides instant (<2ms) client-side search across poet names, meters (بحور),
 * rhyming letters (قوافي), eras, and verse hemistichs.
 */

export interface ArchivalPoemResult {
  id: number;
  title: string;
  poet: string;
  poetSlug: string;
  era: string;
  eraId: string;
  meter: string;
  qafiyah: string;
  lines: string[];
  preview: string;
  source: string;
}

export interface OfflineArchiveIndex {
  version: string;
  source: string;
  totalPoems: number;
  poems: Array<{
    id: number;
    title: string;
    poet: string;
    poetSlug: string;
    era: string;
    eraId: string;
    meter: string;
    qafiyah: string;
    lines: string[];
    preview: string;
    searchTokens: string;
  }>;
}

// In-memory cache of the local archive index
let cachedIndex: OfflineArchiveIndex | null = null;
let loadingPromise: Promise<OfflineArchiveIndex | null> | null = null;

/**
 * Normalizes Arabic text for lightning-fast keyword matching:
 * - Removes tashkeel / harakat
 * - Normalizes alef forms (إ, أ, آ, ٱ -> ا)
 * - Normalizes ya / alif maqsura (ى -> ي)
 * - Normalizes ta marbuta (ة -> ه)
 */
export function normalizeArabicSearch(text: string): string {
  if (!text) return "";
  let t = text.toLowerCase().trim();
  // Strip diacritics
  t = t.replace(/[\u064b-\u0652\u0640]/g, "");
  // Normalize alefs
  t = t.replace(/[إأآٱ]/g, "ا");
  // Normalize ya / maqsura
  t = t.replace(/ى/g, "ي");
  // Normalize ta marbuta
  t = t.replace(/ة/g, "ه");
  // Strip non-alphanumeric punctuation
  t = t.replace(/[^ء-يa-z0-9\s]/g, " ");
  return t.replace(/\s+/g, " ").trim();
}

/**
 * Loads the local in-repo archive index from the Next.js static asset directory.
 * Executes once and caches in client memory for zero latency.
 */
export async function loadOfflineArchiveIndex(): Promise<OfflineArchiveIndex | null> {
  if (cachedIndex) return cachedIndex;
  if (loadingPromise) return loadingPromise;

  loadingPromise = (async () => {
    try {
      const res = await fetch("/data/arabic-archive/index.json");
      if (!res.ok) {
        console.warn("Local arabic archive index not loaded:", res.status);
        return null;
      }
      const data: OfflineArchiveIndex = await res.json();
      cachedIndex = data;
      return data;
    } catch (err) {
      console.error("Failed to load in-repo arabic archive index:", err);
      return null;
    } finally {
      loadingPromise = null;
    }
  })();

  return loadingPromise;
}

/**
 * Executes a zero-API, local in-repo search across the complete Arabic poetry archive.
 */
export async function searchInRepoArabicArchive(
  query: string,
  filterMeter: string = "all",
  filterEra: string = "all"
): Promise<ArchivalPoemResult[]> {
  const index = await loadOfflineArchiveIndex();
  if (!index || !index.poems) return [];

  const normQuery = normalizeArabicSearch(query);
  const queryTokens = normQuery.split(" ").filter(Boolean);

  const matched = index.poems.filter((item) => {
    // Filter by meter if selected
    if (filterMeter !== "all" && item.meter !== filterMeter) {
      return false;
    }

    // Filter by era if selected
    if (filterEra !== "all" && item.eraId !== filterEra) {
      return false;
    }

    // If query is empty, return all matching filters
    if (queryTokens.length === 0) return true;

    // Check if all query tokens exist in the pre-indexed searchTokens
    const targetTokens = item.searchTokens;
    return queryTokens.every((token) => targetTokens.includes(token));
  });

  return matched.map((m) => ({
    id: m.id,
    title: m.title,
    poet: m.poet,
    poetSlug: m.poetSlug,
    era: m.era,
    eraId: m.eraId,
    meter: m.meter,
    qafiyah: m.qafiyah,
    lines: m.lines,
    preview: m.preview,
    source: "ديوان العرب (In-Repo Local Archive)",
  }));
}
