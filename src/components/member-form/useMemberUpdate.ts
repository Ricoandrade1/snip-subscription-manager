import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Member } from "@/contexts/types";
import { FormValues } from "./schema";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useMemberUpdate = (
  member: Member,
  form: UseFormReturn<FormValues>,
  onSubmit: (data: Partial<Member>) => Promise<void>
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      
      // Prepare update data
      const updateData: Partial<Member> = {
        name: data.name,
        nickname: data.nickname,
        phone: data.phone,
        nif: data.nif,
        status: data.status,
        payment_date: data.payment_date ? new Date(data.payment_date).toISOString() : null,
      };

      // Se o status mudou para "pago", atualize a data de pagamento para hoje se não houver uma data definida
      if (data.status === 'pago' && !data.payment_date) {
        const today = new Date();
        updateData.payment_date = today.toISOString();
        form.setValue('payment_date', today);
      }

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

      await onSubmit(updateData);
      
      toast.success("Membro atualizado com sucesso!");
    } catch (error) {
      console.error('Error updating member:', error);
      toast.error("Erro ao atualizar membro");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleSubmit,
    isSubmitting
  };
};