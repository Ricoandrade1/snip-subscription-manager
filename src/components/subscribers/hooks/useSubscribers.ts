import { UseSubscribersProps, UseSubscribersReturn } from "../types/subscriber-hooks";
import { useSubscriberData } from "./useSubscriberData";
import { useSubscriberFilters } from "./useSubscriberFilters";
import { useSubscriberStats } from "./useSubscriberStats";

export function useSubscribers({ planFilter, statusFilter = 'all' }: UseSubscribersProps): UseSubscribersReturn {
  const { subscribers, isLoading, refetch } = useSubscriberData(planFilter);
  const { filters, handleFilterChange, filterSubscribers } = useSubscriberFilters(statusFilter);
  const stats = useSubscriberStats(subscribers);

  const filteredSubscribers = filterSubscribers(subscribers);

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