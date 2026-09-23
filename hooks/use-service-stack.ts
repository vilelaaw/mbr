"use client";

import { useEffect } from "react";

export function useServiceStack() {
  useEffect(() => {
    const media = window.matchMedia("(max-width: 1023px) and (min-height: 650px) and (prefers-reduced-motion: no-preference)");
    const cards = Array.from(document.querySelectorAll<HTMLElement>(".service-card"));
    let frame = 0;
    const update = () => {
      frame = 0;
      if (!media.matches) {
        cards.forEach((card) => card.style.removeProperty("--stack-scale"));
        return;
      }
      const tops = cards.map((card) => card.getBoundingClientRect().top);
      cards.forEach((card, index) => {
        let scale = 1;
        for (let next = index + 1; next < cards.length; next++) {
          const pin = parseFloat(getComputedStyle(cards[next]).top);
          const progress = Math.max(0, Math.min(1, 1 - (tops[next] - pin) / (window.innerHeight * .55)));
          scale -= progress * .045;
        }
        card.style.setProperty("--stack-scale", scale.toFixed(4));
      });
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    media.addEventListener("change", schedule);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      media.removeEventListener("change", schedule);
      cards.forEach((card) => card.style.removeProperty("--stack-scale"));
    };
  }, []);
}
