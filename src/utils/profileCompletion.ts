import type { ArtistDetails } from "@/hooks/useArtistDetails";

const isNonEmpty = (value?: string | null) =>
  typeof value === "string" ? value.trim().length > 0 : Boolean(value);

export interface ProfileCompletionResult {
  percent: number;
  completedTabs: string[];
}

export function computeProfileCompletion(
  details?: ArtistDetails | null,
): ProfileCompletionResult {
  if (!details) {
    return { percent: 0, completedTabs: [] };
  }

  const videoLinkKeys = [
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
  ] as const;

  const imageKeys = Array.from({ length: 12 }, (_, index) => `image${index + 1}`) as Array<
    keyof ArtistDetails
  >;

  const tabs = [
    {
      key: "dados-pessoais",
      ok:
        isNonEmpty(details.artistic_name) &&
        isNonEmpty(details.full_name) &&
        isNonEmpty(details.country_residence) &&
        (isNonEmpty(details.profile_image) || isNonEmpty(details.cell_phone)),
    },
    { key: "visao-geral", ok: isNonEmpty(details.visao_geral_titulo) },
    { key: "trajetoria", ok: isNonEmpty(details.historia_titulo) },
    { key: "carreira", ok: isNonEmpty(details.carreira_titulo) },
    { key: "mais", ok: isNonEmpty(details.mais_titulo) },
    {
      key: "biografia",
      ok:
        isNonEmpty(details.biography1) ||
        isNonEmpty(details.facebook) ||
        isNonEmpty(details.instagram) ||
        isNonEmpty(details.music_spotify_apple) ||
        isNonEmpty(details.youtube_channel) ||
        isNonEmpty(details.website),
    },
    {
      key: "videos",
      ok:
        isNonEmpty(details.audio) ||
        isNonEmpty(details.video_banner_landscape) ||
        isNonEmpty(details.video_banner_portrait) ||
        videoLinkKeys.some((key) => isNonEmpty(details[key])),
    },
    {
      key: "fotografias",
      ok: imageKeys.some((key) => {
        const val = details[key];
        return typeof val === "string" ? isNonEmpty(val) : false;
      }),
    },
  ] as const;

  const completedTabs = tabs.filter((tab) => tab.ok).map((tab) => tab.key);
  const percent = Math.round((completedTabs.length / tabs.length) * 100);

  return { percent, completedTabs };
}
