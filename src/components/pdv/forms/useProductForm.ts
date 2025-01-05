import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productFormSchema, type ProductFormValues } from "./schema";
import { Product } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UseProductFormProps {
  initialData?: Product | null;
  onSuccess?: () => void;
}

export function useProductForm({ initialData, onSuccess }: UseProductFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProductFormValues>({
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

  const onSubmit = async (values: ProductFormValues) => {
    setIsLoading(true);
    try {
      const productData = {
        name: values.name,
        description: values.description || null,
        price: parseFloat(values.price),
        stock: values.stock ? parseInt(values.stock) : 0,
        brand_id: values.brand || null,
        category_id: values.category || null,
        vat_rate: parseFloat(values.vat_rate),
        vat_included: values.vat_included,
      };

      if (initialData) {
        const { error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", initialData.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("products")
          .insert([productData]);

        if (error) throw error;
      }

      toast.success(initialData ? "Produto atualizado com sucesso" : "Produto criado com sucesso");
      onSuccess?.();
    } catch (error: any) {
      console.error("Error saving product:", error);
      toast.error("Erro ao salvar produto");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    onSubmit: form.handleSubmit(onSubmit),
  };
}