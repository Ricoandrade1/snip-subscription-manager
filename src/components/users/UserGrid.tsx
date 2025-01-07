import { useState } from "react";
import { Loader2, LayoutGrid, List } from "lucide-react";
import { UserCard } from "./UserCard";
import { UserList } from "./UserList";
import { Database } from "@/integrations/supabase/types";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type UserAuthority = Database["public"]["Enums"]["user_authority"];

interface User {
  id: string;
  email: string;
  roles: UserAuthority[];
}

interface UserGridProps {
  users: User[];
  loading: boolean;
  selectedUserId: string | null;
  onSelectUser: (userId: string | null) => void;
  onRoleUpdateSuccess: () => void;
}

export function UserGrid({
  users,
  loading,
  selectedUserId,
  onSelectUser,
  onRoleUpdateSuccess,
}: UserGridProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-barber-gold" />
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-barber-light/60">Nenhum utilizador encontrado</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as "grid" | "list")}>
          <ToggleGroupItem value="grid" aria-label="Grid View">
            <LayoutGrid className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="list" aria-label="List View">
            <List className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <div key={user.id} className="h-full">
              <UserCard
                user={user}
                onRoleUpdateSuccess={onRoleUpdateSuccess}
                selectedUserId={selectedUserId}
                onSelectUser={onSelectUser}
              />
            </div>
          ))}
        </div>
      ) : (
        <UserList
          users={users}
          onRoleUpdateSuccess={onRoleUpdateSuccess}
          selectedUserId={selectedUserId}
          onSelectUser={onSelectUser}
        />
      )}
    </div>
  );
}