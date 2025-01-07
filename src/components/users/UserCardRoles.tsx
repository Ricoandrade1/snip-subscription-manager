import { cn } from "@/lib/utils";
import { Database } from "@/integrations/supabase/types";

type UserAuthority = Database["public"]["Enums"]["user_authority"];

interface UserCardRolesProps {
  roles: UserAuthority[];
}

export function UserCardRoles({ roles }: UserCardRolesProps) {
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
    <div className="flex flex-wrap gap-2">
      {roles?.length > 0 ? (
        roles.map((role) => (
          <span
            key={role}
            className={cn(
              "px-2 py-1 rounded-full text-xs border",
              getRoleStyle(role)
            )}
          >
            {role}
          </span>
        ))
      ) : (
        <span className="text-barber-light text-sm">Sem funções atribuídas</span>
      )}
    </div>
  );
}