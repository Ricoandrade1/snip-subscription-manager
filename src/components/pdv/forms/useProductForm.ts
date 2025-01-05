import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Product } from "../types";

const productFormSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  price: z.string().min(1, "Preço é obrigatório"),
  stock: z.string().optional(),
  brand: z.string().optional(),
  category: z.string().optional(),
  vat_rate: z.string().default("23"),
  vat_included: z.boolean().default(false),
  image_url: z.string().optional(),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;

interface UseProductFormProps {
  initialData?: Product | null;
}

export function useProductForm({ initialData }: UseProductFormProps = {}) {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      price: initialData?.price?.toString() || "",
      stock: initialData?.stock?.toString() || "",
      brand: initialData?.brand_id || "",
      category: initialData?.category_id || "",
      vat_rate: initialData?.vat_rate?.toString() || "23",
      vat_included: initialData?.vat_included || false,
      image_url: initialData?.image_url || "",
    },
  });

  return form;
}