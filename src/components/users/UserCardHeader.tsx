import { UserCog } from "lucide-react";
import { Database } from "@/integrations/supabase/types";

type UserAuthority = Database["public"]["Enums"]["user_authority"];

interface User {
  id: string;
  email: string;
  roles: UserAuthority[];
}

interface UserCardHeaderProps {
  user: User;
  getRoleStyle: (role: string) => string;
}

export function UserCardHeader({ user, getRoleStyle }: UserCardHeaderProps) {
  return (
    <>
      <div className="flex items-center space-x-2">
        <UserCog className="h-5 w-5 text-barber-gold" />
        <h3 className="text-lg font-semibold truncate text-barber-light">
          {user.email || "Usuário sem email"}
        </h3>
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {user.roles?.length > 0 ? (
          user.roles.map((role) => (
            <span
              key={role}
              className={getRoleStyle(role)}
            >
              {role}
            </span>
          ))
        ) : (
          <span className="text-barber-light text-sm">Sem funções atribuídas</span>
        )}
      </div>
    </>
  );
}