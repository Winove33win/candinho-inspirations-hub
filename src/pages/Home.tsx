import { Button } from "@/components/ui/button";
import Seo from "@/components/seo/Seo";
import { Link } from "react-router-dom";

const features = [
  {
    title: "Blog com curadoria",
    description: "Publicações otimizadas para SEO que destacam artistas, negócios e inovação musical.",
  },
  {
    title: "Loja exclusiva",
    description: "Produtos e serviços B2B com preços visíveis apenas para profissionais verificados.",
  },
  {
    title: "Painel do músico",
    description: "Centralize cadastro artístico, verificação profissional e pedidos em um só lugar.",
  },
];

export default function Home() {
  return (
    <>
      <Seo
        title="SMARTx — Plataforma integrada para músicos profissionais"
        description="Conecte conteúdo, loja B2B e painel do artista em uma experiência única feita para profissionais da música."
        openGraph={[
          { property: "og:title", content: "SMARTx — Plataforma integrada" },
          {
            property: "og:description",
            content:
              "Conecte conteúdo, loja B2B e painel do artista em uma experiência única feita para profissionais da música.",
          },
        ]}
        twitter={[
          { name: "twitter:card", content: "summary_large_image" },
          { name: "twitter:title", content: "SMARTx" },
        ]}
      />
      <section className="space-y-10">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-10 shadow-sm">
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-400">SMARTx</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight text-white">
            Conteúdo, loja B2B e painel profissional em uma única plataforma.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-zinc-300">
            A SMARTx foi desenhada para acelerar carreiras musicais: publique artigos otimizados, venda soluções para o mercado e
            habilite profissionais com verificação segura.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Button asChild size="lg">
              <Link to="/store">Explorar Loja</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-zinc-700 text-zinc-200">
              <Link to="/blog">Ler o Blog</Link>
            </Button>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-white">{feature.title}</h2>
              <p className="mt-3 text-sm text-zinc-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
