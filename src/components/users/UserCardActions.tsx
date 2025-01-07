import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RoleManager } from "@/components/barber-list/RoleManager";
import { Database } from "@/integrations/supabase/types";
import { cn } from "@/lib/utils";
import { UserForm } from "./UserForm";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase/client";
import { KeyRound } from "lucide-react";

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
  const [isResettingPassword, setIsResettingPassword] = useState(false);

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

  const handleResetPassword = async () => {
    try {
      setIsResettingPassword(true);
      
      const { data, error } = await supabase.functions.invoke('reset-password', {
        body: {
          userId: user.id,
          userEmail: user.email,
        },
      });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Senha redefinida com sucesso! Um email foi enviado ao usuário.",
      });
    } catch (error) {
      console.error('Error resetting password:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível redefinir a senha.",
      });
    } finally {
      setIsResettingPassword(false);
    }
  };

  return (
    <div className="flex justify-end gap-2 pt-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleResetPassword}
        disabled={isResettingPassword}
        className="bg-barber-gray border-yellow-600 text-yellow-600 hover:bg-yellow-600/10"
      >
        <KeyRound className="mr-2 h-4 w-4" />
        {isResettingPassword ? "Redefinindo..." : "Redefinir Senha"}
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