"use client";

import React, { useState, useMemo } from "react";
import { ARTWORKS, getArtwork, Artwork } from "@/data/art";
import { getPoem, stripTags } from "@/data/diwan";
import ArtCard from "./ArtCard";

interface ArtGalleryProps {
  routeParts: string[];
}

interface AICLiveResult {
  id: number;
  title: string;
  artist: string;
  date: string;
  medium: string;
  description?: string;
  provenance?: string;
  iiifUrl?: string;
}

export default function ArtGallery({ routeParts }: ArtGalleryProps) {
  const [selectedMuseum, setSelectedMuseum] = useState<string>("all");
  const [selectedMovement, setSelectedMovement] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Live AIC Explorer state
  const [liveQuery, setLiveQuery] = useState<string>("");
  const [liveLoading, setLiveLoading] = useState<boolean>(false);
  const [liveResults, setLiveResults] = useState<AICLiveResult[]>([]);
  const [liveSearched, setLiveSearched] = useState<boolean>(false);

  const artworkSlug = routeParts[1];

  const filteredArtworks = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return ARTWORKS.filter((a) => {
      if (selectedMuseum !== "all" && a.museum !== selectedMuseum) return false;
      if (selectedMovement !== "all" && !a.movement.toLowerCase().includes(selectedMovement.toLowerCase())) return false;
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
        a.galleryPlaque +
        " " +
        a.curatorialEssay +
        " " +
        a.tags.join(" ")
      ).toLowerCase();
      return haystack.includes(q);
    });
  }, [selectedMuseum, selectedMovement, searchQuery]);

  async function handleLiveSearch(e: React.FormEvent) {
    e.preventDefault();
    const query = liveQuery.trim();
    if (!query) return;

    setLiveLoading(true);
    setLiveSearched(true);
    setLiveResults([]);

    try {
      const url = `https://api.artic.edu/api/v1/artworks/search?q=${encodeURIComponent(
        query
      )}&limit=6&fields=id,title,artist_display,date_display,medium_display,description,provenance_text,image_id`;
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        const items = (json.data || []).map((item: any) => {
          const imageId = item.image_id;
          const iiifUrl = imageId
            ? `https://www.artic.edu/iiif/2/${imageId}/full/843,/0/default.jpg`
            : undefined;
          return {
            id: item.id,
            title: item.title || "Untitled",
            artist: item.artist_display || "Unknown Artist",
            date: item.date_display || "",
            medium: item.medium_display || "",
            description: item.description ? stripTags(item.description) : undefined,
            provenance: item.provenance_text ? stripTags(item.provenance_text) : undefined,
            iiifUrl,
          };
        });
        setLiveResults(items);
      }
    } catch {
      // Graceful fallback on network failure
    } finally {
      setLiveLoading(false);
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
          <a href="#/poems">Diwan</a> &nbsp;/&nbsp;{" "}
          <a href="#/art">Art Gallery</a> &nbsp;/&nbsp;{" "}
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
            <p className="sc mt-4 text-center text-xs opacity-75">
              Plate No. {index + 1} &mdash; {artwork.title} ({artwork.date}) &bull; {artwork.museumLocation}
            </p>
          </div>

          {/* Curatorial Story and Plaques */}
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
    return (
      <section className="px-[4vw] pt-8 pb-16">
        <div className="text-center max-w-3xl mx-auto">
          <nav className="sc text-xs mb-3" aria-label="Breadcrumb">
            <a href="#/poems">Diwan</a> &nbsp;/&nbsp;{" "}
            <span className="text-ember font-semibold">Art Gallery</span>
          </nav>

          <p className="sc text-xs tracking-widest text-ember uppercase">
            The World Cultural Heritage Collections
          </p>
          <h1 className="disp mt-2 text-[clamp(3.5rem,8vw,7.5rem)] text-ink">
            <i>A</i>rt <i>G</i>allery
          </h1>
          <p className="mt-4 italic text-lg opacity-85 leading-relaxed">
            Where painting and poetry unite. Featuring masterworks from the <strong>Art Institute of Chicago</strong>, <strong>Rijksmuseum Amsterdam</strong>, <strong>The Metropolitan Museum of Art</strong>, and <strong>Europeana</strong>, accompanied by official curatorial plaques and provenance histories.
          </p>
        </div>

        {/* Museum Filter Tabs */}
        <div className="mt-10 mx-auto max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              className="dbtn"
              aria-pressed={selectedMuseum === "all"}
              onClick={() => setSelectedMuseum("all")}
            >
              All Museums ({ARTWORKS.length})
            </button>
            <button
              className="dbtn"
              aria-pressed={selectedMuseum === "Art Institute of Chicago"}
              onClick={() => setSelectedMuseum("Art Institute of Chicago")}
            >
              Art Institute of Chicago
            </button>
            <button
              className="dbtn"
              aria-pressed={selectedMuseum === "Rijksmuseum"}
              onClick={() => setSelectedMuseum("Rijksmuseum")}
            >
              Rijksmuseum Amsterdam
            </button>
            <button
              className="dbtn"
              aria-pressed={selectedMuseum === "The Metropolitan Museum of Art"}
              onClick={() => setSelectedMuseum("The Metropolitan Museum of Art")}
            >
              The Metropolitan Museum of Art
            </button>
            <button
              className="dbtn"
              aria-pressed={selectedMuseum === "Europeana / WikiArt"}
              onClick={() => setSelectedMuseum("Europeana / WikiArt")}
            >
              Europeana &amp; WikiArt
            </button>
          </div>

          {/* Movement Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {[
              { id: "all", label: "All Movements" },
              { id: "impressionism", label: "Impressionism & Post-Impressionism" },
              { id: "golden age", label: "Dutch Golden Age" },
              { id: "romanticism", label: "Romanticism" },
              { id: "neoclassicism", label: "Neoclassicism & Renaissance" },
              { id: "asian", label: "Asian & Islamic Art" },
            ].map((m) => (
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

          {/* Search bar */}
          <div className="mx-auto max-w-md pt-2">
            <label className="sc block text-center text-xs" htmlFor="art-q">
              Search artwork by title, artist, or plaque description
            </label>
            <input
              id="art-q"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mt-1 w-full border border-ink/60 bg-transparent px-4 py-2 text-center italic outline-none focus:border-ember"
              placeholder="Van Gogh, Rembrandt, Vermeer, Hokusai, Monet..."
            />
          </div>
        </div>

        {/* Curated Masterpiece Grid */}
        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {filteredArtworks.length > 0 ? (
            filteredArtworks.map((art) => <ArtCard key={art.slug} artwork={art} />)
          ) : (
            <p className="col-span-full text-center italic py-8">
              No artworks match your search query. Try another term.
            </p>
          )}
        </div>

        {/* Live Museum Explorer (AIC Open Access & IIIF) */}
        <section className="mt-20 border-t border-ink/20 pt-16">
          <div className="text-center max-w-2xl mx-auto">
            <p className="sc text-xs text-ember tracking-widest uppercase">
              Live Cultural Heritage Portal
            </p>
            <h2 className="disp text-[clamp(2.4rem,5vw,4.5rem)] text-ink mt-2">
              <i>E</i>xplore 120,000+ <i>A</i>rtworks
            </h2>
            <p className="italic text-base opacity-85 mt-2">
              Search directly into the <strong>Art Institute of Chicago (AIC)</strong> open data API with live IIIF high-resolution images, curatorial essays, and provenance histories.
            </p>

            <form onSubmit={handleLiveSearch} className="mt-6 flex flex-wrap gap-2 justify-center">
              <input
                type="search"
                value={liveQuery}
                onChange={(e) => setLiveQuery(e.target.value)}
                placeholder="Search AIC (e.g., Monet, Degas, Hopper, Picasso, Japanese prints...)"
                className="w-full max-w-md border border-ink/60 bg-transparent px-4 py-2 text-center italic outline-none focus:border-ember"
              />
              <button type="submit" className="dbtn" disabled={liveLoading}>
                {liveLoading ? "Querying AIC Collection..." : "Search Museum API"}
              </button>
            </form>
          </div>

          {liveSearched && (
            <div className="mt-12 max-w-6xl mx-auto">
              {liveResults.length > 0 ? (
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {liveResults.map((item) => (
                    <article key={item.id} className="mat flex flex-col justify-between">
                      <div>
                        {item.iiifUrl && (
                          <div className="gilt mb-4">
                            <img
                              src={item.iiifUrl}
                              alt={item.title}
                              className="aspect-[4/3] w-full object-cover"
                              loading="lazy"
                            />
                          </div>
                        )}
                        <span className="sc text-xs text-ember tracking-wider uppercase block">
                          Art Institute of Chicago &bull; {item.date}
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
              ) : (
                !liveLoading && (
                  <p className="text-center italic opacity-75">
                    No artworks found in the Art Institute of Chicago for &ldquo;{liveQuery}&rdquo;. Try another artist or keyword.
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
