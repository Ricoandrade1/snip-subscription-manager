import { UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { RoleManager } from "@/components/barber-list/RoleManager";
import { Database } from "@/integrations/supabase/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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

export function UserCard({ user, onRoleUpdateSuccess, selectedUserId, onSelectUser }: UserCardProps) {
  const isAdmin = user.roles?.includes("admin");
  const isSeller = user.roles?.includes("seller");
  const isBarber = user.roles?.includes("barber");

  const getCardStyle = () => {
    if (isAdmin) {
      return "bg-barber-gray border-barber-gold/20 hover:border-barber-gold/40";
    }
    if (isSeller) {
      return "bg-blue-950/50 border-blue-500/20 hover:border-blue-500/40";
    }
    if (isBarber) {
      return "bg-barber-gray border-gray-500/20 hover:border-gray-500/40";
    }
    return "bg-barber-gray border-gray-500/20 hover:border-gray-500/40";
  };

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

  const getTitleStyle = () => {
    if (isAdmin) return "text-barber-gold";
    if (isSeller) return "text-blue-400";
    if (isBarber) return "text-gray-400";
    return "text-gray-400";
  };

  const getIconStyle = () => {
    if (isAdmin) return "text-barber-gold";
    if (isSeller) return "text-blue-400";
    if (isBarber) return "text-gray-400";
    return "text-gray-400";
  };

  return (
    <Card className={cn("transition-colors", getCardStyle())}>
      <CardHeader className="pb-2">
        <div className="flex items-center space-x-2">
          <UserCog className={cn("h-5 w-5", getIconStyle())} />
          <h3 className={cn("text-lg font-semibold truncate", getTitleStyle())}>
            {user.email || "Usuário sem email"}
          </h3>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {user.roles?.length > 0 ? (
              user.roles.map((role) => (
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
          
          <div className="flex justify-end pt-2">
            <Dialog 
              open={selectedUserId === user.id} 
              onOpenChange={(open) => !open && onSelectUser(null)}
            >
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onSelectUser(user.id)}
                  className={cn(
                    "bg-barber-gray border-barber-gold text-barber-gold hover:bg-barber-gold hover:text-barber-black",
                    {
                      "bg-barber-gray border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-barber-black": isSeller,
                      "bg-barber-gray border-gray-400 text-gray-400 hover:bg-gray-400 hover:text-barber-black": isBarber
                    }
                  )}
                >
                  Gerir Funções
                </Button>
              </DialogTrigger>
              <DialogContent className={cn("border-barber-gold/20", getCardStyle())}>
                <div className="space-y-4">
                  <h2 className={cn("text-xl font-semibold", getTitleStyle())}>
                    Gerir Funções - {user.email || "Usuário sem email"}
                  </h2>
                  <RoleManager
                    barber={{
                      id: user.id,
                      name: user.email || 'Usuário sem email',
                      roles: user.roles || []
                    }}
                    onSuccess={onRoleUpdateSuccess}
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}