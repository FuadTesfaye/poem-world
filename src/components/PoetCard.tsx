import React from "react";
import { Poet } from "@/data/diwan";

interface PoetCardProps {
  poet: Poet;
}

export default function PoetCard({ poet }: PoetCardProps) {
  const customBg = poet.imageSrc ? { backgroundImage: `url(${poet.imageSrc})` } : {};

  return (
    <a className="card transition-all duration-300 hover:-translate-y-1" href={`#/poet/${poet.slug}`}>
      <div className="mat text-center">
        <div
          className="clip oval mx-auto h-36 w-36 overflow-hidden"
          style={{ boxShadow: "0 0 0 3px #9a6b1f, 0 0 0 5px #34190a" }}
        >
          <div
            className={`dpic ${poet.img} h-full w-full`}
            style={{
              backgroundPosition: poet.pos,
              backgroundSize: "cover",
              ...customBg,
            }}
          />
        </div>
        <h3 className="disp mt-5 text-[1.7rem] leading-tight text-ink">{poet.name}</h3>
        {poet.ar && <p className="ar text-xl text-ember font-medium mt-0.5">{poet.ar}</p>}
        <p className="sc mt-1 text-sm opacity-80">
          {poet.years} &nbsp;&middot;&nbsp; {poet.era}
        </p>
        <p className="mt-3 text-sm italic opacity-85 leading-relaxed">{poet.tag}</p>
        <div className="mt-4 flex flex-wrap justify-center gap-1">
          {poet.themes.slice(0, 3).map((theme) => (
            <span
              key={theme}
              className="text-[0.7rem] uppercase tracking-wider px-2 py-0.5 border border-ink/20 text-ink/75"
            >
              {theme}
            </span>
          ))}
        </div>
      </div>
    </a>
  );
}
