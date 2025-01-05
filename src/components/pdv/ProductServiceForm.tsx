import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { ProductBasicFields } from "./forms/ProductBasicFields";
import { ProductCategoryFields } from "./forms/ProductCategoryFields";
import { supabase } from "@/integrations/supabase/client";
import { useProductForm } from "./forms/useProductForm";
import { toast } from "sonner";
import { Product } from "./types";

interface ProductServiceFormProps {
  initialData?: Product | null;
  onSuccess: () => void;
}

export function ProductServiceForm({ initialData, onSuccess }: ProductServiceFormProps) {
  const [brands, setBrands] = useState<{ id: string; name: string }[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const form = useProductForm({ initialData });

  useEffect(() => {
    fetchBrandsAndCategories();
  }, []);

  const fetchBrandsAndCategories = async () => {
    try {
      const [brandsResponse, categoriesResponse] = await Promise.all([
        supabase.from("brands").select("*").order("name"),
        supabase.from("categories").select("*").order("name"),
      ]);

      if (brandsResponse.error) throw brandsResponse.error;
      if (categoriesResponse.error) throw categoriesResponse.error;

      setBrands(brandsResponse.data || []);
      setCategories(categoriesResponse.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Erro ao carregar marcas e categorias");
    }
  };

  const onSubmit = async (values: any) => {
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
      onSuccess();
    } catch (error: any) {
      console.error("Error saving product:", error);
      toast.error("Erro ao salvar produto");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <ProductBasicFields form={form} />
          </div>
          <div className="space-y-6">
            <ProductCategoryFields 
              form={form} 
              brands={brands}
              categories={categories}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={isLoading}
            className="bg-barber-gold hover:bg-barber-gold/90 text-black font-medium px-8"
          >
            {isLoading ? "Salvando..." : initialData ? "Atualizar" : "Criar"}
          </Button>
        </div>
      </form>
    </Form>
  );
}