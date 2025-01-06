import { Subscriber, SubscriberStats } from "../types/subscriber";
import { supabase } from "@/lib/supabase/client";

const PLAN_PRICES = {
  Basic: 30,
  Classic: 49.99,
  Business: 99.99
};

export async function calculateSubscriberStats(subscribers: Subscriber[]): Promise<SubscriberStats> {
  console.log('Calculating stats for subscribers:', subscribers);
  
  const stats = subscribers.reduce((acc, subscriber) => {
    console.log('Processing subscriber:', subscriber.name, 'Status:', subscriber.status, 'Plan:', subscriber.plan);
    
    let monthlyRevenue = 0;
    if (subscriber.status === 'pago') {
      monthlyRevenue = PLAN_PRICES[subscriber.plan] || 0;
      console.log(`Revenue from ${subscriber.name}: ${monthlyRevenue}€`);
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

  console.log('Final calculated stats:', stats);
  return stats;
}