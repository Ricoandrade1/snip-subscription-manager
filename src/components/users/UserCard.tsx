import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Database } from "@/integrations/supabase/types";
import { UserCardHeader } from "./UserCardHeader";
import { UserCardRoles } from "./UserCardRoles";
import { UserCardActions } from "./UserCardActions";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ImageUpload } from "../barber-form/ImageUpload";

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
      
      // Update local state with new image URL
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

  return (
    <Card className={`transition-none group relative ${getCardStyle()}`}>
      <CardHeader className="pb-2">
        <div className="flex items-start gap-4">
          <ImageUpload
            currentImage={userDetails?.image_url || null}
            onUpload={handleImageUpload}
          />
          <div className="flex-1">
            <UserCardHeader 
              email={user.email} 
              name={userDetails?.name}
              phone={userDetails?.phone}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <UserCardRoles roles={user.roles} />
          <UserCardActions
            user={user}
            onRoleUpdateSuccess={onRoleUpdateSuccess}
            selectedUserId={selectedUserId}
            onSelectUser={onSelectUser}
            getCardStyle={getCardStyle}
          />
        </div>
      </CardContent>
    </Card>
  );
}