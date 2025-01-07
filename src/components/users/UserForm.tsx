import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";

const userFormSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres").optional(),
  name: z.string().min(1, "Nome é obrigatório"),
  phone: z.string().min(1, "Telefone é obrigatório"),
  nif: z.string().optional(),
  role: z.string().default("user"),
});

type UserFormValues = z.infer<typeof userFormSchema>;

interface UserFormProps {
  onSubmit: (data: UserFormValues) => Promise<void>;
  initialData?: Partial<UserFormValues>;
  isEditing?: boolean;
}

export function UserForm({ onSubmit, initialData, isEditing = false }: UserFormProps) {
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      email: initialData?.email || "",
      password: "",
      name: initialData?.name || "",
      phone: initialData?.phone || "",
      nif: initialData?.nif || "",
      role: initialData?.role || "user",
    },
  });

  return (
    <ScrollArea className="max-h-[80vh]">
      <div className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-barber-light">Email</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="email"
                      className="bg-barber-black border-barber-gold/20 focus:border-barber-gold text-barber-light"
                      disabled={isEditing}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-barber-light">Nome</FormLabel>
                  <FormControl>
                    <Input 
                      {...field}
                      className="bg-barber-black border-barber-gold/20 focus:border-barber-gold text-barber-light"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-barber-light">Telefone</FormLabel>
                  <FormControl>
                    <Input 
                      {...field}
                      className="bg-barber-black border-barber-gold/20 focus:border-barber-gold text-barber-light"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nif"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-barber-light">NIF</FormLabel>
                  <FormControl>
                    <Input 
                      {...field}
                      className="bg-barber-black border-barber-gold/20 focus:border-barber-gold text-barber-light"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full bg-barber-gold hover:bg-barber-gold/90 text-barber-black"
            >
              {isEditing ? "Atualizar Utilizador" : "Criar Utilizador"}
            </Button>
          </form>
        </Form>
      </div>
    </ScrollArea>
  );
}