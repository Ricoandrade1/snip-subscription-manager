import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { QuickEditForm } from "@/components/QuickEditForm";
import { Subscriber } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Member } from "@/contexts/types";

interface EditSubscriberDialogProps {
  subscriber: Subscriber | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditSubscriberDialog({ subscriber, open, onOpenChange }: EditSubscriberDialogProps) {
  if (!subscriber) return null;

  // Convert Subscriber to Member type for QuickEditForm
  const memberData: Member = {
    ...subscriber,
    plan: subscriber.plan,
    status: subscriber.status === "overdue" ? "inactive" : "active",
    due_date: undefined,
  };

  const handleSubmit = async (data: Partial<Member>) => {
    try {
      // Get plan_id if plan is being updated
      if (data.plan) {
        const { data: planData, error: planError } = await supabase
          .from('plans')
          .select('id')
          .eq('title', data.plan)
          .single();

        if (planError) throw planError;

        // Update the data with plan_id
        data.plan_id = planData.id;
        // Remove plan from data as it's not a column in the members table
        delete data.plan;
      }

      const { error } = await supabase
        .from('members')
        .update(data)
        .eq('id', subscriber.id);

      if (error) throw error;

      toast.success('Assinante atualizado com sucesso!');
      onOpenChange(false);
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