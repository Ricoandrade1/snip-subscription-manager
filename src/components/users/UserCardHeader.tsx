import { UserCog } from "lucide-react";

interface UserCardHeaderProps {
  email: string;
  name?: string;
  phone?: string;
}

export function UserCardHeader({ email, name, phone }: UserCardHeaderProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <UserCog className="h-5 w-5 text-barber-gold" />
        <h3 className="text-lg font-semibold truncate text-barber-light">
          {email || "Usuário sem email"}
        </h3>
      </div>
      {(name || phone) && (
        <div className="pl-7 space-y-1">
          {name && (
            <p className="text-sm text-barber-light/80">
              Nome: {name}
            </p>
          )}
          {phone && (
            <p className="text-sm text-barber-light/80">
              Telefone: {phone}
            </p>
          )}
        </div>
      )}
    </div>
  );
}