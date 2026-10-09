"use client";

import React, { useState, useMemo } from "react";
import {
  POETS,
  POEMS,
  ROM,
  Poet,
  Poem,
  getPoet,
  getPoem,
  getPoemsByPoet,
  stripTags,
} from "@/data/diwan";
import PoemCard from "./PoemCard";
import PoetCard from "./PoetCard";
import {
  searchInRepoArabicArchive,
  fetchFuadCorpusStream,
  FuadCorpusPoemResult,
  FuadCorpusPage,
} from "@/data/search/arabicOfflineEngine";
import {
  SearchIcon,
  BookIcon,
  ScrollIcon,
  UsersIcon,
  GlobeIcon,
  SparkIcon,
  CheckIcon,
  CloseIcon,
  CopyIcon,
  ExternalLinkIcon,
  DatasetIcon,
} from "./Icons";

interface DiwanProps {
  routeParts: string[];
  hidden?: boolean;
}

interface ExternalResult {
  title: string;
  poet: string;
  meter?: string;
  era?: string;
  lines: string[];
  source: string;
}

const ARABIC_ERAS = [
  { id: "all", label: "All Eras (جميع العصور)" },
  { id: "jahili", label: "العصر الجاهلي (Pre-Islamic)" },
  { id: "umayyad", label: "العصر الأموي (Umayyad)" },
  { id: "abbasid", label: "العصر العباسي (Abbasid)" },
  { id: "andalusian", label: "العصر الأندلسي (Andalusian)" },
  { id: "modern", label: "العصر الحديث (Modern)" },
];

const ENGLISH_ERAS = [
  { id: "all", label: "All English Eras" },
  { id: "old", label: "Old & Middle English" },
  { id: "renaissance", label: "Renaissance & Elizabethan" },
  { id: "metaphysical", label: "Metaphysical & Jacobean" },
  { id: "romantic", label: "Romantic Movement" },
  { id: "victorian", label: "Victorian Era" },
  { id: "american", label: "19th C. American" },
  { id: "modernist", label: "Modernist & 20th C." },
];

