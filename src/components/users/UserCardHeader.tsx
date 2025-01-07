import { UserCog } from "lucide-react";

interface UserCardHeaderProps {
  email: string;
}

export function UserCardHeader({ email }: UserCardHeaderProps) {
  return (
    <div className="flex items-center space-x-2">
      <UserCog className="h-5 w-5 text-barber-gold" />
      <h3 className="text-lg font-semibold truncate text-barber-light">
        {email || "Usuário sem email"}
      </h3>
    </div>
  );
}