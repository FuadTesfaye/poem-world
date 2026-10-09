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
  source: "qafiyah" | "poetrydb";
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
  const [visibleCount, setVisibleCount] = useState<number>(12);

  // Global Live Archive Bridge State
  const [archiveQuery, setArchiveQuery] = useState<string>("");
  const [archiveSearching, setArchiveSearching] = useState<boolean>(false);
  const [archiveResults, setArchiveResults] = useState<ExternalResult[]>([]);
  const [archiveSearched, setArchiveSearched] = useState<boolean>(false);

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

  function handleCopyPoem(text: string) {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      const clean = text.replace(/\|\|/g, "—");
      navigator.clipboard.writeText(clean);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  }

  // Live Archive Search (Qafiyah & PoetryDB)
  async function searchLiveArchive(e: React.FormEvent) {
    e.preventDefault();
    const query = archiveQuery.trim();
    if (!query) return;

    setArchiveSearching(true);
    setArchiveSearched(true);
    setArchiveResults([]);

    const results: ExternalResult[] = [];
    const isArabicQuery = /[\u0600-\u06FF]/.test(query);

    try {
      if (isArabicQuery || selectedLanguage === "ar") {
        // Query Qafiyah API (over 17,000 poems)
        const res = await fetch(`https://api.qafiyah.com/v1/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          const poems = data.poems?.data || [];
          for (const item of poems.slice(0, 6)) {
            results.push({
              title: item.title || query,
              poet: item.poet?.name || "شاعر عربي",
              meter: item.meter?.name || "بحر كلاسيكي",
              era: item.era?.name || "العصر الذهبي",
              lines: item.text ? item.text.split("\n").slice(0, 4) : [item.preview || ""],
              source: "qafiyah",
            });
          }
        }
      } else {
        // Query PoetryDB (over 3,000 poems)
        const res = await fetch(`https://poetrydb.org/title/${encodeURIComponent(query)}/title,author,lines`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            for (const item of data.slice(0, 6)) {
              results.push({
                title: item.title,
                poet: item.author,
                era: "English Canon",
                lines: Array.isArray(item.lines) ? item.lines.slice(0, 4) : [],
                source: "poetrydb",
              });
            }
          }
        }
      }
    } catch {
      // Graceful fallback if network drops
    } finally {
      setArchiveResults(results);
      setArchiveSearching(false);
    }
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

    return (
      <>
        <article className="grid gap-12 px-[4vw] pt-8 lg:grid-cols-[1fr_1.1fr]">
          <div className="lg:sticky lg:top-6 lg:self-start">
            <div className="mx-auto max-w-[640px]">
              {renderFrameFor(p)}
              <p className="sc mt-5 text-center text-sm opacity-80">
                Plate {ROM[index] || "I"} &mdash; {p.plate}
              </p>
            </div>
          </div>
          <div className="max-w-2xl">
            <nav className="sc text-xs" aria-label="Breadcrumb">
              <a href="#/poems">Diwan</a> &nbsp;/&nbsp;{" "}
              <a href="#/poets">Poets</a> &nbsp;/&nbsp;{" "}
              <a href="#/art" className="text-ember font-medium hover:underline">Art Gallery</a> &nbsp;/&nbsp;{" "}
              {po && <a href={`#/poet/${po.slug}`}>{po.name}</a>}
            </nav>

            <h1
              className="disp mt-4 text-[clamp(2.4rem,6vw,5.5rem)] text-ink leading-tight"
              dangerouslySetInnerHTML={{ __html: p.title }}
            />
            {p.titleAr && (
              <p className="ar mt-2 text-[clamp(1.8rem,4vw,3.2rem)] text-ember font-medium leading-relaxed">
                {p.titleAr}
              </p>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
              {po && (
                <a className="sc text-lg text-ember font-semibold hover:underline" href={`#/poet/${po.slug}`}>
                  {po.name}
                </a>
              )}
              {po?.ar && (
                <span className="ar text-xl text-ink font-normal">{po.ar}</span>
              )}
              <span className="sc text-xs opacity-70">
                &bull; {p.era}
              </span>
              {p.meter && (
                <span className="tag ar text-sm text-ember bg-amber-950/10 font-medium">
                  {p.meter}
                </span>
              )}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              {p.tags.map((t) => (
                <span key={t} className="tag">
                  {t}
                </span>
              ))}
            </div>

            <div className="dorn mt-8">
              <span className="text-xl text-ember">&#10086;</span>
            </div>

            {/* Verses rendering */}
            <div className="poem mt-8" id="poem-text">
              {isArabic ? (
                <div className="bayt-list" dir="rtl">
                  {p.text.split("\n\n").map((stanza, sIdx) => (
                    <div key={sIdx} className="space-y-3 my-4">
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
                  ))}
                </div>
              ) : (
                <div className="space-y-5 text-lg leading-relaxed">
                  {p.text.split("\n\n").map((stanza, sIdx) => (
                    <p
                      key={sIdx}
                      className={sIdx === 0 ? "ddrop whitespace-pre-line" : "whitespace-pre-line"}
                      dangerouslySetInnerHTML={{
                        __html: stanza.replace(/\n/g, "<br/>"),
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Actions: Copy & Details */}
            <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-ink/20 pt-6">
              <button
                className="dbtn text-sm"
                onClick={() => handleCopyPoem(p.text)}
              >
                {copied ? "Copied to parchment ✓" : "Copy Verses"}
              </button>
              {po && (
                <a className="dbtn text-sm" href={`#/poet/${po.slug}`}>
                  All Works by {po.name} &rarr;
                </a>
              )}
            </div>

            {/* Commentary / About */}
            <div className="mat mt-10">
              <h2 className="sc text-sm">About this Masterpiece</h2>
              <p className="mt-2 text-base leading-relaxed opacity-90">{p.about}</p>
            </div>

            {/* Prev / Next Navigation */}
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
            <h1 className="disp mt-4 text-[clamp(2.8rem,7vw,7rem)] text-ink leading-tight">{p.name}</h1>
            {p.ar && <p className="ar text-[clamp(2.2rem,4.5vw,3.8rem)] text-ember font-medium mt-1">{p.ar}</p>}
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
            <input
              id="poet-q"
              type="search"
              value={poetSearchQuery}
              onChange={(e) => setPoetSearchQuery(e.target.value)}
              className="mt-1 w-full border border-ink/60 bg-transparent px-4 py-2 text-center italic outline-none focus:border-ember"
              placeholder="Mutanabbi, Shakespeare, Keats, Darwish, Antarah..."
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              className="dbtn"
              aria-pressed={selectedLanguage === "all"}
              onClick={() => {
                setSelectedLanguage("all");
                setSelectedEra("all");
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
              }}
            >
              العربية (Arabic Canon - 28)
            </button>
            <button
              className="dbtn"
              aria-pressed={selectedLanguage === "en"}
              onClick={() => {
                setSelectedLanguage("en");
                setSelectedEra("all");
              }}
            >
              English Canon (35 Masters)
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
                  onClick={() => setSelectedEra(era.id)}
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
                  onClick={() => setSelectedEra(era.id)}
                >
                  {era.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {filteredPoets.length > 0 ? (
            filteredPoets.map((poet) => <PoetCard key={poet.slug} poet={poet} />)
          ) : (
            <p className="col-span-full text-center italic py-8">
              No poets match your search query. Try another term.
            </p>
          )}
        </div>
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
            Enriched with references to <strong>Qafiyah</strong>, <strong>ArPoT</strong>, <strong>Aldiwan</strong>, <strong>Ashaar</strong>, <strong>LearningMetersPoems</strong>, and <strong>PoetryDB</strong>, every verse is set within illuminated borders honoring antique manuscript art.
          </p>
          <p>
            Engineered with Next.js and Bun, deploying multi-service backends for Arabic meter and poetry classification via ALBERT and GPT-2 models.
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
            <input
              id="q"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mt-1 w-full border border-ink/60 bg-transparent px-4 py-2 text-center italic outline-none focus:border-ember"
              placeholder="Qifa Nabki, Raven, Tawil, Basit, Darwish..."
            />
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
                className="dbtn"
                onClick={() => setVisibleCount((prev) => prev + 12)}
              >
                Load More Masterpieces ({filteredPoems.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </section>

        {/* Live Global Archive Bridge */}
        <section className="px-[4vw] py-16 border-t border-ink/20">
          <div className="text-center max-w-2xl mx-auto">
            <p className="sc text-xs text-ember tracking-widest uppercase">Live Global Archives</p>
            <h2 className="disp text-[clamp(2.4rem,5vw,4.5rem)] text-ink mt-2">
              <i>E</i>xplore 20,000+ <i>P</i>oems
            </h2>
            <p className="italic text-base opacity-85 mt-2">
              Query beyond the curated canon: directly search live records from <strong>Qafiyah</strong> (17,000+ Arabic poems) and <strong>PoetryDB</strong> (3,000+ English poems).
            </p>

            <form onSubmit={searchLiveArchive} className="mt-6 flex flex-wrap gap-2 justify-center">
              <input
                type="search"
                value={archiveQuery}
                onChange={(e) => setArchiveQuery(e.target.value)}
                placeholder="Search archive (e.g., المتنبي, Sonnet, Byron...)"
                className="w-full max-w-md border border-ink/60 bg-transparent px-4 py-2 text-center italic outline-none focus:border-ember"
              />
              <button type="submit" className="dbtn" disabled={archiveSearching}>
                {archiveSearching ? "Consulting Archive..." : "Search Archives"}
              </button>
            </form>
          </div>

          {archiveSearched && (
            <div className="mt-10 max-w-5xl mx-auto">
              {archiveResults.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {archiveResults.map((res, i) => (
                    <div key={i} className="mat flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-xs opacity-75">
                          <span className="sc uppercase text-ember">{res.source}</span>
                          {res.meter && <span className="ar">{res.meter}</span>}
                        </div>
                        <h3 className="disp text-xl mt-2 leading-tight text-ink">{res.title}</h3>
                        <p className="sc text-sm mt-1">{res.poet}</p>
                        <div className="mt-4 space-y-1 text-sm italic opacity-85 border-t border-ink/10 pt-3">
                          {res.lines.map((ln, idx) => (
                            <p key={idx} className="truncate">{ln}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                !archiveSearching && (
                  <p className="text-center italic opacity-75">
                    No archival poems found matching &ldquo;{archiveQuery}&rdquo;. Try another poet or title.
                  </p>
                )
              )}
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
