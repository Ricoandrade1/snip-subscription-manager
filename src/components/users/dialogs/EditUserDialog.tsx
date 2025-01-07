import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { UserForm } from "../UserForm";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

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

interface UserData {
  name: string;
  phone: string;
  nif: string;
}

export function EditUserDialog({
  user,
  isOpen,
  onOpenChange,
  onSuccess,
  getCardStyle,
}: EditUserDialogProps) {
  const { toast } = useToast();
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchUserData();
    }
  }, [isOpen, user.id]);

  const fetchUserData = async () => {
    try {
      const { data, error } = await supabase
        .from('barbers')
        .select('name, phone, nif')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setUserData(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar os dados do usuário.",
      });
    }
  };

  const handleUpdateUser = async (data: UserData) => {
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
      
      await onSuccess(); // Aguarda a atualização dos dados
      onOpenChange(false); // Fecha o diálogo após a atualização
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
          Editar Usuário - {user.email}
        </DialogTitle>
        {userData && (
          <UserForm 
            onSubmit={handleUpdateUser}
            initialData={{
              email: user.email,
              name: userData.name,
              phone: userData.phone,
              nif: userData.nif,
              role: "user"
            }}
            isEditing={true}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}