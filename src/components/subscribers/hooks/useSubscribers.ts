import { useSubscriberData } from "./useSubscriberData";
import { useSubscriberFilters } from "./useSubscriberFilters";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { SubscriberStats } from "../types/subscriber";

interface UseSubscribersProps {
  planFilter?: "Basic" | "Classic" | "Business";
  statusFilter?: string;
}

export function useSubscribers({ planFilter, statusFilter = 'all' }: UseSubscribersProps) {
  const { subscribers, isLoading, refetch } = useSubscriberData(planFilter);
  const { filters, handleFilterChange, filteredSubscribers } = useSubscriberFilters(subscribers, statusFilter);
  const [stats, setStats] = useState<SubscriberStats>({
    totalSubscribers: 0,
    activeSubscribers: 0,
    overdueSubscribers: 0,
    pendingSubscribers: 0,
    monthlyRevenue: 0,
  });

  useEffect(() => {
    const calculateStats = async () => {
      const { data: plans } = await supabase.from('plans').select('title, price');
      const planPrices = plans?.reduce((acc: Record<string, number>, plan) => {
        acc[plan.title] = Number(plan.price);
        return acc;
      }, {}) || {};

      const stats = filteredSubscribers.reduce((acc, subscriber) => {
        let monthlyRevenue = 0;
        if (subscriber.status === 'pago') {
          monthlyRevenue = planPrices[subscriber.plan] || 0;
        }
        
        return {
          totalSubscribers: acc.totalSubscribers + 1,
          activeSubscribers: acc.activeSubscribers + (subscriber.status === 'pago' ? 1 : 0),
          overdueSubscribers: acc.overdueSubscribers + (subscriber.status === 'cancelado' ? 1 : 0),
          pendingSubscribers: acc.pendingSubscribers + (subscriber.status === 'pendente' ? 1 : 0),
          monthlyRevenue: acc.monthlyRevenue + monthlyRevenue,
        };
      }, {
        totalSubscribers: 0,
        activeSubscribers: 0,
        overdueSubscribers: 0,
        pendingSubscribers: 0,
        monthlyRevenue: 0,
      });

      setStats(stats);
    };

    calculateStats();
  }, [filteredSubscribers]);

  return {
    subscribers,
    isLoading,
    filters,
    handleFilterChange,
    filteredSubscribers,
    stats,
    refetch
  };
}