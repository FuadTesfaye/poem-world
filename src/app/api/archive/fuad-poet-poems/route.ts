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

import poetsOffsetsMap from "@/data/poets/poetsOffsetsMap.json";

function normalizeAr(str: string): string {
  return (str || "")
    .replace(/[ًٌٍَُِّْـ]/g, "")
    .replace(/[إأآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .trim();
}

const SLUG_TO_AR: Record<string, string> = {
  "al-mutanabbi": "المتنبي",
  "imru-al-qais": "امرؤ القيس",
  "antarah-ibn-shaddad": "عنترة بن شداد",
  "tarafa-ibn-al-abd": "طرفة بن العبد",
  "zuhayr-ibn-abi-sulma": "زهير بن أبي سلمى",
  "labid-ibn-rabiah": "لبيد بن ربيعة",
  "amr-ibn-kulthum": "عمرو بن كلثوم",
  "al-harith-ibn-hilliza": "الحارث بن حلزة",
  "al-nabigha-al-dhubyani": "النابغة الذبياني",
  "al-a-sha": "الأعشى",
  "al-khansa": "الخنساء",
  "hassan-ibn-thabit": "حسان بن ثابت",
  "ka-b-ibn-zuhayr": "كعب بن زهير",
  "al-hutay-ah": "الحطيئة",
  "jamil-buthayna": "جميل بثينة",
  "qays-ibn-al-mulawwah": "مجنون ليلى",
  "kuthayyir-azza": "كثير عزة",
  "al-akhtal": "الأخطل",
  "al-farazdaq": "الفرزدق",
  "jarir": "جرير",
  "dhu-al-rummah": "ذو الرمة",
  "umar-ibn-abi-rabi-ah": "عمر بن أبي ربيعة",
  "bashshar-ibn-burd": "بشار بن برد",
  "abu-nuwas": "أبو نواس",
  "abu-al-atahiyah": "أبو العتاهية",
  "muslim-ibn-al-walid": "صريع الغواني",
  "abu-tammam": "أبو تمام",
  "al-buhturi": "البحتري",
  "ibn-al-rumi": "ابن الرومي",
  "ibn-al-mu-tazz": "ابن المعتز",
  "al-sharif-al-radi": "الشريف الرضي",
  "al-ma-arri": "أبو العلاء المعري",
  "al-hallaj": "الحلاج",
  "ibn-al-farid": "ابن الفارض",
  "ibn-arabi": "محيي الدين بن عربي",
  "al-busiri": "البوصيري",
  "ibn-khafajah": "ابن خفاجة",
  "ibn-zaydun": "ابن زيدون",
  "wallada-bint-al-mustakfi": "ولادة بنت المستكفي",
  "lisan-al-din-ibn-al-khatib": "لسان الدين بن الخطيب",
  "ibn-zamrak": "ابن زمرك",
  "ahmad-shawqi": "أحمد شوقي",
  "hafiz-ibrahim": "حافظ ابراهيم",
  "khalil-mutran": "خليل مطران",
  "maruf-al-rusafi": "معروف الرصافي",
  "jamil-sidqi-al-zahawi": "جميل صدقي الزهاوي",
  "abu-al-qasim-al-shabbi": "أبو القاسم الشابي",
  "badr-shakir-al-sayyab": "بدر شاكر السياب",
  "nazik-al-mala-ika": "نازك الملائكة",
  "nizar-qabbani": "نزار قباني",
  "mahmoud-darwish": "محمود درويش",
  "adonis": "أدونيس",
  "al-jawahiri": "محمد مهدي الجواهري",
  "amal-dunqul": "أمل دنقل",
  "salah-abd-al-sabur": "صلاح عبد الصبور",
  "fadwa-tuqan": "فدوى طوقان",
  "samih-al-qasim": "سميح القاسم",
  "elias-abu-shabaki": "إلياس أبو شبكة",
  "mikhail-naimy": "ميخائيل نعيمة",
  "kahlil-gibran": "جبران خليل جبران",
  "iliya-abu-madi": "إيليا أبو ماضي"
};

function findPoetOffset(poetName: string): { start: number; count: number; matchedName: string } | null {
  if (!poetName) return null;
  const map = poetsOffsetsMap as Record<string, { start: number; count: number }>;
  
  // 1. Resolve slug if passed
  const query = SLUG_TO_AR[poetName.toLowerCase().trim()] || poetName.trim();

  // 2. Exact match in map
  if (map[query]) {
    return { ...map[query], matchedName: query };
  }

  // 3. Exact normalized match
  const normQuery = normalizeAr(query);
  for (const [k, v] of Object.entries(map)) {
    if (normalizeAr(k) === normQuery) {
      return { ...v, matchedName: k };
    }
  }

  // 4. Candidates where normalized names overlap, sorted by largest count (complete diwan)
  const candidates: Array<{ name: string; start: number; count: number }> = [];
  for (const [k, v] of Object.entries(map)) {
    const normK = normalizeAr(k);
    if (normK.includes(normQuery) || normQuery.includes(normK)) {
      candidates.push({ name: k, ...v });
    }
  }

  // Also strip common prefixes like أبو، ابن، الشيخ، الأمير، الشريف
  const cleanQuery = normQuery.replace(/^(ابو|ابن|الشيخ|الامير|الشاعر|الشريف)\s+/, "").trim();
  if (cleanQuery.length > 2) {
    for (const [k, v] of Object.entries(map)) {
      const normK = normalizeAr(k);
      if (normK.includes(cleanQuery) || cleanQuery.includes(normK)) {
        if (!candidates.some((c) => c.name === k)) {
          candidates.push({ name: k, ...v });
        }
      }
    }
  }

  if (candidates.length > 0) {
    candidates.sort((a, b) => b.count - a.count);
    return { start: candidates[0].start, count: candidates[0].count, matchedName: candidates[0].name };
  }

  return null;
}

const memoryCache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const poet = (searchParams.get("poet") || "").trim();
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "15", 10)));

  // Resolve exact start row from 7,152 poets dataset map
  const poetInfo = findPoetOffset(poet);
  const baseOffset = poetInfo ? poetInfo.start : Math.max(0, parseInt(searchParams.get("offset") || "0", 10));
  const totalPoemsCount = poetInfo ? poetInfo.count : 100;

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

  const fetchLimit = limit;
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

    // Filter rows by poet using matchedName from index or fallback
    const targetName = poetInfo ? poetInfo.matchedName : poet;
    const matchingRows = targetName
      ? rawRows.filter((item) => {
          const rowPoet = (item.row["poet name"] || "").trim();
          const normRow = normalizeAr(rowPoet);
          const normTarget = normalizeAr(targetName);
          return normRow.includes(normTarget) || normTarget.includes(normRow);
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
        poet: (r["poet name"] || targetName || poet || "شاعر").trim(),
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
      poet: poetInfo?.matchedName || poet || poems[0]?.poet || "شاعر",
      offset: fetchOffset,
      page,
      limit,
      totalPoetPoems: totalPoemsCount,
      returned: poems.length,
      poems,
      hasMore: page * limit < totalPoemsCount,
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
