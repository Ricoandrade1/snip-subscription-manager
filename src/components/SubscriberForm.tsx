import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { useMemberContext } from "@/contexts/MemberContext";
import { PersonalInfoFields } from "./PersonalInfoFields";
import { DocumentFields } from "./DocumentFields";
import { BankingFields } from "./BankingFields";
import type { Member } from "@/contexts/MemberContext";

const formSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  nickname: z.string().optional(),
  phone: z.string().min(9, "Telefone deve ter pelo menos 9 dígitos"),
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

export type SubscriberFormData = z.infer<typeof formSchema>;

export function SubscriberForm() {
  const { toast } = useToast();
  const { members, addMember } = useMemberContext();
  
  const form = useForm<SubscriberFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      plan: "Basic",
      name: "",
      nickname: "",
      phone: "",
      birthDate: "",
      bank: "",
      iban: "",
      debitDate: "",
      nif: "",
      passport: "",
      citizenCard: "",
      bi: "",
    },
  });

  const handleSubmit = (data: SubscriberFormData) => {
    const memberData: Omit<Member, "id"> = {
      ...data,
      nickname: data.nickname || "",
      nif: data.nif || "",
      passport: data.passport || "",
      citizenCard: data.citizenCard || "",
      bi: data.bi || "",
    };
    
    addMember(memberData);
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
          <PersonalInfoFields form={form} />
          <DocumentFields form={form} />
          <BankingFields form={form} />
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