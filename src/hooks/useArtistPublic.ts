import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { getSignedUrl } from "@/utils/storage";

export type ArtistProjectPublic = {
  id: string;
  title?: string;
  about?: string;
  partners?: string;
  teamArt?: string;
  teamTech?: string;
  projectSheetUrl?: string | null;
  coverUrl?: string | null;
  bannerUrl?: string | null;
};

export type ArtistEventPublic = {
  id: string;
  name?: string;
  description?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  place?: string;
  ctaLink?: string;
  bannerUrl?: string | null;
};

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
  projects?: ArtistProjectPublic[];
  events?: ArtistEventPublic[];
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
  // Simplified type to avoid deep instantiation issues
  type ArtistRecord = {
    id: string | null;
    slug: string | null;
    member_id: string | null;
    artistic_name: string | null;
    full_name: string | null;
    country_residence: string | null;
    city: string | null;
    profile_image: string | null;
    video_banner_landscape: string | null;
    video_banner_portrait: string | null;
    visao_geral_titulo: string | null;
    historia_titulo: string | null;
    carreira_titulo: string | null;
    mais_titulo: string | null;
    profile_text2: string | null;
    website: string | null;
    instagram: string | null;
    facebook: string | null;
    youtube_channel: string | null;
    music_spotify_apple: string | null;
    [key: string]: any; // For dynamic image/video fields
  };

  async function loadArtistRecord(): Promise<ArtistRecord | null> {
    const lookups = [
      { column: "slug", value: slug },
      { column: "id", value: slug },
      { column: "member_id", value: slug },
    ];

    for (const lookup of lookups) {
      // Cast supabase to any to avoid deep type instantiation
      const result: any = await (supabase as any)
        .from("artist_details_public")
        .select("*")
        .eq(lookup.column, lookup.value)
        .maybeSingle();

      if (result.error && result.error.code !== "PGRST116") {
        throw result.error;
      }

      if (result.data) {
        return result.data as ArtistRecord;
      }
    }

    return null;
  }

  function detectVideoProvider(url: string | null | undefined) {
    if (!url) return undefined;
    const lower = url.toLowerCase();
    if (lower.includes("youtu")) return "youtube" as const;
    if (lower.includes("vimeo")) return "vimeo" as const;
    if (/(\.mp4|\.webm|\.ogg)(\?.*)?$/.test(lower)) return "file" as const;
    return undefined;
  }

  async function resolveSignedUrl(path: string | null | undefined) {
    if (!path) return null;

    try {
      if (/^https?:\/\//i.test(path)) {
        return path;
      }

      return await getSignedUrl(path, 3600);
    } catch (error) {
      console.warn("[useArtistPublic] Falha ao gerar URL assinada do Supabase", {
        path,
        error,
      });
      return null;
    }
  }

  type ProjectRow = Database["public"]["Tables"]["projects"]["Row"];
  type EventRow = Database["public"]["Tables"]["events"]["Row"];

  async function loadPublishedProjects(memberId: string | null | undefined) {
    if (!memberId) return [] as ProjectRow[];

    const { data, error } = await supabase
      .from("projects")
      .select(
        "id, title, about, partners, team_art, team_tech, project_sheet, cover_image, banner_image"
      )
      .eq("member_id", memberId)
      .eq("status", "published")
      .order("updated_at", { ascending: false });

    if (error) {
      console.warn("[useArtistPublic] Falha ao carregar projetos publicados", {
        memberId,
        error: error.message,
      });
      return [];
    }

    return data ?? [];
  }

  async function loadPublishedEvents(memberId: string | null | undefined) {
    if (!memberId) return [] as EventRow[];

    const { data, error } = await supabase
      .from("events")
      .select("id, name, description, date, start_time, end_time, place, cta_link, banner")
      .eq("member_id", memberId)
      .eq("status", "published")
      .order("date", { ascending: true });

    if (error) {
      console.warn("[useArtistPublic] Falha ao carregar eventos publicados", {
        memberId,
        error: error.message,
      });
      return [];
    }

    return data ?? [];
  }

  const record = await loadArtistRecord();

  if (!record) {
    const notFound = new Error("artist_not_found");
    (notFound as Error & { status?: number }).status = 404;
    throw notFound;
  }

  const photoIndexes = Array.from({ length: 12 }, (_, index) => index + 1);
  const photosPromises = photoIndexes.map(async (index) => {
    const path = record[`image${index}` as keyof ArtistRecord];
    if (typeof path !== "string" || path.length === 0) {
      return null;
    }

    const signed = await resolveSignedUrl(path);
    if (!signed) return null;

    const caption = record[`image${index}_text` as keyof ArtistRecord];
    return {
      url: signed,
      alt: typeof caption === "string" && caption.length > 0 ? caption : undefined,
    };
  });

  const photos = (await Promise.all(photosPromises)).filter(
    (photo): photo is NonNullable<typeof photo> => photo !== null
  );

  const videoKeys: Array<keyof ArtistRecord> = [
    "link_to_video",
    "link_to_video2",
    "link_to_video3",
    "link_to_video4",
    "link_to_video5",
    "link_to_video6",
    "link_to_video7",
    "link_to_video8",
    "link_to_video9",
    "link_to_video10",
  ];

  const videos = (
    await Promise.all(
      videoKeys
        .map((key) => record[key])
        .filter((value): value is string => typeof value === "string" && value.length > 0)
        .map(async (value) => {
          const provider = detectVideoProvider(value);
          const isAbsoluteUrl = /^https?:\/\//i.test(value);

          if (provider === "file" || !isAbsoluteUrl) {
            const signed = await resolveSignedUrl(value);
            if (!signed) return null;
            return { url: signed, provider: "file" as const };
          }

          return { url: value, provider };
        })
    )
  ).filter((video): video is NonNullable<typeof video> => video !== null);

  const [projectRows, eventRows] = await Promise.all([
    loadPublishedProjects(record.member_id),
    loadPublishedEvents(record.member_id),
  ]);

  const projects = await Promise.all(
    projectRows.map(async (project) => ({
      id: project.id,
      title: project.title ?? undefined,
      about: project.about ?? undefined,
      partners: project.partners ?? undefined,
      teamArt: project.team_art ?? undefined,
      teamTech: project.team_tech ?? undefined,
      projectSheetUrl: await resolveSignedUrl(project.project_sheet),
      coverUrl: await resolveSignedUrl(project.cover_image),
      bannerUrl: await resolveSignedUrl(project.banner_image),
    }))
  );

  const events = await Promise.all(
    eventRows.map(async (event) => ({
      id: event.id,
      name: event.name ?? undefined,
      description: event.description ?? undefined,
      date: event.date ?? undefined,
      startTime: event.start_time ?? undefined,
      endTime: event.end_time ?? undefined,
      place: event.place ?? undefined,
      ctaLink: event.cta_link ?? undefined,
      bannerUrl: await resolveSignedUrl(event.banner),
    }))
  );

  const socials = [
    { label: "Site oficial", url: record.website },
    { label: "Instagram", url: record.instagram },
    { label: "Facebook", url: record.facebook },
    { label: "YouTube", url: record.youtube_channel },
    { label: "Spotify / Apple Music", url: record.music_spotify_apple },
  ].filter((item) => typeof item.url === "string" && item.url.length > 0);

  const stats: ArtistPublic["stats"] = [];
  if (record.country_residence) {
    stats.push({ key: "País", value: record.country_residence });
  }
  if (record.city) {
    stats.push({ key: "Cidade", value: record.city });
  }
  if (record.profile_text2) {
    stats.push({ key: "Destaque", value: record.profile_text2 });
  }

  const avatarUrl = await resolveSignedUrl(record.profile_image);
  const landscapeBanner = await resolveSignedUrl(record.video_banner_landscape);
  const portraitBanner = await resolveSignedUrl(record.video_banner_portrait);
  const coverUrl =
    (landscapeBanner && detectVideoProvider(landscapeBanner) !== "youtube" ? landscapeBanner : null) ||
    (portraitBanner && detectVideoProvider(portraitBanner) !== "youtube" ? portraitBanner : null);

  return {
    id: record.id ?? slug,
    slug: record.slug ?? slug,
    stageName: record.artistic_name || record.full_name || "Artista SMARTx",
    country: record.country_residence ?? undefined,
    city: record.city ?? undefined,
    avatarUrl,
    coverUrl,
    stats,
    vision: record.visao_geral_titulo ?? undefined,
    history: record.historia_titulo ?? undefined,
    career: record.carreira_titulo ?? undefined,
    more: record.mais_titulo ?? undefined,
    socials,
    photos,
    videos,
    projects: projects.filter(
      (project) =>
        project.title || project.about || project.coverUrl || project.bannerUrl || project.projectSheetUrl
    ),
    events: events.filter(
      (event) =>
        event.name || event.description || event.bannerUrl || event.date || event.place || event.ctaLink
    ),
  };
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
