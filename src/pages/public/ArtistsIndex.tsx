import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { getSignedUrl } from "@/utils/storage";

interface ArtistCard {
  id: string;
  slug: string | null;
  display_name: string | null;
  country_residence: string | null;
  profile_image: string | null;
  frase_de_impacto: string | null;
}

export default function ArtistsIndex() {
  const [items, setItems] = useState<ArtistCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [signedUrls, setSignedUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    let active = true;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: queryError } = await supabase
          .from("artists_public")
          .select("id, slug, display_name, country_residence, profile_image, frase_de_impacto")
          .order("created_at", { ascending: false })
          .limit(60);

        if (queryError) throw queryError;
        if (!active) return;

        setItems((data ?? []) as ArtistCard[]);
      } catch (err) {
        console.error("[ARTISTS::LIST]", err);
        if (active) setError("Não foi possível carregar os artistas agora.");
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    (async () => {
      const next: Record<string, string> = {};
      for (const artist of items) {
        if (!artist.profile_image) continue;
        try {
          const url = await getSignedUrl(artist.profile_image, 3600);
          next[artist.id] = url;
        } catch (err) {
          console.error("[ARTISTS::SIGNED_URL]", err);
        }
      }
      if (active) setSignedUrls(next);
    })();

    return () => {
      active = false;
    };
  }, [items]);

  return (
    <div className="min-h-screen bg-[var(--surface-alt)] text-[var(--ink)]">
      <Header />
      <main className="pt-24 pb-20">
        <div className="site-container space-y-8">
          <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-['League_Spartan'] font-bold">Artistas</h1>
              <p className="mt-2 max-w-2xl text-sm text-[var(--muted)]">
                Conheça a rede de artistas SMARTx. Explore perfis públicos com informações compartilhadas pelos próprios integrantes.
              </p>
            </div>
          </div>

          {error && (
            <div className="rounded-[var(--radius)] border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {loading
              ? Array.from({ length: 8 }).map((_, index) => (
                  <div
                    key={`skeleton-${index}`}
                    className="animate-pulse space-y-4 rounded-2xl border border-[var(--border)] bg-white p-5"
                  >
                    <div className="aspect-square w-full rounded-xl bg-[var(--surface)]" />
                    <div className="h-4 w-1/2 rounded bg-[var(--surface)]" />
                    <div className="h-3 w-2/3 rounded bg-[var(--surface)]" />
                  </div>
                ))
              : items.map((artist) => {
                  const cover = signedUrls[artist.id];
                  const href = `/artista/${artist.slug ?? artist.id}`;

                  return (
                    <Link
                      key={artist.id}
                      to={href}
                      className="group rounded-2xl border border-[var(--border)] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                    >
                      <div className="aspect-square w-full overflow-hidden rounded-xl bg-[var(--surface-alt)]">
                        {cover && (
                          <img
                            src={cover}
                            alt={artist.display_name ?? "Artista"}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                        )}
                      </div>
                      <h2 className="mt-4 text-lg font-semibold text-[var(--ink)]">
                        {artist.display_name ?? "Artista SMARTx"}
                      </h2>
                      {artist.frase_de_impacto && (
                        <p className="mt-1 text-sm text-[var(--muted)] line-clamp-2">{artist.frase_de_impacto}</p>
                      )}
                      {artist.country_residence && (
                        <p className="mt-2 text-xs uppercase tracking-wide text-[var(--muted)]">
                          {artist.country_residence}
                        </p>
                      )}
                    </Link>
                  );
                })}
          </div>

          {!loading && items.length === 0 && !error && (
            <div className="rounded-[var(--radius)] border border-dashed border-[var(--border)] p-10 text-center text-sm text-[var(--muted)]">
              Nenhum artista disponível no momento.
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
