import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { menuItems } from "@/components/sidebar/menuItems";

interface RoleManagerProps {
  barber: {
    id: string;
    name: string;
    roles: string[];
  };
  onSuccess: () => Promise<void>;
}

const availableRoles = [
  { id: "admin", label: "Administrador", description: "Acesso total ao sistema" },
  { id: "seller", label: "Vendedor", description: "Acesso à PDV e produtos" },
  { id: "barber", label: "Barbeiro", description: "Acesso básico ao sistema" },
  { id: "manager", label: "Gerente", description: "Acesso administrativo limitado" },
];

const roleAccessMap = {
  admin: menuItems.map(item => item.url), // Admin has access to all routes
  seller: ["/cash-flow", "/products"], // Seller has access to cash flow and products
  barber: ["/", "/schedule", "/account"], // Barber has access to dashboard, schedule and account
  manager: ["/", "/members", "/barbers", "/cash-flow", "/products", "/stores"], // Manager has most access except sensitive areas
};

export function RoleManager({ barber, onSuccess }: RoleManagerProps) {
  const [selectedRoles, setSelectedRoles] = useState<string[]>(barber.roles || []);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleRoleToggle = (roleId: string) => {
    setSelectedRoles(current =>
      current.includes(roleId)
        ? current.filter(r => r !== roleId)
        : [...current, roleId]
    );
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('barbers')
        .update({ roles: selectedRoles })
        .eq('id', barber.id);

      if (error) throw error;

      toast({
        title: "Funções atualizadas",
        description: "As funções do utilizador foram atualizadas com sucesso.",
      });

      await onSuccess();
    } catch (error) {
      console.error('Error updating roles:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível atualizar as funções do utilizador.",
      });
    } finally {
      setLoading(false);
    }
  };

  const getRoleAccessList = (roleId: string) => {
    const accessRoutes = roleAccessMap[roleId as keyof typeof roleAccessMap] || [];
    return menuItems
      .filter(item => accessRoutes.includes(item.url))
      .map(item => item.title)
      .join(", ");
  };

  return (
    <div className="space-y-4">
      <ScrollArea className="h-[300px] pr-4">
        <div className="space-y-4">
          {availableRoles.map((role) => (
            <div key={role.id} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-muted/50">
              <Checkbox
                id={role.id}
                checked={selectedRoles.includes(role.id)}
                onCheckedChange={() => handleRoleToggle(role.id)}
              />
              <div className="space-y-1">
                <label
                  htmlFor={role.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {role.label}
                </label>
                <p className="text-sm text-muted-foreground">
                  {role.description}
                </p>
                <p className="text-xs text-muted-foreground">
                  Acesso a: {getRoleAccessList(role.id)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <Separator />
      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-barber-gold hover:bg-barber-gold/90 text-barber-black"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              Salvar Alterações
            </>
          )}
        </Button>
      </div>
    </div>
  );
}