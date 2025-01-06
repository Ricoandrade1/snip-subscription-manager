import { supabase } from "@/lib/supabase/client";

export interface Plan {
  id: number;
  title: string;
  price: number;
  features: string[];
}

export async function fetchPlanPrices(): Promise<Record<string, number>> {
  const { data: plans, error } = await supabase
    .from('plans')
    .select('title, price');

  if (error) {
    console.error('Error fetching plan prices:', error);
    throw error;
  }

  return plans.reduce((acc: Record<string, number>, plan) => {
    acc[plan.title] = Number(plan.price);
    return acc;
  }, {});
}

export async function fetchPlans(): Promise<Plan[]> {
  const { data: plans, error } = await supabase
    .from('plans')
    .select('*');

  if (error) {
    console.error('Error fetching plans:', error);
    throw error;
  }

  return plans;
}