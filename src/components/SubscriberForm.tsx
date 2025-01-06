import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useMemberContext } from "@/contexts/MemberContext";
import { PersonalInfoFields } from "./PersonalInfoFields";
import { PlanFields } from "./PlanFields";
import { PaymentDateField } from "./PaymentDateField";
import { BankingFields } from "./BankingFields";
import { supabase } from "@/lib/supabase/client";
import { MemberStatus } from "@/contexts/types";
import { DialogHeader, DialogTitle } from "./ui/dialog";

const formSchema = z.object({
  name: z.string(),
  nickname: z.string(),
  phone: z.string(),
  nif: z.string(),
  bankName: z.string(),
  iban: z.string(),
  plan: z.enum(["Basic", "Classic", "Business"]).default("Basic"),
  payment_date: z.date().optional(),
});

export type SubscriberFormData = z.infer<typeof formSchema>;

export function SubscriberForm() {
  const { toast } = useToast();
  const { addMember } = useMemberContext();
  
  const form = useForm<SubscriberFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      plan: "Basic",
      name: "",
      nickname: "",
      phone: "",
      nif: "",
      bankName: "",
      iban: "",
    },
  });

  const handleSubmit = async (data: SubscriberFormData) => {
    try {
      const { data: plansData, error: planError } = await supabase
        .from('plans')
        .select('id, title')
        .eq('title', data.plan)
        .single();

      if (planError) {
        console.error('Erro ao buscar plano:', planError);
        toast({
          title: "Erro ao cadastrar assinante",
          description: "Erro ao buscar plano. Por favor, tente novamente.",
          variant: "destructive",
        });
        return;
      }

      if (!plansData) {
        console.error('Plano não encontrado:', data.plan);
        toast({
          title: "Erro ao cadastrar assinante",
          description: `Plano "${data.plan}" não encontrado.`,
          variant: "destructive",
        });
        return;
      }

      const memberData = {
        name: data.name,
        nickname: data.nickname || "",
        phone: data.phone || "",
        nif: data.nif || "",
        bank: data.bankName,
        iban: data.iban,
        plan_id: plansData.id,
        payment_date: data.payment_date ? data.payment_date.toISOString() : null,
        status: (data.payment_date ? "pago" : "pendente") as MemberStatus
      };

      await addMember(memberData);
      
      toast({
        title: "Assinante cadastrado com sucesso!",
        description: `${data.name} foi cadastrado no plano ${data.plan}.`,
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
    <>
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold text-barber-gold">
          Cadastrar Novo Assinante
        </DialogTitle>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PersonalInfoFields form={form} />
          </div>

          <div className="space-y-4">
            <PlanFields form={form} />
            <PaymentDateField form={form} />
            <BankingFields form={form} />
          </div>

          <div className="flex justify-end pt-4">
            <Button 
              type="submit" 
              className="bg-barber-gold hover:bg-barber-gold/90 text-barber-black w-full md:w-auto"
            >
              Cadastrar Assinante
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}