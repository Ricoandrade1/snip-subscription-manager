import * as z from "zod";

export const formSchema = z.object({
  name: z.string().optional(),
  nickname: z.string().optional(),
  phone: z.string().optional(),
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