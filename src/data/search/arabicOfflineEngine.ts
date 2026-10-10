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

export interface FuadCorpusPoemResult {
  id: string;
  title: string;
  poet: string;
  meter: string;
  era: string;
  theme: string;
  poetBio: string;
  poetUrl?: string;
  poemUrl?: string;
  verses: string[];
  couplets: string[];
  totalVerses: number;
}

export interface FuadCorpusPage {
  source: string;
  status: string;
  totalCorpusPoems: number;
  totalCorpusVerses: number;
  totalCorpusPoets: number;
  offset: number;
  limit: number;
  meterFilter: string;
  returned: number;
  poems: FuadCorpusPoemResult[];
  message?: string;
}

/**
 * Streams paginated records directly from Fuad's personal Hugging Face repository:
 * fuaf24/arabic-poetry-ashaar (254,630 poems / 3,857,429 verses / 7,167 poets)
 */
export async function fetchFuadCorpusStream(
  offset: number = 0,
  limit: number = 12,
  meter: string = "all"
): Promise<FuadCorpusPage | null> {
  try {
    const params = new URLSearchParams({
      offset: String(offset),
      limit: String(limit),
      meter,
    });
    const res = await fetch(`/api/archive/fuad-corpus?${params.toString()}`);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("fetchFuadCorpusStream error:", err);
    return null;
  }
}

export interface DatasetPoetItem {
  id: string;
  name: string;
  era: string;
  desc: string;
  location?: string;
  startOffset: number;
  samplePoemTitle?: string;
  samplePoemMeter?: string;
  sampleCouplet?: string;
  poemCount?: number;
  url?: string;
  source: "registry" | "stream";
}

export interface DatasetPoetsResponse {
  source: string;
  status: string;
  totalPoets: number;
  page: number;
  limit: number;
  eraFilter: string;
  search: string;
  poets: DatasetPoetItem[];
  hasMore: boolean;
  message?: string;
}

export interface DatasetPoetPoem {
  id: string;
  title: string;
  poet: string;
  poetBio?: string;
  era: string;
  meter: string;
  theme: string;
  verses: string[];
  couplets: string[];
  totalVerses: number;
  url?: string;
  rowIdx: number;
}

export interface DatasetPoetPoemsResponse {
  source: string;
  status: string;
  poet: string;
  offset: number;
  page: number;
  limit: number;
  totalPoetPoems?: number;
  returned: number;
  poems: DatasetPoetPoem[];
  hasMore: boolean;
  message?: string;
}

/**
 * Streams paginated poets from fuaf24/arabic-poetry-ashaar (7,167 poets)
 */
export async function fetchDatasetPoetsStream(
  page: number = 1,
  limit: number = 16,
  era: string = "all",
  search: string = ""
): Promise<DatasetPoetsResponse | null> {
  try {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      era,
      search,
    });
    const res = await fetch(`/api/archive/fuad-poets?${params.toString()}`);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("fetchDatasetPoetsStream error:", err);
    return null;
  }
}

/**
 * Fetches all poems of a dataset poet from fuaf24/arabic-poetry-ashaar
 */
export async function fetchPoetPoemsFromDataset(
  poet: string,
  offset?: number,
  page: number = 1,
  limit: number = 20
): Promise<DatasetPoetPoemsResponse | null> {
  try {
    const params = new URLSearchParams({
      poet,
      page: String(page),
      limit: String(limit),
    });
    if (typeof offset === "number" && offset > 0) {
      params.set("offset", String(offset));
    }
    const res = await fetch(`/api/archive/fuad-poet-poems?${params.toString()}`);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("fetchPoetPoemsFromDataset error:", err);
    return null;
  }
}

