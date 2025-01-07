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

      console.log('=== INÍCIO DO CÁLCULO DE RECEITA ===');
      console.log('Preços dos planos no banco:', planPrices);
      console.log('Número total de assinantes:', subscribers.length);
      
      let totalRevenue = 0;
      const calculatedStats = subscribers.reduce((acc, subscriber, index) => {
        console.log(`\n--- Assinante ${index + 1} ---`);
        console.log('Nome:', subscriber.name);
        console.log('Status:', subscriber.status);
        console.log('Plano:', subscriber.plan);
        
        let monthlyRevenue = 0;
        if (subscriber.status === 'pago') {
          const planPrice = planPrices[subscriber.plan];
          console.log('Preço do plano (bruto):', planPrice);
          monthlyRevenue = Number(planPrice) || 0;
          totalRevenue += monthlyRevenue;
          console.log('Preço do plano (convertido):', monthlyRevenue);
          console.log('Receita acumulada até agora:', totalRevenue);
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

      console.log('\n=== RESUMO FINAL ===');
      console.log('Total de assinantes:', calculatedStats.totalSubscribers);
      console.log('Assinantes ativos:', calculatedStats.activeSubscribers);
      console.log('Receita mensal total:', calculatedStats.monthlyRevenue, '€');
      console.log('========================');
      
      setStats(calculatedStats);
    };

    calculateStats();
  }, [subscribers]);

  return stats;
}