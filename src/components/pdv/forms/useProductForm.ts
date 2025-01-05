import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productFormSchema, type ProductFormValues } from "./schema";
import { Product } from "../types";

interface UseProductFormProps {
  initialData?: Product | null;
  onSuccess?: () => void;
}

export function useProductForm({ initialData }: UseProductFormProps) {
  return useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      description: initialData?.description ?? "",
      price: initialData?.price?.toString() ?? "",
      stock: initialData?.stock?.toString() ?? "",
      brand: initialData?.brand_id ?? "",
      category: initialData?.category_id ?? "",
      vat_rate: initialData?.vat_rate?.toString() ?? "23",
      vat_included: initialData?.vat_included ?? false,
    },
  });
}