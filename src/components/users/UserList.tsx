import { Database } from "@/integrations/supabase/types";
import { UserListItem } from "./list/UserListItem";
import { UserListSkeleton } from "./list/UserListSkeleton";
import { useUserDetails } from "./list/useUserDetails";

type UserAuthority = Database["public"]["Enums"]["user_authority"];

interface User {
  id: string;
  email: string;
  roles: UserAuthority[];
}

interface UserListProps {
  users: User[];
  selectedUserId: string | null;
  onSelectUser: (userId: string | null) => void;
  onRoleUpdateSuccess: () => Promise<void>;
  loading?: boolean;
}

export function UserList({
  users,
  selectedUserId,
  onSelectUser,
  onRoleUpdateSuccess,
  loading = false,
}: UserListProps) {
  const userDetails = useUserDetails(
    users.map(user => user.id),
    loading
  );

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((index) => (
          <UserListSkeleton key={index} />
        ))}
      </div>
    );
  }

  const handleRoleUpdateSuccess = async () => {
    await onRoleUpdateSuccess();
  };

  return (
    <div className="space-y-4">
      {users.map((user) => (
        <UserListItem
          key={user.id}
          user={user}
          userDetails={userDetails[user.id]}
          selectedUserId={selectedUserId}
          onSelectUser={onSelectUser}
          onRoleUpdateSuccess={handleRoleUpdateSuccess}
        />
      ))}
    </div>
  );
}