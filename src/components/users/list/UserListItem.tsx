import { UserCog } from "lucide-react";
import { cn } from "@/lib/utils";
import { Database } from "@/integrations/supabase/types";
import { RoleManagementDialog } from "../dialogs/RoleManagementDialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { DeleteUserDialog } from "../dialogs/DeleteUserDialog";

type UserAuthority = Database["public"]["Enums"]["user_authority"];

interface UserDetails {
  name: string;
  phone: string;
}

interface UserListItemProps {
  user: {
    id: string;
    email: string;
    roles: UserAuthority[];
  };
  userDetails: UserDetails | undefined;
  selectedUserId: string | null;
  onSelectUser: (userId: string | null) => void;
  onRoleUpdateSuccess: () => Promise<void>;
}

export function UserListItem({
  user,
  userDetails,
  selectedUserId,
  onSelectUser,
  onRoleUpdateSuccess,
}: UserListItemProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const getCardStyle = () => {
    if (user.roles?.includes("admin")) {
      return "bg-barber-gray border-barber-gold/20";
    }
    if (user.roles?.includes("seller")) {
      return "bg-barber-gray border-blue-500/20";
    }
    return "bg-barber-gray border-gray-500/20";
  };

  return (
    <div className="bg-barber-gray border border-barber-gray/20 rounded-lg p-6 flex flex-col md:flex-row md:items-center gap-4">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <UserCog className="h-5 w-5 text-barber-gold flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <h3 className="text-barber-light font-medium truncate">
            {user.email}
          </h3>
          {userDetails && (
            <div className="mt-1 space-y-0.5">
              <p className="text-sm text-barber-light/80">
                Nome: {userDetails.name}
              </p>
              <p className="text-sm text-barber-light/80">
                Telefone: {userDetails.phone}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <RoleManagementDialog
          user={user}
          selectedUserId={selectedUserId}
          onSelectUser={onSelectUser}
          onSuccess={onRoleUpdateSuccess}
          getCardStyle={getCardStyle}
        />
        <Button
          variant="destructive"
          size="sm"
          onClick={() => setIsDeleteDialogOpen(true)}
        >
          Excluir
        </Button>
      </div>

      <DeleteUserDialog
        user={user}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onSuccess={onRoleUpdateSuccess}
      />
    </div>
  );
}