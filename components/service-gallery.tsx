"use client";

import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";

type GalleryImage = { src: string; alt: string };

export function ServiceGallery({ title, images }: { title: string; images: GalleryImage[] }) {
  const [viewportRef, carousel] = useEmblaCarousel({ align: "start", loop: false });
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!carousel) return;
    const update = () => setIndex(carousel.selectedScrollSnap());
    update();
    carousel.on("select", update);
    carousel.on("reInit", update);
    return () => {
      carousel.off("select", update);
      carousel.off("reInit", update);
    };
  }, [carousel]);

  return (
    <section className="service-preview service-gallery" aria-roledescription="carrossel" aria-label={`Imagens de ${title}`}>
      <div ref={viewportRef} className="service-gallery-viewport" tabIndex={0}
        aria-label="Arraste para os lados ou use as teclas de seta para ver as imagens"
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") { event.preventDefault(); carousel?.scrollPrev(); }
          if (event.key === "ArrowRight") { event.preventDefault(); carousel?.scrollNext(); }
        }}>
        <div className="service-gallery-track">
          {images.map((photo, photoIndex) => (
            <div className="service-gallery-slide" key={photo.src} aria-hidden={photoIndex !== index}>
              <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" draggable={false} />
            </div>
          ))}
        </div>
      </div>
      <div className="service-gallery-indicators" aria-hidden="true">
        {images.map((photo, photoIndex) => (
          <span key={photo.src} className={photoIndex === index ? "is-active" : undefined} />
        ))}
      </div>
      <span className="sr-only" aria-live="polite" aria-atomic="true">Imagem {index + 1} de {images.length}</span>
    </section>
  );
}