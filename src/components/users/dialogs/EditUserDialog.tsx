import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { UserForm } from "../UserForm";

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
  const [isLoading, setIsLoading] = useState(false);

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
      onOpenChange(false);
    }
  };

  const handleUpdateUser = async (data: UserData) => {
    if (isLoading) return;
    setIsLoading(true);

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
      
      // Call onSuccess to trigger parent component refresh
      onSuccess();
      
      // Close dialog
      onOpenChange(false);
      
      // Force page refresh after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 500);
      
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível atualizar as informações do usuário.",
      });
    } finally {
      setIsLoading(false);
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
            isLoading={isLoading}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}