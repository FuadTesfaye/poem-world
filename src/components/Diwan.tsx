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
  const [searchQuery, setSearchQuery] = useState<string>("");

  const routeType = routeParts[0] || "poems";
  const routeParam = routeParts[1];

  // Filtering for home/poems list
  const filteredPoems = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return POEMS.filter((p) => {
      const poetObj = getPoet(p.poet);
      const poetMatches =
        selectedPoetSlug === "all" || p.poet === selectedPoetSlug;
      if (!poetMatches) return false;
      if (!q) return true;
      const haystack = (
        stripTags(p.title) +
        " " +
        (poetObj ? poetObj.name : "") +
        " " +
        p.tags.join(" ") +
        " " +
        stripTags(p.text)
      ).toLowerCase();
      return haystack.includes(q);
    });
  }, [selectedPoetSlug, searchQuery]);

  if (hidden) return null;

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
      i3: "aspect-[4/5]",
      i4: "aspect-[2/3]",
      i5: "aspect-square",
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
    const morePoems = POEMS.filter((x) => x.poet === p.poet && x !== p);
    const stanzas = p.text.split(/\n\n/);

    return (
      <>
        <article className="grid gap-12 px-[4vw] pt-8 lg:grid-cols-[1fr_1.1fr]">
          <div className="lg:sticky lg:top-6 lg:self-start">
            <div className="mx-auto max-w-[640px]">
              {renderFrameFor(p)}
              <p className="sc mt-5 text-center text-sm opacity-80">
                Plate {ROM[index]} &mdash; {p.plate}
              </p>
            </div>
          </div>
          <div className="max-w-2xl">
            <nav className="sc text-xs" aria-label="Breadcrumb">
              <a href="#/poems">Diwan</a> &nbsp;/&nbsp;{" "}
              {po && <a href={`#/poet/${po.slug}`}>{po.name}</a>}
            </nav>
            <h1
              className="disp mt-4 text-[clamp(2.4rem,6vw,5.5rem)]"
              dangerouslySetInnerHTML={{ __html: p.title }}
            />
            <p className="mt-3">
              {po && (
                <a className="sc text-lg text-ember" href={`#/poet/${po.slug}`}>
                  {po.name}
                </a>
              )}
              {po?.ar && (
                <>
                  {" "}&nbsp;<span className="ar text-xl">{po.ar}</span>
                </>
              )}
            </p>
            <p className="mt-3">
              {p.tags.map((t) => (
                <span key={t} className="tag mr-1">
                  {t}
                </span>
              ))}
            </p>
            {p.orig && (
              <p className="note mt-6 text-sm">
                <strong className="sc">In the spirit of {poetName}.</strong> This is an original poem, not a poem by {poetName}. His own poems are under copyright and can&rsquo;t be reproduced here.
              </p>
            )}
            <div className="dorn mt-8">
              <span className="text-xl text-ember">&#10086;</span>
            </div>
            <div className="poem mt-8" id="poem-text">
              {stanzas.map((stanza, sIdx) => {
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
              })}
            </div>
            <div className="dorn">
              <span className="text-xl text-ember">&#10086;</span>
            </div>
            <div className="mat mt-8">
              <h2 className="sc text-sm">About this poem</h2>
              <p className="mt-2 italic">{p.about}</p>
            </div>
            <div className="mt-10 flex flex-wrap justify-between gap-4">
              <a className="dbtn" href={`#/poem/${prevPoem.slug}`}>
                &larr; Previous
              </a>
              <a className="dbtn" href={`#/poem/${nextPoem.slug}`}>
                Next &rarr;
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

  function renderPoetView(slug: string) {
    const p = getPoet(slug);
    if (!p) {
      return renderHomeView();
    }
    const mine = POEMS.filter((x) => x.poet === p.slug);

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
              <a href="#/poems">Diwan</a> &nbsp;/&nbsp; Poets
            </nav>
            <h1 className="disp mt-4 text-[clamp(2.8rem,7vw,7rem)]">{p.name}</h1>
            {p.ar && <p className="ar text-[clamp(2rem,4vw,3.6rem)]">{p.ar}</p>}
            <p className="sc mt-2 text-lg">
              {p.years} &nbsp;&middot;&nbsp; {p.place}
            </p>
            <p className="mt-2 text-xl italic">{p.tag}</p>
            <p className="mt-5">
              {p.themes.map((t) => (
                <span key={t} className="tag mr-1">
                  {t}
                </span>
              ))}
            </p>
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
            <h2 className="sc text-sm">Selected works</h2>
            <ul className="mt-3 list-none space-y-2 p-0 italic">
              {p.works.map((w, i) => (
                <li key={i}>&#10086; {w}</li>
              ))}
            </ul>
          </aside>
        </section>

        {p.sayings && (
          <section className="px-[4vw] pb-14">
            <div className="dorn mx-auto max-w-[70vw]">
              <span className="disp text-2xl">In his spirit</span>
            </div>
            <p className="mx-auto mt-4 max-w-xl text-center text-sm italic opacity-80">
              Original sayings written for this page on his themes. They are not quotations from Darwish.
            </p>
            <div className="mt-8 grid gap-8 sm:grid-cols-2">
              {p.sayings.map((s, i) => (
                <blockquote key={i} className="mat m-0 text-center">
                  <p className="disp m-0 text-[clamp(1.3rem,2vw,2.2rem)] normal-case leading-snug text-ink">
                    &ldquo;{s}&rdquo;
                  </p>
                </blockquote>
              ))}
            </div>
          </section>
        )}

        <section className="px-[4vw]">
          <div className="dorn mx-auto max-w-[70vw]">
            <span className="disp text-2xl">Poems</span>
          </div>
          <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {mine.map((m) => (
              <PoemCard key={m.slug} poem={m} />
            ))}
          </div>
        </section>
      </>
    );
  }

  function renderAboutView() {
    return (
      <section className="mx-auto max-w-2xl px-[4vw] pt-12">
        <h1 className="disp text-[clamp(3rem,8vw,7rem)]">
          <i>A</i>bout
        </h1>
        <div className="mt-6 space-y-5">
          <p className="ddrop">
            <em>Diwan</em> is the Arabic word for a collected book of poems, and also for a room where people sit and listen. This is a small room of both.
          </p>
          <p>
            The poems by Shakespeare, Blake and Dickinson are in the public domain. The three poems attributed &ldquo;in the spirit of&rdquo; Mahmoud Darwish are original works written for this page on his themes: homeland, exile, love and memory. They are not his words, and his own poems are protected by copyright.
          </p>
          <p>
            Each poem has its own page and address, such as <code>#/poem/sonnet-18</code>, so you can share a single poem or poet.
          </p>
        </div>
        <a className="dbtn mt-8" href="#/poems">
          Back to the poems
        </a>
      </section>
    );
  }

  function renderHomeView() {
    const allChips = [{ slug: "all", name: "All poets" }, ...POETS];

    return (
      <>
        <section className="relative grid items-center gap-10 px-[4vw] pb-16 pt-10 md:grid-cols-[1.1fr_1fr]">
          <div className="drise">
            <p className="sc text-sm">A house of poems, bound in gold</p>
            <h1 className="disp dink mt-3 text-[clamp(5rem,15vw,15rem)]">
              <i>D</i>iwan
            </h1>
            <p className="mt-6 max-w-lg text-[1.2em] italic">
              Poems that cross borders and centuries: Darwish&rsquo;s country of memory, Dickinson&rsquo;s small bird, Shakespeare&rsquo;s summer, Blake&rsquo;s storm.
            </p>
            <a href="#/poems/list" className="dbtn mt-8">
              Begin reading
            </a>
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

        <div className="dorn mx-auto max-w-[80vw] px-[2vw]">
          <span className="disp text-[clamp(1.2rem,2.4vw,2.6rem)]">
            &#10059; The Poets &#10059;
          </span>
        </div>
        <section
          id="poets"
          className="grid gap-8 px-[4vw] py-12 sm:grid-cols-2 lg:grid-cols-4"
        >
          {POETS.map((poet) => (
            <PoetCard key={poet.slug} poet={poet} />
          ))}
        </section>

        <div className="dorn mx-auto max-w-[80vw] px-[2vw]">
          <span className="disp text-[clamp(1.2rem,2.4vw,2.6rem)]">
            &#10059; The Poems &#10059;
          </span>
        </div>
        <section id="poems" className="px-[4vw] py-12">
          <div
            className="flex flex-wrap items-center justify-center gap-3"
            id="chips"
          >
            {allChips.map((c) => (
              <button
                key={c.slug}
                className="dbtn"
                data-who={c.slug}
                aria-pressed={selectedPoetSlug === c.slug}
                onClick={() => setSelectedPoetSlug(c.slug)}
              >
                {c.name}
              </button>
            ))}
          </div>
          <div className="mx-auto mt-6 max-w-md">
            <label className="sc block text-center text-xs" htmlFor="q">
              Search by title, theme or line
            </label>
            <input
              id="q"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mt-1 w-full border border-ink/60 bg-transparent px-4 py-2 text-center italic outline-none focus:border-ember"
              placeholder="love, exile, rose&hellip;"
            />
          </div>
          <div
            id="grid"
            className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filteredPoems.length > 0 ? (
              filteredPoems.map((p) => <PoemCard key={p.slug} poem={p} />)
            ) : (
              <p className="col-span-full text-center italic">
                No poems match that search. Try a theme such as love, exile or hope.
              </p>
            )}
          </div>
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
        Poems by Shakespeare, Blake and Dickinson are in the public domain. Verses marked &ldquo;in the spirit of Mahmoud Darwish&rdquo; are original works for this page.
        <br />
        &copy; MMXXVI &middot; Diwan
      </footer>
    </div>
  );
}
