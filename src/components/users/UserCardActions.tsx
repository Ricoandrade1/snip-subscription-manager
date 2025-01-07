import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Database } from "@/integrations/supabase/types";
import { supabase } from "@/lib/supabase/client";
import { Key } from "lucide-react";
import { useState } from "react";
import { UserForm } from "./UserForm";

type UserAuthority = Database["public"]["Enums"]["user_authority"];

interface User {
  id: string;
  email: string;
  roles: UserAuthority[];
}

interface UserCardActionsProps {
  user: User;
  onRoleUpdateSuccess: () => void;
  selectedUserId: string | null;
  onSelectUser: (userId: string | null) => void;
  getCardStyle: () => string;
  handleEditClick: () => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
}

export function UserCardActions({
  user,
  onRoleUpdateSuccess,
  selectedUserId,
  onSelectUser,
  getCardStyle,
  handleEditClick,
  isEditDialogOpen,
  setIsEditDialogOpen,
}: UserCardActionsProps) {
  const { toast } = useToast();
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleUpdateUser = async (data: any) => {
    try {
      const { error } = await supabase
        .from('barbers')
        .update({
          email: data.email,
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
      
      setIsEditDialogOpen(false);
      onRoleUpdateSuccess();
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível atualizar as informações do usuário.",
      });
    }
  };

  const handleChangePassword = async () => {
    try {
      setIsChangingPassword(true);
      
      const { error } = await supabase.auth.admin.updateUserById(
        user.id,
        { password: generateTemporaryPassword() }
      );

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Nova senha gerada com sucesso! Um email foi enviado ao usuário.",
      });
    } catch (error) {
      console.error('Error changing password:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível gerar nova senha.",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const generateTemporaryPassword = () => {
    const length = 12;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
  };

  return (
    <div className="flex justify-end gap-2 pt-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleChangePassword}
        disabled={isChangingPassword}
        className="bg-barber-gray border-yellow-600 text-yellow-600 hover:bg-yellow-600/10"
      >
        <Key className="mr-2 h-4 w-4" />
        {isChangingPassword ? "Gerando..." : "Nova Senha"}
      </Button>

      <Dialog 
        open={selectedUserId === user.id} 
        onOpenChange={(open) => !open && onSelectUser(null)}
      >
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onSelectUser(user.id)}
            className="bg-barber-gray border-barber-gold text-barber-gold hover:bg-barber-gold/10"
          >
            Gerir Funções
          </Button>
        </DialogTrigger>
        <DialogContent className={cn("border-barber-gold/20", getCardStyle())}>
          <DialogTitle className="text-xl font-semibold text-barber-light">
            Gerir Funções - {user.email}
          </DialogTitle>
          <RoleManager
            barber={{
              id: user.id,
              name: user.email,
              roles: user.roles || []
            }}
            onSuccess={onRoleUpdateSuccess}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className={cn("border-barber-gold/20", getCardStyle())}>
          <DialogTitle className="text-xl font-semibold text-barber-light">
            Editar Usuário - {user.email}
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
    </div>
  );
}