import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useArtistDetails(userId: string | undefined) {
  const [artistDetails, setArtistDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!userId) return;

    loadArtistDetails();
  }, [userId]);

  const loadArtistDetails = async () => {
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
          .insert({ member_id: userId, perfil_completo: false })
          .select()
          .single();

        if (insertError) throw insertError;
        setArtistDetails(newData);
      } else {
        setArtistDetails(data);
      }
    } catch (error: any) {
      console.error("[LOAD::ARTIST_DETAILS]", error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados do artista",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const upsertArtistDetails = async (payload: any) => {
    if (!userId) return;

    console.log("[SAVE::ARTIST_DETAILS]", payload);

    try {
      const { data, error } = await supabase
        .from("new_artist_details")
        .upsert({ ...payload, member_id: userId })
        .select()
        .single();

      if (error) throw error;

      setArtistDetails(data);
      return { data, error: null };
    } catch (error: any) {
      console.error("[SAVE::ARTIST_DETAILS]", error);
      return { data: null, error };
    }
  };

  return {
    artistDetails,
    loading,
    upsertArtistDetails,
    reloadDetails: loadArtistDetails,
  };
}