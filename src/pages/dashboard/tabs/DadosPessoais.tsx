import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FormSection } from "@/components/dashboard/FormSection";
import { Uploader } from "@/components/dashboard/Uploader";
import { ToolbarSave } from "@/components/dashboard/ToolbarSave";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { ArtistDetails } from "@/hooks/useArtistDetails";
import type { DashboardContextValue } from "../context";
import { computeProfileCompletion } from "@/utils/profileCompletion";

interface DadosPessoaisProps {
  artistDetails: ArtistDetails | null;
  onUpsert: DashboardContextValue["upsertArtistDetails"];
}

export default function DadosPessoais({ artistDetails, onUpsert }: DadosPessoaisProps) {
  const [saving, setSaving] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    artistic_name: "",
    profile_image: "",
    full_name: "",
    how_is_it_defined1: "",
    how_is_it_defined: "",
    cell_phone: "",
    date_of_birth: "",
    country_of_birth: "",
    profile_text2: "",
    address1: "",
    postal_code: "",
    address2: "",
    city: "",
    country_residence: "",
    accepted_terms1: false,
    accepted_terms2: false,
  });

  useEffect(() => {
    if (artistDetails) {
      setFormData({
        artistic_name: artistDetails.artistic_name || "",
        profile_image: artistDetails.profile_image || "",
        full_name: artistDetails.full_name || "",
        how_is_it_defined1: artistDetails.how_is_it_defined1 || "",
        how_is_it_defined: artistDetails.how_is_it_defined || "",
        cell_phone: artistDetails.cell_phone || "",
        date_of_birth: artistDetails.date_of_birth || "",
        country_of_birth: artistDetails.country_of_birth || "",
        profile_text2: artistDetails.profile_text2 || "",
        address1: artistDetails.address1 || "",
        postal_code: artistDetails.postal_code || "",
        address2: artistDetails.address2 || "",
        city: artistDetails.city || "",
        country_residence: artistDetails.country_residence || "",
        accepted_terms1: artistDetails.accepted_terms1 || false,
        accepted_terms2: artistDetails.accepted_terms2 || false,
      });
    }
  }, [artistDetails]);

  const validateForm = () => {
    if (!formData.artistic_name || !formData.full_name) {
      toast({
        title: "Erro de validação",
        description: "Preencha todos os campos obrigatórios (*)",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.accepted_terms1 || !formData.accepted_terms2) {
      toast({
        title: "Erro de validação",
        description: "Você deve aceitar ambos os termos para continuar",
        variant: "destructive",
      });
      return false;
    }

    if (formData.postal_code && formData.postal_code.length > 12) {
      toast({
        title: "Erro de validação",
        description: "CEP/Código Postal deve ter no máximo 12 caracteres",
        variant: "destructive",
      });
      return false;
    }

    if (formData.date_of_birth) {
      const parsed = Date.parse(formData.date_of_birth);
      if (Number.isNaN(parsed)) {
        toast({
          title: "Erro de validação",
          description: "Informe uma data de nascimento válida",
          variant: "destructive",
        });
        return false;
      }
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return false;

    setSaving(true);
    console.log("[SAVE::DADOS_PESSOAIS]", formData);

    try {
      const response = await onUpsert({
        ...formData,
      });

      if (!response || response.error) {
        throw response?.error || new Error("Não foi possível salvar os dados");
      }

      toast({
        title: "Sucesso",
        description: "Dados pessoais salvos com sucesso!",
      });

      const completionTarget =
        response.data ?? (artistDetails ? { ...artistDetails, ...formData } : null);
      const { percent } = computeProfileCompletion(completionTarget);

      if (percent === 100 && !(artistDetails?.perfil_completo)) {
        setShowSuccessModal(true);
      }
      return true;
    } catch (error: unknown) {
      console.error("[SAVE::DADOS_PESSOAIS]", error);
      const message = error instanceof Error ? error.message : "Erro ao salvar dados";
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

  const canSave = formData.accepted_terms1 && formData.accepted_terms2;

  return (
    <>
      <div className="space-y-6">
        <FormSection title="Informações básicas" description="Preencha seus dados pessoais">
          <div className="grid grid-cols-1 gap-y-4 md:grid-cols-12 md:gap-6">
            <div className="md:col-span-6">
              <Label htmlFor="inputArtisticName">Nome Artístico *</Label>
              <Input
                id="inputArtisticName"
                value={formData.artistic_name}
                onChange={(e) => setFormData({ ...formData, artistic_name: e.target.value })}
                required
              />
            </div>

            <div className="md:col-span-6">
              <Label htmlFor="inputFullName">Nome Completo *</Label>
              <Input
                id="inputFullName"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                required
              />
            </div>

            <div className="md:col-span-6">
              <Uploader
                id="imageX80"
                label="Foto de Perfil"
                storageFolder="profile"
                accept="image/*"
                currentPath={formData.profile_image}
                onUploaded={(url) => setFormData({ ...formData, profile_image: url })}
                previewClassName="rounded-full w-32 h-32 object-cover border"
                nameHint="avatar"
              />
            </div>

            <div className="md:col-span-6">
              <Label htmlFor="dropdown2">Como se define</Label>
              <Select
                value={formData.how_is_it_defined1}
                onValueChange={(value) => setFormData({ ...formData, how_is_it_defined1: value })}
              >
                <SelectTrigger id="dropdown2">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="artista">Artista</SelectItem>
                  <SelectItem value="musico">Músico</SelectItem>
                  <SelectItem value="produtor">Produtor</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-6">
              <Label htmlFor="input98">Especificação</Label>
              <Input
                id="input98"
                value={formData.how_is_it_defined}
                onChange={(e) => setFormData({ ...formData, how_is_it_defined: e.target.value })}
              />
            </div>

            <div className="md:col-span-6">
              <Label htmlFor="pinput6">Celular</Label>
              <Input
                id="pinput6"
                type="tel"
                value={formData.cell_phone}
                onChange={(e) => setFormData({ ...formData, cell_phone: e.target.value })}
              />
            </div>

            <div className="md:col-span-6">
              <Label htmlFor="datePicker4">Data de Nascimento</Label>
              <Input
                id="datePicker4"
                type="date"
                value={formData.date_of_birth}
                onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
              />
            </div>

            <div className="md:col-span-6">
              <Label htmlFor="dropdown3">País de Nascimento</Label>
              <Input
                id="dropdown3"
                value={formData.country_of_birth}
                onChange={(e) => setFormData({ ...formData, country_of_birth: e.target.value })}
              />
            </div>
            <div className="md:col-span-12">
              <Label htmlFor="textBox26">Frase de Impacto</Label>
              <Textarea
                id="textBox26"
                value={formData.profile_text2}
                onChange={(e) => setFormData({ ...formData, profile_text2: e.target.value })}
                placeholder="Uma frase que defina você como artista"
              />
            </div>
          </div>
        </FormSection>

        <FormSection title="Endereço">
          <div className="grid grid-cols-1 gap-y-4 md:grid-cols-12 md:gap-6">
            <div className="md:col-span-8">
              <Label htmlFor="pinput8">Endereço</Label>
              <Input
                id="pinput8"
                value={formData.address1}
                onChange={(e) => setFormData({ ...formData, address1: e.target.value })}
              />
            </div>

            <div className="md:col-span-4">
              <Label htmlFor="pinput11">CEP/Código Postal</Label>
              <Input
                id="pinput11"
                value={formData.postal_code}
                onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                maxLength={12}
              />
            </div>

            <div className="md:col-span-6">
              <Label htmlFor="pinput9">Complemento</Label>
              <Input
                id="pinput9"
                value={formData.address2}
                onChange={(e) => setFormData({ ...formData, address2: e.target.value })}
              />
            </div>

            <div className="md:col-span-6">
              <Label htmlFor="pinput10">Cidade</Label>
              <Input
                id="pinput10"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>

            <div className="md:col-span-6">
              <Label htmlFor="dropdown1">País de Residência</Label>
              <Input
                id="dropdown1"
                value={formData.country_residence}
                onChange={(e) => setFormData({ ...formData, country_residence: e.target.value })}
              />
            </div>
          </div>
        </FormSection>

        <FormSection title="Termos e Condições *">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="checkbox5"
                checked={formData.accepted_terms1}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, accepted_terms1: checked as boolean })
                }
              />
              <label htmlFor="checkbox5" className="text-sm">
                Aceito os termos e condições *{" "}
                <a href="#" className="text-primary underline">
                  Ver os termos
                </a>
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="checkbox1"
                checked={formData.accepted_terms2}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, accepted_terms2: checked as boolean })
                }
              />
              <label htmlFor="checkbox1" className="text-sm">
                Aceito a política de privacidade *{" "}
                <a href="#" className="text-primary underline">
                  Ver a política
                </a>
              </label>
            </div>
          </div>
        </FormSection>

        <div className="flex justify-end pt-4">
          <ToolbarSave
            onSave={handleSave}
            saving={saving}
            defaultLabel="Salvar"
            disabled={!canSave}
          />
        </div>
      </div>

      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Perfil criado com sucesso!</DialogTitle>
            <DialogDescription>
              Agora você pode publicar seus projetos e eventos.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}