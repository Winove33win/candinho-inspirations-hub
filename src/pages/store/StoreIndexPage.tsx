import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Seo from "@/components/seo/Seo";
import { useUserProfile } from "@/hooks/useUserProfile";

interface StoreProduct {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  gallery_urls: any;
  professional_price_cents: number | null;
  professional_price_currency: string | null;
}

function formatCurrency(amount: number, currency: string | null) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: currency ?? "BRL",
    minimumFractionDigits: 2,
  }).format(amount / 100);
}

export default function StoreIndexPage() {
  const { data: profile } = useUserProfile();
  const isProfessional = profile?.role === "professional" || profile?.role === "admin";

  const { data, isLoading } = useQuery({
    queryKey: ["store-products", profile?.role],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("v_products_for_user")
        .select("id, slug, name, description, gallery_urls, professional_price_cents, professional_price_currency")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as StoreProduct[];
    },
  });

  return (
    <>
      <Seo
        title="Loja SMARTx — Produtos e serviços para profissionais da música"
        description="Acesse soluções exclusivas para o mercado musical. Preços disponíveis somente para profissionais verificados."
      />
      <div className="mb-10 flex flex-col gap-4">
        <p className="text-sm uppercase tracking-[0.3em] text-emerald-400">Loja</p>
        <h1 className="text-3xl font-semibold text-white">Produtos para fortalecer o seu negócio musical</h1>
        <p className="max-w-2xl text-sm text-zinc-400">
          Ferramentas, consultorias e recursos criados para artistas e equipes profissionais. Solicite verificação para liberar preços
          e checkout.
        </p>
      </div>
      {isLoading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <span className="animate-pulse text-sm text-zinc-500">Carregando catálogo...</span>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {data?.map((product) => (
            <article key={product.id} className="flex flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40">
              <div className="aspect-[4/3] w-full bg-zinc-800">
                {Array.isArray(product.gallery_urls) && product.gallery_urls[0] ? (
                  <img src={product.gallery_urls[0]} alt={product.name} className="h-full w-full object-cover" loading="lazy" />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-zinc-600">Imagem em breve</div>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-4 p-6">
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-white">{product.name}</h2>
                  {product.description && <p className="text-sm text-zinc-400">{product.description}</p>}
                </div>
                {product.professional_price_cents !== null && isProfessional ? (
                  <p className="text-lg font-semibold text-emerald-400">
                    {formatCurrency(product.professional_price_cents, product.professional_price_currency)}
                  </p>
                ) : (
                  <div className="rounded-xl border border-zinc-700 bg-zinc-900/40 px-4 py-3 text-sm text-zinc-400">
                    Exclusivo para profissionais — {profile ? "Solicite verificação" : "Entre para solicitar acesso"}
                  </div>
                )}
                <div className="mt-auto flex gap-3">
                  <Button asChild variant="outline" className="border-zinc-700 text-zinc-200">
                    <Link to={`/store/${product.slug}`}>Ver detalhes</Link>
                  </Button>
                  {!isProfessional && (
                    <Button asChild>
                      <Link to={profile ? "/dashboard" : "/auth"}>Solicitar acesso profissional</Link>
                    </Button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
