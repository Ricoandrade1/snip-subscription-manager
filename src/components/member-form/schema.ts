import * as z from "zod";

export const formSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  nickname: z.string().optional(),
  phone: z.string().optional(),
  nif: z.string().optional(),
  plan: z.enum(["Basic", "Classic", "Business"]),
  due_date: z.date().optional(),
});