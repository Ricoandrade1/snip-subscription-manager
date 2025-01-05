import * as z from "zod";

export const formSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").optional(),
  nickname: z.string().optional(),
  phone: z.string().min(9, "Telefone deve ter pelo menos 9 dígitos").optional(),
  nif: z.string().optional(),
  birthDate: z.string().optional(),
  passport: z.string().optional(),
  citizenCard: z.string().optional(),
  bi: z.string().optional(),
  bank: z.string().optional(),
  iban: z.string().optional(),
  debitDate: z.string().optional(),
  plan: z.enum(["Basic", "Classic", "Business"]).default("Basic"),
});