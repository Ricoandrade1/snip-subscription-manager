import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  price: z.string(),
  stock: z.string().optional(),
  brand: z.string().optional(),
  category: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ProductServiceFormProps {
  initialData?: FormValues & { id: string };
  onSuccess: () => void;
}

export function ProductServiceForm({ initialData, onSuccess }: ProductServiceFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      description: initialData?.description ?? "",
      price: initialData?.price?.toString() ?? "",
      stock: initialData?.stock?.toString() ?? "",
      brand: initialData?.brand ?? "",
      category: initialData?.category ?? "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const productData = {
        name: values.name,
        description: values.description,
        price: values.price ? parseFloat(values.price) : 0,
        stock: values.stock ? parseInt(values.stock) : 0,
        brand: values.brand || null,
        category: values.category || null,
      };

      const { error } = initialData
        ? await supabase
            .from("products")
            .update(productData)
            .eq("id", initialData.id)
        : await supabase
            .from("products")
            .insert(productData);

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
                <Input placeholder="Digite o preço" {...field} />
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
                <Input placeholder="Digite a quantidade" {...field} />
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
              <FormControl>
                <Input placeholder="Digite a marca" {...field} />
              </FormControl>
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
              <FormControl>
                <Input placeholder="Digite a categoria" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit">
            {initialData ? "Atualizar" : "Criar"}
          </Button>
        </div>
      </form>
    </Form>
  );
}