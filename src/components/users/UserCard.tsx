import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Database } from "@/integrations/supabase/types";
import { UserCardHeader } from "./UserCardHeader";
import { UserCardRoles } from "./UserCardRoles";
import { UserCardActions } from "./UserCardActions";

type UserAuthority = Database["public"]["Enums"]["user_authority"];

interface User {
  id: string;
  email: string;
  roles: UserAuthority[];
}

interface UserCardProps {
  user: User;
  onRoleUpdateSuccess: () => void;
  selectedUserId: string | null;
  onSelectUser: (userId: string | null) => void;
}

export function UserCard({
  user,
  onRoleUpdateSuccess,
  selectedUserId,
  onSelectUser,
}: UserCardProps) {
  const isAdmin = user.roles?.includes("admin");
  const isSeller = user.roles?.includes("seller");
  const isBarber = user.roles?.includes("barber");

  const getCardStyle = () => {
    if (isAdmin) {
      return "bg-barber-gray border-barber-gold/20";
    }
    if (isSeller) {
      return "bg-barber-gray border-blue-500/20";
    }
    if (isBarber) {
      return "bg-barber-gray border-gray-500/20";
    }
    return "bg-barber-gray border-gray-500/20";
  };

  return (
    <Card className={`transition-none group relative ${getCardStyle()}`}>
      <CardHeader className="pb-2">
        <UserCardHeader email={user.email} />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <UserCardRoles roles={user.roles} />
          <UserCardActions
            user={user}
            onRoleUpdateSuccess={onRoleUpdateSuccess}
            selectedUserId={selectedUserId}
            onSelectUser={onSelectUser}
            getCardStyle={getCardStyle}
          />
        </div>
      </CardContent>
    </Card>
  );
}