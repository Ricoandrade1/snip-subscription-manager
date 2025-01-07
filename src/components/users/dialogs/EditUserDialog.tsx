import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { UserForm } from "../UserForm";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface EditUserDialogProps {
  user: {
    id: string;
    email: string;
  };
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  getCardStyle: () => string;
}

export function EditUserDialog({
  user,
  isOpen,
  onOpenChange,
  onSuccess,
  getCardStyle,
}: EditUserDialogProps) {
  const { toast } = useToast();

  const handleUpdateUser = async (data: any) => {
    try {
      const { error } = await supabase
        .from('barbers')
        .update({
          name: data.name,
          phone: data.phone,
          nif: data.nif,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Informações do usuário atualizadas com sucesso!",
      });
      
      onSuccess(); // Call onSuccess first to trigger data refresh
      onOpenChange(false); // Then close the dialog
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível atualizar as informações do usuário.",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className={cn("border-barber-gold/20", getCardStyle())}>
        <DialogTitle className="text-xl font-semibold text-barber-light">
          Editar Usuário - {user.email || "Usuário sem email"}
        </DialogTitle>
        <UserForm 
          onSubmit={handleUpdateUser}
          initialData={{
            email: user.email,
            name: "",
            phone: "",
            nif: "",
            role: "user"
          }}
          isEditing={true}
        />
      </DialogContent>
    </Dialog>
  );
}