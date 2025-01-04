import * as z from "zod";

export const formSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  nickname: z.string().optional(),
  phone: z.string().min(9, "Telefone deve ter pelo menos 9 dígitos"),
  nif: z.string().optional(),
  birthDate: z.string(),
  passport: z.string().optional(),
  citizenCard: z.string().optional(),
  bi: z.string().optional(),
  bank: z.string().min(2, "Nome do banco é obrigatório"),
  iban: z.string().min(15, "IBAN inválido"),
  debitDate: z.string(),
  plan: z.enum(["Basic", "Classic", "Business"]),
});