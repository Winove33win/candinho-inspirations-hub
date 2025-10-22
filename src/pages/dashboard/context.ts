import { useOutletContext } from "react-router-dom";
import type { PostgrestError } from "@supabase/supabase-js";
import type { User } from "@supabase/supabase-js";
import type { ArtistDetails } from "@/hooks/useArtistDetails";

export interface DashboardContextValue {
  user: User;
  artistDetails: ArtistDetails | null;
  refreshArtistDetails: () => Promise<void>;
  upsertArtistDetails: (
    payload: Partial<ArtistDetails>
  ) => Promise<{ data: ArtistDetails | null; error: PostgrestError | null }>;
}

export function useDashboardContext() {
  return useOutletContext<DashboardContextValue>();
}
