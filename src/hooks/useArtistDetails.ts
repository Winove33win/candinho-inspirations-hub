import { useState, useEffect, useCallback } from "react";
import type { PostgrestError } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";

export type ArtistDetails = Database["public"]["Tables"]["new_artist_details"]["Row"];

interface UpsertResponse {
  data: ArtistDetails | null;
  error: PostgrestError | Error | null;
}

export function useArtistDetails(userId: string | undefined) {
  const [artistDetails, setArtistDetails] = useState<ArtistDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadArtistDetails = useCallback(async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from("new_artist_details")
        .select("*")
        .eq("member_id", userId)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        // Create skeleton if doesn't exist
        const { data: newData, error: insertError } = await supabase
          .from("new_artist_details")
          .insert({
            member_id: userId,
            perfil_completo: false,
            updated_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (insertError) throw insertError;
        setArtistDetails(newData);
      } else {
        setArtistDetails(data);
      }
    } catch (error: unknown) {
      console.error("[LOAD::ARTIST_DETAILS]", error);
      toast({
        title: "Erro",
        description:
          error instanceof Error
            ? error.message
            : "Erro ao carregar dados do artista",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast, userId]);

  useEffect(() => {
    if (!userId) {
      setArtistDetails(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    loadArtistDetails();
  }, [userId, loadArtistDetails]);

  const normalizePayload = (payload: Partial<ArtistDetails>): Partial<ArtistDetails> => {
    const result: any = {};
    
    for (const [key, value] of Object.entries(payload)) {
      if (typeof value === "string") {
        const trimmed = value.trim();
        result[key] = trimmed.length > 0 ? trimmed : null;
      } else if (typeof value === "boolean" || value === null || value === undefined) {
        result[key] = value ?? null;
      } else {
        result[key] = value;
      }
    }
    
    return result as Partial<ArtistDetails>;
  };

  const upsertArtistDetails = async (payload: Partial<ArtistDetails>): Promise<UpsertResponse> => {
    if (!userId) {
      return { data: null, error: null };
    }

    const sanitizedPayload = normalizePayload(payload);
    const updates = {
      ...sanitizedPayload,
      member_id: userId,
      updated_at: new Date().toISOString(),
    } satisfies Partial<ArtistDetails> & { member_id: string; updated_at: string };

    console.log("[SAVE::ARTIST_DETAILS]", updates);

    try {
      const { data, error } = await supabase
        .from("new_artist_details")
        .upsert(updates, { onConflict: "member_id" })
        .select()
        .single();

      if (error) throw error;

      setArtistDetails(data);
      return { data, error: null };
    } catch (error: unknown) {
      console.error("[SAVE::ARTIST_DETAILS]", error);
      return {
        data: null,
        error: error instanceof Error ? error : new Error("Erro ao salvar dados"),
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