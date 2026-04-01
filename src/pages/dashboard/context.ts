import { useOutletContext } from 'react-router-dom';
import type { AuthUser, ArtistDetails } from '@/types/api';

export interface DashboardContextValue {
  user: AuthUser;
  artistDetails: ArtistDetails | null;
  refreshArtistDetails: () => Promise<void>;
  upsertArtistDetails: (
    payload: Partial<ArtistDetails>
  ) => Promise<{ data: ArtistDetails | null; error: Error | null }>;
}

export function useDashboardContext() {
  return useOutletContext<DashboardContextValue>();
}
