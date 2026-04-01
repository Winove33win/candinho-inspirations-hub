import { useState, useEffect } from 'react';
import { api } from '@/lib/apiClient';
import { getSignedUrl } from '@/utils/storage';
import { useDashboardContext } from './context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Trash2, Calendar as CalendarIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { FormSection } from '@/components/dashboard/FormSection';
import { Uploader } from '@/components/dashboard/Uploader';
import { RichTextEditor } from '@/components/dashboard/RichTextEditor';
import { sanitizeHtml } from '@/lib/sanitize';
import { eventSchema } from '@/lib/validation';
import { z } from 'zod';
import type { Event } from '@/types/api';

function pickStrings(data: Partial<Event>): Partial<Event> {
  const result: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(data)) {
    if (typeof v === 'string') {
      result[k] = v.trim() === '' ? null : v.trim();
    } else {
      result[k] = v;
    }
  }
  return result as Partial<Event>;
}

export default function Events() {
  const { user } = useDashboardContext();
  const { toast } = useToast();
  const [events, setEvents]     = useState<Event[]>([]);
  const [loading, setLoading]   = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => { loadEvents(); }, [user?.id]);

  async function loadEvents() {
    if (!user?.id) return;
    setLoading(true);
    try {
      const { data } = await api.get<{ data: Event[] }>('/api/events');
      setEvents(data || []);
    } catch {
      toast({ title: 'Erro', description: 'Não foi possível carregar os eventos', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Deseja realmente excluir este evento?')) return;
    try {
      await api.delete(`/api/events/${id}`);
      toast({ title: 'Evento excluído com sucesso' });
      loadEvents();
    } catch {
      toast({ title: 'Erro ao excluir', variant: 'destructive' });
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
    <div className="site-container space-y-6 pb-16">
      <Card className="p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <h2 className="text-3xl font-['League_Spartan'] font-semibold text-[var(--ink)]">Eventos</h2>
            <p className="text-sm text-[var(--muted)] md:text-base">Divulgue apresentações, estreias e datas importantes.</p>
          </div>
          <Button onClick={() => setEditingId('new')} className="gap-2 self-start md:self-auto">
            <Plus className="h-4 w-4" />
            Novo evento
          </Button>
        </div>
      </Card>

      {editingId && (
        <EventForm
          eventId={editingId === 'new' ? null : editingId}
          onClose={() => { setEditingId(null); loadEvents(); }}
        />
      )}

      <Card className="p-6 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-6">
          {events.map((event) => (
            <EventPreview key={event.id} event={event}
              onEdit={() => setEditingId(event.id)}
              onDelete={() => handleDelete(event.id)} />
          ))}
        </div>
        {events.length === 0 && !editingId && (
          <Card className="mt-6 border-dashed bg-[var(--surface)] p-12 text-center">
            <CalendarIcon className="mx-auto h-12 w-12 text-[var(--muted)]" aria-hidden="true" />
            <p className="mt-4 text-sm text-[var(--muted)] md:text-base">
              Nenhum evento cadastrado ainda. Adicione seu primeiro evento!
            </p>
          </Card>
        )}
      </Card>
    </div>
  );
}

function EventForm({ eventId, onClose }: { eventId: string | null; onClose: () => void }) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<Event>>({
    name: '', description: '', date: '', start_time: '', end_time: '',
    place: '', cta_link: '', banner: '', status: 'draft',
  });

  useEffect(() => {
    if (eventId) {
      api.get<{ data: Event }>(`/api/events/${eventId}`)
        .then(({ data }) => setFormData(data))
        .catch(console.error);
    }
  }, [eventId]);

  async function handleSave() {
    setSaving(true);
    try {
      const validated = eventSchema.parse(formData);
      const payload = { ...pickStrings(validated as Partial<Event>), status: 'published' as const };

      if (eventId) {
        await api.put(`/api/events/${eventId}`, payload);
      } else {
        await api.post('/api/events', payload);
      }
      toast({ title: 'Evento salvo com sucesso!' });
      onClose();
    } catch (err) {
      if (err instanceof z.ZodError) {
        toast({ title: 'Erro de validação', description: err.errors[0].message, variant: 'destructive' });
      } else {
        toast({ title: 'Erro ao salvar', description: err instanceof Error ? err.message : undefined, variant: 'destructive' });
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <FormSection title={eventId ? 'Editar evento' : 'Novo evento'} description="Planeje as informações principais do seu evento.">
        <div className="grid grid-cols-12 gap-4 md:gap-6">
          <div className="col-span-12 md:col-span-6">
            <Label htmlFor="eventName">Nome do evento *</Label>
            <Input id="eventName" value={formData.name || ''} onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))} placeholder="Festival SMARTx" required />
          </div>
          <div className="col-span-12 md:col-span-4">
            <Label htmlFor="eventDate">Data</Label>
            <Input id="eventDate" type="date" value={formData.date || ''} onChange={(e) => setFormData((p) => ({ ...p, date: e.target.value }))} />
          </div>
          <div className="col-span-12 md:col-span-4">
            <Label htmlFor="eventStart">Horário de início</Label>
            <Input id="eventStart" type="time" value={formData.start_time || ''} onChange={(e) => setFormData((p) => ({ ...p, start_time: e.target.value }))} />
          </div>
          <div className="col-span-12 md:col-span-4">
            <Label htmlFor="eventEnd">Horário de término</Label>
            <Input id="eventEnd" type="time" value={formData.end_time || ''} onChange={(e) => setFormData((p) => ({ ...p, end_time: e.target.value }))} />
          </div>
          <div className="col-span-12 md:col-span-6">
            <Label htmlFor="eventPlace">Local do evento</Label>
            <Input id="eventPlace" value={formData.place || ''} onChange={(e) => setFormData((p) => ({ ...p, place: e.target.value }))} placeholder="Teatro Municipal de São Paulo" />
          </div>
          <div className="col-span-12 md:col-span-6">
            <Label htmlFor="eventLink">Link para inscrição/ingresso</Label>
            <Input id="eventLink" type="url" value={formData.cta_link || ''} onChange={(e) => setFormData((p) => ({ ...p, cta_link: e.target.value }))} placeholder="https://" />
          </div>
          <div className="col-span-12">
            <Uploader label="Banner do evento" storageFolder="photos"
              currentPath={formData.banner || ''}
              onUploaded={(url) => setFormData((p) => ({ ...p, banner: url }))}
              accept="image/*" nameHint="evento-banner" />
          </div>
        </div>
      </FormSection>

      <FormSection title="Descrição" description="Conte ao público o que esperar do evento.">
        <RichTextEditor id="eventDescription" value={formData.description || ''}
          onChange={(v) => setFormData((p) => ({ ...p, description: v }))}
          placeholder="Descreva a programação, artistas e destaques do evento." />
      </FormSection>

      <div className="flex flex-wrap justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onClose} className="min-w-[160px]">Cancelar</Button>
        <Button type="button" onClick={handleSave} disabled={saving || !formData.name} className="min-w-[180px]">
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          {eventId ? 'Atualizar evento' : 'Publicar evento'}
        </Button>
      </div>
    </div>
  );
}

function EventPreview({ event, onEdit, onDelete }: { event: Event; onEdit: () => void; onDelete: () => void }) {
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!event.banner) { setBannerUrl(null); return; }
    let active = true;
    getSignedUrl(event.banner).then((url) => { if (active) setBannerUrl(url); }).catch(() => { if (active) setBannerUrl(null); });
    return () => { active = false; };
  }, [event.banner]);

  const eventDate = event.date ? new Date(`${event.date}T00:00:00`) : null;
  const formattedDate = eventDate
    ? eventDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
    : 'Data a definir';
  const timeLabel = [event.start_time, event.end_time].filter(Boolean).join(' - ');

  return (
    <Card className="group overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
      {bannerUrl && (
        <div className="relative h-48 w-full overflow-hidden">
          <img src={bannerUrl} alt={event.name || 'Banner do evento'}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/30 to-transparent" aria-hidden="true" />
        </div>
      )}
      <div className="space-y-4 p-6 md:p-8">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-[var(--ink)]">{event.name || 'Evento sem título'}</h3>
          <p className="text-sm font-semibold text-[var(--brand)]">
            {formattedDate}
            {timeLabel && <span className="text-[var(--muted)]"> · {timeLabel}</span>}
          </p>
          {event.place && <p className="text-sm text-[var(--muted)]">{event.place}</p>}
        </div>
        {event.description && (
          <div className="prose prose-sm max-w-none text-[var(--muted)] line-clamp-3"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(event.description) }} />
        )}
        <div className="flex items-center gap-2 pt-2">
          <Button variant="secondary" size="sm" className="flex-1" onClick={onEdit}>Editar</Button>
          <Button variant="destructive" size="sm" onClick={onDelete} aria-label={`Excluir ${event.name ?? 'evento'}`}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
