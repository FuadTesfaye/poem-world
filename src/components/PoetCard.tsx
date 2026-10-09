import React from "react";
import { Poet } from "@/data/diwan";

interface PoetCardProps {
  poet: Poet;
}

export default function PoetCard({ poet }: PoetCardProps) {
  return (
    <a className="card" href={`#/poet/${poet.slug}`}>
      <div className="mat text-center">
        <div
          className="clip oval mx-auto h-36 w-36"
          style={{ boxShadow: "0 0 0 3px #9a6b1f,0 0 0 5px #34190a" }}
        >
          <div
            className={`dpic ${poet.img} h-full w-full`}
            style={{ backgroundPosition: poet.pos }}
          />
        </div>
        <h3 className="disp mt-5 text-[1.7rem] leading-tight">{poet.name}</h3>
        {poet.ar && <p className="ar text-xl text-ember">{poet.ar}</p>}
        <p className="sc mt-1 text-sm">
          {poet.years} &nbsp;&middot;&nbsp; {poet.era}
        </p>
        <p className="mt-3 text-sm italic">{poet.tag}</p>
      </div>
    </a>
  );
}
