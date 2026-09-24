"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function HeroVisual({ children }: { children: ReactNode }) {
  const photo = useRef<HTMLImageElement>(null);
  const frameId = useRef(0);
  const position = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => () => cancelAnimationFrame(frameId.current), []);

  const animate = () => {
    const current = position.current;
    current.x += (target.current.x - current.x) * 0.09;
    current.y += (target.current.y - current.y) * 0.09;
    if (photo.current) {
      photo.current.style.transform = `translate3d(${current.x}px, ${current.y}px, 0)`;
    }
    if (Math.abs(target.current.x - current.x) + Math.abs(target.current.y - current.y) > 0.05) {
      frameId.current = requestAnimationFrame(animate);
    } else {
      frameId.current = 0;
    }
  };

  const schedule = () => {
    if (!frameId.current) frameId.current = requestAnimationFrame(animate);
  };

  return (
    <div
      className="hero-visual"
      onPointerMove={(event) => {
        if (event.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        target.current = {
          x: (0.5 - Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width))) * 64,
          y: (0.5 - Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height))) * 48,
        };
        schedule();
      }}
      onPointerLeave={() => {
        target.current = { x: 0, y: 0 };
        schedule();
      }}
    >
      <div className="hero-media">
        <img ref={photo} src="/images/hero.jpg" alt="Projeto de interiores desenvolvido pelo Studio M.B.R." className="hero-photo" draggable={false} fetchPriority="high" loading="eager" decoding="async" />
      </div>
      <div className="hero-content">{children}</div>
    </div>
  );
}
