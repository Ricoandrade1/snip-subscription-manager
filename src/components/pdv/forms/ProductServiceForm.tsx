import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { ProductBasicFields } from "./ProductBasicFields";
import { ProductCategoryFields } from "./ProductCategoryFields";
import { ProductCommissionFields } from "./ProductCommissionFields";
import { productFormSchema, type ProductFormValues } from "./schema";

interface Product {
  id: string;
  name: string;
  price: number;
  description?: string | null;
  stock?: number;
  brand?: string | null;
  category?: string | null;
  commission_rates?: Record<string, number>;
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
  const [isLoading, setIsLoading] = useState(false);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      description: initialData?.description?.toString() ?? "",
      price: initialData?.price?.toString() ?? "",
      stock: initialData?.stock?.toString() ?? "",
      brand: initialData?.brand ?? "",
      category: initialData?.category ?? "",
      commission_rates: initialData?.commission_rates ?? {},
    },
  });

  useEffect(() => {
    fetchBrandsAndCategories();
  }, []);

  const fetchBrandsAndCategories = async () => {
    try {
      const [brandsResponse, categoriesResponse] = await Promise.all([
        supabase.from("brands").select("*").order("name"),
        supabase.from("categories").select("*").order("name"),
      ]);

      if (brandsResponse.data) {
        setBrands(brandsResponse.data);
      }
      if (categoriesResponse.data) {
        setCategories(categoriesResponse.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Erro ao carregar marcas e categorias");
    }
  };

  const onSubmit = async (values: ProductFormValues) => {
    setIsLoading(true);
    try {
      const productData = {
        name: values.name,
        description: values.description,
        price: parseFloat(values.price),
        stock: values.stock ? parseInt(values.stock) : 0,
        brand_id: values.brand || null,
        category_id: values.category || null,
        commission_rates: values.commission_rates || {},
      };

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
      onSuccess();
    } catch (error) {
      console.error("Error saving item:", error);
      toast.error("Erro ao salvar item");
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
            <ProductCommissionFields form={form} />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Salvando..." : initialData ? "Atualizar" : "Criar"}
          </Button>
        </div>
      </form>
    </Form>
  );
}