import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Subscriber, SubscriberStats } from "../types";

interface PlanPrices {
  [key: string]: number;
}

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
      // Buscar preços atualizados dos planos
      const { data: plans } = await supabase.from('plans').select('title, price');
      const planPrices: PlanPrices = plans?.reduce((acc: PlanPrices, plan) => {
        acc[plan.title] = Number(plan.price);
        return acc;
      }, {}) || {};

      console.log('Preços dos planos:', planPrices);

      const calculatedStats = subscribers.reduce((acc, subscriber) => {
        let monthlyRevenue = 0;
        if (subscriber.status === 'pago' && subscriber.plan) {
          monthlyRevenue = planPrices[subscriber.plan] || 0;
          console.log(`Receita do assinante ${subscriber.name}:`, monthlyRevenue);
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

      console.log('Estatísticas calculadas:', calculatedStats);
      setStats(calculatedStats);
    };

    calculateStats();
  }, [subscribers]);

  return stats;
}