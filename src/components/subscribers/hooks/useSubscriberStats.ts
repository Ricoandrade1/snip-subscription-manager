import { Subscriber, SubscriberStats } from "../types/subscriber";
import { usePlanPrices } from "./usePlanPrices";

export function useSubscriberStats(subscribers: Subscriber[]) {
  const { getPlanPrice } = usePlanPrices();
  
  const calculateStats = (subscribersList: Subscriber[]): SubscriberStats => {
    console.log('Calculando estatísticas para', subscribersList.length, 'assinantes');
    
    return subscribersList.reduce((acc, subscriber) => {
      console.log('-------------------');
      console.log('Processando assinante:', subscriber.name);
      console.log('Status:', subscriber.status);
      console.log('Plano:', subscriber.plan);
      
      let monthlyRevenue = 0;
      if (subscriber.status === 'pago') {
        // Round to 2 decimal places to avoid floating point precision issues
        monthlyRevenue = Math.round(getPlanPrice(subscriber.plan) * 100) / 100;
        console.log('Receita do plano:', monthlyRevenue, '€');
      }
      
      const newStats = {
        totalSubscribers: acc.totalSubscribers + 1,
        activeSubscribers: acc.activeSubscribers + (subscriber.status === 'pago' ? 1 : 0),
        overdueSubscribers: acc.overdueSubscribers + (subscriber.status === 'cancelado' ? 1 : 0),
        pendingSubscribers: acc.pendingSubscribers + (subscriber.status === 'pendente' ? 1 : 0),
        // Round the accumulated sum to 2 decimal places
        monthlyRevenue: Math.round((acc.monthlyRevenue + monthlyRevenue) * 100) / 100,
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
  };

  return {
    calculateStats,
  };
}