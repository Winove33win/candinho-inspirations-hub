import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.46.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

function jsonResponse(body: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(body), {
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      ...(init?.headers ?? {}),
    },
    status: init?.status ?? 200,
  });
}

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

type ImageIndex = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
type VideoIndex = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
type ImageKey = `image${ImageIndex}`;
type ImageCaptionKey = `${ImageKey}_text`;
type VideoKey = "link_to_video" | `link_to_video${VideoIndex}`;

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
  country_of_birth: string | null;
  biography1: string | null;
  audio: string | null;
} & Partial<Record<ImageKey, string | null>> &
  Partial<Record<ImageCaptionKey, string | null>> &
  Partial<Record<VideoKey, string | null>>;

type EventRecord = {
  id: string;
  name: string | null;
  description: string | null;
  date: string | null;
  start_time: string | null;
  end_time: string | null;
  place: string | null;
  cta_link: string | null;
  banner: string | null;
};

type ProjectRecord = {
  id: string;
  title: string | null;
  about: string | null;
  partners: string | null;
  team_art: string | null;
  team_tech: string | null;
  project_sheet: string | null;
  cover_image: string | null;
  banner_image: string | null;
};

function isAbsoluteUrl(value: string) {
  return value.startsWith("http://") || value.startsWith("https://");
}

async function resolveStorageUrl(path: string | null | undefined) {
  if (!path) return null;
  if (isAbsoluteUrl(path)) return path;

  const segments = path.split("/").filter(Boolean);
  if (segments.length === 0) return null;

  const knownBuckets = new Set(["artist-photos", "artist-video", "artist-docs"]);
  let bucket = segments[0];
  let objectPathSegments = segments.slice(1);

  if (!knownBuckets.has(bucket) || objectPathSegments.length === 0) {
    bucket = "artist-photos";
    objectPathSegments = segments;
  }

  const objectPath = objectPathSegments.join("/");
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(objectPath, 3600);

  if (error) {
    // Log sanitized error without exposing internal details
    console.error("[PUBLIC_ARTIST::SIGN] Failed to create signed URL", {
      bucket,
      hasPath: !!objectPath,
      errorCode: error.message?.substring(0, 50) || "unknown"
    });
    return null;
  }

  return data?.signedUrl ?? null;
}

async function loadArtist(slug: string) {
  const { data: bySlug, error: slugError } = await supabase
    .from("artist_details_public")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (slugError && slugError.code !== "PGRST116") throw slugError;
  if (bySlug) return bySlug as ArtistRecord;

  const { data: byId, error: idError } = await supabase
    .from("artist_details_public")
    .select("*")
    .eq("id", slug)
    .maybeSingle();

  if (idError && idError.code !== "PGRST116") throw idError;
  if (byId) return byId as ArtistRecord;

  const { data: byMember, error: memberError } = await supabase
    .from("artist_details_public")
    .select("*")
    .eq("member_id", slug)
    .maybeSingle();

  if (memberError && memberError.code !== "PGRST116") throw memberError;
  if (byMember) return byMember as ArtistRecord;

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

async function loadEvents(memberId: string | null | undefined) {
  if (!memberId) return [] as Array<EventRecord>;

  const { data, error } = await supabase
    .from("events")
    .select("id, name, description, date, start_time, end_time, place, cta_link, banner")
    .eq("member_id", memberId)
    .eq("status", "published")
    .order("date", { ascending: true });

  if (error) {
    console.error("[PUBLIC_ARTIST::EVENTS] Failed to load events", {
      memberId,
      error: error.message?.substring(0, 80) || "unknown",
    });
    return [];
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    description: row.description,
    date: row.date,
    start_time: row.start_time,
    end_time: row.end_time,
    place: row.place,
    cta_link: row.cta_link,
    banner: row.banner,
  }));
}

