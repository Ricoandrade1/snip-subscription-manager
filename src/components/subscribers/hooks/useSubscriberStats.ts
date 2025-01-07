import { useState } from "react";
import { Subscriber, SubscriberStats } from "../types";

export function useSubscriberStats(subscribers: Subscriber[]) {
  const [stats] = useState<SubscriberStats>({
    totalSubscribers: subscribers.length,
    activeSubscribers: 0,
    overdueSubscribers: 0,
    pendingSubscribers: 0,
    monthlyRevenue: 0,
  });

  return stats;
}