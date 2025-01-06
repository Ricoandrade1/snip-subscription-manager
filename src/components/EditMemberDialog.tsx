import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Member, useMemberContext } from "@/contexts/MemberContext";
import { QuickEditForm } from "./QuickEditForm";
import { toast } from "sonner";

interface EditMemberDialogProps {
  member: Member | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditMemberDialog({ member, open, onOpenChange }: EditMemberDialogProps) {
  const { updateMember } = useMemberContext();

  if (!member) return null;

  const handleSubmit = async (data: Partial<Member>) => {
    try {
      console.log('Enviando atualização:', data);
      // Remove created_at from the update data to preserve the original registration date
      const { created_at, ...updateData } = data;
      await updateMember(member.id, updateData);
      onOpenChange(false);
      toast.success("Membro atualizado com sucesso!");
    } catch (error) {
      console.error('Error updating member:', error);
      toast.error("Erro ao atualizar membro");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl bg-barber-gray border-barber-gold/20">
        <DialogHeader>
          <DialogTitle className="text-barber-light">Editar Membro</DialogTitle>
        </DialogHeader>
        <QuickEditForm member={member} onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  );
}