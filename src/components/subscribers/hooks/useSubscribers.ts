import { useEffect } from "react";
import { useSubscriberData } from "./useSubscriberData";
import { useSubscriberFilters } from "./useSubscriberFilters";
import { useSubscriberStats } from "./useSubscriberStats";

interface UseSubscribersProps {
  planFilter?: "Basic" | "Classic" | "Business";
  statusFilter?: string;
}

export function useSubscribers({ planFilter, statusFilter = 'all' }: UseSubscribersProps) {
  const { subscribers, isLoading, refetch } = useSubscriberData(planFilter);
  const { filters, handleFilterChange, filteredSubscribers } = useSubscriberFilters(subscribers, statusFilter);
  const stats = useSubscriberStats(subscribers);

  useEffect(() => {
    console.log('Estatísticas calculadas:', stats);
  }, [stats]);

  return {
    subscribers,
    isLoading,
    filters,
    handleFilterChange,
    filteredSubscribers,
    stats,
    refetch,
  };
}