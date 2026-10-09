import React from "react";
import { Artwork } from "@/data/art/types";

interface ArtCardProps {
  artwork: Artwork;
}

export default function ArtCard({ artwork }: ArtCardProps) {
  const customBg = {
    backgroundImage: `url(${artwork.imageSrc})`,
    backgroundPosition: "center center",
    backgroundSize: "cover",
  };

  return (
    <article className="group cursor-pointer">
      <a href={`#/art/${artwork.slug}`} className="block focus:outline-none">
        <div className="gilt transition duration-300 group-hover:brightness-105">
          <div
            className="dpic aspect-[4/3] w-full"
            style={customBg}
            role="img"
            aria-label={`${artwork.title} by ${artwork.artist}`}
          />
        </div>

        <div className="mt-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-ember font-medium">
            <span className="sc tracking-wide uppercase">{artwork.museum}</span>
            <span className="opacity-75">{artwork.date}</span>
          </div>

          <h3 className="disp text-2xl leading-snug text-ink group-hover:text-ember transition">
            {artwork.title}
          </h3>

          {artwork.titleAr && (
            <p className="ar text-lg text-ink/80 font-normal leading-relaxed">
              {artwork.titleAr}
            </p>
          )}

          <p className="sc text-sm text-ink/85">
            {artwork.artist}
            {artwork.artistDates && <span className="opacity-60 text-xs ml-1.5">({artwork.artistDates})</span>}
          </p>

          <p className="mt-2 text-xs italic text-ink/70 line-clamp-2 leading-relaxed">
            {artwork.galleryPlaque}
          </p>

          <div className="pt-2 flex flex-wrap gap-1.5">
            <span className="tag text-[11px] py-0.5 px-2 bg-amber-950/10 text-ember border-ember/20">
              {artwork.movement}
            </span>
            {artwork.relatedPoemSlug && (
              <span className="tag text-[11px] py-0.5 px-2 border-ink/20 opacity-80">
                Poem Connected &#10086;
              </span>
            )}
          </div>
        </div>
      </a>
    </article>
  );
}
