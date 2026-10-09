"use client";

import React, { useState, useEffect, useRef } from "react";
import Landing from "@/components/Landing";
import Diwan from "@/components/Diwan";
import ParallaxZoom from "@/components/ParallaxZoom";
import { POEMS, getPoet, getPoem, stripTags } from "@/data/diwan";

const LANDING_TITLE = "Art-Nature — a place where poetry meets beauty";

function isDw(hash: string): boolean {
  return /^#\/(poems|poets|poem|poet|about)(\/|$)/.test(hash);
}

export default function Home() {
  const [mounted, setMounted] = useState<boolean>(false);
  const [isDiwan, setIsDiwan] = useState<boolean>(false);
  const [routeParts, setRouteParts] = useState<string[]>([]);
  const prevWasDiwan = useRef<boolean>(false);

  useEffect(() => {
    setMounted(true);

    function handleRoute(first: boolean) {
      const hash = window.location.hash;
      const diwanMode = isDw(hash);

      if (!diwanMode) {
        setIsDiwan(false);
        document.title = LANDING_TITLE;

        const targetId = hash.replace(/^#/, "");
        if (targetId && !targetId.startsWith("/")) {
          const el = document.getElementById(targetId);
          if (el) {
            el.scrollIntoView();
          } else {
            window.scrollTo(0, 0);
          }
        } else if (prevWasDiwan.current || first) {
          window.scrollTo(0, 0);
        }
        window.dispatchEvent(new Event("scroll"));
        prevWasDiwan.current = false;
        return;
      }

      setIsDiwan(true);
      prevWasDiwan.current = true;

      const parts = hash.replace(/^#\/?/, "").split("/");
      setRouteParts(parts);

      let title = "Diwan — a house of poems";
      let scrollTarget: string | null = null;

      if (parts[0] === "poem" && parts[1]) {
        const poem = getPoem(parts[1]);
        if (poem) {
          const poet = getPoet(poem.poet);
          title = `${stripTags(poem.title)} — ${poet ? poet.name : poem.poet} · Diwan`;
        }
      } else if (parts[0] === "poet" && parts[1]) {
        const poet = getPoet(parts[1]);
        if (poet) {
          title = `${poet.name} · Diwan`;
        }
      } else if (parts[0] === "poets") {
        title = "The Poets · Diwan";
      } else if (parts[0] === "about") {
        title = "About · Diwan";
      } else {
        if (parts[0] === "poems" && parts[1] === "list") {
          scrollTarget = "poems";
        }
      }

      document.title = title;

      if (scrollTarget) {
        setTimeout(() => {
          const s = document.getElementById(scrollTarget!);
          if (s) s.scrollIntoView();
        }, 10);
      } else {
        window.scrollTo(0, 0);
      }
    }

    handleRoute(true);

    const onHashChange = () => handleRoute(false);
    window.addEventListener("hashchange", onHashChange);

    return () => {
      window.removeEventListener("hashchange", onHashChange);
    };
  }, []);

  return (
    <>
      <ParallaxZoom />
      <Landing hidden={mounted && isDiwan} />
      <Diwan routeParts={routeParts} hidden={!mounted || !isDiwan} />
    </>
  );
}
