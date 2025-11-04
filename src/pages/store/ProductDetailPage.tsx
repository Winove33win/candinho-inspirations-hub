import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Seo from "@/components/seo/Seo";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";

function formatCurrency(amount: number, currency: string | null) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: currency ?? "BRL",
    minimumFractionDigits: 2,
  }).format(amount / 100);
}

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: profile } = useUserProfile();
  const { addItem } = useCart();
  const isProfessional = profile?.role === "professional" || profile?.role === "admin";

  const { data, isLoading } = useQuery({
    queryKey: ["product-detail", slug, profile?.role],
    enabled: !!slug,
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_product_with_price", {
        p_product_slug: slug,
      });
      if (error) throw error;
      return data?.[0] ?? null;
    },
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <span className="animate-pulse text-sm text-zinc-500">Carregando produto...</span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-10 text-center">
        <p className="text-lg text-zinc-400">Produto não encontrado.</p>
      </div>
    );
  }

  const gallery: string[] = Array.isArray(data.gallery_urls) ? data.gallery_urls : [];
  const priceVisible = data.professional_price_cents !== null && isProfessional;
  const priceValue = data.professional_price_cents ?? 0;
  const priceCurrency = data.professional_price_currency ?? "BRL";

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: data.name,
    description: data.description ?? undefined,
    image: gallery,
  };

  if (priceVisible) {
    jsonLd.offers = {
      "@type": "Offer",
      priceCurrency: priceCurrency,
      price: (priceValue / 100).toFixed(2),
      availability: "https://schema.org/InStock",
    };
  }

  return (
    <>
      <Seo
        title={`${data.name} — Loja SMARTx`}
        description={data.description ?? undefined}
        jsonLd={jsonLd}
      />
      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <section className="space-y-4">
          <div className="overflow-hidden rounded-2xl border border-zinc-800">
            {gallery.length ? (
              <img src={gallery[0]} alt={data.name} className="h-auto w-full object-cover" loading="lazy" />
            ) : (
              <div className="flex aspect-[16/10] items-center justify-center text-sm text-zinc-500">Imagem em breve</div>
            )}
          </div>
          {gallery.length > 1 && (
            <div className="flex gap-3 overflow-x-auto">
              {gallery.map((image) => (
                <img key={image} src={image} alt="Miniatura" className="h-24 w-24 rounded-lg border border-zinc-800 object-cover" />
              ))}
            </div>
          )}
        </section>
        <section className="flex flex-col gap-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8">
          <div className="space-y-3">
            <h1 className="text-3xl font-semibold text-white">{data.name}</h1>
            {data.description && <p className="text-sm text-zinc-400">{data.description}</p>}
          </div>
          {priceVisible ? (
            <div>
              <p className="text-lg font-semibold text-emerald-400">
                {formatCurrency(priceValue, priceCurrency)}
              </p>
              <p className="text-xs text-zinc-500">Preço exclusivo para profissionais verificados.</p>
            </div>
          ) : (
            <div className="rounded-xl border border-zinc-700 bg-zinc-900/40 px-4 py-4 text-sm text-zinc-400">
              <p>Preços disponíveis apenas para profissionais aprovados.</p>
              <div className="mt-3 flex gap-3">
                <Button asChild size="sm">
                  <Link to={profile ? "/dashboard" : "/auth"}>Solicitar acesso profissional</Link>
                </Button>
              </div>
            </div>
          )}
          <div className="mt-auto flex gap-3">
            {priceVisible && (
              <Button
                onClick={() =>
                  addItem({
                    productId: data.id,
                    slug: data.slug,
                    name: data.name,
                    priceCents: priceValue,
                    currency: priceCurrency,
                  })
                }
              >
                Adicionar ao carrinho
              </Button>
            )}
            <Button asChild variant="outline" className="border-zinc-700 text-zinc-200">
              <Link to="/store">Voltar para a loja</Link>
            </Button>
          </div>
        </section>
      </div>
    </>
  );
}