export default function Diwan({ routeParts, hidden = false }: DiwanProps) {
  const [selectedPoetSlug, setSelectedPoetSlug] = useState<string>("all");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all");
  const [selectedEra, setSelectedEra] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [poetSearchQuery, setPoetSearchQuery] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [copyFeedback, setCopyFeedback] = useState<string>("");
  const [visibleCount, setVisibleCount] = useState<number>(12);
  const [visiblePoetsCount, setVisiblePoetsCount] = useState<number>(16);
  const [readingMode, setReadingMode] = useState<"original" | "parallel" | "stanza" | "translation">("parallel");

  // Dual-Tier Arabic Archive Engine State
  const [archiveMode, setArchiveMode] = useState<"local" | "cloud">("local");
  const [archiveQuery, setArchiveQuery] = useState<string>("");
  const [archiveMeter, setArchiveMeter] = useState<string>("all");
  const [archiveSearching, setArchiveSearching] = useState<boolean>(false);
  const [archiveResults, setArchiveResults] = useState<ExternalResult[]>([]);
  const [archiveSearched, setArchiveSearched] = useState<boolean>(false);

  // Fuad's 3.85M Corpus Cloud Explorer State (fuaf24/arabic-poetry-ashaar)
  const [cloudOffset, setCloudOffset] = useState<number>(0);
  const [cloudLimit] = useState<number>(12);
  const [cloudMeter, setCloudMeter] = useState<string>("all");
  const [cloudLoading, setCloudLoading] = useState<boolean>(false);
  const [cloudData, setCloudData] = useState<FuadCorpusPage | null>(null);
  const [activeCloudPoemModal, setActiveCloudPoemModal] = useState<FuadCorpusPoemResult | null>(null);

  async function loadCloudPage(newOffset: number, meterToUse: string = cloudMeter) {
    setCloudLoading(true);
    try {
      const data = await fetchFuadCorpusStream(newOffset, cloudLimit, meterToUse);
      if (data) {
        setCloudData(data);
        setCloudOffset(newOffset);
      }
    } catch (err) {
      console.error("Failed to load cloud corpus page:", err);
    } finally {
      setCloudLoading(false);
    }
  }

  function handleSwitchToCloud() {
    setArchiveMode("cloud");
    if (!cloudData && !cloudLoading) {
      loadCloudPage(0, cloudMeter);
    }
  }

  const routeType = routeParts[0] || "poems";
  const routeParam = routeParts[1];

  // Filtered poems for poems catalog
  const filteredPoems = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return POEMS.filter((p) => {
      const poetObj = getPoet(p.poet);
      if (selectedPoetSlug !== "all" && p.poet !== selectedPoetSlug) return false;
      if (selectedLanguage !== "all" && p.language !== selectedLanguage) return false;
      if (selectedEra !== "all") {
        const eraLower = p.era.toLowerCase();
        const selLower = selectedEra.toLowerCase();
        const eraMatch =
          eraLower.includes(selLower) ||
          (selLower === "old" && (eraLower.includes("old english") || eraLower.includes("middle english") || eraLower.includes("anglo-saxon"))) ||
          (selLower === "modernist" && (eraLower.includes("modernist") || eraLower.includes("20th century") || eraLower.includes("confessional") || eraLower.includes("harlem")));
        if (!eraMatch) return false;
      }
      if (!q) return true;

      const haystack = (
        stripTags(p.title) +
        " " +
        (p.titleAr || "") +
        " " +
        (poetObj ? poetObj.name + " " + (poetObj.ar || "") : "") +
        " " +
        (p.meter || "") +
        " " +
        p.era +
        " " +
        p.tags.join(" ") +
        " " +
        stripTags(p.text)
      ).toLowerCase();
      return haystack.includes(q);
    });
  }, [selectedPoetSlug, selectedLanguage, selectedEra, searchQuery]);

  // Filtered poets for poets catalog
  const filteredPoets = useMemo(() => {
    const q = poetSearchQuery.toLowerCase().trim();
    return POETS.filter((poet) => {
      if (selectedLanguage !== "all") {
        if (selectedLanguage === "ar" && poet.language === "en") return false;
        if (selectedLanguage === "en" && poet.language === "ar") return false;
      }
      if (selectedEra !== "all") {
        const eraLower = poet.era.toLowerCase();
        const selLower = selectedEra.toLowerCase();
        const eraMatch =
          eraLower.includes(selLower) ||
          (selLower === "old" && (eraLower.includes("old english") || eraLower.includes("middle english") || eraLower.includes("anglo-saxon"))) ||
          (selLower === "modernist" && (eraLower.includes("modernist") || eraLower.includes("20th century") || eraLower.includes("confessional") || eraLower.includes("harlem")));
        if (!eraMatch) return false;
      }
      if (!q) return true;

      const haystack = (
        poet.name +
        " " +
        (poet.ar || "") +
        " " +
        poet.era +
        " " +
        poet.place +
        " " +
        poet.tag +
        " " +
        poet.themes.join(" ")
      ).toLowerCase();
      return haystack.includes(q);
    });
  }, [poetSearchQuery, selectedLanguage, selectedEra]);

  // Dynamic available poet chips based on active tradition and era
  const availableChips = useMemo(() => {
    let poets = POETS;
    if (selectedLanguage === "ar") {
      poets = poets.filter((p) => p.language === "ar");
    } else if (selectedLanguage === "en") {
      poets = poets.filter((p) => p.language === "en");
    }
    if (selectedEra !== "all") {
      const selLower = selectedEra.toLowerCase();
      poets = poets.filter((p) => {
        const eraLower = p.era.toLowerCase();
        return (
          eraLower.includes(selLower) ||
          (selLower === "old" && (eraLower.includes("old english") || eraLower.includes("middle english") || eraLower.includes("anglo-saxon"))) ||
          (selLower === "modernist" && (eraLower.includes("modernist") || eraLower.includes("20th century") || eraLower.includes("confessional") || eraLower.includes("harlem")))
        );
      });
    }
    return [{ slug: "all", name: selectedLanguage === "ar" ? "جميع الشعراء" : "All poets" }, ...poets];
  }, [selectedLanguage, selectedEra]);

  if (hidden) return null;

  function handleCopyPoem(text: string, label: string = "Verses") {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      const clean = text.replace(/\|\|/g, " — ");
      navigator.clipboard.writeText(clean);
      setCopied(true);
      setCopyFeedback(`Copied ${label}`);
      setTimeout(() => {
        setCopied(false);
        setCopyFeedback("");
      }, 2200);
    }
  }

  // Instant In-Repo Archive Search (Zero Latency & Zero External API Calls)
  async function runInstantArchiveSearch(query: string, meter: string = archiveMeter) {
    const q = query.trim();
    setArchiveSearching(true);
    setArchiveSearched(true);

    const results: ExternalResult[] = [];
    const isArabicQuery = /[\u0600-\u06FF]/.test(q) || selectedLanguage === "ar";

    try {
      if (isArabicQuery || !q) {
        // Query local in-repo static archive index with zero external network API calls
        const offlineItems = await searchInRepoArabicArchive(q, meter, "all");
        for (const item of offlineItems.slice(0, 24)) {
          results.push({
            title: item.title,
            poet: item.poet,
            meter: item.meter,
            era: item.era,
            lines: item.lines.slice(0, 4),
            source: "ديوان العرب (In-Repo Local Archive)",
          });
        }
      } else {
        // Local search within bundled English poems
        const qLower = q.toLowerCase();
        const matched = POEMS.filter(
          (p) =>
            p.language === "en" &&
            (p.title.toLowerCase().includes(qLower) ||
             p.poet.toLowerCase().includes(qLower) ||
             p.text.toLowerCase().includes(qLower))
        ).slice(0, 16);

        for (const p of matched) {
          results.push({
            title: stripTags(p.title),
            poet: p.poet,
            meter: p.meter,
            era: p.era,
            lines: stripTags(p.text).split("\n").slice(0, 4),
            source: "English Canon (In-Repo)",
          });
        }
      }
      setArchiveResults(results);
    } catch (err) {
      console.error("Local archive search error:", err);
    } finally {
      setArchiveSearching(false);
    }
  }

  async function searchLiveArchive(e: React.FormEvent) {
    e.preventDefault();
    runInstantArchiveSearch(archiveQuery, archiveMeter);
  }

  function renderFrameFor(p: Poem) {
    const customBg = p.img.startsWith("http") || p.img.startsWith("/")
      ? { backgroundImage: `url(${p.img})` }
      : {};

    if (p.frame === "carved") {
      return (
        <div className="carved">
          <div className="dwin">
            <div
              className={`dpic ${p.img}`}
              style={{ backgroundPosition: p.pos, ...customBg }}
              role="img"
              aria-label={p.plate}
            />
          </div>
          <div className="dfr" />
        </div>
      );
    }
    if (p.frame === "none") {
      return (
        <div className="dwin aspect-[4/5] w-full">
          <div
            className={`dpic ${p.img} h-full w-full`}
            style={{ backgroundPosition: p.pos, ...customBg }}
            role="img"
            aria-label={p.plate}
          />
        </div>
      );
    }
    return (
      <div className="gilt">
        <div
          className={`dpic ${p.img} aspect-[4/5]`}
          style={{ backgroundPosition: p.pos, ...customBg }}
          role="img"
          aria-label={p.plate}
        />
      </div>
    );
  }

  // 1. Single Poem Route: #/poem/[slug]
  function renderPoemView(slug: string) {
    const p = getPoem(slug);
    if (!p) {
      return renderHomeView();
    }
    const po = getPoet(p.poet);
    const poetName = po ? po.name : p.poet;
    const index = POEMS.indexOf(p);
    const prevPoem = POEMS[(index + POEMS.length - 1) % POEMS.length];
    const nextPoem = POEMS[(index + 1) % POEMS.length];
    const morePoems = getPoemsByPoet(p.poet).filter((x) => x.slug !== p.slug);
    const isArabic = p.language === "ar";

    const originalStanzas = p.text.split("\n\n").map((s) => s.trim()).filter(Boolean);
    const translationText = p.translation || "";
    const translationStanzas = translationText
      ? translationText.split("\n\n").map((s) => s.trim()).filter(Boolean)
      : [];

    function renderOriginalStanza(stanza: string, sIdx: number) {
      if (isArabic) {
        return (
          <div key={sIdx} className="bayt-list space-y-3" dir="rtl">
            {stanza.split("\n").map((baytLine, bIdx) => {
              const parts = baytLine.split("||");
              const sadr = parts[0]?.trim();
              const ajuz = parts[1]?.trim();
              return (
                <div key={bIdx} className="bayt-row">
                  <span className="bayt-sadr">{sadr}</span>
                  {ajuz && <span className="bayt-separator">&#10059;</span>}
                  {ajuz && <span className="bayt-ajuz">{ajuz}</span>}
                </div>
              );
            })}
          </div>
        );
      } else {
        return (
          <p
            key={sIdx}
            className={sIdx === 0 ? "ddrop whitespace-pre-line" : "whitespace-pre-line"}
            dir="ltr"
            dangerouslySetInnerHTML={{
              __html: stanza.replace(/\n/g, "<br/>"),
            }}
          />
        );
      }
    }

    function renderTranslationStanza(stanza: string, sIdx: number) {
      if (isArabic) {
        // Arabic poem translated into English
        return (
          <p
            key={sIdx}
            className="whitespace-pre-line text-lg italic text-ink/90 font-serif leading-relaxed"
            dir="ltr"
            dangerouslySetInnerHTML={{
              __html: stanza.replace(/\n/g, "<br/>"),
            }}
          />
        );
      } else {
        // English poem translated into Arabic
        return (
          <p
            key={sIdx}
            className="ar whitespace-pre-line text-xl font-medium text-ink/90 leading-loose"
            dir="rtl"
            dangerouslySetInnerHTML={{
              __html: stanza.replace(/\n/g, "<br/>"),
            }}
          />
        );
      }
    }

    return (
      <>
        <article
          className={`grid gap-12 px-[4vw] pt-8 ${
            readingMode === "parallel" ? "lg:grid-cols-[0.85fr_1.35fr]" : "lg:grid-cols-[1fr_1.1fr]"
          }`}
        >
          {/* Framed Plate Display */}
          <div className="lg:sticky lg:top-6 lg:self-start">
            <div className="mx-auto max-w-[640px]">
              {renderFrameFor(p)}
              <p className="sc mt-5 text-center text-sm opacity-80">
                Plate {ROM[index] || "I"} &mdash; {p.plate}
              </p>
            </div>
          </div>

          {/* Reading Column */}
          <div className={readingMode === "parallel" ? "w-full max-w-4xl" : "max-w-2xl"}>
            <nav className="sc text-xs mb-3" aria-label="Breadcrumb">
              <a href="#/poems" className="hover:text-ember">Diwan</a> &nbsp;/&nbsp;{" "}
              <a href="#/poets" className="hover:text-ember">Poets</a> &nbsp;/&nbsp;{" "}
              <a href="#/art" className="text-ember font-medium hover:underline">Art Gallery</a> &nbsp;/&nbsp;{" "}
              {po && <a href={`#/poet/${po.slug}`} className="hover:text-ember">{po.name}</a>}
            </nav>

            {/* Non-Intervening Title Hierarchy */}
            {isArabic ? (
              <div>
                <h1
                  className="ar mt-4 text-[clamp(2.5rem,5.5vw,4.8rem)] text-ink leading-snug font-medium"
                  dir="rtl"
                >
                  <bdi>{p.titleAr || stripTags(p.title)}</bdi>
                </h1>
                <p
                  className="disp mt-2 text-[clamp(1.2rem,2.4vw,2rem)] text-ember italic leading-normal"
                  dir="ltr"
                >
                  <bdi>{stripTags(p.title)}</bdi>
                </p>
              </div>
            ) : (
              <div>
                <h1
                  className="disp mt-4 text-[clamp(2.4rem,5.5vw,4.8rem)] text-ink leading-tight font-normal"
                  dir="ltr"
                  dangerouslySetInnerHTML={{ __html: p.title }}
                />
                {p.titleAr && (
                  <p
                    className="ar mt-2 text-[clamp(1.5rem,3vw,2.4rem)] text-ember leading-relaxed font-medium"
                    dir="rtl"
                  >
                    <bdi>{p.titleAr}</bdi>
                  </p>
                )}
              </div>
            )}

            {/* Poet & Era Badges */}
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
              {isArabic ? (
                <>
                  {po?.ar && (
                    <a className="ar text-2xl text-ember font-medium hover:underline" href={`#/poet/${po.slug}`} dir="rtl">
                      {po.ar}
                    </a>
                  )}
                  <span className="sc text-sm opacity-70" dir="ltr">
                    (<bdi>{po ? po.name : p.poet}</bdi>)
                  </span>
                </>
              ) : (
                <>
                  {po && (
                    <a className="sc text-lg text-ember font-semibold hover:underline" href={`#/poet/${po.slug}`} dir="ltr">
                      {po.name}
                    </a>
                  )}
                  {po?.ar && (
                    <span className="ar text-xl text-ink/80 font-normal" dir="rtl">
                      (<bdi>{po.ar}</bdi>)
                    </span>
                  )}
                </>
              )}

              <span className="sc text-xs opacity-70">&bull; {p.era}</span>
              {p.meter && (
                <span className="tag ar text-sm text-ember bg-amber-950/10 font-medium">
                  {p.meter}
                </span>
              )}
            </div>

            {/* Tags */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {p.tags.map((t) => (
                <span key={t} className="tag">
                  {t}
                </span>
              ))}
            </div>

            {/* Reading Mode Segmented Controls */}
            <div className="mt-8 border-y border-ink/15 py-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="sc text-xs tracking-wider uppercase text-ember font-semibold flex items-center gap-1.5">
                  <span>&#10086;</span> Reading Mode
                </span>
                <div className="flex flex-wrap gap-1.5 text-xs">
                  <button
                    className={`px-3 py-1.5 transition-colors border ${
                      readingMode === "original"
                        ? "bg-ember text-paper border-ember font-medium"
                        : "border-ink/20 hover:border-ember/60 text-ink/80"
                    }`}
                    onClick={() => setReadingMode("original")}
                    title="View only the original verse"
                  >
                    Original Only (الأصل)
                  </button>
                  <button
                    className={`px-3 py-1.5 transition-colors border ${
                      readingMode === "parallel"
                        ? "bg-ember text-paper border-ember font-medium"
                        : "border-ink/20 hover:border-ember/60 text-ink/80"
                    }`}
                    onClick={() => setReadingMode("parallel")}
                    title="Side-by-side parallel columns"
                  >
                    Side-by-Side (جنباً إلى جنب)
                  </button>
                  <button
                    className={`px-3 py-1.5 transition-colors border ${
                      readingMode === "stanza"
                        ? "bg-ember text-paper border-ember font-medium"
                        : "border-ink/20 hover:border-ember/60 text-ink/80"
                    }`}
                    onClick={() => setReadingMode("stanza")}
                    title="Original stanzas with isolated translation cards"
                  >
                    Verse &amp; Card (الأصل والترجمة)
                  </button>
                  <button
                    className={`px-3 py-1.5 transition-colors border ${
                      readingMode === "translation"
                        ? "bg-ember text-paper border-ember font-medium"
                        : "border-ink/20 hover:border-ember/60 text-ink/80"
                    }`}
                    onClick={() => setReadingMode("translation")}
                    title="View only the translated verse"
                  >
                    Translation Only (الترجمة)
                  </button>
                </div>
              </div>
              {p.translator && readingMode !== "original" && (
                <div className="mt-2 text-right text-[11px] italic opacity-75">
                  Poetic translation by: <span className="font-medium text-ember">{p.translator}</span>
                </div>
              )}
            </div>

            {/* Verses Container based on Reading Mode */}
            <div className="poem mt-8" id="poem-text">
              {/* MODE 1: ORIGINAL ONLY */}
              {readingMode === "original" && (
                <div className="space-y-6">
                  {originalStanzas.map((stanza, sIdx) => renderOriginalStanza(stanza, sIdx))}
                </div>
              )}

              {/* MODE 2: SIDE-BY-SIDE DUAL COLUMNS */}
              {readingMode === "parallel" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                  {/* Left Column: English (LTR) */}
                  <div className="space-y-6">
                    <div className="border-b border-ink/15 pb-2 flex items-center justify-between text-xs">
                      <span className="sc font-semibold text-ember uppercase">
                        {isArabic ? "Poetic Translation" : "Original English Text"}
                      </span>
                      <span className="tag py-0.5 px-2 bg-amber-950/5 text-ink/70">
                        {isArabic ? "English" : "English (Original)"}
                      </span>
                    </div>
                    <div className="space-y-6">
                      {isArabic ? (
                        translationStanzas.length > 0 ? (
                          translationStanzas.map((stanza, sIdx) => renderTranslationStanza(stanza, sIdx))
                        ) : (
                          <p className="italic text-sm opacity-70 py-6 text-center">
                            Scholarly English translation is being illuminated into the archive.
                          </p>
                        )
                      ) : (
                        originalStanzas.map((stanza, sIdx) => renderOriginalStanza(stanza, sIdx))
                      )}
                    </div>
                  </div>

                  {/* Right Column: Arabic (RTL) */}
                  <div className="space-y-6 md:border-l md:border-ink/15 md:pl-8">
                    <div className="border-b border-ink/15 pb-2 flex items-center justify-between text-xs" dir="rtl">
                      <span className="ar font-semibold text-ember text-sm">
                        {isArabic ? "النص العربي الأصلي" : "الترجمة الأدبية العربية"}
                      </span>
                      <span className="tag py-0.5 px-2 bg-amber-950/5 text-ink/70 text-xs">
                        {isArabic ? "العربية (الأصل)" : "العربية (مترجمة)"}
                      </span>
                    </div>
                    <div className="space-y-6">
                      {isArabic ? (
                        originalStanzas.map((stanza, sIdx) => renderOriginalStanza(stanza, sIdx))
                      ) : (
                        translationStanzas.length > 0 ? (
                          translationStanzas.map((stanza, sIdx) => renderTranslationStanza(stanza, sIdx))
                        ) : (
                          <p className="ar italic text-sm opacity-70 py-6 text-center" dir="rtl">
                            الترجمة الأدبية العربية قيد الإضاءة والتحقيق في أرشيف الديوان.
                          </p>
                        )
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* MODE 3: STANZA WITH ISOLATED TRANSLATION CARD */}
              {readingMode === "stanza" && (
                <div className="space-y-10">
                  {originalStanzas.map((stanza, sIdx) => {
                    const trans = translationStanzas[sIdx];
                    return (
                      <div key={sIdx} className="space-y-3 pb-6 border-b border-ink/10 last:border-b-0">
                        <div>{renderOriginalStanza(stanza, sIdx)}</div>
                        {trans && (
                          <div className="mat mt-3 p-4 border-l-2 border-ember bg-amber-950/5">
                            <div className="flex items-center justify-between text-xs text-ember font-medium mb-1">
                              <span className="sc uppercase">
                                {isArabic ? "English Translation" : "الترجمة العربية"}
                              </span>
                              {p.translator && <span className="opacity-75 italic">{p.translator}</span>}
                            </div>
                            <div className="mt-2">{renderTranslationStanza(trans, sIdx)}</div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* MODE 4: TRANSLATION ONLY */}
              {readingMode === "translation" && (
                <div className="space-y-6">
                  {translationStanzas.length > 0 ? (
                    translationStanzas.map((stanza, sIdx) => renderTranslationStanza(stanza, sIdx))
                  ) : (
                    <p className="italic text-base opacity-75 py-8 text-center">
                      {isArabic
                        ? "Scholarly English translation is being illuminated into the archive."
                        : "الترجمة الأدبية العربية قيد الإضاءة والتحقيق في أرشيف الديوان."}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Actions: Copy & Navigation */}
            <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-ink/20 pt-6">
              <button
                className="dbtn text-xs"
                onClick={() => handleCopyPoem(p.text, "Original")}
              >
                Copy Original Verses
              </button>
              {p.translation && (
                <button
                  className="dbtn text-xs"
                  onClick={() => handleCopyPoem(p.translation!, "Translation")}
                >
                  Copy Translation
                </button>
              )}
              {p.translation && (
                <button
                  className="dbtn text-xs"
                  onClick={() => handleCopyPoem(`${p.text}\n\n---\n\n${p.translation}`, "Bilingual")}
                >
                  Copy Bilingual Both
                </button>
              )}
              {copyFeedback && (
                <span className="sc text-xs text-emerald-800 font-medium ml-2">
                  {copyFeedback}
                </span>
              )}
              {po && (
                <a className="dbtn text-xs ml-auto" href={`#/poet/${po.slug}`}>
                  All Works by {po.name} &rarr;
                </a>
              )}
            </div>

            {/* Commentary / About */}
            <div className="mat mt-10">
              <div className="flex items-center justify-between">
                <h2 className="sc text-sm uppercase tracking-wider text-ink font-semibold">
                  About this Masterpiece
                </h2>
                {p.aboutAr && <span className="ar text-base text-ember" dir="rtl">عن الرائعة</span>}
              </div>
              <p className="mt-2 text-base leading-relaxed opacity-90">{p.about}</p>
              {p.aboutAr && (
                <p className="ar mt-3 pt-3 border-t border-ink/10 text-lg leading-relaxed text-ink/90" dir="rtl">
                  {p.aboutAr}
                </p>
              )}
            </div>

            {/* Prev / Next Plate Navigation */}
            <nav
              className="mt-12 flex items-center justify-between border-t border-ink/20 pt-6 text-sm"
              aria-label="Poem pagination"
            >
              <a
                className="sc flex items-center gap-2 hover:text-ember"
                href={`#/poem/${prevPoem.slug}`}
              >
                &larr; Previous Plate
              </a>
              <a
                className="sc flex items-center gap-2 hover:text-ember"
                href={`#/poem/${nextPoem.slug}`}
              >
                Next Plate &rarr;
              </a>
            </nav>
          </div>
        </article>

        {/* More from this poet */}
        {morePoems.length > 0 && (
          <section className="px-[4vw] pt-16">
            <div className="dorn mx-auto max-w-[70vw]">
              <span className="disp text-2xl">More from {poetName}</span>
            </div>
            <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {morePoems.map((mp) => (
                <PoemCard key={mp.slug} poem={mp} />
              ))}
            </div>
          </section>
        )}
      </>
    );
  }

  // 2. Single Poet Route: #/poet/[slug]
  function renderPoetView(slug: string) {
    const p = getPoet(slug);
    if (!p) {
      return renderPoetsListView();
    }
    const poetPoems = getPoemsByPoet(p.slug);
    const customBg = p.imageSrc ? { backgroundImage: `url(${p.imageSrc})` } : {};

    return (
      <>
        <section className="grid items-center gap-10 px-[4vw] pt-10 md:grid-cols-[.8fr_1.2fr]">
          <div className="mx-auto w-full max-w-[420px]">
            <div className="gilt">
              <div
                className={`dpic ${p.img} aspect-[4/5]`}
                style={{
                  backgroundPosition: p.pos,
                  backgroundSize: "cover",
                  ...customBg,
                }}
                role="img"
                aria-label={`Portrait of ${p.name}`}
              />
            </div>
          </div>
          <div>
            <nav className="sc text-xs">
              <a href="#/poems">Diwan</a> &nbsp;/&nbsp;{" "}
              <a href="#/poets">Poets</a> &nbsp;/&nbsp;{" "}
              <a href="#/art" className="text-ember font-medium hover:underline">Art Gallery</a>
            </nav>
            {p.language === "ar" ? (
              <>
                <h1 className="ar mt-4 text-[clamp(2.8rem,7vw,6.5rem)] text-ink leading-snug font-medium" dir="rtl">
                  <bdi>{p.ar || p.name}</bdi>
                </h1>
                <p className="sc text-2xl text-ember font-medium mt-1" dir="ltr">
                  <bdi>{p.name}</bdi>
                </p>
              </>
            ) : (
              <>
                <h1 className="disp mt-4 text-[clamp(2.8rem,7vw,7rem)] text-ink leading-tight font-normal" dir="ltr">
                  <bdi>{p.name}</bdi>
                </h1>
                {p.ar && (
                  <p className="ar text-[clamp(2rem,4vw,3.5rem)] text-ember font-medium mt-1" dir="rtl">
                    <bdi>{p.ar}</bdi>
                  </p>
                )}
              </>
            )}
            <p className="sc mt-2 text-lg opacity-85">
              {p.years} &nbsp;&middot;&nbsp; {p.place} &nbsp;&middot;&nbsp; {p.era}
            </p>
            <p className="mt-2 text-xl italic opacity-90">{p.tag}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {p.themes.map((t) => (
                <span key={t} className="tag">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-10 px-[4vw] py-14 lg:grid-cols-[1.4fr_1fr]">
          <div className="max-w-2xl space-y-5">
            {p.bio.map((b, i) => (
              <p
                key={i}
                className={i === 0 ? "ddrop" : "text-lg leading-relaxed"}
                dangerouslySetInnerHTML={{ __html: b }}
              />
            ))}
          </div>
          <aside className="mat self-start">
            <h2 className="sc text-sm">Selected Works &amp; Diwans</h2>
            <ul className="mt-3 list-none space-y-2 p-0 italic">
              {p.works.map((w, i) => (
                <li key={i}>&#10086; {w}</li>
              ))}
            </ul>
          </aside>
        </section>

        {p.sayings && p.sayings.length > 0 && (
          <section className="px-[4vw] pb-14">
            <div className="dorn mx-auto max-w-[70vw]">
              <span className="disp text-2xl">Verses &amp; Sayings in Spirit</span>
            </div>
            <div className="mt-8 grid gap-8 sm:grid-cols-2">
              {p.sayings.map((s, i) => (
                <blockquote key={i} className="mat m-0 text-center">
                  <p
                    className="disp m-0 text-[clamp(1.3rem,2vw,2.2rem)] normal-case leading-snug text-ink"
                    dangerouslySetInnerHTML={{ __html: `&ldquo;${s}&rdquo;` }}
                  />
                </blockquote>
              ))}
            </div>
          </section>
        )}

        <section className="px-[4vw]">
          <div className="dorn mx-auto max-w-[70vw]">
            <span className="disp text-2xl">Poems by {p.name} ({poetPoems.length})</span>
          </div>
          {poetPoems.length > 0 ? (
            <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {poetPoems.map((m) => (
                <PoemCard key={m.slug} poem={m} />
              ))}
            </div>
          ) : (
            <p className="mt-8 text-center italic opacity-80">
              More masterworks by this author are being illuminated into the archive.
            </p>
          )}
        </section>
      </>
    );
  }

  // 3. Poets Catalog Route: #/poets
  function renderPoetsListView() {
    const arabicPoetsCount = POETS.filter((p) => p.language === "ar").length;
    const englishPoetsCount = POETS.filter((p) => p.language === "en").length;

    return (
      <section className="px-[4vw] pt-8">
        <div className="text-center max-w-2xl mx-auto">
          <p className="sc text-xs tracking-widest text-ember uppercase">The Classical &amp; Modern Masters</p>
          <h1 className="disp mt-2 text-[clamp(3.5rem,8vw,7.5rem)] text-ink">
            <i>T</i>he <i>P</i>oets
          </h1>
          <p className="mt-4 italic text-lg opacity-85 leading-relaxed">
            Cross centuries and empires: the pre-Islamic desert wanderers, the court masters of Baghdad and Damascus, the poets of Andalusia, the English Romantics, and the voices of modern memory.
          </p>
        </div>

        {/* Filter bar */}
        <div className="mt-10 mx-auto max-w-3xl space-y-4">
          <div className="mx-auto max-w-md">
            <label className="sc block text-center text-xs" htmlFor="poet-q">
              Search poet by name, era, or birthplace
            </label>
            <div className="relative mt-1">
              <input
                id="poet-q"
                type="search"
                value={poetSearchQuery}
                onChange={(e) => {
                  setPoetSearchQuery(e.target.value);
                  setVisiblePoetsCount(16);
                }}
                className="w-full border border-ink/60 bg-transparent pl-10 pr-10 py-2.5 text-center italic outline-none focus:border-ember"
                placeholder="Mutanabbi, Shakespeare, Keats, Darwish, Antarah..."
              />
              <SearchIcon className="absolute left-3.5 top-3 w-4 h-4 text-ink/50 pointer-events-none" />
              {poetSearchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setPoetSearchQuery("");
                    setVisiblePoetsCount(16);
                  }}
                  className="absolute right-3 top-2.5 text-ink/60 hover:text-ember p-0.5"
                  title="Clear search"
                >
                  <CloseIcon className="w-4 h-4" />
                </button>
              )}
            </div>
            {poetSearchQuery && (
              <p className="mt-2 text-center text-xs sc text-ember">
                Found {filteredPoets.length} matching masters
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              className="dbtn"
              aria-pressed={selectedLanguage === "all"}
              onClick={() => {
                setSelectedLanguage("all");
                setSelectedEra("all");
                setVisiblePoetsCount(16);
              }}
            >
              All Traditions ({POETS.length})
            </button>
            <button
              className="dbtn"
              aria-pressed={selectedLanguage === "ar"}
              onClick={() => {
                setSelectedLanguage("ar");
                setSelectedEra("all");
                setVisiblePoetsCount(16);
              }}
            >
              العربية (Arabic Canon &bull; {arabicPoetsCount})
            </button>
            <button
              className="dbtn"
              aria-pressed={selectedLanguage === "en"}
              onClick={() => {
                setSelectedLanguage("en");
                setSelectedEra("all");
                setVisiblePoetsCount(16);
              }}
            >
              English Canon &bull; {englishPoetsCount} Masters
            </button>
            <a href="#/art" className="dbtn text-ember font-medium">
              Art Gallery &rarr;
            </a>
          </div>

          {/* Sub-Era Filter Pills */}
          {selectedLanguage === "en" && (
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              {ENGLISH_ERAS.map((era) => (
                <button
                  key={era.id}
                  className={`text-xs py-1 px-3 transition-colors border ${
                    selectedEra === era.id
                      ? "bg-ember text-paper border-ember"
                      : "border-ink/30 hover:border-ember/70 text-ink"
                  }`}
                  onClick={() => {
                    setSelectedEra(era.id);
                    setVisiblePoetsCount(16);
                  }}
                >
                  {era.label}
                </button>
              ))}
            </div>
          )}

          {selectedLanguage === "ar" && (
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2" dir="rtl">
              {ARABIC_ERAS.map((era) => (
                <button
                  key={era.id}
                  className={`text-xs py-1 px-3 transition-colors border ${
                    selectedEra === era.id
                      ? "bg-ember text-paper border-ember"
                      : "border-ink/30 hover:border-ember/70 text-ink"
                  }`}
                  onClick={() => {
                    setSelectedEra(era.id);
                    setVisiblePoetsCount(16);
                  }}
                >
                  {era.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredPoets.length > 0 ? (
            filteredPoets.slice(0, visiblePoetsCount).map((poet) => (
              <PoetCard key={poet.slug} poet={poet} />
            ))
          ) : (
            <p className="col-span-full text-center italic py-8">
              No poets match your search query. Try another term.
            </p>
          )}
        </div>

        {/* Poets Load More / Pagination Button */}
        {visiblePoetsCount < filteredPoets.length && (
          <div className="mt-12 text-center flex flex-col items-center gap-3">
            <button
              type="button"
              className="dbtn font-bold px-8 py-3 text-xs tracking-wider uppercase transition shadow-sm hover:shadow"
              onClick={() => setVisiblePoetsCount((prev) => prev + 16)}
            >
              Load More Masters ({filteredPoets.length - visiblePoetsCount} remaining)
            </button>
            <p className="text-xs sc text-ink/70">
              Displaying {Math.min(visiblePoetsCount, filteredPoets.length)} of {filteredPoets.length} poets
            </p>
          </div>
        )}
      </section>
    );
  }

  // 4. About View: #/about
  function renderAboutView() {
    return (
      <section className="mx-auto max-w-2xl px-[4vw] pt-12">
        <h1 className="disp text-[clamp(3rem,8vw,7rem)] text-ink">
          <i>A</i>bout
        </h1>
        <div className="mt-6 space-y-5 text-lg leading-relaxed">
          <p className="ddrop">
            <em>Diwan</em> is the Arabic word for a collected book of poems, and also for a hall where people gather to listen. This sanctuary unites the greatest voices of human longing across classical Arabic, the pre-Islamic Golden Mu‘allaqat, the courts of Damascus, Baghdad and Cordoba, and the English Renaissance and Romantic traditions.
          </p>
          <p>
            Enriched with references to classical prosody, every verse is set within illuminated borders honoring antique manuscript art, alongside scholarly bilingual translations and metrical scansion according to the 16 classical meters of Al-Khalil ibn Ahmad.
          </p>
          <p>
            An open, comprehensive cultural repository preserved for scholars, readers, and lovers of verse worldwide.
          </p>
        </div>
        <div className="mt-8">
          <a className="dbtn" href="#/poems">
            Back to the Diwan
          </a>
        </div>
      </section>
    );
  }

  // 5. Home / All Poems View
  function renderHomeView() {
    const paginatedPoems = filteredPoems.slice(0, visibleCount);

    return (
      <>
        <section className="relative grid items-center gap-10 px-[4vw] pb-16 pt-10 md:grid-cols-[1.1fr_1fr]">
          <div className="drise">
            <p className="sc text-sm">A house of poems, bound in gold</p>
            <h1 className="disp dink mt-3 text-[clamp(5rem,15vw,15rem)]">
              <i>D</i>iwan
            </h1>
            <p className="mt-6 max-w-lg text-[1.2em] italic leading-relaxed">
              From the thunder of pre-Islamic desert chivalry to Shakespeare&rsquo;s summer, Keats&rsquo;s nightingale, Poe&rsquo;s raven, and Darwish&rsquo;s country of memory.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="#/poems/list" className="dbtn">
                Browse Poems ({POEMS.length})
              </a>
              <a href="#/poets" className="dbtn">
                All Poets ({POETS.length})
              </a>
              <a href="#/art" className="dbtn text-ember font-medium">
                Art Gallery &rarr;
              </a>
            </div>
          </div>
          <div
            className="relative mx-auto h-[min(110vw,640px)] w-full max-w-[640px]"
            aria-hidden="true"
          >
            <div className="gilt absolute left-[2%] top-0 w-[52%] -rotate-3">
              <div
                className="dpic i1 aspect-[3/4]"
                style={{ backgroundPosition: "center 30%" }}
              />
            </div>
            <div className="gilt absolute right-0 top-[18%] w-[48%] rotate-2">
              <div className="dpic i5 aspect-square" />
            </div>
            <div className="gilt absolute bottom-0 left-[22%] w-[44%] -rotate-1">
              <div
                className="dpic i3 aspect-[4/5]"
                style={{ backgroundPosition: "center 35%" }}
              />
            </div>
          </div>
        </section>

        {/* The Poets Preview */}
        <div className="dorn mx-auto max-w-[80vw] px-[2vw]">
          <span className="disp text-[clamp(1.2rem,2.4vw,2.6rem)]">
            &#10059; The Poets &#10059;
          </span>
        </div>
        <section
          id="poets"
          className="grid gap-8 px-[4vw] py-12 sm:grid-cols-2 lg:grid-cols-4"
        >
          {POETS.slice(0, 8).map((poet) => (
            <PoetCard key={poet.slug} poet={poet} />
          ))}
        </section>
        <div className="text-center pb-8">
          <a href="#/poets" className="dbtn">
            View All {POETS.length} Poets &rarr;
          </a>
        </div>

        {/* The Poems Section */}
        <div className="dorn mx-auto max-w-[80vw] px-[2vw]">
          <span className="disp text-[clamp(1.2rem,2.4vw,2.6rem)]">
            &#10059; The Poems ({filteredPoems.length}) &#10059;
          </span>
        </div>

        <section id="poems" className="px-[4vw] py-12">
          {/* Language Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
            <button
              className="dbtn"
              aria-pressed={selectedLanguage === "all"}
              onClick={() => {
                setSelectedLanguage("all");
                setSelectedEra("all");
                setSelectedPoetSlug("all");
                setVisibleCount(12);
              }}
            >
              All Traditions
            </button>
            <button
              className="dbtn"
              aria-pressed={selectedLanguage === "ar"}
              onClick={() => {
                setSelectedLanguage("ar");
                setSelectedEra("all");
                setSelectedPoetSlug("all");
                setVisibleCount(12);
              }}
            >
              العربية (Arabic Traditions)
            </button>
            <button
              className="dbtn"
              aria-pressed={selectedLanguage === "en"}
              onClick={() => {
                setSelectedLanguage("en");
                setSelectedEra("all");
                setSelectedPoetSlug("all");
                setVisibleCount(12);
              }}
            >
              English Canon
            </button>
          </div>

          {/* Sub-Era Filter Pills */}
          {selectedLanguage === "en" && (
            <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
              {ENGLISH_ERAS.map((era) => (
                <button
                  key={era.id}
                  className={`text-xs py-1 px-3 transition-colors border ${
                    selectedEra === era.id
                      ? "bg-ember text-paper border-ember"
                      : "border-ink/30 hover:border-ember/70 text-ink"
                  }`}
                  onClick={() => {
                    setSelectedEra(era.id);
                    setSelectedPoetSlug("all");
                    setVisibleCount(12);
                  }}
                >
                  {era.label}
                </button>
              ))}
            </div>
          )}

          {selectedLanguage === "ar" && (
            <div className="flex flex-wrap items-center justify-center gap-2 mb-6" dir="rtl">
              {ARABIC_ERAS.map((era) => (
                <button
                  key={era.id}
                  className={`text-xs py-1 px-3 transition-colors border ${
                    selectedEra === era.id
                      ? "bg-ember text-paper border-ember"
                      : "border-ink/30 hover:border-ember/70 text-ink"
                  }`}
                  onClick={() => {
                    setSelectedEra(era.id);
                    setSelectedPoetSlug("all");
                    setVisibleCount(12);
                  }}
                >
                  {era.label}
                </button>
              ))}
            </div>
          )}

          {/* Poet Filter Chips */}
          <div
            className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto"
            id="chips"
          >
            {availableChips.slice(0, 24).map((c) => (
              <button
                key={c.slug}
                className="dbtn text-xs py-1 px-3"
                data-who={c.slug}
                aria-pressed={selectedPoetSlug === c.slug}
                onClick={() => {
                  setSelectedPoetSlug(c.slug);
                  setVisibleCount(12);
                }}
              >
                {c.name}
              </button>
            ))}
          </div>

          {/* Search input */}
          <div className="mx-auto mt-8 max-w-md">
            <label className="sc block text-center text-xs" htmlFor="q">
              Search poem by title, verse, or meter
            </label>
            <div className="relative mt-1">
              <input
                id="q"
                type="search"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setVisibleCount(12);
                }}
                className="w-full border border-ink/60 bg-transparent pl-10 pr-10 py-2.5 text-center italic outline-none focus:border-ember"
                placeholder="Qifa Nabki, Raven, Tawil, Basit, Darwish..."
              />
              <SearchIcon className="absolute left-3.5 top-3 w-4 h-4 text-ink/50 pointer-events-none" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setVisibleCount(12);
                  }}
                  className="absolute right-3 top-2.5 text-ink/60 hover:text-ember p-0.5"
                  title="Clear search"
                >
                  <CloseIcon className="w-4 h-4" />
                </button>
              )}
            </div>
            {searchQuery && (
              <p className="mt-2 text-center text-xs sc text-ember">
                Found {filteredPoems.length} matching poems
              </p>
            )}
          </div>

          {/* Poems grid */}
          <div
            id="grid"
            className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3"
          >
            {paginatedPoems.map((p) => (
              <PoemCard key={p.slug} poem={p} />
            ))}
          </div>

          {/* Pagination / Load More */}
          {visibleCount < filteredPoems.length && (
            <div className="mt-12 text-center">
              <button
                className="dbtn font-bold px-8 py-3 text-xs tracking-wider uppercase transition shadow-sm hover:shadow"
                onClick={() => setVisibleCount((prev) => prev + 12)}
              >
                Load More Masterpieces ({filteredPoems.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </section>

        {/* Dual-Tier Arabic Archive: In-Repo Offline Core & Fuad's 3.85M Cloud Explorer */}
        <section className="px-[4vw] py-16 border-t-2 border-gilt/60 bg-amber-950/5">
          <div className="text-center max-w-4xl mx-auto">
            <p className="sc text-xs text-ember tracking-widest uppercase font-bold">
              Corpus Archive &bull; ديوان العرب الشامل
            </p>
            <h2 className="disp text-[clamp(2.5rem,5.5vw,4.8rem)] text-ink mt-2 leading-tight">
              <i>D</i>iwan <i>A</i>l-<i>A</i>rab &bull; ديوان العرب
            </h2>

            {/* Scale & Cloned HF Repository Banner */}
            <div className="mt-4 flex flex-wrap justify-center items-center gap-3 text-xs">
              <span className="bg-amber-950/10 px-3 py-1.5 rounded-full font-semibold border border-amber-950/20 inline-flex items-center gap-1.5">
                <BookIcon className="w-3.5 h-3.5 text-ember" />
                <span><strong>254,630</strong> قصيدة</span>
              </span>
              <span className="bg-amber-950/10 px-3 py-1.5 rounded-full font-semibold border border-amber-950/20 inline-flex items-center gap-1.5">
                <ScrollIcon className="w-3.5 h-3.5 text-ember" />
                <span><strong>3,857,429</strong> بيت شعري</span>
              </span>
              <span className="bg-amber-950/10 px-3 py-1.5 rounded-full font-semibold border border-amber-950/20 inline-flex items-center gap-1.5">
                <UsersIcon className="w-3.5 h-3.5 text-ember" />
                <span><strong>7,167</strong> شاعر عربي</span>
              </span>
              <a
                href="https://huggingface.co/datasets/fuaf24/arabic-poetry-ashaar"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-ember/15 text-ember hover:bg-ember hover:text-paper transition px-3.5 py-1.5 rounded-full font-bold border border-ember/30 inline-flex items-center gap-1.5"
              >
                <DatasetIcon className="w-3.5 h-3.5" />
                <span>fuaf24/arabic-poetry-ashaar</span>
                <ExternalLinkIcon className="w-3 h-3 opacity-80" />
              </a>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="mt-8 flex justify-center gap-2 border-b border-ink/15 pb-4">
              <button
                type="button"
                onClick={() => setArchiveMode("local")}
                className={`sc px-4 py-2 text-sm font-bold rounded-sm border transition flex items-center gap-2 ${
                  archiveMode === "local"
                    ? "bg-ink text-paper border-ink shadow"
                    : "border-ink/20 hover:border-ember text-ink/80 hover:text-ink"
                }`}
              >
                <SparkIcon className="w-4 h-4 text-ember" />
                <span>المستودع الفوري المحلي (In-Repo Core &bull; 0ms)</span>
              </button>
              <button
                type="button"
                onClick={handleSwitchToCloud}
                className={`sc px-4 py-2 text-sm font-bold rounded-sm border transition flex items-center gap-2 ${
                  archiveMode === "cloud"
                    ? "bg-ember text-paper border-ember shadow"
                    : "border-ember/30 text-ember hover:bg-ember/10"
                }`}
              >
                <GlobeIcon className="w-4 h-4" />
                <span>خزانة ديوان فؤاد (Fuad&apos;s 3.85M Corpus &bull; 254K)</span>
              </button>
            </div>
          </div>

          {/* TAB 1: LOCAL IN-REPO CORE */}
          {archiveMode === "local" && (
            <div className="max-w-4xl mx-auto mt-6 text-center">
              <p className="italic text-sm sm:text-base opacity-80 leading-relaxed max-w-2xl mx-auto">
                بحث فوري ومباشر في مستودع أمهات القصائد المخزن محلياً داخل المشروع — بدون استدعاء أي خوادم خارجية <strong>(Zero External API Calls)</strong> عبر 14 عصراً تاريخياً وشعراء المعلقات والدواوين الكلاسيكية.
              </p>

              {/* Metrical Filter Chips */}
              <div className="mt-5 flex flex-wrap justify-center gap-1.5 text-xs">
                <span className="sc mr-1 text-ink/70 self-center">البحر:</span>
                {[
                  { id: "all", label: "كل البحور (All)" },
                  { id: "الطويل", label: "الطويل" },
                  { id: "الكامل", label: "الكامل" },
                  { id: "البسيط", label: "البسيط" },
                  { id: "الوافر", label: "الوافر" },
                  { id: "الخفيف", label: "الخفيف" },
                  { id: "الرمل", label: "الرمل" },
                  { id: "المتقارب", label: "المتقارب" },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setArchiveMeter(m.id);
                      runInstantArchiveSearch(archiveQuery, m.id);
                    }}
                    className={`sc px-2.5 py-1 rounded-sm border transition text-xs ${
                      archiveMeter === m.id
                        ? "bg-ember text-paper border-ember font-bold shadow-sm"
                        : "border-ink/20 hover:border-ember text-ink"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              <form onSubmit={searchLiveArchive} className="mt-6 flex flex-wrap gap-2 justify-center">
                <div className="relative w-full max-w-lg">
                  <input
                    type="search"
                    value={archiveQuery}
                    onChange={(e) => {
                      const val = e.target.value;
                      setArchiveQuery(val);
                      runInstantArchiveSearch(val, archiveMeter);
                    }}
                    placeholder="ابحث فورياً بالاسم، الشطر، أو العصر (المتنبي، قفا نبك، دمشق...)"
                    className="w-full border-2 border-ember/60 bg-paper/80 pl-10 pr-10 py-2.5 text-center italic text-ink outline-none focus:border-ember focus:bg-paper"
                  />
                  <SearchIcon className="absolute left-3.5 top-3.5 w-4 h-4 text-ink/50 pointer-events-none" />
                  {archiveQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setArchiveQuery("");
                        runInstantArchiveSearch("", archiveMeter);
                      }}
                      className="absolute right-3.5 top-3 text-ink/60 hover:text-ember p-0.5"
                      title="مسح"
                    >
                      <CloseIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <button type="submit" className="dbtn font-bold px-6 py-2.5" disabled={archiveSearching}>
                  {archiveSearching ? "جاري البحث..." : "بحث فوري"}
                </button>
              </form>

              {archiveSearched && (
                <div className="mt-12 max-w-6xl mx-auto text-left">
                  <div className="flex items-center justify-between border-b border-amber-950/20 pb-2 mb-6 text-xs">
                    <span className="sc text-ember font-bold uppercase tracking-wider">
                      نتائج المستودع المحلي المخزن ({archiveResults.length} قصيدة)
                    </span>
                    <span className="italic opacity-70">100% In-Repo Local Query &bull; 0ms Latency</span>
                  </div>

                  {archiveResults.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {archiveResults.map((res, i) => (
                        <div key={i} className="mat flex flex-col justify-between p-5 bg-amber-950/5 border border-amber-950/15 rounded-sm hover:border-ember transition">
                          <div>
                            <div className="flex items-center justify-between text-xs opacity-80 border-b border-ink/10 pb-1.5 mb-2">
                              <span className="sc uppercase text-ember font-bold">{res.source}</span>
                              {res.meter && <span className="ar font-semibold text-ink/90 bg-amber-950/10 px-2 py-0.5 rounded">{res.meter}</span>}
                            </div>
                            <h3 className="disp text-xl mt-1 leading-snug text-ink font-bold">{res.title}</h3>
                            <p className="sc text-sm mt-1 text-ember font-medium">{res.poet}</p>
                            <div className="mt-4 space-y-2 text-sm opacity-90 border-t border-ink/10 pt-3" dir="rtl">
                              {res.lines.map((ln, idx) => {
                                const parts = ln.split("||");
                                return (
                                  <p key={idx} className="leading-relaxed">
                                    {parts.length === 2 ? (
                                      <>
                                        <span>{parts[0].trim()}</span>
                                        <span className="text-ember mx-1.5">&#10059;</span>
                                        <span>{parts[1].trim()}</span>
                                      </>
                                    ) : (
                                      ln
                                    )}
                                  </p>
                                );
                              })}
                            </div>
                          </div>
                          <div className="mt-4 pt-2 border-t border-ink/10 text-xs opacity-60 flex justify-between">
                            <span>{res.era || "العصر الذهبي"}</span>
                            <span>مستودع ديوان العرب المحلي</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    !archiveSearching && (
                      <p className="text-center italic opacity-75 py-8 text-base">
                        لم يتم العثور على نتائج تطابق &ldquo;{archiveQuery}&rdquo;. جرب اسم شاعر آخر أو بحراً شعرياً مختلفاً.
                      </p>
                    )
                  )}
                </div>
              )}

              {/* Callout to Fuad's Cloud Archive */}
              <div className="mt-12 p-6 bg-ember/5 border border-ember/20 rounded text-center max-w-2xl mx-auto">
                <p className="font-semibold text-ink text-sm sm:text-base">
                  تريد تصفح الـ 3.85 مليون بيت شعري و254 ألف قصيدة بالكامل؟
                </p>
                <p className="text-xs text-ink/75 mt-1">
                  تم استنساخ أضخم أرشيف للشعر العربي في حسابك الشخصي على Hugging Face ويمكنك تصفحه فورياً الآن.
                </p>
                <button
                  type="button"
                  onClick={handleSwitchToCloud}
                  className="mt-3 dbtn font-bold px-5 py-2.5 text-xs uppercase inline-flex items-center gap-2"
                >
                  <GlobeIcon className="w-4 h-4" />
                  <span>فتح متصفح سحابة ديوان فؤاد (3.85M بيت) &rarr;</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: FUAD'S 3.85M CORPUS CLOUD EXPLORER */}
          {archiveMode === "cloud" && (
            <div className="max-w-6xl mx-auto mt-6">
              <div className="text-center max-w-2xl mx-auto mb-8">
                <p className="italic text-sm sm:text-base opacity-85 leading-relaxed">
                  تصفح مباشر لقاعدة بيانات الشعر العربي المستنسخة على حساب فؤاد <strong>(fuaf24/arabic-poetry-ashaar)</strong> تضم أكثر من 254,630 قصيدة و3.85 مليون بيت شعري عبر 7,167 شاعراً عربياً.
                </p>

                {/* Meter filter chips */}
                <div className="mt-4 flex flex-wrap justify-center gap-1.5 text-xs">
                  <span className="sc mr-1 text-ink/70 self-center">البحر الشعري:</span>
                  {[
                    { id: "all", label: "كل البحور" },
                    { id: "الطويل", label: "بحر الطويل" },
                    { id: "الكامل", label: "بحر الكامل" },
                    { id: "البسيط", label: "بحر البسيط" },
                    { id: "الوافر", label: "بحر الوافر" },
                    { id: "الخفيف", label: "بحر الخفيف" },
                    { id: "الرمل", label: "بحر الرمل" },
                    { id: "المتقارب", label: "بحر المتقارب" },
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => {
                        setCloudMeter(m.id);
                        loadCloudPage(0, m.id);
                      }}
                      className={`sc px-2.5 py-1 rounded-sm border transition text-xs ${
                        cloudMeter === m.id
                          ? "bg-ember text-paper border-ember font-bold shadow-sm"
                          : "border-ink/20 hover:border-ember text-ink"
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>

                {/* Pagination Controls */}
                <div className="mt-6 flex items-center justify-center gap-4 text-xs font-semibold">
                  <button
                    type="button"
                    disabled={cloudOffset <= 0 || cloudLoading}
                    onClick={() => loadCloudPage(Math.max(0, cloudOffset - cloudLimit))}
                    className="px-3 py-1.5 border border-ink/20 rounded disabled:opacity-40 hover:border-ember transition"
                  >
                    &laquo; الصفحة السابقة (-12)
                  </button>
                  <span className="text-ink/80 sc">
                    القصائد <strong>{cloudOffset + 1}</strong> &ndash; <strong>{cloudOffset + (cloudData?.returned || 12)}</strong> من أصل <strong>{cloudData?.totalCorpusPoems?.toLocaleString() || "254,630"}</strong>
                  </span>
                  <button
                    type="button"
                    disabled={cloudLoading}
                    onClick={() => loadCloudPage(cloudOffset + cloudLimit)}
                    className="px-3 py-1.5 border border-ink/20 rounded disabled:opacity-40 hover:border-ember transition"
                  >
                    الصفحة التالية (+12) &raquo;
                  </button>
                </div>
              </div>

              {/* Cloud Items Grid */}
              {cloudLoading ? (
                <div className="py-16 text-center">
                  <div className="inline-block w-8 h-8 border-2 border-ember border-t-transparent rounded-full animate-spin mb-3" />
                  <p className="italic text-sm text-ink/70">جاري بث القصائد من مستودع fuaf24 على Hugging Face...</p>
                </div>
              ) : cloudData && cloudData.poems.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {cloudData.poems.map((poem) => (
                    <div
                      key={poem.id}
                      className="mat flex flex-col justify-between p-5 bg-amber-950/5 border border-amber-950/15 rounded-sm hover:border-ember hover:shadow-md transition"
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs opacity-80 border-b border-ink/10 pb-1.5 mb-2">
                          <span className="sc uppercase text-ember font-bold text-[10px]">
                            {poem.theme || "ديوان العرب"}
                          </span>
                          <span className="ar font-semibold text-ink/90 bg-amber-950/10 px-2 py-0.5 rounded text-[11px]">
                            بحر {poem.meter}
                          </span>
                        </div>
                        <h3 className="disp text-lg mt-1 leading-snug text-ink font-bold line-clamp-2">
                          {poem.title}
                        </h3>
                        <p className="sc text-sm mt-0.5 text-ember font-medium">
                          {poem.poet}
                        </p>

                        {/* Verses Couplets Preview */}
                        <div className="mt-4 space-y-2 text-sm opacity-90 border-t border-ink/10 pt-3" dir="rtl">
                          {poem.couplets.slice(0, 3).map((couplet, cIdx) => {
                            const parts = couplet.split("||");
                            return (
                              <p key={cIdx} className="leading-relaxed">
                                {parts.length === 2 ? (
                                  <>
                                    <span>{parts[0].trim()}</span>
                                    <span className="text-ember mx-1.5">&#10059;</span>
                                    <span>{parts[1].trim()}</span>
                                  </>
                                ) : (
                                  couplet
                                )}
                              </p>
                            );
                          })}
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-ink/10 flex items-center justify-between gap-2">
                        <span className="text-[11px] opacity-60">{poem.era}</span>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleCopyPoem(poem.couplets.join("\n"), poem.title)}
                            className="text-xs px-2.5 py-1 border border-ink/20 rounded hover:border-ember transition inline-flex items-center gap-1"
                            title="نسخ الأبيات"
                          >
                            <CopyIcon className="w-3 h-3 text-ink/70" />
                            <span>نسخ</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveCloudPoemModal(poem)}
                            className="text-xs px-2.5 py-1 bg-ember text-paper font-semibold rounded hover:bg-ember/90 transition"
                          >
                            عرض كامل ({poem.totalVerses} شطر)
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <p className="italic text-ink/70">انقر على زر استعراض السحابة للبدء في تصفح الـ 254 ألف قصيدة.</p>
                  <button
                    type="button"
                    onClick={() => loadCloudPage(0, cloudMeter)}
                    className="mt-3 dbtn font-bold px-6 py-2"
                  >
                    تحميل القصائد الآن
                  </button>
                </div>
              )}
            </div>
          )}

          {/* FULL POEM MODAL VIEWER */}
          {activeCloudPoemModal && (
            <div
              role="dialog"
              aria-modal="true"
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm"
              onClick={() => setActiveCloudPoemModal(null)}
            >
              <div
                className="relative bg-paper border-2 border-gilt max-w-2xl w-full max-h-[85vh] flex flex-col rounded-sm shadow-2xl p-6 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-start justify-between border-b border-ink/15 pb-4 mb-4">
                  <div>
                    <span className="sc text-xs text-ember font-bold uppercase tracking-wider">
                      بحر {activeCloudPoemModal.meter} &bull; {activeCloudPoemModal.era}
                    </span>
                    <h3 className="disp text-2xl font-bold text-ink mt-1">
                      {activeCloudPoemModal.title}
                    </h3>
                    <p className="sc text-base text-ember font-medium mt-0.5">
                      {activeCloudPoemModal.poet}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveCloudPoemModal(null)}
                    className="text-ink/60 hover:text-ink p-1 rounded hover:bg-amber-950/10 transition"
                    aria-label="إغلاق"
                  >
                    <CloseIcon className="w-5 h-5" />
                  </button>
                </div>

                {/* Poet Bio snippet if available */}
                {activeCloudPoemModal.poetBio && (
                  <p className="text-xs italic bg-amber-950/5 p-3 rounded border border-ink/10 mb-4 text-ink/80 leading-relaxed" dir="rtl">
                    {activeCloudPoemModal.poetBio}
                  </p>
                )}

                {/* Scrollable Verses */}
                <div className="overflow-y-auto flex-1 space-y-3 pr-2 text-right" dir="rtl">
                  {activeCloudPoemModal.couplets.map((couplet, idx) => {
                    const parts = couplet.split("||");
                    return (
                      <div
                        key={idx}
                        className="py-1.5 border-b border-ink/5 last:border-b-0 text-sm sm:text-base leading-relaxed hover:bg-amber-950/5 px-2 rounded transition"
                      >
                        <span className="text-xs text-ember/60 ml-2 select-none font-mono">
                          [{idx + 1}]
                        </span>
                        {parts.length === 2 ? (
                          <>
                            <span className="font-medium">{parts[0].trim()}</span>
                            <span className="text-ember mx-2">&#10059;</span>
                            <span className="font-medium">{parts[1].trim()}</span>
                          </>
                        ) : (
                          <span>{couplet}</span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between border-t border-ink/15 pt-4 mt-4 text-xs">
                  <span className="opacity-70">
                    مستودع: <strong>fuaf24/arabic-poetry-ashaar</strong>
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopyPoem(activeCloudPoemModal.couplets.join("\n"), activeCloudPoemModal.title)}
                      className="dbtn text-xs py-1.5 px-4 inline-flex items-center gap-1.5"
                    >
                      {copied ? (
                        <>
                          <CheckIcon className="w-3.5 h-3.5" />
                          <span>تم النسخ</span>
                        </>
                      ) : (
                        <>
                          <CopyIcon className="w-3.5 h-3.5" />
                          <span>نسخ القصيدة كاملة</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveCloudPoemModal(null)}
                      className="px-4 py-1.5 border border-ink/30 rounded text-ink hover:border-ink transition"
                    >
                      إغلاق
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </>
    );
  }

  return (
    <main>
      {routeType === "poem" && routeParam && renderPoemView(routeParam)}
      {routeType === "poet" && routeParam && renderPoetView(routeParam)}
      {routeType === "poets" && renderPoetsListView()}
      {routeType === "about" && renderAboutView()}
      {routeType === "poems" && renderHomeView()}
      {routeType !== "poem" &&
        routeType !== "poet" &&
        routeType !== "poets" &&
        routeType !== "about" &&
        routeType !== "poems" &&
        renderHomeView()}
    </main>
  );
}
