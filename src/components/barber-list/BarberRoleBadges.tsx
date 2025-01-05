import { Badge } from "@/components/ui/badge";
import { Database } from "@/integrations/supabase/types";

type UserAuthority = Database["public"]["Enums"]["user_authority"];

interface BarberRoleBadgesProps {
  roles: UserAuthority[];
}

export function BarberRoleBadges({ roles }: BarberRoleBadgesProps) {
  return (
    <div className="flex flex-wrap gap-1">
      {roles?.map((role, index) => (
        <Badge key={index} variant="outline">
          {role}
        </Badge>
      ))}
    </div>
  );
}