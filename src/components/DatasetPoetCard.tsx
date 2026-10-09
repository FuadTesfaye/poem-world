import React from "react";
import { DatasetPoetItem } from "@/data/search/arabicOfflineEngine";
import { BookIcon } from "./Icons";

interface DatasetPoetCardProps {
  poet: DatasetPoetItem;
  onOpenDiwan: (poet: DatasetPoetItem) => void;
}

export default function DatasetPoetCard({ poet, onOpenDiwan }: DatasetPoetCardProps) {
  // Extract clean first letter for the classical illuminated cartouche
  const cleanName = poet.name.replace(/^(ال|أبو\s+|ابن\s+|أمير\s+)/, "");
  const initial = cleanName.slice(0, 1) || poet.name.slice(0, 1) || "ش";

  return (
    <div className="card transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between">
      <div className="mat text-center flex flex-col items-center">
        {/* Antique Calligraphy Medallion Cartouche */}
        <div
          className="clip oval mx-auto h-32 w-32 overflow-hidden flex items-center justify-center border-2 border-gilt/70 bg-[#f7efe0] dark:bg-[#1f140c]"
          style={{ boxShadow: "0 0 0 3px #9a6b1f, 0 0 0 5px #34190a" }}
        >
          <span className="disp text-5xl font-bold text-ember select-none font-serif pt-1">
            {initial}
          </span>
        </div>

        {/* Poet Name */}
        <h3 className="ar mt-4 text-[1.85rem] leading-snug text-ink font-medium" dir="rtl">
          <bdi>{poet.name}</bdi>
        </h3>

        {/* Era & Location Badges */}
        <p className="sc mt-1 text-sm opacity-80" dir="rtl">
          {poet.era} {poet.location ? <span>&nbsp;&middot;&nbsp; {poet.location}</span> : null}
        </p>

        {/* Biography Excerpt */}
        <p className="mt-3 text-sm italic opacity-85 leading-relaxed line-clamp-3 text-right w-full" dir="rtl">
          {poet.desc}
        </p>

        {/* Sample Couplet / Verse */}
        {poet.sampleCouplet && (
          <div className="mt-3 p-2.5 bg-amber-950/5 border border-ink/10 rounded-xs text-right text-xs italic text-ember/90 font-medium w-full" dir="rtl">
            {poet.samplePoemTitle && (
              <span className="sc text-[10px] block opacity-70 mb-0.5">{poet.samplePoemTitle}</span>
            )}
            <p className="line-clamp-1">«{poet.sampleCouplet}»</p>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="mt-4 pt-3 border-t border-ink/15 flex items-center justify-between px-2">
        <span className="sc text-[11px] text-ink/60 uppercase">
          {poet.poemCount ? `${poet.poemCount} قصيدة` : "ديوان شامل"}
        </span>
        <button
          type="button"
          onClick={() => onOpenDiwan(poet)}
          className="dbtn text-xs py-1.5 px-3.5 inline-flex items-center gap-1.5 hover:border-ember hover:text-ember transition"
        >
          <BookIcon className="w-3.5 h-3.5 text-ember" />
          <span>تصفح الديوان</span>
        </button>
      </div>
    </div>
  );
}
