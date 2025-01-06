import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

interface DashboardStats {
  totalSubscribers: number;
  activeSubscribers: number;
  monthlyRevenue: number;
}

export function useDashboardStats() {
  const { data: stats, refetch } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async (): Promise<DashboardStats> => {
      // Fetch members and their plans
      const { data: members, error } = await supabase
        .from("members")
        .select(`
          *,
          plans (
            price
          )
        `);

      if (error) throw error;

      // Calculate stats
      const totalSubscribers = members.length;
      const activeSubscribers = members.filter(m => m.status === "pago").length;
      const monthlyRevenue = members.reduce((acc, member) => {
        if (member.status === "pago" && member.plans) {
          return acc + Number(member.plans.price);
        }
        return acc;
      }, 0);

      return {
        totalSubscribers,
        activeSubscribers,
        monthlyRevenue
      };
    }
  });

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel("dashboard-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "members"
        },
        () => {
          // Refetch stats when any change occurs
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  return stats || {
    totalSubscribers: 0,
    activeSubscribers: 0,
    monthlyRevenue: 0
  };
}