import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { PersonalInfoFields } from "./PersonalInfoFields";
import { PlanFields } from "./PlanFields";
import { PaymentDateField } from "./PaymentDateField";
import { BankingFields } from "./BankingFields";
import { supabase } from "@/lib/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
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
  const navigate = useNavigate();
  const form = useForm<SubscriberFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      plan: "Basic",
    },
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Você precisa estar logado para cadastrar assinantes");
        navigate("/login");
      }
    };

    checkAuth();
  }, [navigate]);

  const onSubmit = async (data: SubscriberFormData) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("Você precisa estar logado para cadastrar assinantes");
        navigate("/login");
        return;
      }

      // Primeiro, buscar o ID do plano baseado no título
      const { data: planData, error: planError } = await supabase
        .from('plans')
        .select('id')
        .eq('title', data.plan)
        .single();

      if (planError) {
        throw planError;
      }

      const { error } = await supabase
        .from('members')
        .insert([
          {
            name: data.name,
            nickname: data.nickname,
            phone: data.phone,
            nif: data.nif,
            plan_id: planData.id,
            payment_date: data.payment_date,
            bank_name: data.bankName,
            iban: data.iban
          }
        ]);

      if (error) throw error;

      toast.success("Assinante cadastrado com sucesso!");
      form.reset();
    } catch (error) {
      console.error('Erro ao cadastrar assinante:', error);
      toast.error("Erro ao cadastrar assinante");
    }
  };

  return (
    <div className="p-4 bg-barber-black text-barber-light">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold text-barber-gold">
          Cadastrar Novo Assinante
        </DialogTitle>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
          <PersonalInfoFields form={form} />
          <BankingFields form={form} />
          <PlanFields form={form} />
          <PaymentDateField form={form} />
          
          <Button 
            type="submit" 
            className="w-full bg-barber-gold hover:bg-barber-gold/90 text-barber-black"
          >
            Cadastrar Assinante
          </Button>
        </form>
      </Form>
    </div>
  );
}
