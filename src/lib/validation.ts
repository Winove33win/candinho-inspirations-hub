import { z } from "zod";

// Auth validation schemas
export const emailSchema = z
  .string()
  .trim()
  .min(1, "Email é obrigatório")
  .email("Email inválido")
  .max(255, "Email deve ter no máximo 255 caracteres");

export const passwordSchema = z
  .string()
  .min(6, "A senha deve ter no mínimo 6 caracteres")
  .max(128, "A senha deve ter no máximo 128 caracteres");

export const authSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

// Event validation schemas
export const eventSchema = z.object({
  name: z.string().trim().min(1, "Nome do evento é obrigatório").max(200, "Nome deve ter no máximo 200 caracteres"),
  description: z.string().max(5000, "Descrição deve ter no máximo 5000 caracteres").optional().nullable(),
  date: z.string().optional().nullable(),
  start_time: z.string().optional().nullable(),
  end_time: z.string().optional().nullable(),
  place: z.string().trim().max(300, "Local deve ter no máximo 300 caracteres").optional().nullable(),
  cta_link: z.string().url("URL inválida").max(500, "URL deve ter no máximo 500 caracteres").optional().nullable().or(z.literal("")),
  banner: z.string().optional().nullable(),
  status: z.enum(["draft", "published"]).optional(),
});

// Artist detail validation schemas
export const artistNameSchema = z
  .string()
  .trim()
  .min(1, "Nome é obrigatório")
  .max(200, "Nome deve ter no máximo 200 caracteres");

export const phoneSchema = z
  .string()
  .trim()
  .max(20, "Telefone deve ter no máximo 20 caracteres")
  .optional()
  .nullable();

export const addressSchema = z
  .string()
  .trim()
  .max(500, "Endereço deve ter no máximo 500 caracteres")
  .optional()
  .nullable();

export const urlSchema = z
  .string()
  .url("URL inválida")
  .max(500, "URL deve ter no máximo 500 caracteres")
  .optional()
  .nullable()
  .or(z.literal(""));

export const richTextSchema = z
  .string()
  .max(10000, "Texto deve ter no máximo 10000 caracteres")
  .optional()
  .nullable();

// Support ticket validation
export const supportTicketSchema = z.object({
  subject: z.string().trim().min(1, "Assunto é obrigatório").max(200, "Assunto deve ter no máximo 200 caracteres"),
  message: z.string().trim().min(10, "Mensagem deve ter no mínimo 10 caracteres").max(2000, "Mensagem deve ter no máximo 2000 caracteres"),
});
