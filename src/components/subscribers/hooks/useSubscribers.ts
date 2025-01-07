import { useSubscriberData } from "./useSubscriberData";
import { useSubscriberFilters } from "./useSubscriberFilters";

interface UseSubscribersProps {
  planFilter?: "Basic" | "Classic" | "Business";
  statusFilter?: string;
}

export function useSubscribers({ planFilter, statusFilter = 'all' }: UseSubscribersProps) {
  const { subscribers, isLoading, stats, refetch } = useSubscriberData({ planFilter, statusFilter });
  const { filters, handleFilterChange, filteredSubscribers } = useSubscriberFilters(subscribers, statusFilter);

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