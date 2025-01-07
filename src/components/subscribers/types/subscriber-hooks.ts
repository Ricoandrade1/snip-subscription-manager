import { Subscriber, FilterState } from "./subscriber";

export interface UseSubscribersProps {
  planFilter?: "Basic" | "Classic" | "Business";
  statusFilter?: string;
}

export interface UseSubscribersReturn {
  subscribers: Subscriber[];
  isLoading: boolean;
  filters: FilterState;
  handleFilterChange: (field: keyof FilterState, value: string) => void;
  filteredSubscribers: Subscriber[];
  stats: SubscriberStats;
  refetch: () => Promise<void>;
}

export interface SubscriberStats {
  totalSubscribers: number;
  activeSubscribers: number;
  overdueSubscribers: number;
  pendingSubscribers: number;
  monthlyRevenue: number;
}