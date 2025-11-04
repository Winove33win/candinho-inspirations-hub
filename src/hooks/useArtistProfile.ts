import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { useQuery } from "@tanstack/react-query";

export type Artist = Database["public"]["Tables"]["artists"]["Row"];

export function useArtistProfile() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["artist-profile", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from("artists")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error && error.code !== "PGRST116") throw error;
      return (data ?? null) as Artist | null;
    },
  });
}
