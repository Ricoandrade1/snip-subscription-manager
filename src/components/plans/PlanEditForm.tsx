import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  title: z.string().min(2, "Título deve ter pelo menos 2 caracteres"),
  price: z.coerce.number().min(0, "Preço deve ser maior que 0"),
  features: z.string().min(2, "Características são obrigatórias"),
});

interface PlanEditFormProps {
  initialData: {
    id?: number;
    title: string;
    price: number;
    features: string[];
  };
  onClose: () => void;
}

export function PlanEditForm({ initialData, onClose }: PlanEditFormProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData.title,
      price: initialData.price,
      features: initialData.features.join("\n"),
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const features = data.features.split("\n").filter(feature => feature.trim() !== "");
      
      const { error } = await supabase
        .from('plans')
        .update({
          title: data.title,
          price: data.price,
          features: features,
        })
        .eq('id', initialData.id);

      if (error) throw error;

      toast({
        title: "Plano atualizado com sucesso!",
        description: "As alterações foram salvas.",
      });
      
      onClose();
    } catch (error) {
      console.error('Erro ao atualizar plano:', error);
      toast({
        title: "Erro ao atualizar plano",
        description: "Ocorreu um erro ao salvar as alterações.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título do Plano</FormLabel>
              <FormControl>
                <Input placeholder="Nome do plano" {...field} />
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
                <Input type="number" placeholder="30" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="features"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Características (uma por linha)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Digite as características do plano"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </div>
      </form>
    </Form>
  );
}