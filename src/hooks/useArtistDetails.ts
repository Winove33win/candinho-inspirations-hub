import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/apiClient';
import type { ArtistDetails } from '@/types/api';
import { useToast } from '@/hooks/use-toast';

export type { ArtistDetails };

interface UpsertResponse {
  data: ArtistDetails | null;
  error: Error | null;
}

export function useArtistDetails(userId: string | undefined) {
  const [artistDetails, setArtistDetails] = useState<ArtistDetails | null>(null);
  const [loading, setLoading]             = useState(true);
  const { toast }                         = useToast();

  // Reset when userId changes
  useEffect(() => {
    setArtistDetails(null);
    setLoading(true);
  }, [userId]);

  const loadArtistDetails = useCallback(async () => {
    if (!userId) return;

    try {
      const { data } = await api.get<{ data: ArtistDetails }>('/api/artists/me');
      setArtistDetails(data);
    } catch (err) {
      console.error('[LOAD::ARTIST_DETAILS]', err);
      toast({
        title: 'Erro',
        description: err instanceof Error ? err.message : 'Erro ao carregar dados do artista',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [userId, toast]);

  useEffect(() => {
    if (!userId) {
      setArtistDetails(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    loadArtistDetails();
  }, [userId, loadArtistDetails]);

  const upsertArtistDetails = async (payload: Partial<ArtistDetails>): Promise<UpsertResponse> => {
    if (!userId) return { data: null, error: null };

    try {
      const { data } = await api.put<{ data: ArtistDetails }>('/api/artists/me', payload);
      setArtistDetails(data);
      return { data, error: null };
    } catch (err) {
      console.error('[SAVE::ARTIST_DETAILS]', err);
      return {
        data: null,
        error: err instanceof Error ? err : new Error('Erro ao salvar dados'),
      };
    }
  };

  return {
    artistDetails,
    loading,
    upsertArtistDetails,
    reloadDetails: loadArtistDetails,
  };
}
