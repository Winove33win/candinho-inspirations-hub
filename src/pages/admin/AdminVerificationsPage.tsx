import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export default function AdminVerificationsPage() {
  const queryClient = useQueryClient();
  const [selectedNotes, setSelectedNotes] = useState<Record<string, string>>({});

  const { data, isLoading } = useQuery({
    queryKey: ["admin-verifications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("professional_verifications")
        .select("id, user_id, legal_id, company, website, portfolio_url, attachment_urls, status, notes, created_at, user:user_id(full_name, email, role)")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  const approveMutation = useMutation({
    mutationFn: async ({ id, notes }: { id: string; notes?: string }) => {
      const { error } = await supabase.rpc("admin_approve_verification", {
        p_verification_id: id,
        p_notes: notes ?? null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-verifications"] });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async ({ id, notes }: { id: string; notes?: string }) => {
      const { error } = await supabase.rpc("admin_reject_verification", {
        p_verification_id: id,
        p_notes: notes ?? null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-verifications"] });
    },
  });

  if (isLoading) {
    return <p className="text-sm text-zinc-500">Carregando solicitações...</p>;
  }

  if (!data?.length) {
    return <p className="text-sm text-zinc-500">Nenhuma solicitação pendente.</p>;
  }

  return (
    <div className="space-y-6">
      {data.map((verification) => (
        <div key={verification.id} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-zinc-400">
            <div>
              <p className="text-zinc-200">{verification.user?.full_name ?? "Usuário"}</p>
              <p className="text-xs text-zinc-500">{verification.user?.email}</p>
            </div>
            <span className="rounded-full border border-zinc-700 px-3 py-1 text-xs uppercase text-zinc-400">
              {verification.status}
            </span>
            <span className="text-xs text-zinc-500">{new Date(verification.created_at).toLocaleDateString("pt-BR")}</span>
          </div>
          <div className="mt-4 grid gap-3 text-xs text-zinc-400 md:grid-cols-2">
            <p><strong className="text-zinc-200">Documento:</strong> {verification.legal_id}</p>
            {verification.company && <p><strong className="text-zinc-200">Empresa:</strong> {verification.company}</p>}
            {verification.website && (
              <p>
                <strong className="text-zinc-200">Website:</strong>{" "}
                <a href={verification.website} target="_blank" rel="noreferrer" className="text-emerald-300">
                  {verification.website}
                </a>
              </p>
            )}
            {verification.portfolio_url && (
              <p>
                <strong className="text-zinc-200">Portfólio:</strong>{" "}
                <a href={verification.portfolio_url} target="_blank" rel="noreferrer" className="text-emerald-300">
                  {verification.portfolio_url}
                </a>
              </p>
            )}
          </div>
          {Array.isArray(verification.attachment_urls) && verification.attachment_urls.length > 0 && (
            <div className="mt-4 text-xs text-zinc-400">
              <p className="text-zinc-200">Anexos:</p>
              <ul className="mt-2 list-disc space-y-1 pl-4">
                {verification.attachment_urls.map((url: string) => (
                  <li key={url}>
                    <a href={url} target="_blank" rel="noreferrer" className="text-emerald-300 hover:text-emerald-200">
                      {url.split("/").pop()}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="mt-4 space-y-2">
            <Textarea
              placeholder="Notas internas"
              value={selectedNotes[verification.id] ?? verification.notes ?? ""}
              onChange={(event) =>
                setSelectedNotes((current) => ({ ...current, [verification.id]: event.target.value }))
              }
            />
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10"
                onClick={() =>
                  approveMutation.mutate({
                    id: verification.id,
                    notes: selectedNotes[verification.id],
                  })
                }
                disabled={approveMutation.isPending}
              >
                Aprovar
              </Button>
              <Button
                variant="outline"
                className="border-rose-500/40 text-rose-300 hover:bg-rose-500/10"
                onClick={() =>
                  rejectMutation.mutate({
                    id: verification.id,
                    notes: selectedNotes[verification.id],
                  })
                }
                disabled={rejectMutation.isPending}
              >
                Recusar
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
