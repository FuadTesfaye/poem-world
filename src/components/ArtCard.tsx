import React from "react";
import { Artwork } from "@/data/art/types";
import { SearchIcon } from "./Icons";

interface ArtCardProps {
  artwork: Artwork;
  layout?: "showcase" | "compact";
  onQuickInspect?: (artwork: Artwork) => void;
}

export default function ArtCard({ artwork, layout = "showcase", onQuickInspect }: ArtCardProps) {
  const customBg = {
    backgroundImage: `url(${artwork.imageSrc})`,
    backgroundPosition: "center center",
    backgroundSize: "cover",
  };

  if (layout === "compact") {
    return (
      <article className="group cursor-pointer">
        <a href={`#/art/${artwork.slug}`} className="block focus:outline-none">
          <div className="gilt transition duration-300 group-hover:brightness-105 group-hover:shadow-lg">
            <div
              className="dpic aspect-[4/3] w-full"
              style={customBg}
              role="img"
              aria-label={`${artwork.title} by ${artwork.artist}`}
            />
          </div>

          <div className="mt-3 space-y-1">
            <div className="flex items-center justify-between text-xs text-ember font-medium">
              <span className="sc tracking-wide uppercase truncate">{artwork.museum}</span>
              <span className="opacity-75">{artwork.date}</span>
            </div>

            <h3 className="disp text-xl leading-snug text-ink group-hover:text-ember transition truncate" dir="ltr">
              <bdi>{artwork.title}</bdi>
            </h3>

            {artwork.titleAr && (
              <p className="ar text-base text-ink/80 font-normal leading-relaxed truncate" dir="rtl">
                <bdi>{artwork.titleAr}</bdi>
              </p>
            )}

            <p className="sc text-xs text-ink/85 truncate">
              {artwork.artist}
            </p>
          </div>
        </a>
      </article>
    );
  }

  // Default: Expansive "showcase" layout (Wide, high visual prominence, readable curatorial plaque)
  return (
    <article className="group cursor-pointer flex flex-col justify-between bg-amber-950/5 border border-amber-950/15 hover:border-ember/70 hover:shadow-xl transition-all duration-300 rounded-sm p-4 sm:p-5">
      <div>
        {/* High-Fidelity Artwork Showcase Frame */}
        <div className="relative overflow-hidden rounded-sm border-2 border-gilt/80 shadow-md transition duration-300 group-hover:border-ember group-hover:shadow-xl">
          <a href={`#/art/${artwork.slug}`} className="block" title={`Explore ${artwork.title}`}>
            <div
              className="aspect-[16/10] sm:aspect-[4/3] min-h-[220px] sm:min-h-[260px] xl:min-h-[300px] w-full transform transition duration-500 group-hover:scale-[1.02]"
              style={customBg}
              role="img"
              aria-label={`${artwork.title} by ${artwork.artist}`}
            />
          </a>

          {/* Quick Inspection Floating Badge */}
          {onQuickInspect && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onQuickInspect(artwork);
              }}
              className="absolute bottom-2.5 right-2.5 rounded bg-black/60 backdrop-blur-sm px-2.5 py-1 text-xs text-paper opacity-0 transition group-hover:opacity-100 hover:bg-ember hover:text-white inline-flex items-center gap-1.5"
              title="Expand High-Resolution Lightbox"
            >
              <SearchIcon className="w-3 h-3" />
              <span>Inspect High-Res</span>
            </button>
          )}

          {/* Museum Badge Watermark */}
          <div className="absolute top-2.5 left-2.5 rounded bg-amber-950/80 backdrop-blur-sm px-2.5 py-0.5 text-[11px] sc text-paper/90 border border-gilt/40">
            {artwork.museum}
          </div>
        </div>

        {/* Narrative & Curatorial Story Texts */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-ember font-medium">
            <span className="tag py-0.5 px-2 bg-amber-950/10 text-ember border-ember/20 text-[11px]">
              {artwork.movement}
            </span>
            <span className="sc opacity-80 text-xs font-semibold">{artwork.date}</span>
          </div>

          {/* Dual Titles with BiDi Isolation */}
          <a href={`#/art/${artwork.slug}`} className="block group-hover:text-ember">
            <h3 className="disp text-2xl xl:text-3xl leading-snug text-ink transition-colors" dir="ltr">
              <bdi>{artwork.title}</bdi>
            </h3>

            {artwork.titleAr && (
              <p className="ar text-xl xl:text-2xl text-ember font-medium leading-relaxed mt-0.5" dir="rtl">
                <bdi>{artwork.titleAr}</bdi>
              </p>
            )}
          </a>

          {/* Artist Information */}
          <p className="sc text-sm sm:text-base text-ink/90 font-medium">
            {artwork.artist}
            {artwork.artistDates && (
              <span className="opacity-60 text-xs ml-2 font-normal">({artwork.artistDates})</span>
            )}
          </p>

          {/* Museum Official Gallery Wall Plaque (Readable Quote) */}
          <div className="my-3 p-3.5 bg-amber-950/10 border-l-2 border-ember rounded-r shadow-inner">
            <span className="sc block text-[10px] tracking-wider uppercase text-ember font-semibold mb-1">
              Official Museum Wall Plaque
            </span>
            <p className="text-xs sm:text-sm italic text-ink/85 leading-relaxed line-clamp-3">
              &ldquo;{artwork.galleryPlaque}&rdquo;
            </p>
          </div>

          {/* Curatorial Story Snippet */}
          <p className="text-xs text-ink/75 leading-relaxed line-clamp-2">
            {artwork.curatorialEssay}
          </p>
        </div>
      </div>

      {/* Footer Meta & Interaction Strip */}
      <div className="mt-4 pt-3 border-t border-amber-950/15 flex flex-wrap items-center justify-between gap-2 text-xs">
        {artwork.relatedPoemSlug ? (
          <a
            href={`#/poem/${artwork.relatedPoemSlug}`}
            className="text-[11px] text-ember hover:underline font-semibold flex items-center gap-1"
            title="Read associated classical poem"
          >
            <span>&#10086;</span> Paired Diwan Poem
          </a>
        ) : (
          <span className="text-[11px] opacity-60">{artwork.medium}</span>
        )}

        <a
          href={`#/art/${artwork.slug}`}
          className="sc text-xs text-ink/90 font-bold hover:text-ember flex items-center gap-1 transition ml-auto"
        >
          Explore Story &rarr;
        </a>
      </div>
    </article>
  );
}
