import { useSubscriberData } from './useSubscriberData';
import { useSubscriberFilters } from './useSubscriberFilters';

export function useSubscribers() {
  const { subscribers, isLoading, stats, refetch } = useSubscriberData();
  const { filters, handleFilterChange, filterSubscribers, sortSubscribers } = useSubscriberFilters();

  const filteredSubscribers = sortSubscribers(filterSubscribers(subscribers));

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