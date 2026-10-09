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
  const [galleryViewMode, setGalleryViewMode] = useState<"showcase" | "mosaic">("showcase");
  const [lightboxArtwork, setLightboxArtwork] = useState<Artwork | null>(null);
  const [copiedCitation, setCopiedCitation] = useState<boolean>(false);

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

  // Handle escape key to close lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLightboxArtwork(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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

  // Copy citation helper
  const handleCopyCitation = (art: Artwork) => {
    const citation = `${art.title} (${art.date}) by ${art.artist}. ${art.medium}, ${art.dimensions}. ${art.museum}, ${art.museumLocation}.`;
    navigator.clipboard.writeText(citation).then(() => {
      setCopiedCitation(true);
      setTimeout(() => setCopiedCitation(false), 2500);
    });
  };

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

    // Related artworks from same museum or movement
    const relatedArtworks = ARTWORKS.filter(
      (a) => a.slug !== artwork.slug && (a.museum === artwork.museum || a.movement === artwork.movement)
    ).slice(0, 4);

    return (
      <article className="w-full max-w-[1780px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 pt-6 pb-20">
        {/* Breadcrumb Navigation */}
        <nav className="sc text-xs mb-6 flex items-center gap-2 text-ink/80" aria-label="Breadcrumb">
          <a href="#" className="hover:text-ember">Sanctuary</a> &nbsp;/&nbsp;
          <a href="#/poems" className="hover:text-ember">Diwan Poems</a> &nbsp;/&nbsp;
          <a href="#/art" className="hover:text-ember font-semibold">Art Gallery</a> &nbsp;/&nbsp;
          <span className="text-ember font-semibold truncate max-w-xs">{artwork.title}</span>
        </nav>

        {/* Master Exhibition Hall: Expansive 2-Column Spread */}
        <div className="grid gap-10 xl:gap-16 lg:grid-cols-[1.35fr_1fr] items-start">
          {/* LEFT COLUMN: Grand Artwork Showcase Frame */}
          <div className="lg:sticky lg:top-24 space-y-4">
            <div className="relative rounded-sm border-[3px] border-gilt/80 shadow-2xl p-3 sm:p-5 bg-gradient-to-b from-amber-950/15 via-amber-950/10 to-amber-950/20">
              <div
                onClick={() => setLightboxArtwork(artwork)}
                className="cursor-zoom-in relative min-h-[380px] sm:min-h-[500px] xl:min-h-[640px] max-h-[82vh] w-full flex items-center justify-center overflow-hidden rounded-sm bg-black/15 shadow-inner"
              >
                <img
                  src={artwork.imageSrc}
                  alt={`${artwork.title} by ${artwork.artist}`}
                  className="w-full h-full object-contain max-h-[82vh] transition duration-500 hover:scale-[1.01]"
                  loading="eager"
                />

                {/* Hover zoom prompt */}
                <div className="absolute bottom-3 right-3 rounded bg-black/70 backdrop-blur-sm px-3 py-1 text-xs text-paper flex items-center gap-1.5 shadow">
                  <span>🔍</span> Click for High-Res Lightbox
                </div>
              </div>
            </div>

            {/* Quick Action Strip below the frame */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-amber-950/5 p-3 rounded border border-amber-950/15">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setLightboxArtwork(artwork)}
                  className="dbtn text-xs py-1 px-3 flex items-center gap-1"
                >
                  <span>🔍</span> Inspect Fullscreen
                </button>

                <button
                  onClick={() => handleCopyCitation(artwork)}
                  className="dbtn text-xs py-1 px-3"
                  title="Copy scholarly reference citation"
                >
                  {copiedCitation ? "✓ Citation Copied!" : "📋 Copy Citation"}
                </button>
              </div>

              <div className="flex items-center gap-3 opacity-80 text-xs">
                <span>{artwork.date}</span>
                <span>&bull;</span>
                <span>{artwork.museumLocation}</span>
                {artwork.openAccessUrl && (
                  <>
                    <span>&bull;</span>
                    <a
                      href={artwork.openAccessUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-ember hover:underline font-semibold"
                    >
                      Museum Archive &rarr;
                    </a>
                  </>
                )}
              </div>
            </div>

            {/* Technical Specifications Panel */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-amber-950/5 rounded border border-amber-950/10 text-xs">
              <div>
                <span className="sc block font-bold text-ink uppercase tracking-wider text-[11px]">Medium</span>
                <span className="opacity-85">{artwork.medium}</span>
              </div>
              <div>
                <span className="sc block font-bold text-ink uppercase tracking-wider text-[11px]">Dimensions</span>
                <span className="opacity-85">{artwork.dimensions}</span>
              </div>
              <div>
                <span className="sc block font-bold text-ink uppercase tracking-wider text-[11px]">Department</span>
                <span className="opacity-85">{artwork.department}</span>
              </div>
              <div>
                <span className="sc block font-bold text-ink uppercase tracking-wider text-[11px]">License</span>
                <span className="text-emerald-800 font-bold">CC0 Open Access</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Curatorial Narrative & Story Typography */}
          <div className="space-y-6">
            {/* Museum & Movement Badges */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="sc tracking-widest uppercase text-ember font-bold bg-ember/10 px-2.5 py-1 rounded-sm border border-ember/30">
                {artwork.museum}
              </span>
              <span className="tag py-1 px-2.5 bg-amber-950/10 text-ink border-amber-950/20 text-xs">
                {artwork.movement}
              </span>
            </div>

            {/* Dual Masterpiece Titles (Strict BiDi Separation) */}
            <div>
              <h1 className="disp text-[clamp(2.5rem,4.5vw,5rem)] text-ink leading-[1.05]" dir="ltr">
                <bdi>{artwork.title}</bdi>
              </h1>

              {artwork.titleAr && (
                <p className="ar text-[clamp(2rem,3.4vw,3.2rem)] text-ember font-medium mt-2 leading-relaxed" dir="rtl">
                  <bdi>{artwork.titleAr}</bdi>
                </p>
              )}

              <p className="sc mt-2 text-xl text-ink/90 font-medium">
                {artwork.artist}
                {artwork.artistDates && <span className="text-sm opacity-70 ml-2 font-normal">({artwork.artistDates})</span>}
              </p>
            </div>

            {/* Official Museum Gallery Wall Plaque */}
            <div className="border-l-4 border-ember pl-6 py-4 bg-amber-950/10 rounded-r shadow-inner">
              <span className="sc block text-xs uppercase tracking-widest text-ember font-bold mb-2">
                Official Museum Gallery Plaque
              </span>
              <p className="text-base sm:text-lg italic leading-relaxed text-ink/90">
                &ldquo;{artwork.galleryPlaque}&rdquo;
              </p>
            </div>

            {/* Curatorial Context & Master Narrative */}
            <div className="space-y-3 pt-2">
              <h2 className="sc text-sm uppercase tracking-wider text-ink font-bold border-b border-ink/20 pb-1.5">
                Curatorial Context &amp; Significance
              </h2>
              <p className="ddrop text-base sm:text-lg leading-relaxed text-ink/90 whitespace-pre-line">
                {artwork.curatorialEssay}
              </p>
            </div>

            {/* Provenance & Ownership Journey */}
            <div className="mat bg-amber-950/5 border border-amber-950/15 p-5 rounded-sm">
              <h3 className="sc text-xs uppercase tracking-wider text-ember font-bold">
                Provenance &amp; Ownership Journey
              </h3>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed opacity-90">
                {artwork.provenance}
              </p>
            </div>

            {/* Paired Diwan Poem (Cross-Tradition Dialogue) */}
            {pairedPoem && (
              <div className="mat border-2 border-ember/40 bg-ember/5 p-6 rounded-sm">
                <div className="flex items-center justify-between">
                  <span className="sc text-xs tracking-wider uppercase text-ember font-bold">
                    &#10086; Dialogue of Verse &amp; Canvas
                  </span>
                  <span className="text-xs opacity-75">{pairedPoem.era}</span>
                </div>
                <h4 className="disp text-2xl text-ink mt-2">
                  &ldquo;{stripTags(pairedPoem.title)}&rdquo;
                </h4>
                {pairedPoem.titleAr && (
                  <p className="ar text-lg text-ember" dir="rtl">
                    {pairedPoem.titleAr}
                  </p>
                )}
                <p className="sc text-sm text-ink/85 mt-1">By {pairedPoem.poet}</p>
                <p className="mt-3 text-xs sm:text-sm italic opacity-85 line-clamp-3 border-t border-ember/20 pt-2">
                  {stripTags(pairedPoem.text).slice(0, 160)}...
                </p>
                <a
                  href={`#/poem/${pairedPoem.slug}`}
                  className="dbtn mt-4 text-xs inline-block font-semibold"
                >
                  Read Paired Poem in Diwan &rarr;
                </a>
              </div>
            )}

            {/* Prev / Next Plate Navigation */}
            <nav
              className="flex items-center justify-between border-t border-ink/20 pt-6 text-sm"
              aria-label="Artwork pagination"
            >
              <a
                className="sc flex items-center gap-2 hover:text-ember font-medium"
                href={`#/art/${prevArtwork.slug}`}
              >
                &larr; {prevArtwork.title}
              </a>
              <a href="#/art" className="dbtn text-xs">
                Back to Gallery
              </a>
              <a
                className="sc flex items-center gap-2 hover:text-ember font-medium"
                href={`#/art/${nextArtwork.slug}`}
              >
                {nextArtwork.title} &rarr;
              </a>
            </nav>
          </div>
        </div>

        {/* RELATED MASTERPIECES STRIP */}
        {relatedArtworks.length > 0 && (
          <section className="mt-20 pt-12 border-t border-amber-950/20">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="sc text-xs uppercase tracking-widest text-ember font-bold">
                  Echoes in the Collection
                </span>
                <h3 className="disp text-3xl sm:text-4xl text-ink mt-1">
                  More Masterpieces from {artwork.museum}
                </h3>
              </div>
              <a href="#/art" className="sc text-xs hover:text-ember hover:underline font-semibold">
                View All 62 &rarr;
              </a>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedArtworks.map((ra) => (
                <ArtCard
                  key={ra.slug}
                  artwork={ra}
                  layout="compact"
                  onQuickInspect={(art) => setLightboxArtwork(art)}
                />
              ))}
            </div>
          </section>
        )}

        {/* LIGHTBOX MODAL */}
        {renderLightboxModal()}
      </article>
    );
  }

  // --- Catalog View: #/art ---
  function renderCatalogView() {
    const paginatedArtworks = filteredArtworks.slice(0, visibleCount);
    const hasMore = visibleCount < filteredArtworks.length;

    return (
      <section className="w-full max-w-[1780px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 pt-6 pb-20">
        {/* Gallery Grand Header */}
        <div className="text-center max-w-4xl mx-auto">
          <nav className="sc text-xs mb-3 flex items-center justify-center gap-2 text-ink/75" aria-label="Breadcrumb">
            <a href="#" className="hover:text-ember">Sanctuary</a> &nbsp;/&nbsp;
            <a href="#/poems" className="hover:text-ember">Diwan Poems</a> &nbsp;/&nbsp;
            <span className="text-ember font-semibold">Art Gallery</span>
          </nav>

          <p className="sc text-xs tracking-widest text-ember uppercase font-bold">
            The World Cultural Heritage Collections
          </p>
          <h1 className="disp mt-2 text-[clamp(3.5rem,8vw,7.5rem)] text-ink leading-tight">
            <i>A</i>rt <i>G</i>allery
          </h1>
          <p className="mt-4 italic text-lg sm:text-xl opacity-90 leading-relaxed max-w-3xl mx-auto">
            Where painting and poetry unite. Featuring {ARTWORKS.length} canonical masterpieces from the{" "}
            <strong>Art Institute of Chicago</strong>, <strong>Rijksmuseum Amsterdam</strong>,{" "}
            <strong>The Metropolitan Museum of Art</strong>, and <strong>Europeana</strong>, accompanied by official
            curatorial plaques, provenance histories, and poetic dialogues.
          </p>
        </div>

        {/* Filter, Search & Layout Controls Toolbar */}
        <div className="mt-10 space-y-5">
          {/* Museum Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              className={`dbtn ${selectedMuseum === "all" ? "bg-ember text-paper border-ember" : ""}`}
              aria-pressed={selectedMuseum === "all"}
              onClick={() => setSelectedMuseum("all")}
            >
              All Museums ({museumCounts.all})
            </button>
            <button
              className={`dbtn ${
                selectedMuseum === "Art Institute of Chicago" ? "bg-ember text-paper border-ember" : ""
              }`}
              aria-pressed={selectedMuseum === "Art Institute of Chicago"}
              onClick={() => setSelectedMuseum("Art Institute of Chicago")}
            >
              Art Institute of Chicago ({museumCounts["Art Institute of Chicago"]})
            </button>
            <button
              className={`dbtn ${selectedMuseum === "Rijksmuseum" ? "bg-ember text-paper border-ember" : ""}`}
              aria-pressed={selectedMuseum === "Rijksmuseum"}
              onClick={() => setSelectedMuseum("Rijksmuseum")}
            >
              Rijksmuseum Amsterdam ({museumCounts.Rijksmuseum})
            </button>
            <button
              className={`dbtn ${
                selectedMuseum === "The Metropolitan Museum of Art" ? "bg-ember text-paper border-ember" : ""
              }`}
              aria-pressed={selectedMuseum === "The Metropolitan Museum of Art"}
              onClick={() => setSelectedMuseum("The Metropolitan Museum of Art")}
            >
              The Met Open Access ({museumCounts["The Metropolitan Museum of Art"]})
            </button>
            <button
              className={`dbtn ${
                selectedMuseum === "Europeana & National Galleries" ? "bg-ember text-paper border-ember" : ""
              }`}
              aria-pressed={selectedMuseum === "Europeana & National Galleries"}
              onClick={() => setSelectedMuseum("Europeana & National Galleries")}
            >
              Europeana &amp; World Galleries ({museumCounts["Europeana & National Galleries"]})
            </button>
          </div>

          {/* Movement Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
            {MOVEMENTS.map((m) => (
              <button
                key={m.id}
                className={`sc rounded-sm border px-3 py-1.5 transition ${
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

          {/* Search bar & View Mode Controls Strip */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-2 border-t border-amber-950/15">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 sc text-xs font-semibold">
              <span className="opacity-70">View Mode:</span>
              <button
                onClick={() => setGalleryViewMode("showcase")}
                className={`px-3 py-1.5 rounded-sm border transition flex items-center gap-1.5 ${
                  galleryViewMode === "showcase"
                    ? "bg-ember text-paper border-ember shadow-sm"
                    : "border-ink/20 text-ink hover:border-ember"
                }`}
                title="Expansive wide cards with large artworks and readable curatorial stories"
              >
                <span>🖼️</span> Curatorial Showcase (Wide)
              </button>
              <button
                onClick={() => setGalleryViewMode("mosaic")}
                className={`px-3 py-1.5 rounded-sm border transition flex items-center gap-1.5 ${
                  galleryViewMode === "mosaic"
                    ? "bg-ember text-paper border-ember shadow-sm"
                    : "border-ink/20 text-ink hover:border-ember"
                }`}
                title="Dense mosaic grid for fast visual scanning"
              >
                <span>🏛️</span> Museum Mosaic
              </button>
            </div>

            {/* Instant Search Bar */}
            <div className="w-full md:max-w-md relative">
              <input
                id="art-q"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-ink/60 bg-paper/60 px-10 py-2 italic outline-none focus:border-ember focus:bg-paper"
                placeholder="Search Monet, Van Gogh, Rembrandt, Vermeer, Hokusai..."
              />
              <span className="absolute left-3.5 top-2.5 text-sm opacity-50">🔍</span>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-2 text-xs text-ink/70 hover:text-ember px-1.5 py-0.5"
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Count Indicator */}
            <p className="text-xs italic opacity-80 whitespace-nowrap">
              {searchQuery ? (
                <>Found {filteredArtworks.length} of {ARTWORKS.length} masterpieces</>
              ) : (
                <>Displaying {paginatedArtworks.length} of {filteredArtworks.length} masterpieces</>
              )}
            </p>
          </div>

          {/* Quick Keyword Chips */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs opacity-80">
            <span className="sc mr-1">Quick Filters:</span>
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
        </div>

        {/* Masterpiece Exhibition Grid (Expanded Wide Container) */}
        <div
          className={`mt-10 grid gap-8 xl:gap-10 ${
            galleryViewMode === "showcase"
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3"
              : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-5"
          }`}
        >
          {paginatedArtworks.length > 0 ? (
            paginatedArtworks.map((art) => (
              <ArtCard
                key={art.slug}
                artwork={art}
                layout={galleryViewMode === "showcase" ? "showcase" : "compact"}
                onQuickInspect={(a) => setLightboxArtwork(a)}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <p className="italic text-xl opacity-80">
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
                Load More Masterpieces (+{PAGE_SIZE})
              </button>
              <button
                className="dbtn px-6 py-3 text-sm opacity-85 hover:opacity-100"
                onClick={() => setVisibleCount(filteredArtworks.length)}
              >
                Show All {filteredArtworks.length} Works
              </button>
            </div>
            <p className="text-xs italic opacity-70">
              Viewing {paginatedArtworks.length} of {filteredArtworks.length} works from global archives
            </p>
          </div>
        )}

        {/* Live Museum API Explorer */}
        <div className="mt-24 border-t-2 border-gilt/60 pt-16">
          <div className="text-center max-w-2xl mx-auto">
            <p className="sc text-xs uppercase tracking-widest text-ember font-bold">
              Infinite Archive Exploration
            </p>
            <h2 className="disp text-[clamp(2.5rem,5.5vw,4.5rem)] text-ink mt-2">
              <i>Q</i>uery <i>L</i>ive <i>M</i>useum <i>A</i>PIs
            </h2>
            <p className="italic text-base opacity-85 mt-2">
              Query beyond the curated 62 masterpieces: interactively search over <strong>400,000+</strong> open-access
              cultural records directly from the <strong>Art Institute of Chicago (IIIF)</strong> and the{" "}
              <strong>Metropolitan Museum of Art</strong>.
            </p>

            {/* Source Switcher */}
            <div className="mt-6 flex justify-center gap-3">
              <button
                className={`dbtn text-xs ${liveSource === "aic" ? "bg-ember text-paper border-ember" : ""}`}
                onClick={() => setLiveSource("aic")}
              >
                Art Institute of Chicago (IIIF)
              </button>
              <button
                className={`dbtn text-xs ${liveSource === "met" ? "bg-ember text-paper border-ember" : ""}`}
                onClick={() => setLiveSource("met")}
              >
                The Met Open Access
              </button>
            </div>

            {/* Search Input */}
            <form onSubmit={handleLiveSearch} className="mt-6 flex flex-wrap gap-2 justify-center">
              <input
                type="search"
                value={liveQuery}
                onChange={(e) => setLiveQuery(e.target.value)}
                placeholder={
                  liveSource === "aic"
                    ? "Search AIC (e.g. Monet, woodblock, bronze, landscape)..."
                    : "Search The Met (e.g. Rembrandt, Persian, armor, tapestry)..."
                }
                className="w-full max-w-md border border-ink/60 bg-paper/60 px-4 py-2 text-center italic outline-none focus:border-ember focus:bg-paper"
              />
              <button type="submit" className="dbtn font-semibold" disabled={liveLoading}>
                {liveLoading ? "Querying Museum API..." : "Search Museum Archives"}
              </button>
            </form>
          </div>

          {/* Live Search Results */}
          {liveSearched && (
            <div className="mt-12">
              {liveResults.length > 0 ? (
                <>
                  <p className="text-center text-xs sc text-ember mb-6 tracking-wider">
                    Live Museum API Records for &ldquo;{activeLiveQuery}&rdquo; ({liveResults.length} loaded)
                  </p>
                  <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {liveResults.map((item) => (
                      <article key={item.id} className="mat flex flex-col justify-between p-4 bg-amber-950/5 rounded">
                        <div>
                          {item.imageUrl ? (
                            <div className="gilt mb-4">
                              <div
                                className="dpic aspect-[4/3] w-full"
                                style={{
                                  backgroundImage: `url(${item.imageUrl})`,
                                  backgroundPosition: "center center",
                                  backgroundSize: "cover",
                                }}
                                role="img"
                                aria-label={item.title}
                              />
                            </div>
                          ) : (
                            <div className="aspect-[4/3] w-full bg-amber-950/10 flex items-center justify-center text-xs italic opacity-60 mb-4 rounded border border-ink/10">
                              No image available in public API record
                            </div>
                          )}

                          <div className="flex items-center justify-between text-xs opacity-75">
                            <span className="sc uppercase text-ember font-bold">{item.museumName}</span>
                            <span>{item.date}</span>
                          </div>

                          <h3 className="disp text-xl mt-2 leading-tight text-ink">{item.title}</h3>
                          <p className="sc text-sm mt-1">{item.artist}</p>
                          <p className="text-xs opacity-75 mt-0.5">{item.medium}</p>

                          {item.description && (
                            <p className="mt-3 text-xs italic opacity-85 line-clamp-3 border-t border-ink/10 pt-2">
                              {item.description}
                            </p>
                          )}
                        </div>

                        <div className="mt-4 pt-3 border-t border-ink/10 text-xs opacity-70">
                          {item.provenance ? (
                            <span className="truncate block">Provenance: {item.provenance}</span>
                          ) : (
                            <span>Official CC0 Open Access Archive Record</span>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>

                  {liveHasMore && (
                    <div className="mt-10 text-center">
                      <button
                        className="dbtn"
                        onClick={handleLoadMoreLive}
                        disabled={liveLoadingMore}
                      >
                        {liveLoadingMore ? "Fetching Next Page..." : "Load More from Museum API (+12)"}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                !liveLoading && (
                  <p className="text-center italic opacity-75 mt-8">
                    No museum archive items found matching &ldquo;{activeLiveQuery}&rdquo;. Try another term.
                  </p>
                )
              )}
            </div>
          )}
        </div>

        {/* LIGHTBOX MODAL */}
        {renderLightboxModal()}
      </section>
    );
  }

  // --- High-Resolution Lightbox Modal ---
  function renderLightboxModal() {
    if (!lightboxArtwork) return null;

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-8 animate-fade-in"
        onClick={() => setLightboxArtwork(null)}
        role="dialog"
        aria-modal="true"
      >
        <div
          className="relative max-w-6xl w-full max-h-[95vh] flex flex-col items-center"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={() => setLightboxArtwork(null)}
            className="absolute -top-12 right-0 flex h-10 w-10 items-center justify-center rounded-full bg-paper/20 text-paper hover:bg-ember hover:text-white transition text-lg"
            aria-label="Close Lightbox"
          >
            ✕
          </button>

          {/* Full Canvas Artwork Display */}
          <div className="relative max-h-[75vh] w-full flex items-center justify-center overflow-hidden rounded-sm border-2 border-gilt shadow-2xl bg-black">
            <img
              src={lightboxArtwork.imageSrc}
              alt={`${lightboxArtwork.title} by ${lightboxArtwork.artist}`}
              className="max-h-[75vh] max-w-full object-contain"
            />
          </div>

          {/* Lightbox Information Strip */}
          <div className="mt-4 w-full bg-[#ecd9ab] p-4 rounded-sm border border-gilt text-ink flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-ember font-bold">
                <span className="sc uppercase">{lightboxArtwork.museum}</span>
                <span>&bull;</span>
                <span>{lightboxArtwork.date}</span>
                <span>&bull;</span>
                <span>{lightboxArtwork.movement}</span>
              </div>
              <h3 className="disp text-2xl text-ink leading-tight mt-0.5">
                {lightboxArtwork.title}
              </h3>
              <p className="sc text-sm text-ink/80">{lightboxArtwork.artist}</p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={`#/art/${lightboxArtwork.slug}`}
                onClick={() => setLightboxArtwork(null)}
                className="dbtn text-xs font-semibold"
              >
                View Full Curatorial Story &rarr;
              </a>
              <button
                onClick={() => setLightboxArtwork(null)}
                className="dbtn text-xs"
              >
                Close (Esc)
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return renderCatalogView();
}
