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
  brand_id?: string | null;
  category_id?: string | null;
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
      brand: initialData?.brand_id ?? "",
      category: initialData?.category_id ?? "",
      vat_rate: initialData?.vat_rate?.toString() ?? "23",
      vat_included: initialData?.vat_included ?? false,
    },
  });

  const onSubmit = async (values: ProductFormValues) => {
    try {
      setIsLoading(true);

      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Você precisa estar logado para salvar produtos");
        return;
      }

      console.log("Current session:", session); // Debug log
      
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

      console.log("Saving product with data:", productData); // Debug log

      let error;
      if (initialData) {
        const { error: updateError, data } = await supabase
          .from("products")
          .update(productData)
          .eq("id", initialData.id);
        error = updateError;
        console.log("Update response:", { error: updateError, data }); // Debug log
      } else {
        const { error: insertError, data } = await supabase
          .from("products")
          .insert(productData);
        error = insertError;
        console.log("Insert response:", { error: insertError, data }); // Debug log
      }

      if (error) {
        console.error("Database error:", error);
        throw error;
      }

      toast.success(
        initialData ? "Produto atualizado com sucesso" : "Produto criado com sucesso"
      );
      
      form.reset();
      onSuccess?.();
    } catch (error: any) {
      console.error("Error saving product:", error);
      const errorMessage = error.message || "Erro ao salvar produto";
      console.error("Full error details:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      toast.error(errorMessage);
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