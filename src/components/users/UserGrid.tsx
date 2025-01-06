import { UserCog } from "lucide-react";
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

export function UserGrid({ users, loading, selectedUserId, onSelectUser, onRoleUpdateSuccess }: UserGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div 
            key={i} 
            className="h-48 rounded-lg bg-barber-gray/50 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center p-8 text-center">
        <UserCog className="h-16 w-16 text-barber-gold/20 mb-4" />
        <h3 className="text-xl font-semibold text-barber-gold mb-2">
          Nenhum utilizador encontrado
        </h3>
        <p className="text-barber-light/60">
          Adicione utilizadores para gerenciar suas funções
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {users.map((user) => (
        <UserCard
          key={user.id}
          user={user}
          selectedUserId={selectedUserId}
          onSelectUser={onSelectUser}
          onRoleUpdateSuccess={onRoleUpdateSuccess}
        />
      ))}
    </div>
  );
}