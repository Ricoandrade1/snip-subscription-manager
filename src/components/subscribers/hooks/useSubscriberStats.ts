import { Subscriber, SubscriberStats } from "../types/subscriber";
import { getPlanPrices } from "@/utils/planPrices";

export async function calculateSubscriberStats(subscribers: Subscriber[]): Promise<SubscriberStats> {
  console.log('Calculando estatísticas para', subscribers.length, 'assinantes');
  
  const planPrices = await getPlanPrices();
  
  return subscribers.reduce((acc, subscriber) => {
    console.log('-------------------');
    console.log('Processando assinante:', subscriber.name);
    console.log('Status:', subscriber.status);
    console.log('Plano:', subscriber.plan);
    
    let monthlyRevenue = 0;
    if (subscriber.status === 'pago') {
      monthlyRevenue = planPrices[subscriber.plan] || 0;
      console.log('Receita do plano:', monthlyRevenue, '€');
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
}