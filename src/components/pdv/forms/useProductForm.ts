import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { productFormSchema, type ProductFormValues } from "./schema";

interface Product {
  id: string;
  name: string;
  price: number;
  description?: string | null;
  stock?: number;
  brand?: string | null;
  category?: string | null;
  vat_rate?: number;
  vat_included?: boolean;
}

export function useProductForm(initialData?: Product, onSuccess?: () => void) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      description: initialData?.description?.toString() ?? "",
      price: initialData?.price?.toString() ?? "",
      stock: initialData?.stock?.toString() ?? "",
      brand: initialData?.brand ?? "",
      category: initialData?.category ?? "",
      vat_rate: initialData?.vat_rate?.toString() ?? "23",
      vat_included: initialData?.vat_included ?? false,
    },
  });

  const onSubmit = async (values: ProductFormValues) => {
    try {
      setIsLoading(true);
      
      const productData = {
        name: values.name,
        description: values.description,
        price: parseFloat(values.price),
        stock: values.stock ? parseInt(values.stock) : 0,
        brand_id: values.brand || null,
        category_id: values.category || null,
        vat_rate: parseFloat(values.vat_rate),
        vat_included: values.vat_included,
      };

      console.log("Saving product with data:", productData);

      const { error } = initialData
        ? await supabase
            .from("products")
            .update(productData)
            .eq("id", initialData.id)
        : await supabase
            .from("products")
            .insert(productData);

      if (error) throw error;

      toast.success(
        initialData ? "Item atualizado com sucesso" : "Item criado com sucesso"
      );
      onSuccess?.();
    } catch (error) {
      console.error("Error saving item:", error);
      toast.error("Erro ao salvar item");
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