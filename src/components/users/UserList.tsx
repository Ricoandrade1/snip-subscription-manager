import { UserCog } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { RoleManager } from "@/components/barber-list/RoleManager";
import { Database } from "@/integrations/supabase/types";
import { cn } from "@/lib/utils";

type UserAuthority = Database["public"]["Enums"]["user_authority"];

interface User {
  id: string;
  email: string;
  roles: UserAuthority[];
}

interface UserListProps {
  users: User[];
  selectedUserId: string | null;
  onSelectUser: (userId: string | null) => void;
  onRoleUpdateSuccess: () => void;
}

export function UserList({
  users,
  selectedUserId,
  onSelectUser,
  onRoleUpdateSuccess,
}: UserListProps) {
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
    <div className="space-y-4">
      {users.map((user) => (
        <div
          key={user.id}
          className="bg-barber-gray border border-barber-gray/20 rounded-lg p-6 flex flex-col md:flex-row md:items-center gap-4"
        >
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <UserCog className="h-5 w-5 text-barber-gold flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h3 className="text-barber-light font-medium truncate">
                {user.email}
              </h3>
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

          <Dialog
            open={selectedUserId === user.id}
            onOpenChange={(open) => !open && onSelectUser(null)}
          >
            <DialogTrigger asChild>
              <button
                onClick={() => onSelectUser(user.id)}
                className="px-4 py-2 text-sm bg-barber-gray border border-barber-gold text-barber-gold rounded-md hover:bg-barber-gold/10 transition-colors whitespace-nowrap w-full md:w-auto"
              >
                Gerir Funções
              </button>
            </DialogTrigger>
            <DialogContent className="bg-barber-gray border-barber-gold/20">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-barber-light">
                  Gerir Funções - {user.email}
                </h2>
                <RoleManager
                  barber={{
                    id: user.id,
                    name: user.email,
                    roles: user.roles || [],
                  }}
                  onSuccess={onRoleUpdateSuccess}
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      ))}
    </div>
  );
}