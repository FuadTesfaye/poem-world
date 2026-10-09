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

export default function Diwan({ routeParts, hidden = false }: DiwanProps) {
  const [selectedPoetSlug, setSelectedPoetSlug] = useState<string>("all");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all");
  const [selectedEra, setSelectedEra] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [poetSearchQuery, setPoetSearchQuery] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [visibleCount, setVisibleCount] = useState<number>(12);

  const routeType = routeParts[0] || "poems";
  const routeParam = routeParts[1];

  // Filtered poems for poems catalog
  const filteredPoems = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return POEMS.filter((p) => {
      const poetObj = getPoet(p.poet);
      if (selectedPoetSlug !== "all" && p.poet !== selectedPoetSlug) return false;
      if (selectedLanguage !== "all" && p.language !== selectedLanguage) return false;
      if (selectedEra !== "all" && p.era !== selectedEra) return false;
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
      if (selectedEra !== "all" && poet.era !== selectedEra) return false;
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

  if (hidden) return null;

  function handleCopyPoem(text: string) {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      const clean = text.replace(/\|\|/g, "—");
      navigator.clipboard.writeText(clean);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  }

  function renderFrameFor(p: Poem) {
    if (p.frame === "carved") {
      return (
        <div className="carved">
          <div className="dwin">
            <div
              className={`dpic ${p.img}`}
              style={{ backgroundPosition: p.pos }}
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
        <div
          className={`dpic ${p.img} aspect-square w-full`}
          style={{
            backgroundPosition: p.pos,
            boxShadow: "0 22px 30px -14px rgba(52,25,10,.6)",
          }}
          role="img"
          aria-label={p.plate}
        />
      );
    }
    const arMap: Record<string, string> = {
      i1: "aspect-[3/4]",
      i2: "aspect-[4/3]",
      i3: "aspect-[4/5]",
      i4: "aspect-[2/3]",
      i5: "aspect-square",
      i6: "aspect-square",
    };
    const ar = arMap[p.img] || "aspect-[3/4]";
    return (
      <div className="gilt">
        <div
          className={`dpic ${p.img} ${ar} w-full`}
          style={{ backgroundPosition: p.pos }}
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
              {po && <a href={`#/poet/${po.slug}`}>{po.name}</a>}
            </nav>

            <h1
              className="disp mt-4 text-[clamp(2.4rem,6vw,5.5rem)]"
              dangerouslySetInnerHTML={{ __html: p.title }}
            />
            {p.titleAr && (
              <p className="ar mt-2 text-[clamp(1.8rem,4vw,3.2rem)] text-ember">
                {p.titleAr}
              </p>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
              {po && (
                <a className="sc text-lg text-ember" href={`#/poet/${po.slug}`}>
                  {po.name}
                </a>
              )}
              {po?.ar && (
                <span className="ar text-xl opacity-90">{po.ar}</span>
              )}
              <span className="sc text-xs opacity-70">
                &bull; {p.era}
              </span>
              {p.meter && (
                <span className="tag ar text-sm text-ember bg-amber-950/10">
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

            {p.orig && (
              <p className="note mt-6 text-sm">
                <strong className="sc">In the spirit of {poetName}.</strong> This is an original poem, not a poem by {poetName}. His own poems are under copyright and can&rsquo;t be reproduced here.
              </p>
            )}

            <div className="dorn mt-8">
              <span className="text-xl text-ember">&#10086;</span>
            </div>

            {/* Verses rendering */}
            <div className="poem mt-8" id="poem-text">
              {isArabic ? (
                <div className="bayt-list" dir="rtl">
                  {p.text.split("\n\n").map((stanza, sIdx) => (
                    <div key={sIdx} className="space-y-2">
                      {stanza.split("\n").map((baytLine, bIdx) => {
                        const parts = baytLine.split("||");
                        const sadr = parts[0]?.trim();
                        const ajuz = parts[1]?.trim();
                        return (
                          <div key={bIdx} className="bayt-row">
                            <span className="bayt-sadr">{sadr}</span>
                            {ajuz && <span className="bayt-separator">&#10086;</span>}
                            {ajuz && <span className="bayt-ajuz">{ajuz}</span>}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              ) : (
                p.text.split("\n\n").map((stanza, sIdx) => {
                  const lines = stanza.split("\n");
                  return (
                    <p key={sIdx} className={sIdx === 0 ? "ddrop" : ""}>
                      {lines.map((line, lIdx) => (
                        <React.Fragment key={lIdx}>
                          <span dangerouslySetInnerHTML={{ __html: line }} />
                          {lIdx < lines.length - 1 && <br />}
                        </React.Fragment>
                      ))}
                    </p>
                  );
                })
              )}
            </div>

            <div className="dorn mt-8">
              <span className="text-xl text-ember">&#10086;</span>
            </div>

            <div className="mat mt-8">
              <div className="flex items-center justify-between">
                <h2 className="sc text-sm">About this poem</h2>
                <button
                  type="button"
                  onClick={() => handleCopyPoem(p.text)}
                  className="sc text-xs text-ember underline underline-offset-4 cursor-pointer hover:text-ink"
                >
                  {copied ? "Verses copied!" : "Copy verses"}
                </button>
              </div>
              <p className="mt-2 italic">{p.about}</p>
            </div>

            <div className="mt-10 flex flex-wrap justify-between gap-4">
              <a className="dbtn" href={`#/poem/${prevPoem.slug}`}>
                &larr; Previous ({stripTags(prevPoem.title)})
              </a>
              <a className="dbtn" href={`#/poem/${nextPoem.slug}`}>
                Next ({stripTags(nextPoem.title)}) &rarr;
              </a>
            </div>
          </div>
        </article>

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

    return (
      <>
        <section className="grid items-center gap-10 px-[4vw] pt-10 md:grid-cols-[.8fr_1.2fr]">
          <div className="mx-auto w-full max-w-[420px]">
            <div className="gilt">
              <div
                className={`dpic ${p.img} aspect-[4/5]`}
                style={{ backgroundPosition: p.pos }}
                role="img"
                aria-label={`Artwork for ${p.name}`}
              />
            </div>
          </div>
          <div>
            <nav className="sc text-xs">
              <a href="#/poems">Diwan</a> &nbsp;/&nbsp;{" "}
              <a href="#/poets">Poets</a>
            </nav>
            <h1 className="disp mt-4 text-[clamp(2.8rem,7vw,7rem)]">{p.name}</h1>
            {p.ar && <p className="ar text-[clamp(2.2rem,4.5vw,3.8rem)] text-ember">{p.ar}</p>}
            <p className="sc mt-2 text-lg">
              {p.years} &nbsp;&middot;&nbsp; {p.place} &nbsp;&middot;&nbsp; {p.era}
            </p>
            <p className="mt-2 text-xl italic">{p.tag}</p>
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
                className={i === 0 ? "ddrop" : ""}
                dangerouslySetInnerHTML={{ __html: b }}
              />
            ))}
          </div>
          <aside className="mat self-start">
            <h2 className="sc text-sm">Selected works &amp; collections</h2>
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
              More poems from this author are being transcribed into the illuminated archive.
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
          <h1 className="disp mt-2 text-[clamp(3.5rem,8vw,7.5rem)]">
            <i>T</i>he <i>P</i>oets
          </h1>
          <p className="mt-4 italic text-lg opacity-85">
            Cross centuries and empires: the pre-Islamic desert wanderers, the court masters of Baghdad and Aleppo, the Romantic visionaries, and the voices of modern memory.
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
              placeholder="Mutanabbi, Poe, Keats, Darwish..."
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              className="dbtn"
              aria-pressed={selectedLanguage === "all"}
              onClick={() => setSelectedLanguage("all")}
            >
              All Traditions
            </button>
            <button
              className="dbtn"
              aria-pressed={selectedLanguage === "ar"}
              onClick={() => setSelectedLanguage("ar")}
            >
              العربية (Arabic)
            </button>
            <button
              className="dbtn"
              aria-pressed={selectedLanguage === "en"}
              onClick={() => setSelectedLanguage("en")}
            >
              English
            </button>
          </div>
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
        <h1 className="disp text-[clamp(3rem,8vw,7rem)]">
          <i>A</i>bout
        </h1>
        <div className="mt-6 space-y-5">
          <p className="ddrop">
            <em>Diwan</em> is the Arabic word for a collected book of poems, and also for a hall where people gather to listen. This sanctuary unites the greatest voices of human longing across classical Arabic, the pre-Islamic Golden Mu‘allaqat, English Romanticism, and the Renaissance.
          </p>
          <p>
            Sourced and enriched with reference to the <strong>Arabic Poetry Treebank (ArPoT)</strong>, the <strong>Aldiwan corpus</strong>, and the <strong>PoetryDB library</strong>, every verse is set within illuminated borders, honoring the antique art of the manuscript.
          </p>
          <p>
            Each poem and poet possesses a dedicated URL address (such as <code>#/poet/al-mutanabbi</code> or <code>#/poem/the-raven</code>) allowing effortless sharing and contemplation.
          </p>
        </div>
        <a className="dbtn mt-8" href="#/poems">
          Back to the poems
        </a>
      </section>
    );
  }

  // 5. Home / All Poems View
  function renderHomeView() {
    const allChips = [{ slug: "all", name: "All poets" }, ...POETS];
    const paginatedPoems = filteredPoems.slice(0, visibleCount);

    return (
      <>
        <section className="relative grid items-center gap-10 px-[4vw] pb-16 pt-10 md:grid-cols-[1.1fr_1fr]">
          <div className="drise">
            <p className="sc text-sm">A house of poems, bound in gold</p>
            <h1 className="disp dink mt-3 text-[clamp(5rem,15vw,15rem)]">
              <i>D</i>iwan
            </h1>
            <p className="mt-6 max-w-lg text-[1.2em] italic">
              From the thunder of desert chivalry to Shakespeare&rsquo;s summer, Keats&rsquo;s urn, Poe&rsquo;s raven, and Darwish&rsquo;s country of memory.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="#/poems/list" className="dbtn">
                Browse Poems
              </a>
              <a href="#/poets" className="dbtn">
                All Poets ({POETS.length})
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
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            <button
              className="dbtn"
              aria-pressed={selectedLanguage === "all"}
              onClick={() => {
                setSelectedLanguage("all");
                setVisibleCount(12);
              }}
            >
              All Languages
            </button>
            <button
              className="dbtn"
              aria-pressed={selectedLanguage === "ar"}
              onClick={() => {
                setSelectedLanguage("ar");
                setVisibleCount(12);
              }}
            >
              العربية (Arabic)
            </button>
            <button
              className="dbtn"
              aria-pressed={selectedLanguage === "en"}
              onClick={() => {
                setSelectedLanguage("en");
                setVisibleCount(12);
              }}
            >
              English
            </button>
          </div>

          {/* Poet Filter Chips */}
          <div
            className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto"
            id="chips"
          >
            {allChips.map((c) => (
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
              Search by title, theme, meter or lines
            </label>
            <input
              id="q"
              type="search"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setVisibleCount(12);
              }}
              className="mt-1 w-full border border-ink/60 bg-transparent px-4 py-2 text-center italic outline-none focus:border-ember"
              placeholder="The Raven, قفا نبك, love, exile..."
            />
          </div>

          {/* Grid */}
          <div
            id="grid"
            className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3"
          >
            {paginatedPoems.length > 0 ? (
              paginatedPoems.map((p) => <PoemCard key={p.slug} poem={p} />)
            ) : (
              <p className="col-span-full text-center italic py-8">
                No poems match that search. Try another word or reset filters.
              </p>
            )}
          </div>

          {/* Load More Button */}
          {visibleCount < filteredPoems.length && (
            <div className="mt-12 text-center">
              <button
                type="button"
                className="dbtn"
                onClick={() => setVisibleCount((prev) => prev + 12)}
              >
                Load More Poems ({filteredPoems.length - visibleCount} remaining) &rarr;
              </button>
            </div>
          )}
        </section>
      </>
    );
  }

  return (
    <div id="diwan">
      <header className="relative z-10 flex flex-wrap items-center justify-between gap-4 px-[4vw] py-6">
        <a
          href="#/poems"
          className="disp text-4xl normal-case"
          aria-label="Diwan, poems home"
        >
          <i>D</i>iwan
        </a>
        <nav className="sc flex flex-wrap gap-x-8 gap-y-1 text-sm" aria-label="Poetry">
          <a href="#/poems">Poems</a>
          <a href="#/poets">Poets</a>
          <a href="#/about">About</a>
          <a href="#/">Art-Nature</a>
        </nav>
      </header>

      <main id="app" tabIndex={-1} className="relative z-10 outline-none">
        {routeType === "poem" && routeParam
          ? renderPoemView(routeParam)
          : routeType === "poet" && routeParam
          ? renderPoetView(routeParam)
          : routeType === "poets"
          ? renderPoetsListView()
          : routeType === "about"
          ? renderAboutView()
          : renderHomeView()}
      </main>

      <footer className="sc relative z-10 mt-24 border-t-4 border-double border-ink/60 px-[4vw] py-8 text-center text-sm">
        <span className="disp text-3xl normal-case">
          <i>D</i>iwan
        </span>
        <br />
        <a href="#/" className="underline underline-offset-4">
          Back to Art-Nature
        </a>
        <br />
        Featuring masterworks from the Classical Arabic tradition, the ArPoT Treebank, the Aldiwan corpus, and PoetryDB.
        <br />
        &copy; MMXXVI &middot; Diwan
      </footer>
    </div>
  );
}
