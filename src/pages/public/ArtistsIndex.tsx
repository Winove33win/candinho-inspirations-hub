import { useEffect, useState, useCallback, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { api } from '@/lib/apiClient';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ArtistCard {
  id: string;
  slug: string | null;
  stageName: string | null;
  country: string | null;
  city: string | null;
  avatarUrl: string | null;
  impactPhrase: string | null;
}

interface ArtistsResponse {
  data: ArtistCard[];
  total: number;
  page: number;
  limit: number;
  pages: number;
  countries: string[];
}

const LIMIT = 24;

export default function ArtistsIndex() {
  const [searchParams, setSearchParams] = useSearchParams();

  const qParam       = searchParams.get('q') || '';
  const countryParam = searchParams.get('country') || '';
  const pageParam    = Math.max(1, parseInt(searchParams.get('page') || '1'));

  const [search, setSearch]   = useState(qParam);
  const [country, setCountry] = useState(countryParam);
  const [items, setItems]     = useState<ArtistCard[]>([]);
  const [meta, setMeta]       = useState({ total: 0, page: 1, pages: 1, countries: [] as string[] });
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const debounceRef           = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchArtists = useCallback(async (q: string, c: string, p: number) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ limit: String(LIMIT), page: String(p) });
      if (q) params.set('q', q);
      if (c) params.set('country', c);

      const res = await api.get<ArtistsResponse>(`/api/public/artists?${params}`);
      setItems(res.data ?? []);
      setMeta({ total: res.total, page: res.page, pages: res.pages, countries: res.countries });
    } catch {
      setError('Não foi possível carregar os artistas agora.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Sync URL → state on mount
  useEffect(() => {
    setSearch(qParam);
    setCountry(countryParam);
    fetchArtists(qParam, countryParam, pageParam);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);

  // Debounce search input
  const handleSearchChange = (value: string) => {
    setSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const next = new URLSearchParams(searchParams);
      next.set('q', value);
      next.set('page', '1');
      if (!value) next.delete('q');
      setSearchParams(next, { replace: true });
    }, 400);
  };

  const handleCountryChange = (c: string) => {
    setCountry(c);
    const next = new URLSearchParams(searchParams);
    next.set('page', '1');
    if (c) next.set('country', c); else next.delete('country');
    setSearchParams(next, { replace: true });
  };

  const handlePage = (p: number) => {
    const next = new URLSearchParams(searchParams);
    next.set('page', String(p));
    setSearchParams(next, { replace: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearFilters = () => {
    setSearch('');
    setCountry('');
    setSearchParams({}, { replace: true });
  };

  const hasFilters = qParam || countryParam;

  return (
    <div className="min-h-screen bg-[var(--surface-alt)] text-[var(--ink)]">
      <Header />
      <main className="pt-24 pb-20">
        <div className="site-container space-y-8">

          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-4xl font-['League_Spartan'] font-bold">Artistas</h1>
            <p className="max-w-2xl text-sm text-[var(--muted)]">
              Conheça a rede de artistas SMARTx.
              {meta.total > 0 && !loading && (
                <span className="ml-1 font-semibold text-[var(--ink)]">{meta.total} artistas cadastrados.</span>
              )}
            </p>
          </div>

          {/* Search + Filters */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
              <Input
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Buscar por nome artístico..."
                className="pl-9 pr-9"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => handleSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--ink)]"
                  aria-label="Limpar busca"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {meta.countries.length > 1 && (
              <select
                value={country}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring md:w-56"
                aria-label="Filtrar por país"
              >
                <option value="">Todos os países</option>
                {meta.countries.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            )}

            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={handleClearFilters} className="gap-1 self-start md:self-auto">
                <X className="h-3 w-3" /> Limpar filtros
              </Button>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-[var(--radius)] border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {loading
              ? Array.from({ length: LIMIT }).map((_, i) => (
                  <div key={`sk-${i}`} className="animate-pulse space-y-4 rounded-2xl border border-[var(--elev-border)] bg-[var(--surface)] p-5">
                    <div className="aspect-square w-full rounded-xl bg-[var(--surface-alt)]" />
                    <div className="h-4 w-3/4 rounded bg-[var(--surface-alt)]" />
                    <div className="h-3 w-1/2 rounded bg-[var(--surface-alt)]" />
                  </div>
                ))
              : items.map((artist) => {
                  const href = `/artistas/${artist.slug ?? artist.id}`;
                  return (
                    <Link
                      key={artist.id}
                      to={href}
                      className="group flex flex-col rounded-2xl border border-[var(--elev-border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-1)] transition hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.45)]"
                    >
                      <div className="aspect-square w-full overflow-hidden rounded-xl bg-[var(--surface-alt)]">
                        {artist.avatarUrl ? (
                          <img
                            src={artist.avatarUrl}
                            alt={artist.stageName ?? 'Artista'}
                            loading="lazy"
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--brand-soft)] to-[var(--surface-alt)]">
                            <span className="text-3xl font-bold text-[var(--brand)] opacity-40">
                              {(artist.stageName ?? '?')[0].toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>

                      <h2 className="mt-4 text-base font-semibold text-[var(--ink)] leading-snug line-clamp-1">
                        {artist.stageName ?? 'Artista SMARTx'}
                      </h2>

                      {artist.impactPhrase && (
                        <p className="mt-1 text-sm text-[var(--muted)] line-clamp-2 flex-1">
                          {artist.impactPhrase}
                        </p>
                      )}

                      {(artist.city || artist.country) && (
                        <p className="mt-2 text-xs uppercase tracking-wide text-[var(--muted)]">
                          {[artist.city, artist.country].filter(Boolean).join(', ')}
                        </p>
                      )}
                    </Link>
                  );
                })}
          </div>

          {/* Empty state */}
          {!loading && items.length === 0 && !error && (
            <div className="rounded-[var(--radius)] border border-dashed border-[var(--border)] p-12 text-center">
              <p className="text-sm text-[var(--muted)]">
                {hasFilters
                  ? 'Nenhum artista encontrado com esses filtros.'
                  : 'Nenhum artista disponível no momento.'}
              </p>
              {hasFilters && (
                <Button variant="outline" size="sm" onClick={handleClearFilters} className="mt-4">
                  Limpar filtros
                </Button>
              )}
            </div>
          )}

          {/* Pagination */}
          {!loading && meta.pages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="icon"
                disabled={meta.page <= 1}
                onClick={() => handlePage(meta.page - 1)}
                aria-label="Página anterior"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {Array.from({ length: meta.pages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === meta.pages || Math.abs(p - meta.page) <= 2)
                .reduce<(number | '...')[]>((acc, p, idx, arr) => {
                  if (idx > 0 && (p as number) - (arr[idx - 1] as number) > 1) acc.push('...');
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
                  p === '...' ? (
                    <span key={`ellipsis-${i}`} className="px-1 text-[var(--muted)]">…</span>
                  ) : (
                    <Button
                      key={p}
                      variant={p === meta.page ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handlePage(p as number)}
                      aria-label={`Página ${p}`}
                      aria-current={p === meta.page ? 'page' : undefined}
                    >
                      {p}
                    </Button>
                  )
                )}

              <Button
                variant="outline"
                size="icon"
                disabled={meta.page >= meta.pages}
                onClick={() => handlePage(meta.page + 1)}
                aria-label="Próxima página"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
