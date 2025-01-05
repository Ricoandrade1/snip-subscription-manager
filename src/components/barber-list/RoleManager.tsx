import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Database } from "@/integrations/supabase/types";

type UserAuthority = Database["public"]["Enums"]["user_authority"];

interface Barber {
  id: string;
  name: string;
  roles: UserAuthority[];
}

interface RoleManagerProps {
  barber: Barber;
  onSuccess: () => void;
}

const availableRoles: { id: UserAuthority; label: string }[] = [
  { id: "admin", label: "Administrador" },
  { id: "seller", label: "Vendedor" },
  { id: "manager", label: "Gerente" },
  { id: "barber", label: "Barbeiro" },
  { id: "owner", label: "Proprietário" },
];

export function RoleManager({ barber, onSuccess }: RoleManagerProps) {
  const [selectedRoles, setSelectedRoles] = useState<UserAuthority[]>(barber.roles || []);
  const { toast } = useToast();

  const handleRoleToggle = (roleId: UserAuthority) => {
    setSelectedRoles((current) => {
      if (current.includes(roleId)) {
        return current.filter((r) => r !== roleId);
      } else {
        return [...current, roleId];
      }
    });
  };

  const handleSubmit = async () => {
    try {
      const { error } = await supabase
        .from('barbers')
        .update({ roles: selectedRoles })
        .eq('id', barber.id);

      if (error) throw error;

      toast({
        title: "Funções atualizadas",
        description: "As funções do barbeiro foram atualizadas com sucesso.",
      });

      onSuccess();
    } catch (error) {
      console.error('Error updating roles:', error);
      toast({
        title: "Erro ao atualizar funções",
        description: "Não foi possível atualizar as funções do barbeiro.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {availableRoles.map((role) => (
          <div key={role.id} className="flex items-center space-x-2">
            <Checkbox
              id={role.id}
              checked={selectedRoles.includes(role.id)}
              onCheckedChange={() => handleRoleToggle(role.id)}
            />
            <label
              htmlFor={role.id}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {role.label}
            </label>
          </div>
        ))}
      </div>

      <Button onClick={handleSubmit} className="w-full">
        Salvar Alterações
      </Button>
    </div>
  );
}