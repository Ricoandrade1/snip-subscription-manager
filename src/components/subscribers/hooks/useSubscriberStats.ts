import { Subscriber, SubscriberStats } from "../types/subscriber";
import { PLAN_PRICES } from "../utils/planPrices";

export function calculateSubscriberStats(subscribers: Subscriber[]): SubscriberStats {
  console.log('Calculando estatísticas para', subscribers.length, 'assinantes');
  
  return subscribers.reduce((acc, subscriber) => {
    console.log('-------------------');
    console.log('Processando assinante:', subscriber.name);
    console.log('Status:', subscriber.status);
    console.log('Plano:', subscriber.plan);
    
    let monthlyRevenue = 0;
    if (subscriber.status === 'pago') {
      monthlyRevenue = PLAN_PRICES[subscriber.plan] || 0;
      console.log('Receita do plano:', monthlyRevenue, '€');
    }
    
    const newStats = {
      totalSubscribers: acc.totalSubscribers + 1,
      activeSubscribers: acc.activeSubscribers + (subscriber.status === 'pago' ? 1 : 0),
      overdueSubscribers: acc.overdueSubscribers + (subscriber.status === 'cancelado' ? 1 : 0),
      pendingSubscribers: acc.pendingSubscribers + (subscriber.status === 'pendente' ? 1 : 0),
      monthlyRevenue: acc.monthlyRevenue + monthlyRevenue,
    };
    
    console.log('Receita mensal acumulada:', newStats.monthlyRevenue, '€');
    return newStats;
  }, {
    totalSubscribers: 0,
    activeSubscribers: 0,
    overdueSubscribers: 0,
    pendingSubscribers: 0,
    monthlyRevenue: 0,
  });
}