import { useState, useEffect } from "react";
import { Subscriber, SubscriberStats } from "../types/subscriber";
import { usePlanPrices } from "./usePlanPrices";

export function useSubscriberStats(subscribers: Subscriber[]) {
  const [stats, setStats] = useState<SubscriberStats>({
    totalSubscribers: 0,
    activeSubscribers: 0,
    overdueSubscribers: 0,
    pendingSubscribers: 0,
    monthlyRevenue: 0,
  });

  const planPrices = usePlanPrices();

  useEffect(() => {
    if (!Object.keys(planPrices).length) {
      console.log('Aguardando preços dos planos...');
      return;
    }

    console.log('Calculando estatísticas com preços:', planPrices);
    console.log('Total de assinantes:', subscribers.length);
    
    let totalRevenue = 0;
    const calculatedStats = subscribers.reduce((acc, subscriber) => {
      console.log('-------------------');
      console.log('Processando assinante:', subscriber.name);
      console.log('Status:', subscriber.status);
      console.log('Plano:', subscriber.plan);
      
      let monthlyRevenue = 0;
      if (subscriber.status === 'pago' && planPrices[subscriber.plan]) {
        monthlyRevenue = Number(planPrices[subscriber.plan]);
        totalRevenue += monthlyRevenue;
        console.log('Preço do plano:', monthlyRevenue, '€');
      }
      
      return {
        totalSubscribers: acc.totalSubscribers + 1,
        activeSubscribers: acc.activeSubscribers + (subscriber.status === 'pago' ? 1 : 0),
        overdueSubscribers: acc.overdueSubscribers + (subscriber.status === 'cancelado' ? 1 : 0),
        pendingSubscribers: acc.pendingSubscribers + (subscriber.status === 'pendente' ? 1 : 0),
        monthlyRevenue: totalRevenue,
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