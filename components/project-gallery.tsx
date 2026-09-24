"use client";

import { useRef, useState } from "react";
import { ArrowRight } from "lucide-react";

export const projects: { name: string; image: string; instagramUrl: string | null }[] = [
  { name: "Sala de Estar", image: "/images/projeto-01.jpg", instagramUrl: "https://www.instagram.com/mbr.interiores/p/C580Gmdg9Fu/" },
  { name: "Área de Lazer", image: "/images/projeto-02.jpg", instagramUrl: "https://www.instagram.com/mbr.interiores/p/C6MaBWqgBQl/" },
  { name: "Fachada de Casa", image: "/images/projeto-03.jpg", instagramUrl: "https://www.instagram.com/mbr.interiores/p/C9k36xzPFw8/" },
  { name: "Área Gourmet", image: "/images/projeto-04.jpg", instagramUrl: "https://www.instagram.com/mbr.interiores/p/C9k8W3hPFPL/" },
  { name: "Fachada de Casa", image: "/images/projeto-05.jpg", instagramUrl: "https://www.instagram.com/mbr.interiores/p/DCqA1CYu04O/" },
  { name: "Cozinha", image: "/images/projeto-06.jpg", instagramUrl: "https://www.instagram.com/mbr.interiores/p/DJjTSsoOI1Z/" },
  { name: "Suite", image: "/images/projeto-07.jpg", instagramUrl: "https://www.instagram.com/mbr.interiores/p/DJjXTrOuJV5/" },
  { name: "Sala e Cozinha", image: "/images/projeto-08.jpg", instagramUrl: "https://www.instagram.com/mbr.interiores/p/DObH_QsDlN0/" },
  { name: "Garagem Organizada", image: "/images/projeto-09.jpg", instagramUrl: "https://www.instagram.com/mbr.interiores/p/DXmxesPCZC9/" },
];

export function ProjectGallery() {
  const [active, setActive] = useState(0);
  const gesture = useRef<{ x: number; y: number } | null>(null);
  const suppressClickUntil = useRef(0);

  const firstVisible = Math.max(0, Math.min(active - 1, projects.length - 3));

  return (
    <div className="portfolio-gallery">
      <div className="portfolio-cards"
        onPointerDown={(event) => {
          if (event.pointerType !== "touch" || !window.matchMedia("(max-width: 1023px)").matches) return;
          gesture.current = { x: event.clientX, y: event.clientY };
        }}
        onPointerCancel={() => { gesture.current = null; }}
        onPointerUp={(event) => {
          const start = gesture.current;
          gesture.current = null;
          if (!start) return;
          const dx = event.clientX - start.x;
          const dy = event.clientY - start.y;
          if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy) * 1.3) return;
          suppressClickUntil.current = Date.now() + 500;
          setActive((current) => (current + (dx < 0 ? 1 : -1) + projects.length) % projects.length);
        }}
        onClickCapture={(event) => {
          if (Date.now() < suppressClickUntil.current) { event.preventDefault(); event.stopPropagation(); }
        }}>
        {projects.map((project, index) => {
          const expanded = index === active;
          return (
            <article key={index} data-mobile-visible={index >= firstVisible && index < firstVisible + 3} className={`portfolio-card ${expanded ? "is-active" : ""}`}
              onMouseEnter={() => { if (window.matchMedia("(hover: hover) and (min-width: 1024px)").matches) setActive(index); }}
              onFocus={() => { if (Date.now() >= suppressClickUntil.current) setActive(index); }}>
              <img src={project.image} alt={`Capa de ${project.name}`} loading="lazy" decoding="async" />
              <button type="button" className="portfolio-select" aria-expanded={expanded}
                aria-controls={`project-details-${index}`} onClick={() => setActive(index)}
                aria-label={`Mostrar ${project.name}`}>
                <span className="portfolio-label" aria-hidden="true">{project.name}</span>
              </button>
              <div className="portfolio-details" id={`project-details-${index}`} hidden={!expanded}>
                <h3>{project.name}</h3>
                {project.instagramUrl ? (
                  <a className="portfolio-cta" href={project.instagramUrl} target="_blank" rel="noreferrer">
                    Ver projeto <ArrowRight size={18} aria-hidden="true" />
                  </a>
                ) : (
                  <button className="portfolio-cta" type="button" disabled title="Post do projeto ainda não disponível">
                    Ver projeto <ArrowRight size={18} aria-hidden="true" />
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
