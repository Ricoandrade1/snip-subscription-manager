import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RoleManager } from "@/components/barber-list/RoleManager";
import { cn } from "@/lib/utils";
import { Database } from "@/integrations/supabase/types";

type UserAuthority = Database["public"]["Enums"]["user_authority"];

interface RoleManagementDialogProps {
  user: {
    id: string;
    email: string;
    roles: UserAuthority[];
  };
  selectedUserId: string | null;
  onSelectUser: (userId: string | null) => void;
  onSuccess: () => void;
  getCardStyle: () => string;
}

export function RoleManagementDialog({
  user,
  selectedUserId,
  onSelectUser,
  onSuccess,
  getCardStyle,
}: RoleManagementDialogProps) {
  return (
    <Dialog 
      open={selectedUserId === user.id} 
      onOpenChange={(open) => !open && onSelectUser(null)}
    >
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onSelectUser(user.id)}
          className="bg-barber-gray border-barber-gold text-barber-gold hover:bg-barber-gold/10"
        >
          Gerir Funções
        </Button>
      </DialogTrigger>
      <DialogContent className={cn("border-barber-gold/20", getCardStyle())}>
        <DialogTitle className="text-xl font-semibold text-barber-light">
          Gerir Funções - {user.email || "Usuário sem email"}
        </DialogTitle>
        <RoleManager
          barber={{
            id: user.id,
            name: user.email || 'Usuário sem email',
            roles: user.roles
          }}
          onSuccess={onSuccess}
        />
      </DialogContent>
    </Dialog>
  );
}