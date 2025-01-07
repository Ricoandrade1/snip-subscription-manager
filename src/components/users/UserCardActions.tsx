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
    <div className="flex justify-end pt-2">
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