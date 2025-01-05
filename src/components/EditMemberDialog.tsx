import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Member, useMemberContext } from "@/contexts/MemberContext";
import { QuickEditForm } from "./QuickEditForm";

interface EditMemberDialogProps {
  member: Member | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditMemberDialog({ member, open, onOpenChange }: EditMemberDialogProps) {
  const { updateMember } = useMemberContext();

  if (!member) return null;

  const handleSubmit = async (data: Partial<Member>) => {
    // Remove created_at from the update data to preserve the original registration date
    const { created_at, ...updateData } = data;
    await updateMember(member.id, updateData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Membro</DialogTitle>
        </DialogHeader>
        <QuickEditForm member={member} onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  );
}