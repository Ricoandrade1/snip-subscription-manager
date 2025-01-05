import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { ProductBasicFields } from "./forms/ProductBasicFields";
import { ProductCategoryFields } from "./forms/ProductCategoryFields";
import { supabase } from "@/integrations/supabase/client";
import { useProductForm } from "./forms/useProductForm";
import { toast } from "sonner";

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

interface Brand {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
}

interface ProductServiceFormProps {
  initialData?: Product;
  onSuccess: () => void;
}

export function ProductServiceForm({ initialData, onSuccess }: ProductServiceFormProps) {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const { form, isLoading, onSubmit } = useProductForm(initialData, onSuccess);

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

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
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