import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Upload, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { KNOWN_BUCKETS, getBucketForFolder } from "@/config/storage";

export default function ImportArtists() {
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const { toast } = useToast();
  const videoBucket = getBucketForFolder("videos");

  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  };

  const cleanValue = (value: string): string | null => {
    if (!value || value === '""' || value === '') return null;
    return value.replace(/^"|"$/g, '').trim() || null;
  };

  type BannerStatus = "empty" | "valid" | "invalid" | "normalized";

  const normalizeVideoBanner = (
    value: string | null,
  ): { value: string | null; status: BannerStatus } => {
    if (!value) {
      return { value: null, status: "empty" as const };
    }

    const trimmed = value.trim().replace(/^\/+/, "");
    if (!trimmed) {
      return { value: null, status: "empty" as const };
    }

    if (/^https?:\/\//i.test(trimmed)) {
      return { value: trimmed, status: "valid" as const };
    }

    const segments = trimmed.split("/").filter(Boolean);
    if (segments.length < 2) {
      return { value: null, status: "invalid" as const };
    }

    const [firstSegment, ...rest] = segments;
    if (firstSegment === videoBucket) {
      return { value: [firstSegment, ...rest].join("/"), status: "valid" as const };
    }

    if (KNOWN_BUCKETS.includes(firstSegment)) {
      return { value: null, status: "invalid" as const };
    }

    return {
      value: `${videoBucket}/${segments.join("/")}`,
      status: "normalized" as const,
    };
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setProgress({ current: 0, total: 0 });

    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      // Remove header
      const dataLines = lines.slice(1);
      setProgress({ current: 0, total: dataLines.length });

      let imported = 0;
      let skipped = 0;
      let errors = 0;
      let normalizedVideoBanners = 0;
      let invalidVideoBanners = 0;

      for (let i = 0; i < dataLines.length; i++) {
        const line = dataLines[i];
        if (!line.trim()) continue;

        try {
          const cols = parseCSVLine(line);
          
          const artisticName = cleanValue(cols[1]);
          const fullName = cleanValue(cols[2]);
          const memberId = cleanValue(cols[3]);

          // Skip if no essential data
          if (!artisticName && !fullName) {
            skipped++;
            continue;
          }

          // Check if artist already exists by email or member_id
          const email = cleanValue(cols[79]);
          
          // Use member ID from CSV or generate new UUID
          const userId = memberId || crypto.randomUUID();

          // Check if artist already exists
          const { data: existing } = await supabase
            .from('new_artist_details')
            .select('id')
            .eq('member_id', userId)
            .maybeSingle();

          if (existing) {
            skipped++;
            setProgress({ current: i + 1, total: dataLines.length });
            continue;
          }

          // Map CSV fields to database columns
          const videoPortrait = normalizeVideoBanner(cleanValue(cols[17]));
          const videoLandscape = normalizeVideoBanner(cleanValue(cols[18]));

          normalizedVideoBanners += Number(videoPortrait.status === "normalized");
          normalizedVideoBanners += Number(videoLandscape.status === "normalized");
          invalidVideoBanners += Number(videoPortrait.status === "invalid");
          invalidVideoBanners += Number(videoLandscape.status === "invalid");

          const artistData = {
            member_id: userId,
            artistic_name: artisticName,
            full_name: fullName,
            country_residence: cleanValue(cols[6]),
            city: cleanValue(cols[7]),
            profile_text2: cleanValue(cols[8]),
            profile_image: cleanValue(cols[9]),
            country_of_birth: cleanValue(cols[10]),
            visao_geral_titulo: cleanValue(cols[11]),
            historia_titulo: cleanValue(cols[12]),
            carreira_titulo: cleanValue(cols[13]),
            mais_titulo: cleanValue(cols[14]),
            biography1: cleanValue(cols[15]),
            audio: cleanValue(cols[16]),
            video_banner_portrait: videoPortrait.value,
            video_banner_landscape: videoLandscape.value,
            link_to_video: cleanValue(cols[19]),
            link_to_video2: cleanValue(cols[20]),
            link_to_video3: cleanValue(cols[21]),
            link_to_video4: cleanValue(cols[22]),
            link_to_video5: cleanValue(cols[23]),
            link_to_video6: cleanValue(cols[24]),
            link_to_video7: cleanValue(cols[25]),
            link_to_video8: cleanValue(cols[26]),
            link_to_video9: cleanValue(cols[27]),
            link_to_video10: cleanValue(cols[28]),
            address2: cleanValue(cols[29]),
            image1: cleanValue(cols[32]),
            image1_text: cleanValue(cols[33]),
            image2: cleanValue(cols[34]),
            image2_text: cleanValue(cols[35]),
            image3: cleanValue(cols[36]),
            image3_text: cleanValue(cols[37]),
            image4: cleanValue(cols[38]),
            image4_text: cleanValue(cols[39]),
            image5: cleanValue(cols[40]),
            image5_text: cleanValue(cols[41]),
            image6: cleanValue(cols[42]),
            image7: cleanValue(cols[43]),
            image8: cleanValue(cols[44]),
            image7_text: cleanValue(cols[45]),
            image6_text: cleanValue(cols[46]),
            image8_text: cleanValue(cols[47]),
            image9: cleanValue(cols[48]),
            image10: cleanValue(cols[49]),
            image9_text: cleanValue(cols[50]),
            image10_text: cleanValue(cols[51]),
            image11: cleanValue(cols[52]),
            image12: cleanValue(cols[53]),
            image11_text: cleanValue(cols[59]),
            image12_text: cleanValue(cols[58]),
            facebook: cleanValue(cols[73]),
            accepted_terms1: cleanValue(cols[74]) === 'true',
            accepted_terms2: cleanValue(cols[75]) === 'true',
            perfil_completo: cleanValue(cols[76]) === 'true',
            cell_phone: cleanValue(cols[80]),
            address1: cleanValue(cols[81]),
            postal_code: cleanValue(cols[82]),
            date_of_birth: cleanValue(cols[83]),
            instagram: cleanValue(cols[87]),
            website: cleanValue(cols[88]),
            music_spotify_apple: cleanValue(cols[89]),
            youtube_channel: cleanValue(cols[91]),
          };

          const { error } = await supabase
            .from('new_artist_details')
            .insert([artistData]);

          if (error) {
            console.error(`Error importing ${artisticName}:`, error);
            errors++;
          } else {
            imported++;
          }
        } catch (lineError) {
          console.error(`Error processing line ${i}:`, lineError);
          errors++;
        }

        setProgress({ current: i + 1, total: dataLines.length });
      }

      const adjustments: string[] = [];
      if (normalizedVideoBanners > 0) {
        adjustments.push(`${normalizedVideoBanners} banner${normalizedVideoBanners > 1 ? "s" : ""} normalizado${normalizedVideoBanners > 1 ? "s" : ""}`);
      }
      if (invalidVideoBanners > 0) {
        adjustments.push(`${invalidVideoBanners} banner${invalidVideoBanners > 1 ? "s" : ""} descartado${invalidVideoBanners > 1 ? "s" : ""}`);
      }

      const adjustmentsMessage = adjustments.length > 0 ? ` (${adjustments.join(", ")})` : "";

      toast({
        title: "Importação concluída",
        description: `${imported} artistas importados, ${skipped} ignorados, ${errors} erros${adjustmentsMessage}`,
      });
    } catch (error) {
      console.error("Import error:", error);
      toast({
        title: "Erro na importação",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setImporting(false);
      setProgress({ current: 0, total: 0 });
    }
  };

  return (
    <div className="site-container space-y-6 pb-16">
      <Card className="p-8">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-['League_Spartan'] font-semibold text-[var(--ink)]">
              Importar Artistas (CSV)
            </h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Faça upload do arquivo CSV com os dados dos artistas para importar para o banco de dados.
            </p>
          </div>

          {importing && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--muted)]">Importando...</span>
                <span className="font-semibold text-[var(--ink)]">
                  {progress.current} / {progress.total}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--surface-alt)]">
                <div
                  className="h-full bg-[var(--brand)] transition-all duration-300"
                  style={{
                    width: progress.total > 0 ? `${(progress.current / progress.total) * 100}%` : '0%',
                  }}
                />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-4">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              disabled={importing}
              className="hidden"
              id="csv-upload"
            />
            <label htmlFor="csv-upload">
              <Button
                type="button"
                disabled={importing}
                className="w-full"
                onClick={() => document.getElementById('csv-upload')?.click()}
              >
                {importing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Importando...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Selecionar arquivo CSV
                  </>
                )}
              </Button>
            </label>
          </div>

          <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-alt)] p-4">
            <h3 className="mb-2 text-sm font-semibold text-[var(--ink)]">Instruções:</h3>
            <ul className="space-y-1 text-sm text-[var(--muted)]">
              <li>• O arquivo deve estar no formato CSV</li>
              <li>• Artistas duplicados serão ignorados</li>
              <li>• Apenas artistas com nome artístico ou nome completo serão importados</li>
              <li>• O processo pode levar alguns minutos dependendo do tamanho do arquivo</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
