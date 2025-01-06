import { Subscriber, SubscriberStats } from "./subscriber";

export interface UseSubscribersProps {
  planFilter?: "Basic" | "Classic" | "Business";
  statusFilter?: string;
}

export interface UseSubscribersFiltersResult {
  filters: FilterState;
  handleFilterChange: (field: keyof FilterState, value: string) => void;
}

export interface UseSubscribersStatsProps {
  subscribers: Subscriber[];
  stats: SubscriberStats;
  setStats: (stats: SubscriberStats) => void;
}

// Re-export FilterState from subscriber.ts
export type { FilterState } from "./subscriber";