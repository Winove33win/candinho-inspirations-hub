import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { api } from '@/lib/apiClient';
import { getSignedUrl } from '@/utils/storage';

interface ArtistCard {
  id: string;
  slug: string | null;
  stageName: string | null;
  country: string | null;
  avatarUrl: string | null;
}

export default function ArtistsIndex() {
  const [items, setItems]         = useState<ArtistCard[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const [signedUrls, setSignedUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    api.get<{ data: ArtistCard[] }>('/api/public/artists')
      .then(({ data }) => { if (active) setItems(data ?? []); })
      .catch(() => { if (active) setError('Não foi possível carregar os artistas agora.'); })
      .finally(() => { if (active) setLoading(false); });

    return () => { active = false; };
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      const next: Record<string, string> = {};
      for (const artist of items) {
        if (!artist.avatarUrl) continue;
        try {
          next[artist.id] = await getSignedUrl(artist.avatarUrl);
        } catch {
          /* skip */
        }
      }
      if (active) setSignedUrls(next);
    })();
    return () => { active = false; };
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
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div key={`sk-${i}`} className="animate-pulse space-y-4 rounded-2xl border border-[var(--elev-border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-1)]">
                    <div className="aspect-square w-full rounded-xl bg-[var(--surface)]" />
                    <div className="h-4 w-1/2 rounded bg-[var(--surface)]" />
                    <div className="h-3 w-2/3 rounded bg-[var(--surface)]" />
                  </div>
                ))
              : items.map((artist) => {
                  const cover = signedUrls[artist.id] || artist.avatarUrl;
                  const href  = `/artistas/${artist.slug ?? artist.id}`;
                  return (
                    <Link key={artist.id} to={href}
                      className="group rounded-2xl border border-[var(--elev-border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-1)] transition hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.45)]">
                      <div className="aspect-square w-full overflow-hidden rounded-xl bg-[var(--surface-alt)]">
                        {cover && (
                          <img src={cover} alt={artist.stageName ?? 'Artista'}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                        )}
                      </div>
                      <h2 className="mt-4 text-lg font-semibold text-[var(--ink)]">{artist.stageName ?? 'Artista SMARTx'}</h2>
                      {artist.country && (
                        <p className="mt-2 text-xs uppercase tracking-wide text-[var(--muted)]">{artist.country}</p>
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
