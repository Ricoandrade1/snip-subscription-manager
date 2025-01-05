import { Button } from "@/components/ui/button";
import { Pencil, Settings2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BarberForm } from "../barber-form/BarberForm";
import { RoleManager } from "./RoleManager";
import { useState } from "react";
import { Database } from "@/integrations/supabase/types";

type UserAuthority = Database["public"]["Enums"]["user_authority"];

interface Barber {
  id: string;
  name: string;
  roles: UserAuthority[];
}

interface BarberActionsProps {
  barber: Barber;
  onSuccess: () => void;
}

export function BarberActions({ barber, onSuccess }: BarberActionsProps) {
  const [isEditingRoles, setIsEditingRoles] = useState(false);

  const handleRoleUpdateSuccess = () => {
    setIsEditingRoles(false);
    onSuccess();
  };

  return (
    <div className="flex gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon">
            <Pencil className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Barbeiro</DialogTitle>
          </DialogHeader>
          <BarberForm barberId={barber.id} onSuccess={onSuccess} />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditingRoles} onOpenChange={setIsEditingRoles}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon">
            <Settings2 className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gerenciar Funções - {barber.name}</DialogTitle>
          </DialogHeader>
          <RoleManager barber={barber} onSuccess={handleRoleUpdateSuccess} />
        </DialogContent>
      </Dialog>
    </div>
  );
}