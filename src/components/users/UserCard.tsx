import { Pencil } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Database } from "@/integrations/supabase/types";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
  ContextMenuItem,
} from "@/components/ui/context-menu";
import { UserCardHeader } from "./UserCardHeader";
import { UserCardActions } from "./UserCardActions";

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
  
  const isAdmin = user.roles?.includes("admin");
  const isSeller = user.roles?.includes("seller");
  const isBarber = user.roles?.includes("barber");

  const getCardStyle = () => {
    if (isAdmin) return "bg-barber-gray border-barber-gold/20";
    if (isSeller) return "bg-barber-gray border-blue-500/20";
    if (isBarber) return "bg-barber-gray border-gray-500/20";
    return "bg-barber-gray border-gray-500/20";
  };

  const getRoleStyle = (role: string) => {
    switch (role) {
      case "admin":
        return "px-2 py-1 rounded-full text-xs border bg-barber-gold/10 text-barber-gold border-barber-gold/20";
      case "seller":
        return "px-2 py-1 rounded-full text-xs border bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "barber":
        return "px-2 py-1 rounded-full text-xs border bg-gray-500/10 text-gray-400 border-gray-500/20";
      default:
        return "px-2 py-1 rounded-full text-xs border bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  const handleEditClick = () => {
    setIsEditDialogOpen(true);
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
            <UserCardHeader user={user} getRoleStyle={getRoleStyle} />
          </CardHeader>
          <CardContent>
            <UserCardActions
              user={user}
              onRoleUpdateSuccess={onRoleUpdateSuccess}
              selectedUserId={selectedUserId}
              onSelectUser={onSelectUser}
              getCardStyle={getCardStyle}
              handleEditClick={handleEditClick}
              isEditDialogOpen={isEditDialogOpen}
              setIsEditDialogOpen={setIsEditDialogOpen}
            />
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