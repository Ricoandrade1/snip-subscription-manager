import { Subscriber, SubscriberStats } from "../types/subscriber";
import { supabase } from "@/lib/supabase/client";

interface PlanPrices {
  [key: string]: number;
}

async function fetchPlanPrices(): Promise<PlanPrices> {
  const { data, error } = await supabase
    .from('plans')
    .select('title, price');

  if (error) {
    console.error('Error fetching plan prices:', error);
    return {};
  }

  return data.reduce((acc: PlanPrices, plan) => {
    acc[plan.title] = Number(plan.price);
    return acc;
  }, {});
}

export async function calculateSubscriberStats(subscribers: Subscriber[]): Promise<SubscriberStats> {
  console.log('Calculando estatísticas para', subscribers.length, 'assinantes');
  
  const planPrices = await fetchPlanPrices();
  console.log('Preços dos planos:', planPrices);
  
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