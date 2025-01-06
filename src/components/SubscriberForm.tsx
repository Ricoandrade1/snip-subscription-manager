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
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  nickname: z.string().optional(),
  phone: z.string().optional(),
  nif: z.string().optional(),
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
    },
  });

  const handleSubmit = async (data: SubscriberFormData) => {
    try {
      console.log('Dados do formulário:', data);
      
      const { data: plansData, error: planError } = await supabase
        .from('plans')
        .select('id, title')
        .eq('title', data.plan);

      if (planError) {
        console.error('Erro ao buscar plano:', planError);
        toast({
          title: "Erro ao cadastrar assinante",
          description: "Erro ao buscar plano. Por favor, tente novamente.",
          variant: "destructive",
        });
        return;
      }

      if (!plansData || plansData.length === 0) {
        console.error('Plano não encontrado:', data.plan);
        toast({
          title: "Erro ao cadastrar assinante",
          description: `Plano "${data.plan}" não encontrado.`,
          variant: "destructive",
        });
        return;
      }

      const planId = plansData[0].id;
      console.log('Plano encontrado:', plansData[0]);

      const memberData = {
        name: data.name,
        nickname: data.nickname || "",
        phone: data.phone || "",
        nif: data.nif || "",
        plan_id: planId,
        payment_date: data.payment_date ? data.payment_date.toISOString() : null,
        status: data.payment_date ? "pago" as const : "atrasado" as const
      };

      await addMember(memberData);
      
      toast({
        title: "Assinante cadastrado com sucesso!",
        description: `Membro ${data.name} cadastrado no plano ${data.plan}.`,
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
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PersonalInfoFields form={form} />
        </div>

        <div className="max-w-md mx-auto">
          <PlanFields form={form} />
        </div>

        <div className="max-w-md mx-auto">
          <PaymentDateField form={form} />
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