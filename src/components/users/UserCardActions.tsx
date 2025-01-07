import { useState } from "react";
import { Database } from "@/integrations/supabase/types";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Button } from "@/components/ui/button";
import { RoleManagementDialog } from "./dialogs/RoleManagementDialog";
import { EditUserDialog } from "./dialogs/EditUserDialog";
import { PasswordResetDialog } from "./dialogs/PasswordResetDialog";
import { Pencil } from "lucide-react";

type UserAuthority = Database["public"]["Enums"]["user_authority"];

interface UserCardActionsProps {
  user: {
    id: string;
    email: string;
    roles: UserAuthority[];
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

  return (
    <div className="flex justify-end pt-2 space-x-2">
      <RoleManagementDialog
        user={user}
        selectedUserId={selectedUserId}
        onSelectUser={onSelectUser}
        onSuccess={onRoleUpdateSuccess}
        getCardStyle={getCardStyle}
      />

      <EditUserDialog
        user={user}
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSuccess={onRoleUpdateSuccess}
        getCardStyle={getCardStyle}
      />

      <PasswordResetDialog
        user={user}
        isOpen={isPasswordDialogOpen}
        onOpenChange={setIsPasswordDialogOpen}
        getCardStyle={getCardStyle}
      />

      <div>
        <ContextMenu>
          <ContextMenuTrigger>
            <Button
              variant="ghost"
              size="icon"
              className="text-barber-light/60 hover:text-barber-light"
            >
              <span className="sr-only">Abrir menu</span>
              <Pencil className="h-4 w-4" />
            </Button>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem onSelect={() => setIsEditDialogOpen(true)}>
              Editar Informações
            </ContextMenuItem>
            <ContextMenuItem onSelect={() => setIsPasswordDialogOpen(true)}>
              Alterar Senha
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </div>
    </div>
  );
}