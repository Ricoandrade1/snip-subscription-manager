import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useEffect, useState } from "react";

interface Product {
  id: string;
  name: string;
  price: number;
  description?: string | null;
  stock?: number;
  brand?: string | null;
  category?: string | null;
}

interface Brand {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
}

const formSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  price: z.string().min(1, "Preço é obrigatório"),
  stock: z.string().optional(),
  brand: z.string().optional(),
  category: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ProductServiceFormProps {
  initialData?: Product;
  onSuccess: () => void;
}

export function ProductServiceForm({ initialData, onSuccess }: ProductServiceFormProps) {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      description: initialData?.description?.toString() ?? "",
      price: initialData?.price?.toString() ?? "",
      stock: initialData?.stock?.toString() ?? "",
      brand: initialData?.brand ?? "",
      category: initialData?.category ?? "",
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

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      const productData = {
        name: values.name,
        description: values.description,
        price: parseFloat(values.price),
        stock: values.stock ? parseInt(values.stock) : 0,
        brand_id: values.brand || null,
        category_id: values.category || null,
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Item</FormLabel>
              <FormControl>
                <Input placeholder="Digite o nome do item" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Adicione uma descrição do item"
                  className="min-h-[80px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preço</FormLabel>
              <FormControl>
                <Input 
                  type="number"
                  step="0.01"
                  placeholder="Digite o preço" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="stock"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantidade em Estoque</FormLabel>
              <FormControl>
                <Input 
                  type="number"
                  placeholder="Digite a quantidade" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="brand"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Marca</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma marca" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {brands.map((brand) => (
                    <SelectItem key={brand.id} value={brand.id}>
                      {brand.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoria</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Salvando..." : initialData ? "Atualizar" : "Criar"}
          </Button>
        </div>
      </form>
    </Form>
  );
}