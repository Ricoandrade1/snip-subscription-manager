import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { RoleManager } from "@/components/barber-list/RoleManager";
import { UserForm } from "./UserForm";
import { cn } from "@/lib/utils";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

interface UserCardActionsProps {
  user: {
    id: string;
    email: string;
    roles: string[];
  };
  onRoleUpdateSuccess: () => void;
  selectedUserId: string | null;
  onSelectUser: (userId: string | null) => void;
  getCardStyle: () => string;
}

export function UserCardActions({
  user,
  onRoleUpdateSuccess,
  selectedUserId,
  onSelectUser,
  getCardStyle,
}: UserCardActionsProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
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

  const handlePasswordReset = async () => {
    try {
      const newPassword = Math.random().toString(36).slice(-8);
      
      const { error } = await supabase.auth.admin.updateUserById(
        user.id,
        { password: newPassword }
      );

      if (error) throw error;

      toast({
        title: "Senha alterada com sucesso",
        description: `Nova senha temporária: ${newPassword}`,
      });
      
      setIsPasswordDialogOpen(false);
    } catch (error) {
      console.error('Error resetting password:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível redefinir a senha do usuário.",
      });
    }
  };

  return (
    <div className="flex justify-end pt-2">
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
            Gerir Funções - {user.email || "Usuário sem email"}
          </DialogTitle>
          <RoleManager
            barber={{
              id: user.id,
              name: user.email || 'Usuário sem email',
              roles: user.roles || []
            }}
            onSuccess={onRoleUpdateSuccess}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
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

      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent className={cn("border-barber-gold/20", getCardStyle())}>
          <DialogTitle className="text-xl font-semibold text-barber-light">
            Alterar Senha - {user.email || "Usuário sem email"}
          </DialogTitle>
          <div className="space-y-4 p-4">
            <p className="text-barber-light">
              Tem certeza que deseja gerar uma nova senha para este usuário?
            </p>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsPasswordDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                onClick={handlePasswordReset}
                className="bg-barber-gold hover:bg-barber-gold/90 text-barber-black"
              >
                Confirmar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ContextMenu>
        <ContextMenuTrigger>
          <Button
            variant="ghost"
            size="icon"
            className="ml-2 text-barber-light/60 hover:text-barber-light"
          >
            <span className="sr-only">Abrir menu</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
              <path d="m15 5 4 4" />
            </svg>
          </Button>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={() => setIsEditDialogOpen(true)}>
            Editar Informações
          </ContextMenuItem>
          <ContextMenuItem onClick={() => setIsPasswordDialogOpen(true)}>
            Alterar Senha
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
}