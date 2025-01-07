import { UserCog } from "lucide-react";
import { cn } from "@/lib/utils";
import { Database } from "@/integrations/supabase/types";
import { RoleManagementDialog } from "../dialogs/RoleManagementDialog";

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
  onRoleUpdateSuccess: () => void;
}

export function UserListItem({
  user,
  userDetails,
  selectedUserId,
  onSelectUser,
  onRoleUpdateSuccess,
}: UserListItemProps) {
  const getRoleStyle = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-barber-gold/10 text-barber-gold border-barber-gold/20";
      case "seller":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "barber":
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
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
          <div className="flex flex-wrap gap-2 mt-2">
            {user.roles?.map((role) => (
              <span
                key={role}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium border",
                  getRoleStyle(role)
                )}
              >
                {role}
              </span>
            ))}
          </div>
        </div>
      </div>

      <RoleManagementDialog
        user={user}
        selectedUserId={selectedUserId}
        onSelectUser={onSelectUser}
        onSuccess={onRoleUpdateSuccess}
      />
    </div>
  );
}