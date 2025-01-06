import { UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { RoleManager } from "@/components/barber-list/RoleManager";
import { Database } from "@/integrations/supabase/types";

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
  return (
    <div className="p-6 rounded-lg bg-barber-gray border border-barber-gold/20 space-y-4 hover:border-barber-gold/40 transition-colors">
      <h3 className="text-xl font-semibold text-barber-gold truncate">
        {user.email}
      </h3>
      <div className="flex flex-wrap gap-2">
        {user.roles?.map((role) => (
          <span
            key={role}
            className="px-2 py-1 rounded-full text-xs bg-barber-gold/10 text-barber-gold border border-barber-gold/20"
          >
            {role}
          </span>
        ))}
      </div>
      <div className="pt-4 flex justify-end">
        <Dialog 
          open={selectedUserId === user.id} 
          onOpenChange={(open) => !open && onSelectUser(null)}
        >
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onSelectUser(user.id)}
              className="hover:bg-barber-gold/10 hover:text-barber-gold border-barber-gold/20"
            >
              Gerir Funções
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-barber-gray border-barber-gold/20">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-barber-gold">
                Gerir Funções - {user.email}
              </h2>
              <RoleManager
                barber={{
                  id: user.id,
                  name: user.email || '',
                  roles: user.roles || []
                }}
                onSuccess={onRoleUpdateSuccess}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}