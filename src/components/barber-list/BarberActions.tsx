import { Button } from "@/components/ui/button";
import { Pencil, Settings2, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { BarberForm } from "../barber-form/BarberForm";
import { RoleManager } from "./RoleManager";
import { useState } from "react";
import { Database } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type UserAuthority = Database["public"]["Enums"]["user_authority"];

interface Barber {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  specialties: string[];
  commission_rate: number;
  status: string;
  roles: UserAuthority[];
}

interface BarberActionsProps {
  barber: Barber;
  onSuccess: () => void;
}

export function BarberActions({ barber, onSuccess }: BarberActionsProps) {
  const [isEditingRoles, setIsEditingRoles] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const { toast } = useToast();

  const handleRoleUpdateSuccess = () => {
    setIsEditingRoles(false);
    onSuccess();
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('barbers')
        .delete()
        .eq('id', barber.id);

      if (error) throw error;

      toast({
        title: "Barbeiro excluído",
        description: `${barber.name} foi removido com sucesso.`,
      });
      
      setIsConfirmingDelete(false);
      onSuccess();
    } catch (error) {
      console.error('Erro ao excluir barbeiro:', error);
      toast({
        title: "Erro ao excluir barbeiro",
        description: "Não foi possível excluir o barbeiro. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon">
            <Pencil className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
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
            <DialogTitle>Gerenciar Funções</DialogTitle>
          </DialogHeader>
          <RoleManager barber={barber} onSuccess={handleRoleUpdateSuccess} />
        </DialogContent>
      </Dialog>

      <Dialog open={isConfirmingDelete} onOpenChange={setIsConfirmingDelete}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon">
            <Trash2 className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o barbeiro {barber.name}? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDelete}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}