import * as z from "zod";

export const productFormSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  price: z.string().min(1, "Preço é obrigatório"),
  stock: z.string().optional(),
  brand: z.string().optional(),
  category: z.string().optional(),
  commission_rates: z.record(z.number().optional()).optional(),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;