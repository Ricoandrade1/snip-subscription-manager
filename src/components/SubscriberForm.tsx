import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useMemberContext } from "@/contexts/MemberContext";
import { PersonalInfoFields } from "./PersonalInfoFields";
import { DocumentFields } from "./DocumentFields";
import { BankingFields } from "./BankingFields";
import { PlanFields } from "./PlanFields";
import type { Member } from "@/contexts/MemberContext";

const formSchema = z.object({
  name: z.string().optional(),
  nickname: z.string().optional(),
  phone: z.string().optional(),
  nif: z.string().optional(),
  birthDate: z.string().optional(),
  passport: z.string().optional(),
  citizenCard: z.string().optional(),
  bi: z.string().optional(),
  bank: z.string().optional(),
  iban: z.string().optional(),
  debitDate: z.string().optional(),
  plan: z.enum(["Basic", "Classic", "Business"]).default("Basic"),
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

  const handleSubmit = async (data: SubscriberFormData) => {
    try {
      const memberData: Omit<Member, "id"> = {
        name: data.name || "",
        nickname: data.nickname || "",
        phone: data.phone || "",
        nif: data.nif || "",
        birthDate: data.birthDate || "",
        passport: data.passport || "",
        citizenCard: data.citizenCard || "",
        bi: data.bi || "",
        bank: data.bank || "",
        iban: data.iban || "",
        debitDate: data.debitDate || "",
        plan: data.plan
      };

      await addMember(memberData);
      const currentSubscribers = members.filter(member => member.plan === data.plan).length;
      
      toast({
        title: "Assinante cadastrado com sucesso!",
        description: `Número único: ${data.plan} ${String(currentSubscribers + 1).padStart(2, '0')}`,
      });
      
      form.reset();
    } catch (error) {
      console.error('Erro ao adicionar membro:', error);
      toast({
        title: "Erro ao cadastrar assinante",
        description: "Ocorreu um erro ao cadastrar o assinante. Por favor, tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="max-w-3xl mx-auto p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-4">
            <PersonalInfoFields form={form} />
          </div>
          <div className="space-y-4">
            <DocumentFields form={form} />
          </div>
          <div className="space-y-4">
            <BankingFields form={form} />
          </div>
        </div>

        <div className="max-w-md mx-auto">
          <PlanFields form={form} />
        </div>

        <div className="flex justify-center">
          <Button type="submit" className="w-48">
            Cadastrar Assinante
          </Button>
        </div>
      </form>
    </Form>
  );
}