import { Loader2 } from "lucide-react";
import { UserCard } from "./UserCard";
import { Database } from "@/integrations/supabase/types";

type UserAuthority = Database["public"]["Enums"]["user_authority"];

interface User {
  id: string;
  email: string;
  roles: UserAuthority[];
}

interface UserGridProps {
  users: User[];
  loading: boolean;
  selectedUserId: string | null;
  onSelectUser: (userId: string | null) => void;
  onRoleUpdateSuccess: () => void;
}

export function UserGrid({
  users,
  loading,
  selectedUserId,
  onSelectUser,
  onRoleUpdateSuccess,
}: UserGridProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-barber-gold" />
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-barber-light/60">Nenhum utilizador encontrado</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {users.map((user) => (
        <UserCard
          key={user.id}
          user={user}
          onRoleUpdateSuccess={onRoleUpdateSuccess}
          selectedUserId={selectedUserId}
          onSelectUser={onSelectUser}
        />
      ))}
    </div>
  );
}