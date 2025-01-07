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
import { ScrollArea } from "@/components/ui/scroll-area";

// Define the form schema with password as optional
const formSchema = z.object({
  email: z.string().email("Email inválido"),
  name: z.string().min(1, "Nome é obrigatório"),
  phone: z.string().min(1, "Telefone é obrigatório"),
  nif: z.string().min(1, "NIF é obrigatório"),
  role: z.string(),
  password: z.string().optional(),
});

// Define the form data type based on the schema
type FormData = z.infer<typeof formSchema>;

interface UserFormProps {
  onSubmit: (data: FormData) => void;
  initialData?: Partial<FormData>;
  isEditing?: boolean;
  isLoading?: boolean;
}

export function UserForm({ 
  onSubmit, 
  initialData, 
  isEditing = false, 
  isLoading = false 
}: UserFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: initialData?.email || "",
      name: initialData?.name || "",
      phone: initialData?.phone || "",
      nif: initialData?.nif || "",
      role: initialData?.role || "user",
      password: "",
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
                      disabled={isEditing}
                      className="bg-barber-black border-barber-gold/20 focus:border-barber-gold text-barber-light"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!isEditing && (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-barber-light">Senha</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="password"
                        className="bg-barber-black border-barber-gold/20 focus:border-barber-gold text-barber-light"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

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
              disabled={isLoading}
              className="w-full bg-barber-gold hover:bg-barber-gold/90 text-barber-black"
            >
              {isLoading ? "Salvando..." : (isEditing ? "Salvar Alterações" : "Criar Usuário")}
            </Button>
          </form>
        </Form>
      </div>
    </ScrollArea>
  );
}