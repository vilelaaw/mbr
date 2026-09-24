"use client";

import { useRef, useState } from "react";
import "./services-carousel.css";

type Service = { number: string; title: string; description: string; images: { src: string; alt: string }[] };

export function ServicesCarousel({ services }: { services: Service[] }) {
  const [active, setActive] = useState(0);
  const [photo, setPhoto] = useState(0);
  const gesture = useRef<{ x: number; y: number } | null>(null);
  const suppressClick = useRef(false);
  const select = (index: number) => { setActive((index + services.length) % services.length); setPhoto(0); };
  const current = services[active];
  return <section className="services-carousel" aria-label="Serviços" aria-roledescription="carrossel">
    <div className="services-carousel-track" data-active={active} role="group" aria-label="Selecione um serviço"
      onKeyDown={(event) => {
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
        event.preventDefault();
        select(active + (event.key === "ArrowRight" ? 1 : -1));
        const track = event.currentTarget;
        requestAnimationFrame(() => track.querySelector<HTMLButtonElement>('[data-position="0"]')?.focus());
      }}
      onPointerDown={(event) => { gesture.current = { x: event.clientX, y: event.clientY }; suppressClick.current = false; }}
      onPointerCancel={() => { gesture.current = null; }}
      onPointerUp={(event) => {
        const start = gesture.current;
        gesture.current = null;
        if (!start) return;
        const dx = event.clientX - start.x;
        if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(event.clientY - start.y) * 1.3) {
          suppressClick.current = true;
          select(active + (dx < 0 ? 1 : -1));
        }
      }}
      onClickCapture={(event) => {
        if (suppressClick.current) { event.preventDefault(); event.stopPropagation(); suppressClick.current = false; }
      }}>
      {services.map((service, index) => {
        const position = (index - active + services.length) % services.length;
        const image = service.images[index === active ? photo : 0];
        return <button type="button" key={service.number} className="services-carousel-card" data-position={position}
          aria-label={`Ver ${service.title}; clique novamente para trocar a foto`} aria-pressed={index === active}
          onMouseEnter={() => { if (window.matchMedia("(hover: hover) and (min-width: 1024px)").matches && index !== active) select(index); }}
          onFocus={() => { if (index !== active) select(index); }}
          onClick={() => { if (index === active) setPhoto((value) => (value + 1) % service.images.length); else select(index); }}>
          <img src={image.src} alt={image.alt} loading="lazy" decoding="async" draggable={false} />
          <span>{service.title}</span>
        </button>;
      })}
    </div>
    <div className="services-carousel-details" aria-live="polite">
      <h3>{current.title}</h3>
      <p>{current.description}</p>
    </div>
  </section>;
}
