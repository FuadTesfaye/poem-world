import { NextRequest, NextResponse } from "next/server";
import { DATASET_POETS_DIRECTORY, searchDatasetPoets } from "@/data/poets/datasetPoetsIndex";

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

interface HFRowItem {
  row_idx: number;
  row: {
    "poem title"?: string;
    "poem meter"?: string;
    "poem verses"?: string[];
    "poem theme"?: string;
    "poem url"?: string;
    "poet name"?: string;
    "poet description"?: string;
    "poet url"?: string;
    "poet era"?: string;
    "poet location"?: string;
  };
}

interface HFApiResponse {
  rows: HFRowItem[];
  num_rows_total: number;
  num_rows_per_page: number;
}

// In-memory cache for ultra-fast response
const memoryCache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(36, Math.max(1, parseInt(searchParams.get("limit") || "16", 10)));
  const eraFilter = searchParams.get("era") || "all";
  const search = (searchParams.get("search") || "").trim();

  const cacheKey = `dataset_poets_p${page}_l${limit}_era${eraFilter}_q${search}`;
  const cached = memoryCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return NextResponse.json(cached.data, {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=43200",
        "X-Cache": "HIT",
      },
    });
  }

  // 1. If searching, first query the curated landmark registry
  if (search || eraFilter !== "all") {
    const matched = searchDatasetPoets(search, eraFilter);
    const startIdx = (page - 1) * limit;
    const pagedEntries = matched.slice(startIdx, startIdx + limit);

    const poets: DatasetPoetItem[] = pagedEntries.map((p) => ({
      id: p.id,
      name: p.name,
      era: p.era,
      desc: p.desc,
      location: p.location,
      startOffset: p.startOffset,
      poemCount: p.poemCount || 100,
      url: p.url,
      source: "registry",
    }));

    const payload = {
      source: "fuaf24/arabic-poetry-ashaar",
      status: "success",
      totalPoets: 7167,
      matchedCount: matched.length,
      page,
      limit,
      eraFilter,
      search,
      poets,
      hasMore: startIdx + limit < matched.length,
    };

    memoryCache.set(cacheKey, { data: payload, timestamp: Date.now() });
    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=43200",
        "X-Cache": "MISS",
      },
    });
  }

  // 2. Normal Paginated Browsing:
  // For initial pages, blend landmark directory entries.
  // Beyond directory or for dynamic stream, fetch directly from fuaf24/arabic-poetry-ashaar rows!
  const registryStart = (page - 1) * limit;
  const registrySlice = DATASET_POETS_DIRECTORY.slice(registryStart, registryStart + limit);

  if (registrySlice.length >= limit) {
    const poets: DatasetPoetItem[] = registrySlice.map((p) => ({
      id: p.id,
      name: p.name,
      era: p.era,
      desc: p.desc,
      location: p.location,
      startOffset: p.startOffset,
      poemCount: p.poemCount || 150,
      url: p.url,
      source: "registry",
    }));

    const payload = {
      source: "fuaf24/arabic-poetry-ashaar",
      status: "success",
      totalPoets: 7167,
      page,
      limit,
      eraFilter,
      search,
      poets,
      hasMore: true,
    };

    memoryCache.set(cacheKey, { data: payload, timestamp: Date.now() });
    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=43200",
        "X-Cache": "MISS",
      },
    });
  }

  // 3. Dynamic Streaming from Hugging Face rows beyond the registry
  // Calculate row offset across 254K corpus:
  // Step by ~800 rows per page to discover distinct poets across eras
  const dynamicRowOffset = Math.min(250000, (page - 1) * 850);
  const hfUrl = `https://datasets-server.huggingface.co/rows?dataset=fuaf24/arabic-poetry-ashaar&config=default&split=train&offset=${dynamicRowOffset}&limit=50`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000);

    const res = await fetch(hfUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent": "PoemWorld/1.0 (fuadtesfaye24@gmail.com)",
        Accept: "application/json",
      },
      next: { revalidate: 86400 },
    });
    clearTimeout(timeout);

    if (!res.ok) {
      throw new Error(`HF server status ${res.status}`);
    }

    const data: HFApiResponse = await res.json();
    const rows = data.rows || [];

    const discoveredPoets = new Map<string, DatasetPoetItem>();

    // First include any remaining registry entries for this page
    for (const p of registrySlice) {
      discoveredPoets.set(p.name, {
        id: p.id,
        name: p.name,
        era: p.era,
        desc: p.desc,
        location: p.location,
        startOffset: p.startOffset,
        poemCount: p.poemCount || 120,
        url: p.url,
        source: "registry",
      });
    }

    // Extract distinct poets from fetched rows
    for (const item of rows) {
      const r = item.row || {};
      const name = (r["poet name"] || "").trim();
      if (!name || discoveredPoets.has(name)) continue;

      const verses = Array.isArray(r["poem verses"]) ? r["poem verses"] : [];
      let sampleCouplet = "";
      if (verses.length >= 2) {
        sampleCouplet = `${verses[0]} || ${verses[1]}`;
      } else if (verses.length === 1) {
        sampleCouplet = verses[0];
      }

      const id = name
        .toLowerCase()
        .replace(/[^a-z0-9\u0621-\u064A]+/g, "-")
        .replace(/^-+|-+$/g, "") || `poet-${item.row_idx}`;

      discoveredPoets.set(name, {
        id,
        name,
        era: (r["poet era"] && r["poet era"] !== "null" ? r["poet era"] : "العصر الذهبي").trim(),
        desc: (r["poet description"] || "شاعر وأديب من أعيان العربية ورجال الأدب في عصره.").trim(),
        location: r["poet location"] || undefined,
        startOffset: item.row_idx,
        samplePoemTitle: r["poem title"] || undefined,
        samplePoemMeter: r["poem meter"]?.replace(/^بحر\s+/, "") || undefined,
        sampleCouplet: sampleCouplet || undefined,
        poemCount: 50,
        url: r["poet url"] || undefined,
        source: "stream",
      });

      if (discoveredPoets.size >= limit) break;
    }

    const poetsList = Array.from(discoveredPoets.values()).slice(0, limit);

    const payload = {
      source: "fuaf24/arabic-poetry-ashaar",
      status: "success",
      totalPoets: 7167,
      page,
      limit,
      eraFilter,
      search,
      poets: poetsList,
      hasMore: dynamicRowOffset + 850 < (data.num_rows_total || 254630),
    };

    memoryCache.set(cacheKey, { data: payload, timestamp: Date.now() });

    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=43200",
        "X-Cache": "MISS",
      },
    });
  } catch (err) {
    console.error("Dataset poets streaming error:", err);

    // Fallback: serve whatever we have from the registry
    const fallbackList: DatasetPoetItem[] = (registrySlice.length > 0 ? registrySlice : DATASET_POETS_DIRECTORY.slice(0, limit)).map((p) => ({
      id: p.id,
      name: p.name,
      era: p.era,
      desc: p.desc,
      location: p.location,
      startOffset: p.startOffset,
      poemCount: p.poemCount || 100,
      url: p.url,
      source: "registry",
    }));

    return NextResponse.json({
      source: "fuaf24/arabic-poetry-ashaar",
      status: "fallback",
      totalPoets: 7167,
      page,
      limit,
      eraFilter,
      search,
      poets: fallbackList,
      hasMore: true,
      message: "Streaming fallback from local directory.",
    });
  }
}
