import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.46.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "OPTIONS, POST",
};

function jsonResponse(body: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(body), {
    status: init?.status ?? 200,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
}

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

interface AttachmentInput {
  filename: string;
  content: string; // base64
  contentType?: string;
}

interface VerificationPayload {
  legal_id: string;
  company?: string | null;
  website?: string | null;
  portfolio_url?: string | null;
  attachments?: AttachmentInput[];
}

async function uploadAttachment(userId: string, attachment: AttachmentInput) {
  const { filename, content, contentType } = attachment;
  const relativePath = `${userId}/${crypto.randomUUID()}-${filename}`;

  const binary = Uint8Array.from(atob(content), (c) => c.charCodeAt(0));
  const { error, data } = await supabase.storage
    .from("verifications")
    .upload(relativePath, binary, {
      contentType: contentType ?? "application/octet-stream",
      upsert: true,
    });

  if (error) {
    console.error("[SMARTx] Upload failed", { filename, error: error.message });
    throw new Error(`Falha ao enviar arquivo ${filename}`);
  }

  return data.fullPath ? `verifications/${data.fullPath}` : `verifications/${relativePath}`;
}

async function handleRequest(req: Request) {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Método não permitido" }, { status: 405 });
  }

  const authHeader = req.headers.get("Authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token) {
    return jsonResponse({ error: "Não autenticado" }, { status: 401 });
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser(token);

  if (userError || !user) {
    console.error("[SMARTx] Invalid token", userError?.message);
    return jsonResponse({ error: "Sessão inválida" }, { status: 401 });
  }

  const payload = (await req.json().catch(() => null)) as VerificationPayload | null;

  if (!payload || !payload.legal_id) {
    return jsonResponse({ error: "Dados inválidos" }, { status: 400 });
  }

  const attachments: string[] = [];

  if (payload.attachments?.length) {
    for (const item of payload.attachments) {
      try {
        attachments.push(await uploadAttachment(user.id, item));
      } catch (error) {
        return jsonResponse({ error: (error as Error).message }, { status: 400 });
      }
    }
  }

  const { data: existing, error: existingError } = await supabase
    .from("professional_verifications")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (existingError) {
    console.error("[SMARTx] Failed to load verification", existingError.message);
    return jsonResponse({ error: "Erro ao buscar verificação" }, { status: 500 });
  }

  const verificationData = {
    user_id: user.id,
    legal_id: payload.legal_id,
    company: payload.company ?? null,
    website: payload.website ?? null,
    portfolio_url: payload.portfolio_url ?? null,
    attachment_urls: attachments.length ? attachments : existing?.id ? undefined : [],
    status: "pending" as const,
    reviewer_id: null,
    reviewed_at: null,
    notes: null,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("professional_verifications")
    .upsert(verificationData, { onConflict: "user_id" })
    .select("*")
    .single();

  if (error) {
    console.error("[SMARTx] Failed to upsert verification", error.message);
    return jsonResponse({ error: "Erro ao salvar solicitação" }, { status: 500 });
  }

  return jsonResponse({ success: true, verification: data });
}

serve(async (req) => {
  try {
    return await handleRequest(req);
  } catch (error) {
    console.error("[SMARTx] Unexpected error", error);
    return jsonResponse({ error: "Erro inesperado" }, { status: 500 });
  }
});
