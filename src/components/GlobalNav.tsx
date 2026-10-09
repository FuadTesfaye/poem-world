"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { POEMS, POETS, stripTags } from "@/data/diwan";
import { ARTWORKS } from "@/data/art";

interface GlobalNavProps {
  currentRoute?: string;
  routeParts?: string[];
}

export default function GlobalNav({ currentRoute = "landing", routeParts = [] }: GlobalNavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState<"all" | "poems" | "poets" | "art">("all");
  const [scrolled, setScrolled] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Detect scroll to add refined depth styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Keyboard shortcut: Press "/" or "Cmd+K" / "Ctrl+K" to open global search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "/" && (e.target as HTMLElement).tagName !== "INPUT" && (e.target as HTMLElement).tagName !== "TEXTAREA") ||
          (e.key === "k" && (e.metaKey || e.ctrlKey))) {
        e.preventDefault();
        setSearchModalOpen(true);
      } else if (e.key === "Escape") {
        setSearchModalOpen(false);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Focus search input when modal opens
  useEffect(() => {
    if (searchModalOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    } else {
      setSearchQuery("");
    }
  }, [searchModalOpen]);

  // Determine active route
  const activeSection = useMemo(() => {
    const p = routeParts[0] || "";
    if (p === "art") return "art";
    if (p === "poem" || p === "poems") return "poems";
    if (p === "poet" || p === "poets") return "poets";
    if (p === "about") return "about";
    if (currentRoute === "art") return "art";
    if (currentRoute === "poets") return "poets";
    if (currentRoute === "poems") return "poems";
    if (currentRoute === "about") return "about";
    return "landing";
  }, [routeParts, currentRoute]);

  // Surprise Me / Random Discover function
  const handleRandomDiscover = () => {
    const coin = Math.random();
    if (coin < 0.5) {
      // Pick random artwork
      const randomArt = ARTWORKS[Math.floor(Math.random() * ARTWORKS.length)];
      window.location.hash = `#/art/${randomArt.slug}`;
    } else {
      // Pick random poem
      const randomPoem = POEMS[Math.floor(Math.random() * POEMS.length)];
      window.location.hash = `#/poem/${randomPoem.slug}`;
    }
    setMobileMenuOpen(false);
  };

  // Global search filtering across all 3 databases
  const searchResults = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return { poems: [], poets: [], artworks: [] };

    const matchingPoems = POEMS.filter((p) => {
      const title = stripTags(p.title).toLowerCase();
      const titleAr = (p.titleAr || "").toLowerCase();
      const poet = p.poet.toLowerCase();
      const text = stripTags(p.text).toLowerCase();
      const era = p.era.toLowerCase();
      return title.includes(q) || titleAr.includes(q) || poet.includes(q) || era.includes(q) || text.includes(q);
    }).slice(0, 8);

    const matchingPoets = POETS.filter((pt) => {
      const name = pt.name.toLowerCase();
      const nameAr = (pt.ar || "").toLowerCase();
      const era = pt.era.toLowerCase();
      const place = pt.place.toLowerCase();
      return name.includes(q) || nameAr.includes(q) || era.includes(q) || place.includes(q);
    }).slice(0, 6);

    const matchingArtworks = ARTWORKS.filter((a) => {
      const title = a.title.toLowerCase();
      const titleAr = (a.titleAr || "").toLowerCase();
      const artist = a.artist.toLowerCase();
      const museum = a.museum.toLowerCase();
      const movement = a.movement.toLowerCase();
      const plaque = a.galleryPlaque.toLowerCase();
      return title.includes(q) || titleAr.includes(q) || artist.includes(q) || museum.includes(q) || movement.includes(q) || plaque.includes(q);
    }).slice(0, 8);

    return { poems: matchingPoems, poets: matchingPoets, artworks: matchingArtworks };
  }, [searchQuery]);

  const totalResultsCount =
    searchResults.poems.length + searchResults.poets.length + searchResults.artworks.length;

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "bg-[#ecd9ab]/95 backdrop-blur-md shadow-md border-b border-amber-900/25"
            : "bg-[#ecd9ab]/90 backdrop-blur-sm border-b border-amber-900/15"
        }`}
      >
        <div className="mx-auto flex h-16 md:h-20 w-full max-w-[1780px] items-center justify-between px-4 sm:px-6 lg:px-10 xl:px-12">
          {/* Brand Logo & Illuminated Emblem */}
          <div className="flex items-center gap-3">
            <a
              href="#"
              className="group flex items-center gap-3 focus:outline-none"
              title="Return to Sanctuary Home"
            >
              <div className="flex h-10 w-10 md:h-11 md:md-11 items-center justify-center rounded-sm border border-gilt/80 bg-amber-950/10 text-ember shadow-inner transition group-hover:border-ember group-hover:bg-amber-950/20">
                <span className="text-xl md:text-2xl select-none" aria-hidden="true">&#10059;</span>
              </div>
              <div className="flex flex-col">
                <span className="sc text-base md:text-xl font-bold tracking-[0.16em] text-ink group-hover:text-ember transition">
                  Poem World
                </span>
                <span className="ar text-xs md:text-sm text-ember font-medium leading-none" dir="rtl">
                  دِيوان الشِّعْر والفَنّ
                </span>
              </div>
            </a>
          </div>

          {/* Desktop Main Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 sc text-sm font-semibold tracking-wider" aria-label="Main Navigation">
            <a
              href="#/poems"
              className={`px-3.5 py-2 rounded-sm transition ${
                activeSection === "poems"
                  ? "bg-amber-950/15 text-ember border-b-2 border-ember font-bold shadow-sm"
                  : "text-ink/85 hover:text-ember hover:bg-amber-950/5"
              }`}
            >
              <span className="mr-1.5 opacity-80">&#128220;</span> Diwan Poems
            </a>

            <a
              href="#/poets"
              className={`px-3.5 py-2 rounded-sm transition ${
                activeSection === "poets"
                  ? "bg-amber-950/15 text-ember border-b-2 border-ember font-bold shadow-sm"
                  : "text-ink/85 hover:text-ember hover:bg-amber-950/5"
              }`}
            >
              <span className="mr-1.5 opacity-80">&#129671;</span> The Poets
              <span className="ml-1.5 text-[11px] font-normal px-1.5 py-0.2 bg-amber-950/10 rounded-full text-ink/75">
                {POETS.length}
              </span>
            </a>

            <a
              href="#/art"
              className={`px-3.5 py-2 rounded-sm transition ${
                activeSection === "art"
                  ? "bg-amber-950/15 text-ember border-b-2 border-ember font-bold shadow-sm"
                  : "text-ink/85 hover:text-ember hover:bg-amber-950/5"
              }`}
            >
              <span className="mr-1.5 opacity-80">&#127912;</span> Art Gallery
              <span className="ml-1.5 text-[11px] font-normal px-1.5 py-0.2 bg-ember/15 text-ember rounded-full">
                62 Masterworks
              </span>
            </a>

            <a
              href="#philosophy"
              className={`px-3.5 py-2 rounded-sm transition ${
                activeSection === "landing"
                  ? "text-ink/85 hover:text-ember hover:bg-amber-950/5"
                  : "text-ink/85 hover:text-ember hover:bg-amber-950/5"
              }`}
            >
              <span className="mr-1.5 opacity-80">&#9872;</span> Philosophy
            </a>

            <a
              href="#/about"
              className={`px-3.5 py-2 rounded-sm transition ${
                activeSection === "about"
                  ? "bg-amber-950/15 text-ember border-b-2 border-ember font-bold shadow-sm"
                  : "text-ink/85 hover:text-ember hover:bg-amber-950/5"
              }`}
            >
              About
            </a>
          </nav>

          {/* Quick Utility Tools (Search, Surprise Me, Mobile Toggle) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Global Search Trigger */}
            <button
              onClick={() => setSearchModalOpen(true)}
              className="flex items-center gap-2 rounded-sm border border-ink/30 bg-amber-950/5 px-3 py-1.5 text-xs text-ink/85 transition hover:border-ember hover:bg-amber-950/10 hover:text-ember focus:outline-none"
              title="Search across all poems, poets, and artworks (Press / or Ctrl+K)"
            >
              <span className="text-sm">🔍</span>
              <span className="hidden sm:inline font-serif italic">Search Gallery &amp; Diwan...</span>
              <kbd className="hidden md:inline-block rounded border border-ink/30 px-1.5 py-0.2 text-[10px] font-mono text-ink/60">
                /
              </kbd>
            </button>

            {/* Surprise Me / Random Discover Button */}
            <button
              onClick={handleRandomDiscover}
              className="hidden sm:flex items-center gap-1.5 rounded-sm border border-gilt/70 bg-gradient-to-r from-amber-900/10 to-amber-950/15 px-3 py-1.5 text-xs font-semibold text-ember transition hover:border-ember hover:bg-ember hover:text-paper shadow-sm"
              title="Discover a random masterpiece poem or painting"
            >
              <span className="text-sm">&#127922;</span>
              <span className="sc tracking-wide">Surprise Me</span>
            </button>

            {/* Mobile Menu Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex h-10 w-10 items-center justify-center rounded-sm border border-ink/30 text-ink hover:text-ember focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              <span className="text-2xl leading-none">{mobileMenuOpen ? "✕" : "☰"}</span>
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Navigation Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-amber-900/20 bg-[#ecd9ab]/98 px-6 py-5 shadow-2xl backdrop-blur-md">
            <div className="flex flex-col space-y-3 sc text-base font-semibold">
              <a
                href="#/poems"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between py-2 border-b border-ink/10 ${
                  activeSection === "poems" ? "text-ember font-bold" : "text-ink hover:text-ember"
                }`}
              >
                <span>&#128220; Diwan Poems</span>
                <span className="text-xs font-normal opacity-70">Arabic &amp; English</span>
              </a>

              <a
                href="#/poets"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between py-2 border-b border-ink/10 ${
                  activeSection === "poets" ? "text-ember font-bold" : "text-ink hover:text-ember"
                }`}
              >
                <span>&#129671; The Poets</span>
                <span className="text-xs font-normal px-2 py-0.5 bg-amber-950/10 rounded-full">{POETS.length} Masters</span>
              </a>

              <a
                href="#/art"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between py-2 border-b border-ink/10 ${
                  activeSection === "art" ? "text-ember font-bold" : "text-ink hover:text-ember"
                }`}
              >
                <span>&#127912; Art Gallery</span>
                <span className="text-xs font-normal px-2 py-0.5 bg-ember/15 text-ember rounded-full">
                  62 Masterworks
                </span>
              </a>

              <a
                href="#philosophy"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-2 border-b border-ink/10 text-ink hover:text-ember"
              >
                <span>&#9872; Philosophy &amp; Vision</span>
              </a>

              <a
                href="#/about"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-2 border-b border-ink/10 text-ink hover:text-ember"
              >
                <span>About Diwan</span>
              </a>

              <div className="pt-2 flex gap-3">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setSearchModalOpen(true);
                  }}
                  className="flex-1 dbtn text-xs py-2.5 text-center justify-center flex items-center gap-1.5"
                >
                  <span>🔍</span> Search All
                </button>
                <button
                  onClick={handleRandomDiscover}
                  className="flex-1 dbtn text-xs py-2.5 text-center justify-center flex items-center gap-1.5 border-ember text-ember"
                >
                  <span>&#127922;</span> Surprise Me
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Global Interactive Search Modal */}
      {searchModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6 md:p-10 overflow-y-auto animate-fade-in"
          onClick={() => setSearchModalOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-4xl bg-[#ecd9ab] border-2 border-gilt shadow-2xl p-6 sm:p-8 rounded-sm my-8 text-ink"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-amber-900/20 pb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">&#10059;</span>
                <div>
                  <h2 className="disp text-2xl sm:text-3xl text-ink leading-tight">
                    Global Sanctuary Search
                  </h2>
                  <p className="ar text-sm text-ember font-medium" dir="rtl">
                    البحث الشامل في الدِّيوان والمتحف الفنِّي
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSearchModalOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-sm border border-ink/30 text-ink hover:border-ember hover:text-ember"
                aria-label="Close search"
              >
                ✕
              </button>
            </div>

            {/* Search Input Field */}
            <div className="mt-5 relative">
              <input
                ref={searchInputRef}
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Monet, Shakespeare, المتنبي, Sonnet, Landscape, Romanticism..."
                className="w-full border-2 border-ember/70 bg-paper/60 px-12 py-3.5 text-lg italic text-ink outline-none focus:border-ember focus:bg-paper"
              />
              <span className="absolute left-4 top-4 text-xl opacity-60">🔍</span>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-3.5 text-sm text-ink/70 hover:text-ember px-2 py-1"
                >
                  ✕ Clear
                </button>
              )}
            </div>

            {/* Category Filter Tabs */}
            <div className="mt-4 flex flex-wrap gap-2 text-xs sc font-semibold">
              <button
                onClick={() => setSearchCategory("all")}
                className={`px-3 py-1.5 rounded-sm border transition ${
                  searchCategory === "all"
                    ? "bg-ember text-paper border-ember"
                    : "border-ink/20 hover:border-ember/60 text-ink"
                }`}
              >
                All Results ({totalResultsCount})
              </button>
              <button
                onClick={() => setSearchCategory("art")}
                className={`px-3 py-1.5 rounded-sm border transition ${
                  searchCategory === "art"
                    ? "bg-ember text-paper border-ember"
                    : "border-ink/20 hover:border-ember/60 text-ink"
                }`}
              >
                &#127912; Artworks ({searchResults.artworks.length})
              </button>
              <button
                onClick={() => setSearchCategory("poems")}
                className={`px-3 py-1.5 rounded-sm border transition ${
                  searchCategory === "poems"
                    ? "bg-ember text-paper border-ember"
                    : "border-ink/20 hover:border-ember/60 text-ink"
                }`}
              >
                &#128220; Poems ({searchResults.poems.length})
              </button>
              <button
                onClick={() => setSearchCategory("poets")}
                className={`px-3 py-1.5 rounded-sm border transition ${
                  searchCategory === "poets"
                    ? "bg-ember text-paper border-ember"
                    : "border-ink/20 hover:border-ember/60 text-ink"
                }`}
              >
                &#129671; Poets ({searchResults.poets.length})
              </button>
            </div>

            {/* Search Results Display Area */}
            <div className="mt-6 max-h-[60vh] overflow-y-auto space-y-6 pr-2">
              {searchQuery.trim() === "" ? (
                <div className="py-12 text-center text-ink/70 italic">
                  <p className="text-lg">Enter a keyword to explore 62 Masterpieces, 63 Poets, and canonical verses.</p>
                  <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs not-italic">
                    <span className="sc opacity-60">Try searching:</span>
                    {["Van Gogh", "Rembrandt", "Shakespeare", "المتنبي", "Monet", "Darwish", "Sonnet", "Night Watch"].map(
                      (kw) => (
                        <button
                          key={kw}
                          onClick={() => setSearchQuery(kw)}
                          className="underline hover:text-ember"
                        >
                          {kw}
                        </button>
                      )
                    )}
                  </div>
                </div>
              ) : totalResultsCount === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-lg italic opacity-75">
                    No results found matching &ldquo;{searchQuery}&rdquo;.
                  </p>
                  <p className="text-sm opacity-60 mt-1">Try another keyword, poet name, or museum artist.</p>
                </div>
              ) : (
                <>
                  {/* Matching Artworks Section */}
                  {(searchCategory === "all" || searchCategory === "art") && searchResults.artworks.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between border-b border-ink/20 pb-1 mb-3">
                        <span className="sc text-xs tracking-wider uppercase text-ember font-semibold">
                          &#127912; Masterpiece Artworks ({searchResults.artworks.length})
                        </span>
                        <a href="#/art" onClick={() => setSearchModalOpen(false)} className="text-xs hover:underline text-ember">
                          View All Artworks &rarr;
                        </a>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {searchResults.artworks.map((art) => (
                          <a
                            key={art.slug}
                            href={`#/art/${art.slug}`}
                            onClick={() => setSearchModalOpen(false)}
                            className="group flex gap-3 p-2.5 rounded border border-ink/15 hover:border-ember hover:bg-amber-950/10 transition"
                          >
                            <div
                              className="h-16 w-20 flex-shrink-0 rounded bg-cover bg-center border border-gilt"
                              style={{ backgroundImage: `url(${art.imageSrc})` }}
                            />
                            <div className="overflow-hidden">
                              <h4 className="disp text-lg text-ink group-hover:text-ember truncate">
                                {art.title}
                              </h4>
                              {art.titleAr && (
                                <p className="ar text-xs text-ember truncate" dir="rtl">
                                  {art.titleAr}
                                </p>
                              )}
                              <p className="sc text-xs opacity-80 truncate">{art.artist} &bull; {art.date}</p>
                              <span className="text-[10px] uppercase text-ember/90 font-semibold">{art.museum}</span>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Matching Poems Section */}
                  {(searchCategory === "all" || searchCategory === "poems") && searchResults.poems.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between border-b border-ink/20 pb-1 mb-3">
                        <span className="sc text-xs tracking-wider uppercase text-ember font-semibold">
                          &#128220; Canonical Poems ({searchResults.poems.length})
                        </span>
                        <a href="#/poems" onClick={() => setSearchModalOpen(false)} className="text-xs hover:underline text-ember">
                          View Diwan &rarr;
                        </a>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {searchResults.poems.map((p) => (
                          <a
                            key={p.slug}
                            href={`#/poem/${p.slug}`}
                            onClick={() => setSearchModalOpen(false)}
                            className="group p-3 rounded border border-ink/15 hover:border-ember hover:bg-amber-950/10 transition block"
                          >
                            <h4 className="disp text-lg text-ink group-hover:text-ember truncate">
                              {stripTags(p.title)}
                            </h4>
                            {p.titleAr && (
                              <p className="ar text-xs text-ember truncate" dir="rtl">
                                {p.titleAr}
                              </p>
                            )}
                            <p className="sc text-xs opacity-80 mt-1">{p.poet} &bull; {p.era}</p>
                            <p className="text-xs italic text-ink/70 line-clamp-1 mt-1">
                              {stripTags(p.text).slice(0, 80)}...
                            </p>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Matching Poets Section */}
                  {(searchCategory === "all" || searchCategory === "poets") && searchResults.poets.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between border-b border-ink/20 pb-1 mb-3">
                        <span className="sc text-xs tracking-wider uppercase text-ember font-semibold">
                          &#129671; The Poets ({searchResults.poets.length})
                        </span>
                        <a href="#/poets" onClick={() => setSearchModalOpen(false)} className="text-xs hover:underline text-ember">
                          View All Poets &rarr;
                        </a>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-3">
                        {searchResults.poets.map((pt) => (
                          <a
                            key={pt.slug}
                            href={`#/poet/${pt.slug}`}
                            onClick={() => setSearchModalOpen(false)}
                            className="group p-3 rounded border border-ink/15 hover:border-ember hover:bg-amber-950/10 transition block text-center"
                          >
                            <h4 className="sc text-sm font-bold text-ink group-hover:text-ember truncate">
                              {pt.name}
                            </h4>
                            {pt.ar && (
                              <p className="ar text-xs text-ember" dir="rtl">
                                {pt.ar}
                              </p>
                            )}
                            <span className="text-[11px] opacity-70 block mt-1">{pt.era}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="mt-6 border-t border-amber-900/15 pt-3 flex items-center justify-between text-xs opacity-75">
              <span>Press <kbd className="border border-ink/30 px-1 py-0.5 rounded">Esc</kbd> to close</span>
              <span>Poem World Bilingual Masterworks Sanctuary</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
