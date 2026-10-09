import { NextRequest, NextResponse } from "next/server";

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
  const poet = (searchParams.get("poet") || "").trim();
  const baseOffset = Math.max(0, parseInt(searchParams.get("offset") || "0", 10));
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(40, Math.max(1, parseInt(searchParams.get("limit") || "15", 10)));

  const fetchOffset = baseOffset + (page - 1) * limit;
  const cacheKey = `dataset_poet_poems_${poet}_off${fetchOffset}_lim${limit}`;

  const cached = memoryCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return NextResponse.json(cached.data, {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=43200",
        "X-Cache": "HIT",
      },
    });
  }

  // Request a few extra rows so we can filter accurately by poet name if contiguous
  const fetchLimit = Math.min(100, limit + 10);
  const hfUrl = `https://datasets-server.huggingface.co/rows?dataset=fuaf24/arabic-poetry-ashaar&config=default&split=train&offset=${fetchOffset}&limit=${fetchLimit}`;

  try {
    let res: Response | null = null;
    let data: HFApiResponse | null = null;

    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 7500);

        const response = await fetch(hfUrl, {
          signal: controller.signal,
          headers: {
            "User-Agent": "PoemWorld/1.0 (fuadtesfaye24@gmail.com)",
            Accept: "application/json",
          },
          next: { revalidate: 86400 },
        });
        clearTimeout(timeout);

        if (response.ok) {
          res = response;
          data = await response.json();
          break;
        } else if (attempt === 1 && (response.status >= 500 || response.status === 429)) {
          // Wait 300ms before quick retry
          await new Promise((r) => setTimeout(r, 300));
        }
      } catch {
        if (attempt === 1) {
          await new Promise((r) => setTimeout(r, 300));
        }
      }
    }

    if (!data) {
      throw new Error(`HF server unavailable after attempts`);
    }

    const rawRows = data.rows || [];

    // Filter rows by poet if specified, or take rows at this offset
    const matchingRows = poet
      ? rawRows.filter((item) => {
          const rowPoet = (item.row["poet name"] || "").trim();
          return rowPoet.includes(poet) || poet.includes(rowPoet);
        })
      : rawRows;

    const finalRows = matchingRows.length > 0 ? matchingRows.slice(0, limit) : rawRows.slice(0, limit);

    const poems: DatasetPoetPoem[] = finalRows.map((item) => {
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
        id: `ashaar-${item.row_idx}`,
        rowIdx: item.row_idx,
        title: (r["poem title"] || "قصيدة بدون عنوان").trim(),
        poet: (r["poet name"] || poet || "شاعر").trim(),
        poetBio: (r["poet description"] || "").trim(),
        era: (r["poet era"] && r["poet era"] !== "null" ? r["poet era"] : "العصر الذهبي").trim(),
        meter: (r["poem meter"] || "غير محدد").replace(/^بحر\s+/, "").trim(),
        theme: (r["poem theme"] || "شعر عربي").trim(),
        verses,
        couplets,
        totalVerses: verses.length,
        url: r["poem url"] || undefined,
      };
    });

    const payload = {
      source: "fuaf24/arabic-poetry-ashaar",
      status: "success",
      poet: poet || poems[0]?.poet || "شاعر",
      offset: fetchOffset,
      page,
      limit,
      returned: poems.length,
      poems,
      hasMore: poems.length === limit,
    };

    memoryCache.set(cacheKey, { data: payload, timestamp: Date.now() });

    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=43200",
        "X-Cache": "MISS",
      },
    });
  } catch (err) {
    console.error("Dataset poet poems error:", err);

    // Fallback: check in-repo archive index for this poet
    try {
      const path = await import("path");
      const fs = await import("fs/promises");
      const indexPath = path.join(process.cwd(), "public/data/arabic-archive/index.json");
      const raw = await fs.readFile(indexPath, "utf-8");
      const localArchive = JSON.parse(raw);
      const matched = (localArchive.poems || []).filter((p: { poet: string; searchTokens: string }) => {
        return p.poet.includes(poet) || p.searchTokens.includes(poet);
      });

      if (matched.length > 0) {
        const poems: DatasetPoetPoem[] = matched.slice(0, limit).map((m: {
          id: number;
          title: string;
          poet: string;
          era: string;
          meter: string;
          lines: string[];
        }) => ({
          id: `local-${m.id}`,
          rowIdx: m.id,
          title: m.title,
          poet: m.poet,
          era: m.era,
          meter: m.meter,
          theme: "شعر عربي كلاسيكي",
          verses: m.lines,
          couplets: m.lines,
          totalVerses: m.lines.length * 2,
        }));

        return NextResponse.json({
          source: "in-repo-archive-fallback",
          status: "success",
          poet,
          offset: fetchOffset,
          page,
          limit,
          returned: poems.length,
          poems,
          hasMore: false,
        });
      }
    } catch {
      // Continue to default empty response
    }

    return NextResponse.json(
      {
        source: "fuaf24/arabic-poetry-ashaar",
        status: "error",
        poet,
        offset: fetchOffset,
        page,
        limit,
        returned: 0,
        poems: [],
        hasMore: false,
        message: "Failed to fetch poems from dataset stream. Please check connection.",
      },
      { status: 200 }
    );
  }
}
