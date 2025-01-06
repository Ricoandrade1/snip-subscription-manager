import { Dialog, DialogContent } from "@/components/ui/dialog";
import { QuickEditForm } from "@/components/QuickEditForm";
import { Subscriber } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface EditSubscriberDialogProps {
  subscriber: Subscriber | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditSubscriberDialog({ subscriber, open, onOpenChange }: EditSubscriberDialogProps) {
  if (!subscriber) return null;

  const handleSubmit = async (data: Partial<Subscriber>) => {
    try {
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
        <QuickEditForm member={subscriber} onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  );
}