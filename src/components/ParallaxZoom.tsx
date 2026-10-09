"use client";

import { useEffect } from "react";

export default function ParallaxZoom() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ticking = false;

    function update() {
      ticking = false;
      const zoomEls = document.querySelectorAll<HTMLElement>("[data-zoom]");
      zoomEls.forEach((e) => {
        const r = e.getBoundingClientRect();
        const p = Math.min(
          1,
          Math.max(0, (window.innerHeight - r.top) / (window.innerHeight + r.height))
        );
        e.style.transform = `scale(${1 + 0.09 * p})`;
      });

      const speedEls = document.querySelectorAll<HTMLElement>("[data-speed]");
      speedEls.forEach((e) => {
        const parent = e.parentElement;
        if (!parent) return;
        const r = parent.getBoundingClientRect();
        const speed = parseFloat(e.dataset.speed || "0");
        e.style.transform = `translateY(${
          (r.top + r.height / 2 - window.innerHeight / 2) * speed
        }px)`;
      });
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return null;
}
