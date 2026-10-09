import { NextRequest, NextResponse } from "next/server";

export interface FuadCorpusPoem {
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

// In-memory LRU cache for ultra-fast repeated queries
const memoryCache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const offset = Math.max(0, parseInt(searchParams.get("offset") || "0", 10));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "12", 10)));
  const meterFilter = searchParams.get("meter") || "all";

  const cacheKey = `fuad_corpus_${offset}_${limit}_${meterFilter}`;
  const cached = memoryCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return NextResponse.json(cached.data, {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=43200",
        "X-Cache": "HIT",
      },
    });
  }

  const hfUrl = `https://datasets-server.huggingface.co/rows?dataset=fuaf24/arabic-poetry-ashaar&config=default&split=train&offset=${offset}&limit=${limit}`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6500);

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
      throw new Error(`HF server responded with ${res.status}`);
    }

    const data: HFApiResponse = await res.json();
    const rawRows = data.rows || [];

    const poems: FuadCorpusPoem[] = rawRows.map((item, idx) => {
      const r = item.row || {};
      const verses = Array.isArray(r["poem verses"]) ? r["poem verses"] : [];
      
      // Pair hemistichs into couplets (صدر || عجز)
      const couplets: string[] = [];
      for (let i = 0; i < verses.length; i += 2) {
        if (i + 1 < verses.length) {
          couplets.push(`${verses[i]} || ${verses[i + 1]}`);
        } else {
          couplets.push(verses[i]);
        }
      }

      return {
        id: `fuad-${offset + idx}`,
        title: (r["poem title"] || "بدون عنوان").trim(),
        poet: (r["poet name"] || "شاعر غير محدد").trim(),
        meter: (r["poem meter"] || "غير محدد").replace(/^بحر\s+/, "").trim(),
        era: (r["poet era"] || "العصر الذهبي").trim(),
        theme: (r["poem theme"] || "شعر عربي").trim(),
        poetBio: (r["poet description"] || "").trim(),
        poetUrl: r["poet url"],
        poemUrl: r["poem url"],
        verses,
        couplets,
        totalVerses: verses.length,
      };
    });

    const filteredPoems = meterFilter === "all" 
      ? poems 
      : poems.filter(p => p.meter.includes(meterFilter) || meterFilter.includes(p.meter));

    const responsePayload = {
      source: "fuaf24/arabic-poetry-ashaar",
      status: "success",
      totalCorpusPoems: data.num_rows_total || 254630,
      totalCorpusVerses: 3857429,
      totalCorpusPoets: 7167,
      offset,
      limit,
      meterFilter,
      returned: filteredPoems.length,
      poems: filteredPoems,
    };

    memoryCache.set(cacheKey, { data: responsePayload, timestamp: Date.now() });

    return NextResponse.json(responsePayload, {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=43200",
        "X-Cache": "MISS",
      },
    });
  } catch (err) {
    console.error("Fuad corpus API stream error:", err);
    // Graceful fallback response
    return NextResponse.json(
      {
        source: "fuaf24/arabic-poetry-ashaar",
        status: "fallback",
        totalCorpusPoems: 254630,
        totalCorpusVerses: 3857429,
        totalCorpusPoets: 7167,
        offset,
        limit,
        meterFilter,
        returned: 0,
        poems: [],
        message: "Stream latency timeout or network limit. Falling back to in-repo core archive.",
      },
      { status: 200 }
    );
  }
}
