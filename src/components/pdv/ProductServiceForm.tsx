import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  price: z.coerce.number().min(0, "Preço deve ser maior que 0"),
  description: z.string().optional(),
  is_service: z.boolean().default(false),
  stock: z.coerce.number().min(0, "Estoque deve ser maior ou igual a 0"),
  brand_id: z.string().optional(),
  category_id: z.string().optional(),
  image_url: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ProductServiceFormProps {
  initialData?: FormValues & { id: string };
  onSuccess: () => void;
}

interface Brand {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
}

export function ProductServiceForm({ initialData, onSuccess }: ProductServiceFormProps) {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      price: initialData?.price ?? 0,
      description: initialData?.description ?? "",
      is_service: initialData?.is_service ?? false,
      stock: initialData?.stock ?? 0,
      brand_id: initialData?.brand_id,
      category_id: initialData?.category_id,
      image_url: initialData?.image_url ?? "",
    },
  });

  useEffect(() => {
    fetchBrandsAndCategories();
  }, []);

  const fetchBrandsAndCategories = async () => {
    const [brandsResponse, categoriesResponse] = await Promise.all([
      supabase.from("brands").select("*").order("name"),
      supabase.from("categories").select("*").order("name"),
    ]);

    if (brandsResponse.error) {
      toast.error("Erro ao carregar marcas");
    } else {
      setBrands(brandsResponse.data || []);
    }

    if (categoriesResponse.error) {
      toast.error("Erro ao carregar categorias");
    } else {
      setCategories(categoriesResponse.data || []);
    }
  };

  const onSubmit = async (values: FormValues) => {
    try {
      const { error } = initialData
        ? await supabase
            .from("products")
            .update(values)
            .eq("id", initialData.id)
        : await supabase
            .from("products")
            .insert(values);

      if (error) {
        throw error;
      }

      toast.success(
        initialData ? "Item atualizado com sucesso" : "Item criado com sucesso"
      );
      onSuccess();
    } catch (error) {
      console.error("Error saving item:", error);
      toast.error("Erro ao salvar item");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Nome do item" {...field} />
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
              <FormLabel>Preço (€)</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" {...field} />
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
                <Textarea placeholder="Descrição do item" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="is_service"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between">
              <FormLabel>É um serviço?</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {!form.watch("is_service") && (
          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estoque</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="brand_id"
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
          name="category_id"
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

        <FormField
          control={form.control}
          name="image_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL da Imagem</FormLabel>
              <FormControl>
                <Input placeholder="URL da imagem" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="submit">
            {initialData ? "Atualizar" : "Criar"}
          </Button>
        </div>
      </form>
    </Form>
  );
}