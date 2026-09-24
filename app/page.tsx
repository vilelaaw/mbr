"use client";

import { useEffect, useState } from "react";
import { ServicesCarousel } from "../components/services-carousel";
import { ArrowRight, Mail, Menu, X } from "lucide-react";
import { HeroVisual } from "../components/hero-visual";
import { ProjectGallery } from "../components/project-gallery";

const navigation = [
  { label: "Sobre mim", href: "#sobre" },
  { label: "Serviços", href: "#servicos" },
  { label: "Projetos", href: "#projetos" },

  { label: "Contato", href: "#contato" },
];

const introTitle = "STUDIO M.B.R";

const services = [
  {
    number: "01",
    title: "Projeto de Interiores",
    description:
      "A chance de ter a casa dos seus sonhos é agora. Vamos transformar sua ideia em realidade, do papel à execução, com excelência.",
    images: [
      { src: "/images/servico-projeto-cozinha.jpg", alt: "Cozinha planejada com armários claros e bancada preta." },
      { src: "/images/servico-projeto-cristaleira.jpg", alt: "Buffet com cristaleira iluminada, painel de madeira e adega." },
    ],
  },
  {
    number: "02",
    title: "Consultoria de Interiores",
    description:
      "Praticidade e custo-benefício para colocar em prática o que você idealiza, sem abrir mão da qualidade.",
    images: [
      { src: "/images/servico-consultoria-banheiro.jpg", alt: "Banheiro com gabinete claro, nichos de madeira e espelho iluminado." },
      { src: "/images/servico-consultoria-lavabo.jpg", alt: "Lavabo com gabinete ripado de madeira e bancada preta." },
    ],
  },
  {
    number: "03",
    title: "Prestação de Serviços",
    description:
      "Para arquitetos e marceneiros sobrecarregados: entregamos serviços alinhados à imagem e ao padrão da sua empresa.",
    images: [
      { src: "/images/servico-parceria-bicicletario-aberto.jpg", alt: "Bicicletário sob medida aberto, com nichos de madeira iluminados." },
      { src: "/images/servico-parceria-bicicletario-perspectiva.jpg", alt: "Vista em perspectiva do bicicletário com portas de vidro e estrutura preta." },
      { src: "/images/servico-parceria-bicicletario-fechado.jpg", alt: "Vista frontal do bicicletário com portas de vidro fechadas." },
    ],
  },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [introVisible, setIntroVisible] = useState(true);
  const [heroPassed, setHeroPassed] = useState(false);
  const [navbarHidden, setNavbarHidden] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    let previousY = window.scrollY;
    const updateDirection = () => {
      const currentY = window.scrollY;
      if (currentY !== previousY) setNavbarHidden(currentY > previousY && currentY > 20);
      previousY = currentY;
    };
    window.addEventListener("scroll", updateDirection, { passive: true });
    return () => window.removeEventListener("scroll", updateDirection);
  }, []);

  useEffect(() => {
    document.body.classList.add("intro-active");
    const introTimer = window.setTimeout(() => {
      document.body.classList.remove("intro-active");
      setIntroVisible(false);
    }, 1100);

    return () => {
      window.clearTimeout(introTimer);
      document.body.classList.remove("intro-active");
    };
  }, []);

  useEffect(() => {
    const updateHeroState = () => {
      const hero = document.querySelector<HTMLElement>(".hero-visual");
      if (!hero) return;
      setHeroPassed(hero.getBoundingClientRect().bottom <= 72);
    };
    window.addEventListener("scroll", updateHeroState, { passive: true });
    window.addEventListener("resize", updateHeroState);
    updateHeroState();
    return () => {
      window.removeEventListener("scroll", updateHeroState);
      window.removeEventListener("resize", updateHeroState);
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const items = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );

    root.classList.add("reveal-enabled");
    let animationFrame = 0;

    const revealVisibleItems = () => {
      animationFrame = 0;
      const triggerLine = window.innerHeight * 0.9;

      items.forEach((item) => {
        if (item.classList.contains("is-visible")) return;
        const bounds = item.getBoundingClientRect();

        if (bounds.top <= triggerLine && bounds.bottom >= 0) {
          item.classList.add("is-visible");
        }
      });
    };

    const scheduleReveal = () => {
      if (animationFrame) return;
      animationFrame = window.requestAnimationFrame(revealVisibleItems);
    };

    window.addEventListener("scroll", scheduleReveal, { passive: true });
    window.addEventListener("resize", scheduleReveal);
    scheduleReveal();

    return () => {
      window.removeEventListener("scroll", scheduleReveal);
      window.removeEventListener("resize", scheduleReveal);
      window.cancelAnimationFrame(animationFrame);
      root.classList.remove("reveal-enabled");
    };
  }, []);

  useEffect(() => {
    const motionFrames = Array.from(
      document.querySelectorAll<HTMLElement>("[data-image-motion]"),
    );
    let animationFrame = 0;

    const updateImageMotion = () => {
      animationFrame = 0;
      const viewportCenter = window.innerHeight / 2;
      const motionRange = window.innerWidth < 768 ? 8 : 12;

      motionFrames.forEach((frame) => {
        const bounds = frame.getBoundingClientRect();
        const frameCenter = bounds.top + bounds.height / 2;
        const distance = (frameCenter - viewportCenter) / window.innerHeight;
        const progress = Math.max(-1, Math.min(1, distance));
        frame.style.setProperty(
          "--image-shift",
          `${(-progress * motionRange).toFixed(2)}px`,
        );
      });

    };

    const scheduleImageMotion = () => {
      if (animationFrame) return;
      animationFrame = window.requestAnimationFrame(updateImageMotion);
    };

    window.addEventListener("scroll", scheduleImageMotion, { passive: true });
    window.addEventListener("resize", scheduleImageMotion);
    scheduleImageMotion();

    return () => {
      window.removeEventListener("scroll", scheduleImageMotion);
      window.removeEventListener("resize", scheduleImageMotion);
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  useEffect(() => {
    const panFrames = Array.from(
      document.querySelectorAll<HTMLElement>("[data-image-pan]"),
    );

    const cleanups = panFrames.map((frame) => {
      const updatePosition = (event: PointerEvent) => {
        if (event.pointerType !== "mouse") return;

        const bounds = (frame.querySelector(".hero-media") ?? frame).getBoundingClientRect();
        const x = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
        const y = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height));
        const panRange = window.innerWidth < 768 ? 8 : 12;

        frame.style.setProperty("--image-pan-x", `${((.5 - x) * panRange * 2).toFixed(2)}px`);
        frame.style.setProperty("--image-pan-y", `${((.5 - y) * panRange * 2).toFixed(2)}px`);
      };

      const resetMousePosition = (event: PointerEvent) => {
        if (event.pointerType !== "mouse") return;
        frame.style.setProperty("--image-pan-x", "0px");
        frame.style.setProperty("--image-pan-y", "0px");
      };

      frame.addEventListener("pointermove", updatePosition);
      frame.addEventListener("pointerleave", resetMousePosition);

      return () => {
        frame.removeEventListener("pointermove", updatePosition);
        frame.removeEventListener("pointerleave", resetMousePosition);
      };
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);

  return (
    <main className="overflow-x-clip bg-ice text-ink" data-hero-ready={!introVisible}>
      {introVisible && (
        <div className="site-intro" aria-hidden="true">
          <div className="intro-content">
            <p className="intro-title">
              {Array.from(introTitle).map((letter, index) => (
                <span
                  key={`${letter}-${index}`}
                  style={{ animationDelay: `${0.04 + index * 0.025}s` }}
                >
                  {letter === " " ? "\u00a0" : letter}
                </span>
              ))}
            </p>
            <p className="intro-name">
              <span>manuele barbosa</span>
            </p>
          </div>
        </div>
      )}

      <header className={`floating-header ${navbarHidden ? "is-hidden-on-scroll" : ""}`}>
        <div className="floating-nav">
          <a href="#inicio" className="brand-mark" onClick={closeMenu}>
            M.B.R
          </a>

          <nav
            className="hidden items-center gap-5 md:flex lg:gap-6"
            aria-label="Navegação principal"
          >
            {navigation.map((item) => (
              <a key={item.href} href={item.href} className="nav-link">
                {item.label}
              </a>
            ))}
          </nav>

          <a
            href="https://wa.me/5519988201292"
            target="_blank"
            rel="noreferrer"
            className="header-contact hidden md:inline-flex"
          >
            Vamos conversar <ArrowRight size={16} strokeWidth={1.8} />
          </a>

          <button
            type="button"
            className="flex size-11 items-center justify-center rounded-full border border-white/25 md:hidden"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
            aria-controls="menu-mobile"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? (
              <X size={20} strokeWidth={1.5} />
            ) : (
              <Menu size={20} strokeWidth={1.5} />
            )}
          </button>
        </div>

        <div
          id="menu-mobile"
          className={`floating-mobile-menu absolute inset-x-0 top-full px-5 transition-[opacity,transform,visibility] duration-300 md:hidden ${menuOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"}`}
        >
          <nav className="flex flex-col py-5" aria-label="Navegação móvel">
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="border-b border-white/20 py-4 text-base last:border-b-0"
                onClick={closeMenu}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <section id="inicio">
        <div className="hero-shell">
          <HeroVisual>
            <div className="hero-mobile-layout">
            <div className="hero-caption">
              <p>Interiores que inspiram e abraçam</p>
              <a href="https://wa.me/5519988201292" target="_blank" rel="noreferrer" aria-label="Conversar pelo WhatsApp">
                <ArrowRight size={24} strokeWidth={1.5} />
              </a>
            </div>
            <h1 className="hero-brand" aria-label="Studio M.B.R">
              Studio <span>M.B.R</span>
            </h1>
            <div className="hero-mobile-summary">
              <p>Arquitetura e interiores pensados<br />para a sua forma de viver.</p>
              <a href="#projetos" className="hero-projects-button">
                Conheça nossos projetos <ArrowRight size={20} strokeWidth={1.5} aria-hidden="true" />
              </a>
            </div>
            </div>
          </HeroVisual>

        </div>
      </section>

      <section
        id="sobre"
        className="section-beige scroll-mt-20 px-5 py-24 sm:px-8 sm:py-32 lg:px-12 lg:py-40"
      >
        <div data-reveal className="reveal-item mx-auto max-w-[94rem]">
          <div className="about-panel">
              <div className="about-portrait">
                <img
                  src="/images/manuele.jpg"
                  alt="Manuele Barbosa, designer de interiores"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            <div className="about-details">
              <p className="about-kicker">01 · Studio M.B.R.</p>
              <h2 className="about-title">Sobre mim</h2>
              <div className="about-introduction">
                <h3>Prazer, Manuele Barbosa.</h3>
                <p>
                  Transformar espaços em lugares que inspiram e abraçam: esse é
                  o meu propósito e o que define a essência do meu trabalho como
                  Designer de Interiores.
                </p>
                <p>
                  Ao longo de mais de 5 anos de experiência, desenvolvi soluções
                  que unem criatividade e técnica, onde ofereço soluções
                  completas, desde consultorias e projetos de interiores, até
                  parcerias em marcenaria e conferência técnica.
                </p>
              </div>
              <div className="about-facts">
                <div>
                  <h3>Softwares</h3>
                  <ul>
                    <li>AutoCAD</li>
                    <li>SketchUp</li>
                    <li>V-ray</li>
                    <li>Revit</li>
                    <li>Promob</li>
                    <li>Lumion</li>
                    <li>Pacote Office</li>
                  </ul>
                </div>
                <div>
                  <h3>Linguagem</h3>
                  <ul>
                    <li>Inglês Intermediário</li>
                    <li>Espanhol Básico</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="servicos"
        className="scroll-mt-20 px-5 py-24 sm:px-8 sm:py-32 lg:px-12 lg:py-40"
      >
        <div
          data-reveal
          className="reveal-item services-panel mx-auto max-w-[94rem]"
        >
          <div className="section-kicker">
            <span>02</span>
            <span>Serviços</span>
          </div>
          <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="editorial-title max-w-4xl">
              Soluções para cada etapa do seu projeto.
            </h2>
          </div>

          <div className="mt-12">
            <ServicesCarousel services={services} />
          </div>
        </div>
      </section>

      <section
        id="projetos"
        className="section-beige scroll-mt-20 px-5 py-24 sm:px-8 sm:py-32 lg:px-12 lg:py-40"
      >
        <div data-reveal className="reveal-item mx-auto max-w-[94rem]">
          <div className="section-kicker">
            <span>03</span>
            <span>Projetos</span>
          </div>
          <div className="mt-12 grid gap-10 lg:grid-cols-1 lg:gap-12">
            <div className="project-copy">
              <h2 className="editorial-title">
                Ideias que se tornam espaços reais.
              </h2>
            </div>
            <div className="min-w-0">
              <ProjectGallery />
            </div>
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-base leading-8 text-taupe sm:text-lg">
                Os projetos nascem da escuta e da compreensão das necessidades
                do cliente. Do conceito ao detalhamento, equilibramos
                funcionalidade e estética, da fachada ao ambiente interno.
              </p>
              <a
                href="https://wa.me/5519988201292"
                target="_blank"
                rel="noreferrer"
                className="footer-action mt-8"
              >
                Envie sua ideia <ArrowRight size={18} strokeWidth={1.6} />
              </a>
            </div>
          </div>
        </div>
      </section>



      <section
        id="missao"
        className="px-5 py-24 sm:px-8 sm:py-32 lg:px-12 lg:py-44"
      >
        <div data-reveal className="reveal-item mx-auto max-w-[94rem]">
          <div className="section-kicker">
            <span>04</span>
            <span>Nossa missão</span>
          </div>
          <blockquote className="mx-auto mt-16 max-w-[76rem] text-center">
            <p className="font-heading text-[clamp(2.75rem,6vw,6.5rem)] font-light leading-[0.98] tracking-[-0.045em]">
              Criamos conexões entre as emoções e os ambientes.
            </p>
            <p className="mx-auto mt-10 max-w-2xl text-base leading-8 text-taupe sm:text-lg">
              Cada projeto é uma oportunidade de criar algo único, respeitando
              as histórias e os sonhos de cada cliente. Aqui, a arte encontra a
              técnica.
            </p>
          </blockquote>
        </div>
      </section>

      <footer
        id="contato"
        className="section-beige scroll-mt-20 px-5 pb-8 pt-24 sm:px-8 sm:pt-32 lg:px-12 lg:pt-40"
      >
        <div data-reveal className="reveal-item mx-auto max-w-[94rem]">
          <div className="section-kicker">
            <span>05</span>
            <span>Contato</span>
          </div>
          <div className="contact-content mx-auto flex max-w-6xl flex-col items-center border-b border-sand pb-24 pt-14 text-center sm:pt-24">
            <h2 className="font-heading text-[clamp(3.25rem,7.5vw,8rem)] font-light leading-[0.98] tracking-[-0.05em]">
              Vamos criar<br />juntos?
            </h2>
            <a
              href="https://wa.me/5519988201292"
              target="_blank"
              rel="noreferrer"
              className="footer-action mt-14 inline-flex rounded-sm border border-current px-5 py-4"
            >
              Chamar no WhatsApp <ArrowRight size={20} strokeWidth={1.6} />
            </a>
            <address className="mt-6 flex items-center justify-center gap-4 not-italic">
              <a href="https://www.instagram.com/mbr.interiores/" target="_blank" rel="noreferrer"
                className="flex size-11 items-center justify-center rounded-full transition-colors hover:bg-sand/40"
                aria-label="Instagram do Studio M.B.R" title="Instagram">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a href="mailto:mmanu.barbosa01@gmail.com"
                className="flex size-11 items-center justify-center rounded-full transition-colors hover:bg-sand/40"
                aria-label="Enviar e-mail ao Studio M.B.R" title="E-mail">
                <Mail size={24} strokeWidth={1.8} aria-hidden="true" />
              </a>
            </address>
          </div>

          <div className="flex items-center justify-between gap-3 py-7 text-xs text-taupe sm:text-sm">
            <p>Studio M.B.R. · Manuele Barbosa</p>
            <p>Design de Interiores</p>
          </div>
        </div>
      </footer>
      <a
        href="https://wa.me/5519988201292"
        target="_blank"
        rel="noreferrer"
        className={`whatsapp-floating ${heroPassed ? "is-visible-after-hero" : ""}`}
        aria-label="Conversar com o Studio M.B.R pelo WhatsApp"
        title="Conversar pelo WhatsApp"
      >
        <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor" aria-hidden="true">
          <path d="M20.52 3.48A11.9 11.9 0 0 0 12.05 0C5.46 0 .1 5.36.1 11.95c0 2.1.55 4.16 1.6 5.97L0 24l6.24-1.64a11.96 11.96 0 0 0 5.81 1.48h.01C18.65 23.84 24 18.48 24 11.89c0-3.19-1.24-6.2-3.48-8.41ZM12.06 21.82a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.71.97.99-3.62-.24-.37a9.9 9.9 0 0 1-1.52-5.26c0-5.48 4.46-9.94 9.95-9.94a9.87 9.87 0 0 1 7.03 2.91 9.88 9.88 0 0 1 2.91 7.03c0 5.48-4.47 9.94-9.95 9.94Zm5.45-7.44c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.18-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.21 5.08 4.5.71.31 1.27.5 1.7.63.71.23 1.36.2 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35Z" />
        </svg>
      </a>
    </main>
  );
}
