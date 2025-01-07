import { useState, useEffect } from "react";
import { Subscriber, SubscriberStats } from "../types/subscriber";
import { usePlanPricesFixed } from "./usePlanPricesFixed";

export function useSubscriberStats(subscribers: Subscriber[]) {
  const [stats, setStats] = useState<SubscriberStats>({
    totalSubscribers: 0,
    activeSubscribers: 0,
    overdueSubscribers: 0,
    pendingSubscribers: 0,
    monthlyRevenue: 0,
  });

  const planPrices = usePlanPricesFixed();

  useEffect(() => {
    console.log('-------------------');
    console.log('Calculando estatísticas com preços fixos:', planPrices);
    console.log('Total de assinantes:', subscribers.length);
    
    const calculatedStats = subscribers.reduce((acc, subscriber) => {
      console.log('-------------------');
      console.log('Processando assinante:', subscriber.name);
      console.log('Status:', subscriber.status);
      console.log('Plano:', subscriber.plan);
      
      let monthlyRevenue = 0;
      if (subscriber.status === 'pago') {
        monthlyRevenue = Math.round(planPrices[subscriber.plan]); // Arredonda para garantir números inteiros
        console.log('Receita do plano:', monthlyRevenue, '€');
        console.log('Receita acumulada:', acc.monthlyRevenue + monthlyRevenue, '€');
      }
      
      return {
        totalSubscribers: acc.totalSubscribers + 1,
        activeSubscribers: acc.activeSubscribers + (subscriber.status === 'pago' ? 1 : 0),
        overdueSubscribers: acc.overdueSubscribers + (subscriber.status === 'cancelado' ? 1 : 0),
        pendingSubscribers: acc.pendingSubscribers + (subscriber.status === 'pendente' ? 1 : 0),
        monthlyRevenue: Math.round(acc.monthlyRevenue + monthlyRevenue), // Arredonda o total também
      };
    }, {
      totalSubscribers: 0,
      activeSubscribers: 0,
      overdueSubscribers: 0,
      pendingSubscribers: 0,
      monthlyRevenue: 0,
    });

    console.log('-------------------');
    console.log('Estatísticas finais:');
    console.log('Total de assinantes:', calculatedStats.totalSubscribers);
    console.log('Assinantes ativos:', calculatedStats.activeSubscribers);
    console.log('Receita mensal total:', calculatedStats.monthlyRevenue, '€');
    
    setStats(calculatedStats);
  }, [subscribers, planPrices]);

  return stats;
}