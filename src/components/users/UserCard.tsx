import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Database } from "@/integrations/supabase/types";
import { UserCardHeader } from "./UserCardHeader";
import { UserCardRoles } from "./UserCardRoles";
import { UserCardActions } from "./UserCardActions";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ImageUpload } from "../barber-form/ImageUpload";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import { DeleteUserDialog } from "./dialogs/DeleteUserDialog";

type UserAuthority = Database["public"]["Enums"]["user_authority"];

interface User {
  id: string;
  email: string;
  roles: UserAuthority[];
}

interface UserDetails {
  name: string;
  phone: string;
  image_url: string | null;
}

interface UserCardProps {
  user: User;
  onRoleUpdateSuccess: () => void;
  selectedUserId: string | null;
  onSelectUser: (userId: string | null) => void;
}

export function UserCard({
  user,
  onRoleUpdateSuccess,
  selectedUserId,
  onSelectUser,
}: UserCardProps) {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const isAdmin = user.roles?.includes("admin");
  const isSeller = user.roles?.includes("seller");
  const isBarber = user.roles?.includes("barber");

  useEffect(() => {
    fetchUserDetails();
  }, [user.id]);

  const fetchUserDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('barbers')
        .select('name, phone, image_url')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setUserDetails(data);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const handleImageUpload = async (url: string) => {
    try {
      const { error } = await supabase
        .from('barbers')
        .update({ image_url: url })
        .eq('id', user.id);

      if (error) throw error;
      
      setUserDetails(prev => prev ? { ...prev, image_url: url } : null);
    } catch (error) {
      console.error('Error updating user image:', error);
    }
  };

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

  const handleDeleteSuccess = async () => {
    await onRoleUpdateSuccess();
  };

  return (
    <Card className={`h-full flex flex-col transition-none group relative ${getCardStyle()}`}>
      <CardHeader className="pb-4 flex-shrink-0">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 flex-shrink-0">
            <ImageUpload
              currentImage={userDetails?.image_url || null}
              onUpload={handleImageUpload}
            />
          </div>
          <div className="flex-1 min-w-0 pt-2">
            <UserCardHeader 
              email={user.email} 
              name={userDetails?.name}
              phone={userDetails?.phone}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between pt-2">
        <UserCardRoles roles={user.roles} />
        <div className="mt-6 flex justify-between items-center">
          <UserCardActions
            user={user}
            onRoleUpdateSuccess={onRoleUpdateSuccess}
            selectedUserId={selectedUserId}
            onSelectUser={onSelectUser}
            getCardStyle={getCardStyle}
          />
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setIsDeleteDialogOpen(true)}
            className="ml-2"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>

      <DeleteUserDialog
        user={user}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onSuccess={handleDeleteSuccess}
      />
    </Card>
  );
}
