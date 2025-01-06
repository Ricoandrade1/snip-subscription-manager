import { FilterState, Subscriber, SubscriberStats } from "./subscriber";

export interface UseSubscribersProps {
  planFilter?: "Basic" | "Classic" | "Business";
  statusFilter?: string;
}

export interface UseSubscribersFiltersProps {
  filters: FilterState;
  handleFilterChange: (field: keyof FilterState, value: string) => void;
}

export interface UseSubscribersStatsProps {
  subscribers: Subscriber[];
  stats: SubscriberStats;
  setStats: (stats: SubscriberStats) => void;
}