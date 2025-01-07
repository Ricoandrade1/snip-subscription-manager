import { useState, useEffect } from "react";
import { Subscriber, SubscriberStats } from "../types/subscriber";
import { supabase } from "@/integrations/supabase/client";

export function useSubscriberStats(subscribers: Subscriber[]) {
  const [stats, setStats] = useState<SubscriberStats>({
    totalSubscribers: 0,
    activeSubscribers: 0,
    overdueSubscribers: 0,
    pendingSubscribers: 0,
    monthlyRevenue: 0,
  });

  useEffect(() => {
    const calculateStats = async () => {
      // Buscar preços dos planos do banco de dados
      const { data: plans, error } = await supabase
        .from('plans')
        .select('title, price');

      if (error) {
        console.error('Erro ao buscar preços dos planos:', error);
        return;
      }

      const planPrices = plans.reduce((acc: Record<string, number>, plan) => {
        acc[plan.title] = Number(plan.price);
        return acc;
      }, {});

      console.log('-------------------');
      console.log('Calculando estatísticas com preços do banco:', planPrices);
      console.log('Total de assinantes:', subscribers.length);
      
      const calculatedStats = subscribers.reduce((acc, subscriber) => {
        console.log('-------------------');
        console.log('Processando assinante:', subscriber.name);
        console.log('Status:', subscriber.status);
        console.log('Plano:', subscriber.plan);
        console.log('Preço do plano:', planPrices[subscriber.plan], '€');
        
        let monthlyRevenue = 0;
        if (subscriber.status === 'pago') {
          monthlyRevenue = planPrices[subscriber.plan] || 0;
          console.log('Receita do plano:', monthlyRevenue, '€');
          console.log('Receita acumulada:', acc.monthlyRevenue + monthlyRevenue, '€');
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

      console.log('-------------------');
      console.log('Estatísticas finais:');
      console.log('Total de assinantes:', calculatedStats.totalSubscribers);
      console.log('Assinantes ativos:', calculatedStats.activeSubscribers);
      console.log('Receita mensal total:', calculatedStats.monthlyRevenue, '€');
      
      setStats(calculatedStats);
    };

    calculateStats();
  }, [subscribers]);

  return stats;
}