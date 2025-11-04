import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { useQuery } from "@tanstack/react-query";

export type ProfessionalVerification = Database["public"]["Tables"]["professional_verifications"]["Row"];

export function useProfessionalVerification() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["professional-verification", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from("professional_verifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .maybeSingle();

      if (error && error.code !== "PGRST116") throw error;
      return (data ?? null) as ProfessionalVerification | null;
    },
  });
}
