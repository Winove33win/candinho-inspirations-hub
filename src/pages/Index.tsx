import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CandinhoSection from "@/components/CandinhoSection";
import LiveArtistsSection from "@/components/LiveArtistsSection";
import FeaturedArtist from "@/components/FeaturedArtist";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import type { SearchEntry } from "@/data/homepage";
import { spotlightMeta } from "@/data/homepage";

const Index = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const state = location.state as { scrollTo?: string } | null;
    if (!state) return;
    const { scrollTo } = state;
    if (scrollTo && typeof window !== "undefined") {
      window.requestAnimationFrame(() => {
        document.getElementById(scrollTo)?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
    navigate(location.pathname, { replace: true });
  }, [location, navigate]);

  useEffect(() => {
    document.title = spotlightMeta.title;
    const setMeta = (sel: string, attr: string, val: string) =>
      document.querySelector(sel)?.setAttribute(attr, val);
    setMeta('meta[name="description"]', "content", spotlightMeta.description);
    setMeta('meta[property="og:title"]', "content", spotlightMeta.title);
    setMeta('meta[property="og:description"]', "content", spotlightMeta.description);
    setMeta('meta[property="og:image"]', "content", spotlightMeta.image);
  }, []);

  const handleExplore = () => {
    document.getElementById("artistasSmartx")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSuggestionSelect = (entry: SearchEntry) => {
    navigate(entry.href);
  };

  const highlightedEvents = [
    {
      title: "Circuito SMARTx 2025",
      description: "Turnê com recitais em São Paulo, Porto Alegre e Curitiba com artistas residentes.",
      badge: "Eventos",
    },
    {
      title: "Residência de Projetos",
      description: "Mentorias e aceleração para 12 novos projetos autorais selecionados pelo júri SMARTx.",
      badge: "Projetos",
    },
    {
      title: "Encontros Comunitários",
      description: "Sessões abertas com oficinas de voz, percussão e criação de trilhas sonoras inclusivas.",
      badge: "Comunidade",
    },
  ];

  return (
    <div className="relative min-h-screen pb-20">
      <Header />
      <main className="space-y-16">
        <Hero
          onExplore={handleExplore}
          onSuggestionSelect={handleSuggestionSelect}
          onChipSelect={() => {}}
        />

        <LiveArtistsSection />

        <section id="blockProjetos" className="site-container space-y-16">
          <CandinhoSection />
        </section>

        <section id="blockEventos" className="site-container space-y-10">
          <div className="rounded-[28px] border border-[rgba(255,255,255,0.12)] bg-[rgba(18,0,0,0.7)] p-8 shadow-[0_26px_65px_rgba(0,0,0,0.45)] md:p-12">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-[rgba(255,255,255,0.08)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-[rgba(250,250,252,0.75)]">
                  Agenda
                </span>
                <h2 className="text-3xl font-bold text-white md:text-4xl">Eventos e Projetos em destaque</h2>
                <p className="max-w-2xl text-[rgba(250,250,252,0.78)]">
                  Navegue pelos próximos movimentos do ecossistema SMARTx: temporadas, residências e encontros que aproximam artistas, curadores e público.
                </p>
              </div>
              <Button
                variant="outline"
                className="min-w-[180px] justify-center border-[rgba(255,255,255,0.32)] bg-transparent text-white hover:border-[var(--brand)] hover:bg-[rgba(144,8,11,0.1)]"
                onClick={() => navigate("/candinho")}
              >
                Ver agenda completa
              </Button>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {highlightedEvents.map((item) => (
                <div
                  key={item.title}
                  className="group rounded-2xl border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.02)] p-6 transition-all duration-200 hover:-translate-y-1 hover:border-[var(--brand)]/60"
                >
                  <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.26em] text-[rgba(250,250,252,0.65)]">
                    <span>{item.badge}</span>
                    <span className="rounded-full bg-[rgba(144,8,11,0.18)] px-3 py-1 text-[var(--ink)]">Nova</span>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm text-[rgba(250,250,252,0.7)]">{item.description}</p>
                  <Link
                    to="/candinho"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--brand)] transition group-hover:translate-x-1"
                  >
                    Conferir detalhes
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <FeaturedArtist />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
