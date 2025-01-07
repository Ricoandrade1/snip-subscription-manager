import { Pencil, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RoleManager } from "@/components/barber-list/RoleManager";
import { Database } from "@/integrations/supabase/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { UserForm } from "./UserForm";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase/client";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
  ContextMenuItem,
} from "@/components/ui/context-menu";

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
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();
  
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

  const handleEditClick = () => {
    setIsEditDialogOpen(true);
  };

  const handleUpdateUser = async (data: any) => {
    try {
      const { error } = await supabase
        .from('barbers')
        .update({
          email: data.email,
          name: data.name,
          phone: data.phone,
          nif: data.nif,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Informações do usuário atualizadas com sucesso!",
      });
      
      setIsEditDialogOpen(false);
      onRoleUpdateSuccess(); // Refresh user data
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível atualizar as informações do usuário.",
      });
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <Card className={cn("transition-none group relative", getCardStyle())}>
          <Pencil 
            className="absolute top-2 right-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-barber-light/60 cursor-pointer" 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleEditClick();
            }}
          />
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-2">
              <UserCog className="h-5 w-5 text-barber-gold" />
              <h3 className="text-lg font-semibold truncate text-barber-light">
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
                        "bg-barber-gray border-barber-gold text-barber-gold hover:bg-barber-gold/10",
                        {
                          "bg-barber-gray border-blue-400 text-blue-400 hover:bg-blue-400/10": isSeller,
                          "bg-barber-gray border-gray-400 text-gray-400 hover:bg-gray-400/10": isBarber
                        }
                      )}
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
                        roles: user.roles || []
                      }}
                      onSuccess={onRoleUpdateSuccess}
                    />
                  </DialogContent>
                </Dialog>

                {/* Edit User Dialog */}
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                  <DialogContent className={cn("border-barber-gold/20", getCardStyle())}>
                    <DialogTitle className="text-xl font-semibold text-barber-light">
                      Editar Usuário - {user.email || "Usuário sem email"}
                    </DialogTitle>
                    <UserForm 
                      onSubmit={handleUpdateUser}
                      initialData={{
                        email: user.email,
                        name: "",
                        phone: "",
                        nif: "",
                        role: "user"
                      }}
                      isEditing={true}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuItem onClick={handleEditClick}>
          Editar Informações
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}