async function loadProjects(memberId: string | null | undefined) {
  if (!memberId) return [] as Array<ProjectRecord>;

  const { data, error } = await supabase
    .from("projects")
    .select(
      "id, title, about, partners, team_art, team_tech, project_sheet, cover_image, banner_image"
    )
    .eq("member_id", memberId)
    .eq("status", "published")
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("[PUBLIC_ARTIST::PROJECTS] Failed to load projects", {
      memberId,
      error: error.message?.substring(0, 80) || "unknown",
    });
    return [];
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    about: row.about,
    partners: row.partners,
    team_art: row.team_art,
    team_tech: row.team_tech,
    project_sheet: row.project_sheet,
    cover_image: row.cover_image,
    banner_image: row.banner_image,
  }));
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: { ...corsHeaders, "Cache-Control": "no-store" },
    });
  }

  if (req.method !== "GET") {
    return jsonResponse(
      { error: "method_not_allowed" },
      { status: 405 },
    );
  }

  const url = new URL(req.url);
  const pathSegments = url.pathname.split("/").filter(Boolean);
  const slugSegment = pathSegments.length > 1 ? pathSegments.slice(1).join("/") : url.searchParams.get("slug");
  const slug = slugSegment ? decodeURIComponent(slugSegment) : null;

  if (!slug) {
    return jsonResponse({ error: "slug_required" }, { status: 400 });
  }

  try {
    const record = await loadArtist(slug);

    if (!record) {
      return jsonResponse({ error: "artist_not_found", slug }, { status: 404 });
    }

    const photosPromises = Array.from({ length: 12 }).map(async (_, index) => {
      const key = `image${index + 1}` as ImageKey;
      const captionKey = `${key}_text` as ImageCaptionKey;
      const rawPath = record[key];
      if (!rawPath) return null;
      const signed = await resolveStorageUrl(rawPath);
      if (!signed) return null;
      return {
        url: signed,
        alt: record[captionKey] ?? undefined,
      };
    });

    const photos = (await Promise.all(photosPromises)).filter(Boolean) as { url: string; alt?: string }[];

    const videoKeys: VideoKey[] = [
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

    const videos = videoKeys
      .map((key) => record[key] ?? null)
      .filter((value): value is string => typeof value === "string" && value.length > 0)
      .map((value) => ({
        url: value,
        provider: detectVideoProvider(value),
      }));

    const [rawProjects, rawEvents] = await Promise.all([
      loadProjects(record.member_id),
      loadEvents(record.member_id),
    ]);

    const projects = await Promise.all(
      rawProjects.map(async (project) => ({
        id: project.id,
        title: project.title ?? undefined,
        about: project.about ?? undefined,
        partners: project.partners ?? undefined,
        teamArt: project.team_art ?? undefined,
        teamTech: project.team_tech ?? undefined,
        projectSheetUrl: await resolveStorageUrl(project.project_sheet),
        coverUrl: await resolveStorageUrl(project.cover_image),
        bannerUrl: await resolveStorageUrl(project.banner_image),
      }))
    );

    const events = await Promise.all(
      rawEvents.map(async (event) => ({
        id: event.id,
        name: event.name ?? undefined,
        description: event.description ?? undefined,
        date: event.date ?? undefined,
        startTime: event.start_time ?? undefined,
        endTime: event.end_time ?? undefined,
        place: event.place ?? undefined,
        ctaLink: event.cta_link ?? undefined,
        bannerUrl: await resolveStorageUrl(event.banner),
      }))
    );

    const avatarUrl = await resolveStorageUrl(record.profile_image);
    const coverUrl = (await resolveStorageUrl(record.video_banner_landscape)) ?? (await resolveStorageUrl(record.video_banner_portrait));

    const socials = [
      { label: "Site oficial", url: record.website },
      { label: "Instagram", url: record.instagram },
      { label: "Facebook", url: record.facebook },
      { label: "YouTube", url: record.youtube_channel },
      { label: "Spotify / Apple Music", url: record.music_spotify_apple },
    ].filter((item) => !!item.url);

    const stats: { key: string; value: number | string }[] = [];
    if (record.country_residence) {
      stats.push({ key: "País", value: record.country_residence });
    }
    if (record.city) {
      stats.push({ key: "Cidade", value: record.city });
    }
    if (record.profile_text2) {
      stats.push({ key: "Destaque", value: record.profile_text2 });
    }

    const responseBody = {
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

    return jsonResponse(responseBody);
  } catch (err) {
    // Log sanitized error without exposing database structure
    console.error("[PUBLIC_ARTIST::ERROR]", {
      slug,
      errorType: err instanceof Error ? err.constructor.name : typeof err,
      timestamp: new Date().toISOString()
    });
    return jsonResponse({ error: "internal_error" }, { status: 500 });
  }
});
