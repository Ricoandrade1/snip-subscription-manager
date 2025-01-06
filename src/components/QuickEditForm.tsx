import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Member } from "@/contexts/types";
import { Form } from "@/components/ui/form";
import { PersonalInfoFields } from "./member-form/PersonalInfoFields";
import { PlanFields } from "./member-form/PlanFields";
import { PaymentDateField } from "./PaymentDateField";
import { formSchema, FormValues } from "./member-form/schema";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { StatusField } from "./member-form/StatusField";

interface QuickEditFormProps {
  member: Member;
  onSubmit: (data: Partial<Member>) => Promise<void>;
}

export function QuickEditForm({ member, onSubmit }: QuickEditFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: member.name || "",
      nickname: member.nickname || "",
      phone: member.phone || "",
      nif: member.nif || "",
      plan: member.plan || "Basic",
      payment_date: member.payment_date ? new Date(member.payment_date) : undefined,
      status: member.status || "cancelado",
    },
  });

  const handleSubmit = async (data: FormValues) => {
    try {
      console.log('Dados do formulário:', data);
      
      // Prepare update data
      const updateData: Partial<Member> = {
        name: data.name,
        nickname: data.nickname,
        phone: data.phone,
        nif: data.nif,
        payment_date: data.payment_date?.toISOString() || null,
        status: data.status,
      };

      // Check if plan has changed
      if (data.plan !== member.plan) {
        // Get plan details
        const { data: planData, error: planError } = await supabase
          .from('plans')
          .select('id, price')
          .eq('title', data.plan)
          .single();

        if (planError) throw planError;

        // Create a sales record for the plan change
        const { error: salesError } = await supabase
          .from('sales')
          .insert([{
            total: planData.price,
            payment_method: 'card',
            is_plan_change: true,
            sellers: JSON.stringify([]),
            status: 'completed'
          }]);

        if (salesError) throw salesError;

        // Update member with new plan_id and last_plan_change timestamp
        updateData.plan_id = planData.id;
        updateData.last_plan_change = new Date().toISOString();
      }

      console.log('Dados de atualização:', updateData);
      await onSubmit(updateData);
      toast.success("Membro atualizado com sucesso!");
    } catch (error) {
      console.error('Error updating member:', error);
      toast.error("Erro ao atualizar membro");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <PersonalInfoFields form={form} />
        <PlanFields form={form} />
        <PaymentDateField form={form} />
        <StatusField form={form} />
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-barber-gold hover:bg-barber-gold/90 text-white px-4 py-2 rounded-md"
          >
            Salvar Alterações
          </button>
        </div>
      </form>
    </Form>
  );
}