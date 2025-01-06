import { supabase } from "@/integrations/supabase/client";

interface PlanPrices {
  [key: string]: number;
}

export async function fetchPlanPrices(): Promise<PlanPrices> {
  const { data: plans, error } = await supabase
    .from('plans')
    .select('title, price');

  if (error) {
    console.error('Erro ao buscar preços dos planos:', error);
    throw error;
  }

  return plans.reduce((acc: PlanPrices, plan) => {
    acc[plan.title] = Number(plan.price);
    return acc;
  }, {});
}