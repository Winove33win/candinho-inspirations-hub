import { useQuery } from "@tanstack/react-query";

export type ArtistPublic = {
  id: string;
  slug: string;
  stageName: string;
  country?: string;
  city?: string;
  avatarUrl?: string | null;
  coverUrl?: string | null;
  stats?: { key: string; value: number | string }[];
  vision?: string;
  history?: string;
  career?: string;
  more?: string;
  socials?: { label: string; url: string }[];
  photos?: { url: string; alt?: string }[];
  videos?: { url: string; provider?: "youtube" | "vimeo" | "file" }[];
};

/* ---------- Helpers de erro/HTTP ---------- */

type JsonLike =
  | Record<string, unknown>
  | Array<unknown>
  | string
  | number
  | boolean
  | null;

class HttpResponseError extends Error {
  status: number;
  url: string;
  body: JsonLike;
  preview?: string;

  constructor(
    message: string,
    options: { status: number; url: string; body: JsonLike; preview?: string }
  ) {
    super(message);
    this.name = "HttpResponseError";
    this.status = options.status;
    this.url = options.url;
    this.body = options.body;
    this.preview = options.preview;
  }
}

class NonJsonResponseError extends HttpResponseError {
  contentType: string;

  constructor(
    message: string,
    options: {
      status: number;
      url: string;
      preview: string;
      contentType: string;
    }
  ) {
    super(message, {
      status: options.status,
      url: options.url,
      body: null,
      preview: options.preview,
    });
    this.name = "NonJsonResponseError";
    this.contentType = options.contentType;
  }
}

function normalizeBaseUrl(value: string | undefined) {
  if (!value) return undefined;
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

const DEFAULT_HEADERS = {
  Accept: "application/json",
  "Cache-Control": "no-store",
} as const;

async function readJsonBody(response: Response, url: string): Promise<JsonLike> {
  const contentType = response.headers.get("content-type") || "";
  const rawBody = await response.text();
  const preview = rawBody.slice(0, 200);

  if (!contentType.includes("application/json")) {
    throw new NonJsonResponseError(`Resposta não-JSON da API (status ${response.status})`, {
      status: response.status,
      url,
      preview,
      contentType,
    });
  }

  try {
    return rawBody.length > 0 ? (JSON.parse(rawBody) as JsonLike) : null;
  } catch {
    throw new NonJsonResponseError(`Falha ao interpretar JSON da API (status ${response.status})`, {
      status: response.status,
      url,
      preview,
      contentType,
    });
  }
}

async function requestJson(url: string, init?: RequestInit): Promise<JsonLike> {
  const response = await fetch(url, {
    ...init,
    headers: {
      ...DEFAULT_HEADERS,
      ...(init?.headers ?? {}),
    },
  });

  const body = await readJsonBody(response, url);

  if (!response.ok) {
    const message =
      (body &&
        typeof body === "object" &&
        "error" in body &&
        typeof (body as any).error === "string" &&
        (body as any).error) ||
      `Falha ${response.status}`;

    throw new HttpResponseError(message, {
      status: response.status,
      url,
      body,
      preview: typeof body === "string" ? (body as string).slice(0, 200) : undefined,
    });
  }

  return body;
}

/* ---------- Fetchers (primário + fallback) ---------- */

async function fetchArtistFromPrimary(slug: string): Promise<ArtistPublic> {
  const url = `/api/public/artist/${encodeURIComponent(slug)}`;
  const data = await requestJson(url, {
    credentials: "include",
  });
  return data as ArtistPublic;
}

async function fetchArtistFromSupabase(slug: string): Promise<ArtistPublic> {
  const supabaseUrl = normalizeBaseUrl(import.meta.env.VITE_SUPABASE_URL);
  const anonKey =
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !anonKey) {
    throw new Error("Configuração do Supabase ausente para fallback da API pública");
  }

  const url = `${supabaseUrl}/functions/v1/public-artist?slug=${encodeURIComponent(
    slug
  )}`;

  const data = await requestJson(url, {
    method: "GET",
    credentials: "omit",
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
    },
  });

  return data as ArtistPublic;
}

async function fetchArtist(slug: string): Promise<ArtistPublic> {
  const normalizedSlug = slug.trim();
  if (!normalizedSlug) throw new Error("Slug obrigatório");

  try {
    return await fetchArtistFromPrimary(normalizedSlug);
  } catch (error) {
    if (error instanceof NonJsonResponseError) {
      console.warn(
        "[useArtistPublic] Resposta inesperada da API primária, tentando fallback do Supabase.",
        error
      );
    } else if (error instanceof TypeError) {
      console.warn(
        "[useArtistPublic] Falha de rede ao chamar API primária, tentando fallback do Supabase.",
        error
      );
    } else {
      // Erros 4xx/5xx com JSON válido devem subir (não faz sentido fallback)
      throw error;
    }

    try {
      return await fetchArtistFromSupabase(normalizedSlug);
    } catch (fallbackError) {
      if (fallbackError instanceof Error) {
        fallbackError.message = `${fallbackError.message} (fallback Supabase)`;
      }
      throw fallbackError;
    }
  }
}

/* ---------- Hook ---------- */

export function useArtistPublic(slug: string) {
  const normalizedSlug = slug.trim();

  return useQuery({
    queryKey: ["artist-public", normalizedSlug],
    queryFn: () => fetchArtist(normalizedSlug),
    enabled: normalizedSlug.length > 0,
    staleTime: 0,
    gcTime: 0,
    retry: (count, err: unknown) => {
      // não ficar tentando quando a resposta é HTML/fallback do SPA
      if (err instanceof NonJsonResponseError) return false;
      const message = String((err as { message?: string } | undefined)?.message || "");
      // se já caiu no fallback Supabase e falhou, não insista
      return !message.includes("fallback Supabase") && count < 2;
    },
  });
}
