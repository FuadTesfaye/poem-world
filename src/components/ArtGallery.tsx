"use client";

import React, { useState, useMemo, useEffect } from "react";
import { ARTWORKS, getArtwork, Artwork } from "@/data/art";
import { getPoem, stripTags } from "@/data/diwan";
import ArtCard from "./ArtCard";

interface ArtGalleryProps {
  routeParts: string[];
}

interface MuseumLiveResult {
  id: string | number;
  title: string;
  artist: string;
  date: string;
  medium: string;
  description?: string;
  provenance?: string;
  imageUrl?: string;
  museumName: string;
}

const MOVEMENTS = [
  { id: "all", label: "All Movements" },
  { id: "impressionism", label: "Impressionism & Post-Impressionism" },
  { id: "dutch golden age", label: "Dutch Golden Age & Baroque" },
  { id: "romanticism", label: "Romanticism & Early Modern" },
  { id: "renaissance", label: "High Renaissance & Mannerism" },
  { id: "islamic", label: "Asian & Islamic Art" },
  { id: "realism", label: "American Realism & Regionalism" },
];

const QUICK_TAGS = [
  "Van Gogh",
  "Rembrandt",
  "Vermeer",
  "Monet",
  "Hokusai",
  "Botticelli",
  "Friedrich",
  "Delacroix",
  "Landscape",
  "Portrait",
];

const PAGE_SIZE = 12;

