import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useDashboardContext } from "./context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Calendar as CalendarIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { FormSection } from "@/components/dashboard/FormSection";
import { Uploader } from "@/components/dashboard/Uploader";
import type { Database } from "@/integrations/supabase/types";

type Event = Database["public"]["Tables"]["events"]["Row"];

export default function Events() {
  const { user } = useDashboardContext();
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    loadEvents();
  }, [user?.id]);

  async function loadEvents() {
    if (!user?.id) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("member_id", user.id)
        .order("date", { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os eventos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Deseja realmente excluir este evento?")) return;

    try {
      const { error } = await supabase.from("events").delete().eq("id", id);

      if (error) throw error;

      toast({ title: "Evento excluído com sucesso" });
      loadEvents();
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro ao excluir",
        variant: "destructive",
      });
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[var(--brand)]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-['League_Spartan'] font-bold">Eventos</h2>
          <p className="text-sm text-[var(--muted)] mt-1">
            Divulgue apresentações, estreias e datas importantes
          </p>
        </div>
        <Button onClick={() => setEditingId("new")} className="gap-2">
          <Plus className="h-4 w-4" />
          Novo evento
        </Button>
      </div>

      {editingId && (
        <EventForm
          eventId={editingId === "new" ? null : editingId}
          onClose={() => {
            setEditingId(null);
            loadEvents();
          }}
        />
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {events.map((event) => (
          <Card key={event.id} className="overflow-hidden">
            {event.banner && (
              <div className="relative h-48 w-full overflow-hidden bg-[var(--surface-alt)]">
                <img
                  src={event.banner}
                  alt={event.name || "Evento"}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold">{event.name || "Sem título"}</h3>
                {event.date && (
                  <p className="text-sm text-[var(--muted)] mt-1">
                    {new Date(event.date).toLocaleDateString("pt-BR")}
                    {event.start_time && ` às ${event.start_time}`}
                  </p>
                )}
                {event.place && (
                  <p className="text-sm text-[var(--muted)]">{event.place}</p>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingId(event.id)}
                  className="flex-1"
                >
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(event.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {events.length === 0 && !editingId && (
        <div className="rounded-[var(--radius)] border-2 border-dashed border-[var(--border)] p-12 text-center">
          <CalendarIcon className="mx-auto h-12 w-12 text-[var(--muted)]" />
          <p className="mt-4 text-[var(--muted)]">
            Nenhum evento cadastrado ainda. Adicione seu primeiro evento!
          </p>
        </div>
      )}
    </div>
  );
}

function EventForm({
  eventId,
  onClose,
}: {
  eventId: string | null;
  onClose: () => void;
}) {
  const { user } = useDashboardContext();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<Event>>({
    name: "",
    description: "",
    date: "",
    start_time: "",
    end_time: "",
    place: "",
    cta_link: "",
    banner: "",
    status: "draft",
  });

  useEffect(() => {
    if (eventId) {
      loadEvent();
    }
  }, [eventId]);

  async function loadEvent() {
    if (!eventId) return;

    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", eventId)
        .single();

      if (error) throw error;
      setFormData(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleSave() {
    if (!user?.id) return;

    setSaving(true);
    try {
      const payload = { ...formData, member_id: user.id };

      if (eventId) {
        const { error } = await supabase
          .from("events")
          .update(payload)
          .eq("id", eventId);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("events").insert([payload]);

        if (error) throw error;
      }

      toast({ title: "Evento salvo com sucesso!" });
      onClose();
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro ao salvar",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="p-6">
      <FormSection title={eventId ? "Editar Evento" : "Novo Evento"}>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Nome do evento</Label>
            <Input
              id="name"
              value={formData.name || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Nome do evento"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                type="date"
                value={formData.date || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, date: e.target.value }))
                }
              />
            </div>
            <div>
              <Label htmlFor="start_time">Horário</Label>
              <Input
                id="start_time"
                type="time"
                value={formData.start_time || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, start_time: e.target.value }))
                }
              />
            </div>
          </div>

          <div>
            <Label htmlFor="place">Local</Label>
            <Input
              id="place"
              value={formData.place || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, place: e.target.value }))
              }
              placeholder="Local do evento"
            />
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Descreva o evento..."
              rows={3}
            />
          </div>

          <Uploader
            label="Banner do evento"
            bucket="artist-photos"
            maxBytes={5 * 1024 * 1024}
            currentPath={formData.banner || ""}
            onUploaded={(url) =>
              setFormData((prev) => ({ ...prev, banner: url }))
            }
            accept="image/*"
          />

          <div>
            <Label htmlFor="cta_link">Link para inscrição/ingresso</Label>
            <Input
              id="cta_link"
              type="url"
              value={formData.cta_link || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, cta_link: e.target.value }))
              }
              placeholder="https://..."
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleSave}
              disabled={saving || !formData.name}
              className="flex-1"
            >
              {saving ? "Salvando..." : "Salvar evento"}
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </div>
      </FormSection>
    </Card>
  );
}
