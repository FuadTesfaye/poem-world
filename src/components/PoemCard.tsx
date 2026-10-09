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
      className="card"
      href={`#/poem/${poem.slug}`}
      aria-label={`Read ${stripTags(poem.title)} by ${poetName}`}
    >
      <div className="mat">
        <p className="sc text-center text-xs opacity-70">No. {roman}</p>
        <div
          className={`clip ${sh} mx-auto mt-2 ${h} ${widthClass}`}
          style={{ boxShadow: "0 0 0 3px #9a6b1f,0 0 0 5px #34190a" }}
        >
          <div
            className={`dpic ${poem.img} h-full w-full`}
            style={{ backgroundPosition: poem.pos }}
          />
        </div>
        <h3
          className="disp mt-5 text-center text-[1.55rem] leading-tight"
          dangerouslySetInnerHTML={{ __html: poem.title }}
        />
        <p className="sc mt-1 text-center text-sm">{poetName}</p>
        <p
          className="mt-3 text-center text-sm italic opacity-80"
          dangerouslySetInnerHTML={{ __html: poem.tags.join(" &middot; ") }}
        />
      </div>
    </a>
  );
}