export default function ArtGallery({ routeParts }: ArtGalleryProps) {
  const [selectedMuseum, setSelectedMuseum] = useState<string>("all");
  const [selectedMovement, setSelectedMovement] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);

  // Live Museum Explorer state (AIC + The Met Open Access)
  const [liveSource, setLiveSource] = useState<"aic" | "met">("aic");
  const [liveQuery, setLiveQuery] = useState<string>("");
  const [activeLiveQuery, setActiveLiveQuery] = useState<string>("");
  const [liveLoading, setLiveLoading] = useState<boolean>(false);
  const [liveLoadingMore, setLiveLoadingMore] = useState<boolean>(false);
  const [liveResults, setLiveResults] = useState<MuseumLiveResult[]>([]);
  const [livePage, setLivePage] = useState<number>(1);
  const [liveHasMore, setLiveHasMore] = useState<boolean>(false);
  const [liveSearched, setLiveSearched] = useState<boolean>(false);

  const artworkSlug = routeParts[1];

  // Reset pagination when search or filters change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [selectedMuseum, selectedMovement, searchQuery]);

  // Filter curated collection
  const filteredArtworks = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return ARTWORKS.filter((a) => {
      if (selectedMuseum !== "all" && a.museum !== selectedMuseum) return false;
      if (selectedMovement !== "all") {
        const mov = a.movement.toLowerCase();
        if (selectedMovement === "impressionism" && !mov.includes("impressionism") && !mov.includes("pointillism")) return false;
        if (selectedMovement === "dutch golden age" && !mov.includes("dutch") && !mov.includes("baroque")) return false;
        if (selectedMovement === "romanticism" && !mov.includes("romanticism")) return false;
        if (selectedMovement === "renaissance" && !mov.includes("renaissance") && !mov.includes("mannerism")) return false;
        if (selectedMovement === "islamic" && !mov.includes("ukiyo-e") && !mov.includes("islamic") && !mov.includes("persian")) return false;
        if (selectedMovement === "realism" && !mov.includes("realism") && !mov.includes("regionalism")) return false;
      }
      if (!q) return true;

      const haystack = (
        a.title +
        " " +
        (a.titleAr || "") +
        " " +
        a.artist +
        " " +
        (a.artistAr || "") +
        " " +
        a.movement +
        " " +
        a.museum +
        " " +
        a.medium +
        " " +
        a.date +
        " " +
        a.galleryPlaque +
        " " +
        a.curatorialEssay +
        " " +
        a.tags.join(" ")
      ).toLowerCase();
      return haystack.includes(q);
    });
  }, [selectedMuseum, selectedMovement, searchQuery]);

  // Museum counts
  const museumCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: ARTWORKS.length,
      "Art Institute of Chicago": 0,
      Rijksmuseum: 0,
      "The Metropolitan Museum of Art": 0,
      "Europeana & National Galleries": 0,
    };
    for (const art of ARTWORKS) {
      if (counts[art.museum] !== undefined) {
        counts[art.museum]++;
      }
    }
    return counts;
  }, []);

  // Fetch from live museum APIs with pagination
  async function fetchMuseumApi(query: string, pageNum: number, source: "aic" | "met") {
    if (!query.trim()) return [];

    if (source === "aic") {
      const limit = 12;
      const url = `https://api.artic.edu/api/v1/artworks/search?q=${encodeURIComponent(
        query
      )}&page=${pageNum}&limit=${limit}&fields=id,title,artist_display,date_display,medium_display,description,provenance_text,image_id`;

      const res = await fetch(url);
      if (!res.ok) return [];
      const json = await res.json();
      const items = (json.data || []).map((item: any): MuseumLiveResult => {
        const imageId = item.image_id;
        const imageUrl = imageId
          ? `https://www.artic.edu/iiif/2/${imageId}/full/843,/0/default.jpg`
          : undefined;
        return {
          id: `aic-${item.id}`,
          title: item.title || "Untitled",
          artist: item.artist_display || "Unknown Artist",
          date: item.date_display || "",
          medium: item.medium_display || "",
          description: item.description ? stripTags(item.description) : undefined,
          provenance: item.provenance_text ? stripTags(item.provenance_text) : undefined,
          imageUrl,
          museumName: "Art Institute of Chicago",
        };
      });
      return items;
    } else {
      // The Met Open Access Search
      const searchUrl = `https://collectionapi.metmuseum.org/public/collection/v1/search?q=${encodeURIComponent(
        query
      )}&hasImages=true`;
      const sRes = await fetch(searchUrl);
      if (!sRes.ok) return [];
      const sJson = await sRes.json();
      const objectIDs = sJson.objectIDs || [];
      const startIndex = (pageNum - 1) * 9;
      const slice = objectIDs.slice(startIndex, startIndex + 9);

      const items: MuseumLiveResult[] = [];
      for (const objId of slice) {
        try {
          const oRes = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${objId}`);
          if (oRes.ok) {
            const o = await oRes.json();
            items.push({
              id: `met-${o.objectID}`,
              title: o.title || "Untitled",
              artist: o.artistDisplayName || "Unknown Artist",
              date: o.objectDate || "",
              medium: o.medium || "",
              description: o.creditLine || o.classification || undefined,
              provenance: o.repository || undefined,
              imageUrl: o.primaryImageSmall || o.primaryImage || undefined,
              museumName: "The Metropolitan Museum of Art",
            });
          }
        } catch {
          // ignore single item timeout
        }
      }
      return items;
    }
  }

  // Handle live search submission
  async function handleLiveSearch(e: React.FormEvent) {
    e.preventDefault();
    const query = liveQuery.trim();
    if (!query) return;

    setLiveLoading(true);
    setLiveSearched(true);
    setActiveLiveQuery(query);
    setLivePage(1);
    setLiveResults([]);

    try {
      const items = await fetchMuseumApi(query, 1, liveSource);
      setLiveResults(items);
      setLiveHasMore(items.length >= 8);
    } catch {
      setLiveResults([]);
      setLiveHasMore(false);
    } finally {
      setLiveLoading(false);
    }
  }

  // Handle "Load More from Museum API"
  async function handleLoadMoreLive() {
    if (liveLoadingMore || !activeLiveQuery) return;
    setLiveLoadingMore(true);
    const nextPage = livePage + 1;

    try {
      const items = await fetchMuseumApi(activeLiveQuery, nextPage, liveSource);
      if (items.length > 0) {
        setLiveResults((prev) => [...prev, ...items]);
        setLivePage(nextPage);
        setLiveHasMore(items.length >= 6);
      } else {
        setLiveHasMore(false);
      }
    } catch {
      setLiveHasMore(false);
    } finally {
      setLiveLoadingMore(false);
    }
  }

  // --- Detail View: #/art/[slug] ---
  if (artworkSlug) {
    const artwork = getArtwork(artworkSlug);
    if (!artwork) {
      return renderCatalogView();
    }

    const index = ARTWORKS.indexOf(artwork);
    const prevArtwork = ARTWORKS[(index + ARTWORKS.length - 1) % ARTWORKS.length];
    const nextArtwork = ARTWORKS[(index + 1) % ARTWORKS.length];
    const pairedPoem = artwork.relatedPoemSlug ? getPoem(artwork.relatedPoemSlug) : null;

    return (
      <article className="px-[4vw] pt-8 pb-16 max-w-6xl mx-auto">
        <nav className="sc text-xs mb-6" aria-label="Breadcrumb">
          <a href="#/poems" className="hover:text-ember">Diwan</a> &nbsp;/&nbsp;{" "}
          <a href="#/art" className="hover:text-ember">Art Gallery</a> &nbsp;/&nbsp;{" "}
          <span className="text-ember font-semibold">{artwork.museum}</span>
        </nav>

        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] items-start">
          {/* Framed Artwork Display */}
          <div className="lg:sticky lg:top-8">
            <div className="gilt shadow-2xl">
              <div
                className="dpic aspect-[4/3] w-full"
                style={{
                  backgroundImage: `url(${artwork.imageSrc})`,
                  backgroundPosition: "center center",
                  backgroundSize: "cover",
                }}
                role="img"
                aria-label={`${artwork.title} by ${artwork.artist}`}
              />
            </div>
            <div className="mt-4 flex items-center justify-between text-xs opacity-75">
              <span>{artwork.date} &bull; {artwork.museumLocation}</span>
              {artwork.openAccessUrl && (
                <a
                  href={artwork.openAccessUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ember hover:underline"
                >
                  Museum Archive &rarr;
                </a>
              )}
            </div>
          </div>

          {/* Curatorial & Narrative Details */}
          <div>
            <div className="flex items-center gap-2 text-xs">
              <span className="sc tracking-widest uppercase text-ember font-semibold">{artwork.museum}</span>
              <span>&bull;</span>
              <span className="tag py-0.5 px-2 bg-amber-950/10 text-ember border-ember/20 text-xs">
                {artwork.movement}
              </span>
            </div>

            <h1 className="disp mt-3 text-[clamp(2.5rem,5.5vw,5rem)] text-ink leading-tight">
              {artwork.title}
            </h1>

            {artwork.titleAr && (
              <p className="ar text-[clamp(1.8rem,3.5vw,2.8rem)] text-ember font-medium mt-1 leading-relaxed">
                {artwork.titleAr}
              </p>
            )}

            <p className="sc mt-2 text-lg text-ink/90 font-medium">
              {artwork.artist}
              {artwork.artistDates && <span className="text-xs opacity-70 ml-2">({artwork.artistDates})</span>}
            </p>

            {/* Museum Wall Plaque */}
            <div className="mt-8 border-l-2 border-ember pl-5 py-2 bg-amber-950/5">
              <span className="sc block text-xs uppercase tracking-widest text-ember font-semibold">
                Official Museum Gallery Plaque
              </span>
              <p className="mt-2 text-sm italic leading-relaxed text-ink/90">
                &ldquo;{artwork.galleryPlaque}&rdquo;
              </p>
            </div>

            {/* Curatorial Essay */}
            <div className="mt-8 space-y-4">
              <h2 className="sc text-sm uppercase tracking-wider text-ink border-b border-ink/20 pb-1">
                Curatorial Context &amp; Significance
              </h2>
              <p className="ddrop text-base leading-relaxed text-ink/90">
                {artwork.curatorialEssay}
              </p>
            </div>

            {/* Provenance History */}
            <div className="mt-8 mat">
              <h3 className="sc text-xs uppercase tracking-wider text-ember font-semibold">
                Provenance &amp; Ownership Journey
              </h3>
              <p className="mt-2 text-xs leading-relaxed opacity-85">
                {artwork.provenance}
              </p>
            </div>

            {/* Technical Specifications */}
            <div className="mt-6 grid grid-cols-2 gap-4 text-xs border-t border-ink/15 pt-4 opacity-80">
              <div>
                <span className="sc block font-semibold text-ink">Medium</span>
                <span>{artwork.medium}</span>
              </div>
              <div>
                <span className="sc block font-semibold text-ink">Dimensions</span>
                <span>{artwork.dimensions}</span>
              </div>
              <div>
                <span className="sc block font-semibold text-ink">Department</span>
                <span>{artwork.department}</span>
              </div>
              <div>
                <span className="sc block font-semibold text-ink">License</span>
                <span className="text-emerald-800 font-medium">CC0 Public Domain (Open Access)</span>
              </div>
            </div>

            {/* Paired Diwan Poem (Cross-Tradition Dialogue) */}
            {pairedPoem && (
              <div className="mt-8 mat border-ember/40 bg-ember/5">
                <span className="sc text-xs tracking-wider uppercase text-ember font-semibold block">
                  &#10086; Dialogue of Verse &amp; Canvas
                </span>
                <p className="mt-1 text-sm leading-snug">
                  This masterpiece shares its spirit with the verse{" "}
                  <strong>&ldquo;{stripTags(pairedPoem.title)}&rdquo;</strong>.
                </p>
                <a
                  href={`#/poem/${pairedPoem.slug}`}
                  className="dbtn mt-3 text-xs inline-block"
                >
                  Read Paired Poem in Diwan &rarr;
                </a>
              </div>
            )}

            {/* Navigation Actions */}
            <div className="mt-10 flex items-center justify-between border-t border-ink/20 pt-6">
              <a
                href={`#/art/${prevArtwork.slug}`}
                className="sc text-xs flex items-center gap-2 hover:text-ember"
              >
                &larr; {prevArtwork.title}
              </a>
              <a href="#/art" className="dbtn text-xs">
                Back to Gallery
              </a>
              <a
                href={`#/art/${nextArtwork.slug}`}
                className="sc text-xs flex items-center gap-2 hover:text-ember"
              >
                {nextArtwork.title} &rarr;
              </a>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // --- Catalog View: #/art ---
  function renderCatalogView() {
    const paginatedArtworks = filteredArtworks.slice(0, visibleCount);
    const hasMore = visibleCount < filteredArtworks.length;

    return (
      <section className="px-[4vw] pt-8 pb-16">
        <div className="text-center max-w-3xl mx-auto">
          <nav className="sc text-xs mb-3" aria-label="Breadcrumb">
            <a href="#/poems" className="hover:text-ember">Diwan</a> &nbsp;/&nbsp;{" "}
            <span className="text-ember font-semibold">Art Gallery</span>
          </nav>

          <p className="sc text-xs tracking-widest text-ember uppercase">
            The World Cultural Heritage Collections
          </p>
          <h1 className="disp mt-2 text-[clamp(3.5rem,8vw,7.5rem)] text-ink">
            <i>A</i>rt <i>G</i>allery
          </h1>
          <p className="mt-4 italic text-lg opacity-85 leading-relaxed">
            Where painting and poetry unite. Featuring {ARTWORKS.length} canonical masterworks from the{" "}
            <strong>Art Institute of Chicago</strong>, <strong>Rijksmuseum Amsterdam</strong>,{" "}
            <strong>The Metropolitan Museum of Art</strong>, and <strong>Europeana</strong>, accompanied by official
            curatorial plaques, provenance histories, and poetic pairings.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="mt-10 mx-auto max-w-5xl space-y-4">
          {/* Museum Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              className="dbtn"
              aria-pressed={selectedMuseum === "all"}
              onClick={() => setSelectedMuseum("all")}
            >
              All Museums ({museumCounts.all})
            </button>
            <button
              className="dbtn"
              aria-pressed={selectedMuseum === "Art Institute of Chicago"}
              onClick={() => setSelectedMuseum("Art Institute of Chicago")}
            >
              Art Institute of Chicago ({museumCounts["Art Institute of Chicago"]})
            </button>
            <button
              className="dbtn"
              aria-pressed={selectedMuseum === "Rijksmuseum"}
              onClick={() => setSelectedMuseum("Rijksmuseum")}
            >
              Rijksmuseum Amsterdam ({museumCounts.Rijksmuseum})
            </button>
            <button
              className="dbtn"
              aria-pressed={selectedMuseum === "The Metropolitan Museum of Art"}
              onClick={() => setSelectedMuseum("The Metropolitan Museum of Art")}
            >
              The Metropolitan Museum of Art ({museumCounts["The Metropolitan Museum of Art"]})
            </button>
            <button
              className="dbtn"
              aria-pressed={selectedMuseum === "Europeana & National Galleries"}
              onClick={() => setSelectedMuseum("Europeana & National Galleries")}
            >
              Europeana &amp; National Galleries ({museumCounts["Europeana & National Galleries"]})
            </button>
          </div>

          {/* Movement Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {MOVEMENTS.map((m) => (
              <button
                key={m.id}
                className={`text-xs py-1 px-3 transition-colors border ${
                  selectedMovement === m.id
                    ? "bg-ember text-paper border-ember"
                    : "border-ink/30 hover:border-ember/70 text-ink"
                }`}
                onClick={() => setSelectedMovement(m.id)}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Search bar with Instant Filter & Clear */}
          <div className="mx-auto max-w-xl pt-2">
            <label className="sc block text-center text-xs" htmlFor="art-q">
              Search artwork by title, artist, movement, or description
            </label>
            <div className="relative mt-1">
              <input
                id="art-q"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-ink/60 bg-transparent px-10 py-2.5 text-center italic outline-none focus:border-ember"
                placeholder="Search Monet, Van Gogh, Rembrandt, Vermeer, Hokusai, Da Vinci..."
              />
              <span className="absolute left-3.5 top-3 text-sm opacity-50">🔍</span>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-2.5 text-xs text-ink/70 hover:text-ember px-1.5 py-0.5"
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Quick Keyword Chips */}
            <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5 text-xs opacity-80">
              <span className="sc mr-1">Quick:</span>
              {QUICK_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSearchQuery(tag)}
                  className="hover:text-ember underline underline-offset-2 px-1"
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Search Match Status */}
            <p className="mt-2 text-center text-xs italic opacity-75">
              {searchQuery ? (
                <>Found {filteredArtworks.length} masterpieces matching &ldquo;{searchQuery}&rdquo;</>
              ) : (
                <>Showing {paginatedArtworks.length} of {filteredArtworks.length} masterworks</>
              )}
            </p>
          </div>
        </div>

        {/* Curated Masterpiece Grid */}
        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {paginatedArtworks.length > 0 ? (
            paginatedArtworks.map((art) => <ArtCard key={art.slug} artwork={art} />)
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="italic text-lg opacity-80">
                No artworks match your search query &ldquo;{searchQuery}&rdquo;.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedMuseum("all");
                  setSelectedMovement("all");
                }}
                className="dbtn mt-4 text-xs"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>

        {/* Progressive Loading ("Load More" & "Load All") Controls */}
        {hasMore && (
          <div className="mt-16 text-center space-y-3">
            <div className="flex flex-wrap justify-center gap-4">
              <button
                className="dbtn px-8 py-3 text-sm font-semibold tracking-wider text-ember shadow-md"
                onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
              >
                Load More Masterpieces (+{Math.min(PAGE_SIZE, filteredArtworks.length - visibleCount)}) &rarr;
              </button>
              <button
                className="dbtn px-6 py-3 text-xs tracking-wider"
                onClick={() => setVisibleCount(filteredArtworks.length)}
              >
                Show All ({filteredArtworks.length})
              </button>
            </div>
            <p className="sc text-xs opacity-75">
              Viewing {visibleCount} of {filteredArtworks.length} masterworks
            </p>
          </div>
        )}

        {/* Live Museum Explorer (AIC & Met Open Access Search with Infinite Load More) */}
        <section className="mt-24 border-t border-ink/20 pt-16">
          <div className="text-center max-w-2xl mx-auto">
            <p className="sc text-xs text-ember tracking-widest uppercase">
              Live Cultural Heritage Portal
            </p>
            <h2 className="disp text-[clamp(2.4rem,5vw,4.5rem)] text-ink mt-2">
              <i>E</i>xplore 600,000+ <i>A</i>rtworks
            </h2>
            <p className="italic text-base opacity-85 mt-2">
              Query directly into the live open-access APIs of the <strong>Art Institute of Chicago</strong> and{" "}
              <strong>The Metropolitan Museum of Art</strong> with high-resolution IIIF deep zooming and curatorial archives.
            </p>

            {/* Museum Source Selector */}
            <div className="mt-6 flex justify-center gap-2">
              <button
                className="dbtn text-xs"
                aria-pressed={liveSource === "aic"}
                onClick={() => setLiveSource("aic")}
              >
                Art Institute of Chicago API (IIIF)
              </button>
              <button
                className="dbtn text-xs"
                aria-pressed={liveSource === "met"}
                onClick={() => setLiveSource("met")}
              >
                The Met Open Access API
              </button>
            </div>

            {/* Live Search Form */}
            <form onSubmit={handleLiveSearch} className="mt-4 flex flex-wrap gap-2 justify-center">
              <input
                type="search"
                value={liveQuery}
                onChange={(e) => setLiveQuery(e.target.value)}
                placeholder={
                  liveSource === "aic"
                    ? "Search AIC (e.g. Monet, Degas, Hopper, Picasso, Japanese prints...)"
                    : "Search The Met (e.g. Rembrandt, Vermeer, Greek sculpture, Islamic art...)"
                }
                className="w-full max-w-md border border-ink/60 bg-transparent px-4 py-2.5 text-center italic outline-none focus:border-ember"
              />
              <button type="submit" className="dbtn px-6" disabled={liveLoading}>
                {liveLoading ? "Querying Museum..." : "Search Museum API"}
              </button>
            </form>
          </div>

          {/* Live Search Results */}
          {liveSearched && (
            <div className="mt-12 max-w-6xl mx-auto">
              {liveResults.length > 0 ? (
                <>
                  <div className="mb-6 text-center">
                    <p className="sc text-xs text-ember uppercase tracking-wider">
                      Live Museum Results for &ldquo;{activeLiveQuery}&rdquo; &bull; {liveResults.length} artworks loaded
                    </p>
                  </div>

                  <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {liveResults.map((item) => (
                      <article key={item.id} className="mat flex flex-col justify-between">
                        <div>
                          {item.imageUrl ? (
                            <div className="gilt mb-4 overflow-hidden">
                              <img
                                src={item.imageUrl}
                                alt={item.title}
                                className="aspect-[4/3] w-full object-cover transition-transform duration-500 hover:scale-105"
                                loading="lazy"
                              />
                            </div>
                          ) : (
                            <div className="gilt mb-4 aspect-[4/3] flex items-center justify-center bg-paper text-ink/40 italic text-xs">
                              Curatorial Record (No CC0 Image)
                            </div>
                          )}
                          <span className="sc text-xs text-ember tracking-wider uppercase block">
                            {item.museumName} {item.date && <> &bull; {item.date}</>}
                          </span>
                          <h3 className="disp text-xl mt-1 text-ink leading-tight">
                            {item.title}
                          </h3>
                          <p className="sc text-sm mt-1 text-ink/80">{item.artist}</p>
                          {item.medium && (
                            <p className="text-xs italic text-ink/60 mt-0.5">{item.medium}</p>
                          )}
                          {item.description && (
                            <p className="text-xs leading-relaxed text-ink/80 mt-3 line-clamp-4 border-t border-ink/10 pt-2">
                              {item.description}
                            </p>
                          )}
                        </div>
                        {item.provenance && (
                          <div className="mt-4 pt-2 border-t border-ink/10 text-[11px] opacity-75 italic line-clamp-2">
                            Provenance: {item.provenance}
                          </div>
                        )}
                      </article>
                    ))}
                  </div>

                  {/* Load More from Museum API */}
                  {liveHasMore && (
                    <div className="mt-12 text-center">
                      <button
                        className="dbtn px-8 py-3 text-xs tracking-wider text-ember font-medium"
                        onClick={handleLoadMoreLive}
                        disabled={liveLoadingMore}
                      >
                        {liveLoadingMore
                          ? "Fetching Next Page from Museum..."
                          : `Load More from ${
                              liveSource === "aic" ? "Art Institute of Chicago" : "The Met"
                            } (+12) \u2192`}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                !liveLoading && (
                  <p className="text-center italic opacity-75">
                    No artworks found in {liveSource === "aic" ? "the Art Institute of Chicago" : "The Met"} for &ldquo;{activeLiveQuery}&rdquo;. Try another term.
                  </p>
                )
              )}
            </div>
          )}
        </section>
      </section>
    );
  }

  return renderCatalogView();
}
