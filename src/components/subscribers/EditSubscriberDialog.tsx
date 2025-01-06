import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { QuickEditForm } from "@/components/QuickEditForm";
import { Subscriber } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Member } from "@/contexts/types";
import { addDays } from "date-fns";

interface EditSubscriberDialogProps {
  subscriber: Subscriber | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function EditSubscriberDialog({ 
  subscriber, 
  open, 
  onOpenChange,
  onSuccess 
}: EditSubscriberDialogProps) {
  if (!subscriber) return null;

  const memberData: Member = {
    ...subscriber,
    plan: subscriber.plan,
    status: subscriber.status,
    due_date: undefined,
  };

  const handleSubmit = async (data: Partial<Member>) => {
    try {
      let updateData = { ...data };
      
      if (data.plan) {
        const { data: planData, error: planError } = await supabase
          .from('plans')
          .select('id')
          .eq('title', data.plan)
          .single();

        if (planError) throw planError;

        updateData.plan_id = planData.id;
        delete updateData.plan;
      }

      // Garante que a data de pagamento seja atualizada corretamente
      if (data.payment_date) {
        updateData.payment_date = new Date(data.payment_date).toISOString();
      }

      console.log('Dados de atualização:', updateData);

      const { error } = await supabase
        .from('members')
        .update(updateData)
        .eq('id', subscriber.id);

      if (error) {
        console.error('Error updating subscriber:', error);
        throw error;
      }

      toast.success('Assinante atualizado com sucesso!');
      onOpenChange(false);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error updating subscriber:', error);
      toast.error('Erro ao atualizar assinante');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl bg-barber-gray border-barber-gold/20">
        <DialogTitle className="text-xl font-bold text-barber-gold">
          Editar Assinante
        </DialogTitle>
        <QuickEditForm member={memberData} onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  );
}