import { useState } from "react";
import { Database } from "@/integrations/supabase/types";
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
    </div>
  );
}