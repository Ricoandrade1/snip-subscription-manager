import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Subscriber, SubscriberStats } from "../types";
import { toast } from "sonner";

interface PlanPrices {
  [key: string]: number;
}

async function fetchPlanPrices(): Promise<PlanPrices> {
  const { data: plans, error } = await supabase
    .from('plans')
    .select('title, price');

  if (error) {
    console.error('Erro ao buscar preços dos planos:', error);
    return {
      Basic: 29.99,
      Classic: 49.99,
      Business: 99.99
    };
  }

  return plans.reduce((acc: PlanPrices, plan) => {
    acc[plan.title] = Number(plan.price);
    return acc;
  }, {});
}

export async function calculateSubscriberStats(subscribers: Subscriber[]): Promise<SubscriberStats> {
  console.log('Calculando estatísticas para', subscribers.length, 'assinantes');
  
  const planPrices = await fetchPlanPrices();
  
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