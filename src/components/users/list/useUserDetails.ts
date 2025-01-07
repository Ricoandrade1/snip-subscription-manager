import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface UserDetails {
  name: string;
  phone: string;
}

export function useUserDetails(userIds: string[], loading: boolean) {
  const [userDetails, setUserDetails] = useState<Record<string, UserDetails>>({});

  useEffect(() => {
    if (!loading) {
      fetchUsersDetails();
    }
  }, [userIds, loading]);

  const fetchUsersDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('barbers')
        .select('id, name, phone')
        .in('id', userIds);

      if (error) throw error;

      const detailsMap = (data || []).reduce((acc, user) => ({
        ...acc,
        [user.id]: { name: user.name, phone: user.phone }
      }), {});

      setUserDetails(detailsMap);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  return userDetails;
}