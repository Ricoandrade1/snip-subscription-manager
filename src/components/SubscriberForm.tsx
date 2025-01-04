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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { useMemberContext } from "@/contexts/MemberContext";

const formSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  nickname: z.string().optional(),
  nif: z.string().optional(),
  birthDate: z.string(),
  passport: z.string().optional(),
  citizenCard: z.string().optional(),
  bi: z.string().optional(),
  bank: z.string().min(2, "Nome do banco é obrigatório"),
  iban: z.string().min(15, "IBAN inválido"),
  debitDate: z.string(),
  plan: z.enum(["Basic", "Classic", "Business"]),
});

type SubscriberFormData = z.infer<typeof formSchema>;

export function SubscriberForm() {
  const { toast } = useToast();
  const { members, addMember } = useMemberContext();
  
  const form = useForm<SubscriberFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      plan: "Basic",
    },
  });

  const handleSubmit = (data: SubscriberFormData) => {
    addMember(data);
    const currentSubscribers = members.filter(member => member.plan === data.plan).length;
    
    toast({
      title: "Assinante cadastrado com sucesso!",
      description: `Número único: ${data.plan} ${String(currentSubscribers + 1).padStart(2, '0')}`,
    });
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Nome completo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nickname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apelido</FormLabel>
                <FormControl>
                  <Input placeholder="Apelido" {...field} />
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
                <FormLabel>NIF</FormLabel>
                <FormControl>
                  <Input placeholder="Número de Identificação Fiscal" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="birthDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de Nascimento</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="passport"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Passaporte</FormLabel>
                <FormControl>
                  <Input placeholder="Número do Passaporte" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="citizenCard"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cartão Cidadão</FormLabel>
                <FormControl>
                  <Input placeholder="Número do Cartão Cidadão" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bi"
            render={({ field }) => (
              <FormItem>
                <FormLabel>BI</FormLabel>
                <FormControl>
                  <Input placeholder="Número do BI" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bank"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Banco</FormLabel>
                <FormControl>
                  <Input placeholder="Nome do Banco" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="iban"
            render={({ field }) => (
              <FormItem>
                <FormLabel>IBAN</FormLabel>
                <FormControl>
                  <Input placeholder="PT50..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="debitDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de Débito</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="plan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Plano</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Basic" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Basic - Somente Barba (30€)
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Classic" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Classic - Somente Cabelo (40€)
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="Business" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Business - Cabelo e Barba (50€)
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Cadastrar Assinante
        </Button>
      </form>
    </Form>
  );
}