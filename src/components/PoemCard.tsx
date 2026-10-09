import React from "react";
import { Poem, POEMS, ROM, getPoet, stripTags } from "@/data/diwan";

interface PoemCardProps {
  poem: Poem;
}

export default function PoemCard({ poem }: PoemCardProps) {
  const po = getPoet(poem.poet);
  const poetName = po ? po.name : poem.poet;
  const index = POEMS.indexOf(poem);
  const roman = ROM[index] ?? (index + 1).toString();
  const isArabic = poem.language === "ar";

  const sh =
    poem.shape === "oval" ? "oval" : poem.shape === "arch" ? "arch" : "";
  const h =
    poem.shape === "oval"
      ? "aspect-[1/1]"
      : poem.shape === "arch"
      ? "aspect-[4/5]"
      : "aspect-[5/4]";
  const widthClass = poem.shape === "oval" ? "w-[82%]" : "w-full";

  return (
    <a
      className="card group transition-transform duration-300 hover:-translate-y-1"
      href={`#/poem/${poem.slug}`}
      aria-label={`Read ${stripTags(poem.title)} by ${poetName}`}
    >
      <div className="mat flex flex-col justify-between h-full">
        <div>
          {/* Header Metadata */}
          <div className="flex items-center justify-between text-xs opacity-75">
            <span className="sc font-medium">No. {roman}</span>
            {isArabic ? (
              <span className="ar text-ember text-[0.95rem]" dir="rtl">
                {poem.meter || "شعر عربي"}
              </span>
            ) : (
              <span className="sc text-ember">{poem.era}</span>
            )}
          </div>

          {/* Picture with Gilt Frame */}
          <div
            className={`clip ${sh} mx-auto mt-3 ${h} ${widthClass} transition-shadow duration-300 group-hover:shadow-lg`}
            style={{ boxShadow: "0 0 0 3px #9a6b1f, 0 0 0 5px #34190a" }}
          >
            <div
              className={`dpic ${poem.img} h-full w-full`}
              style={{ backgroundPosition: poem.pos }}
            />
          </div>

          {/* Titles: Clean Separation without Intervention */}
          <div className="mt-5 text-center">
            {isArabic ? (
              <>
                <h3
                  className="ar text-2xl text-ink leading-snug font-medium"
                  dir="rtl"
                >
                  <bdi>{poem.titleAr || stripTags(poem.title)}</bdi>
                </h3>
                <p
                  className="disp mt-1 text-sm italic text-ink/80 leading-normal"
                  dir="ltr"
                >
                  <bdi>{stripTags(poem.title)}</bdi>
                </p>
              </>
            ) : (
              <>
                <h3
                  className="disp text-[1.55rem] text-ink leading-tight font-normal"
                  dir="ltr"
                  dangerouslySetInnerHTML={{ __html: poem.title }}
                />
                {poem.titleAr && (
                  <p
                    className="ar mt-1 text-lg text-ember leading-snug"
                    dir="rtl"
                  >
                    <bdi>{poem.titleAr}</bdi>
                  </p>
                )}
              </>
            )}
          </div>

          {/* Poet Attribution */}
          <div className="mt-2 text-center text-xs">
            {isArabic ? (
              <div className="flex items-center justify-center gap-1.5" dir="rtl">
                {po?.ar && <span className="ar text-base text-ember font-medium">{po.ar}</span>}
                <span className="sc opacity-70 text-[11px]" dir="ltr">({poetName})</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-1.5" dir="ltr">
                <span className="sc text-sm text-ink font-medium">{poetName}</span>
                {po?.ar && <span className="ar text-sm text-ember" dir="rtl">({po.ar})</span>}
              </div>
            )}
          </div>
        </div>

        {/* Footer: Tags & Translation Indicator */}
        <div className="mt-4 pt-3 border-t border-ink/10">
          <div className="flex items-center justify-center gap-2 text-[11px]">
            <span className="tag py-0.5 px-2 text-[10px] bg-amber-950/5 text-ink/70">
              {isArabic ? "العربية" : "English"}
            </span>
            <span className="tag py-0.5 px-2 text-[10px] bg-ember/10 text-ember border-ember/30 font-medium">
              Bilingual (ثنائي اللغة)
            </span>
          </div>
        </div>
      </div>
    </a>
  );
}
