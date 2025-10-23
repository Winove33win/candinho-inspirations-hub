import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormSection } from "@/components/dashboard/FormSection";
import { Uploader } from "@/components/dashboard/Uploader";
import { ToolbarSave } from "@/components/dashboard/ToolbarSave";
import { RichTextEditor } from "@/components/dashboard/RichTextEditor";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { useDashboardContext } from "./context";

type EventRow = Database["public"]["Tables"]["events"]["Row"];
type EventInsert = Database["public"]["Tables"]["events"]["Insert"];

type EditableEvent = Omit<EventInsert, "member_id">;

const emptyEvent: EditableEvent = {
  name: "",
  banner: "",
  date: null,
  start_time: null,
  end_time: null,
  place: "",
  cta_link: "",
  description: "",
  status: "draft",
};

export default function Events() {
  const { user } = useDashboardContext();
  const { toast } = useToast();

  const [events, setEvents] = useState<EventRow[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [form, setForm] = useState<EditableEvent>(emptyEvent);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      if (!user?.id) return;
      setLoading(true);
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("member_id", user.id)
        .order("date", { ascending: true });

      if (error) {
        console.error("[LOAD::EVENTS]", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar seus eventos.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      setEvents(data);
      if (data.length > 0) {
        const first = data[0];
        setSelectedEventId(first.id);
        setForm(mapRowToForm(first));
      } else {
        setSelectedEventId(null);
        setForm(emptyEvent);
      }
      setLoading(false);
    };

    loadEvents();
  }, [user?.id, toast]);

  const mapRowToForm = (row: EventRow): EditableEvent => ({
    name: row.name || "",
    banner: row.banner || "",
    date: row.date,
    start_time: row.start_time,
    end_time: row.end_time,
    place: row.place || "",
    cta_link: row.cta_link || "",
    description: row.description || "",
    status: row.status || "draft",
  });

  const handleSelectEvent = (eventId: string) => {
    if (eventId === "novo") {
      setSelectedEventId(null);
      setForm(emptyEvent);
      return;
    }

    const event = events.find((item) => item.id === eventId);
    if (event) {
      setSelectedEventId(event.id);
      setForm(mapRowToForm(event));
    }
  };

  const handleNewEvent = () => {
    setSelectedEventId(null);
    setForm(emptyEvent);
  };

  const handleStatusToggle = () => {
    setForm((current) => ({
      ...current,
      status: current.status === "published" ? "draft" : "published",
    }));
  };

  const validateForm = () => {
    if (!form.name?.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Informe o nome do evento.",
        variant: "destructive",
      });
      return false;
    }

    if (form.cta_link && !/^https?:\/\//.test(form.cta_link)) {
      toast({
        title: "Link inválido",
        description: "O link do botão deve começar com http:// ou https://",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return false;

    setSaving(true);
    console.log("[SAVE::EVENT]", form);

    try {
      const payload: Database["public"]["Tables"]["events"]["Insert"] = {
        ...form,
        member_id: user.id,
      };

      if (selectedEventId) {
        (payload as Database["public"]["Tables"]["events"]["Update"]).id = selectedEventId;
      }

      const { data, error } = await supabase
        .from("events")
        .upsert(payload, { onConflict: "id" })
        .select()
        .single();

      if (error) throw error;

      setEvents((current) => {
        const others = current.filter((item) => item.id !== data.id);
        return [data, ...others];
      });
      setSelectedEventId(data.id);
      setForm(mapRowToForm(data));

      toast({
        title: "Sucesso",
        description: "Evento salvo com sucesso!",
      });
      return true;
    } catch (error: unknown) {
      console.error("[SAVE::EVENT]", error);
      const message = error instanceof Error ? error.message : "Não foi possível salvar o evento.";
      toast({
        title: "Erro",
        description: message,
        variant: "destructive",
      });
      return false;
    } finally {
      setSaving(false);
    }
  };

  const currentStatusLabel = useMemo(
    () => (form.status === "published" ? "Publicado" : "Rascunho"),
    [form.status]
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--surface-alt)]">
        <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-[var(--brand)]" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 md:px-8">
      <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)] md:p-8">
        <div className="space-y-8">
          <div className="space-y-2">
            <h1 className="text-2xl font-['League_Spartan'] font-bold text-[var(--ink)] md:text-3xl">Eventos</h1>
            <p className="text-sm text-[var(--muted)] md:text-base">
              Divulgue apresentações e lançamentos com informações sempre atualizadas para o público SMARTx.
            </p>
          </div>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
            <div className="flex-1 space-y-2">
              <Label htmlFor="selectEvento">Selecionar evento</Label>
              <Select value={selectedEventId ?? 'novo'} onValueChange={handleSelectEvent}>
                <SelectTrigger id="selectEvento">
                  <SelectValue placeholder="Escolha um evento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="novo">Novo evento</SelectItem>
                  {events.map((event) => (
                    <SelectItem key={event.id} value={event.id}>
                      {event.name || 'Sem título'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button variant="secondary" onClick={handleNewEvent}>
                Novo evento
              </Button>
              <Button variant="secondary" onClick={handleStatusToggle}>
                Alterar status ({currentStatusLabel})
              </Button>
            </div>
          </div>

          <FormSection title="Detalhes do evento">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
              <div>
                <Label htmlFor="eventName">Nome do evento *</Label>
                <Input
                  id="eventName"
                  value={form.name ?? ''}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Nome do evento"
                />
              </div>
              <div>
                <Uploader
                  label="Banner do evento"
                  maxBytes={2 * 1024 * 1024}
                  bucketPath="artist-media/photos"
                  accept="image/*"
                  currentPath={form.banner ?? ''}
                  onUploaded={(url) => setForm((prev) => ({ ...prev, banner: url }))}
                />
              </div>
              <div>
                <Label htmlFor="eventDate">Data</Label>
                <Input
                  id="eventDate"
                  type="date"
                  value={form.date ?? ''}
                  onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-2 md:gap-3">
                <div>
                  <Label htmlFor="eventStart">Início</Label>
                  <Input
                    id="eventStart"
                    type="time"
                    value={form.start_time ?? ''}
                    onChange={(e) => setForm((prev) => ({ ...prev, start_time: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="eventEnd">Fim</Label>
                  <Input
                    id="eventEnd"
                    type="time"
                    value={form.end_time ?? ''}
                    onChange={(e) => setForm((prev) => ({ ...prev, end_time: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="eventPlace">Local</Label>
                <Input
                  id="eventPlace"
                  value={form.place ?? ''}
                  onChange={(e) => setForm((prev) => ({ ...prev, place: e.target.value }))}
                  placeholder="Local do evento"
                />
              </div>
              <div>
                <Label htmlFor="eventLink">Link do botão</Label>
                <Input
                  id="eventLink"
                  value={form.cta_link ?? ''}
                  onChange={(e) => setForm((prev) => ({ ...prev, cta_link: e.target.value }))}
                  placeholder="https://"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="eventDescription">Descrição</Label>
                <RichTextEditor
                  id="eventDescription"
                  value={form.description ?? ''}
                  onChange={(value) => setForm((prev) => ({ ...prev, description: value }))}
                  placeholder="Conte sobre o evento"
                />
              </div>
            </div>
          </FormSection>

          <div className="flex justify-end">
            <ToolbarSave onSave={handleSave} saving={saving} />
          </div>
        </div>
      </div>
    </div>
  );

}

