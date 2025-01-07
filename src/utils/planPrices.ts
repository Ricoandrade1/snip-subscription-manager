import { supabase } from "@/integrations/supabase/client";

export const getPlanPrices = async () => {
  const { data: plans, error } = await supabase
    .from('plans')
    .select('title, price');

  if (error) {
    console.error('Error fetching plan prices:', error);
    return {
      Basic: 30,
      Classic: 40,
      Business: 50
    };
  }

  return plans.reduce((acc: Record<string, number>, plan) => {
    acc[plan.title] = Number(plan.price);
    return acc;
  }, {});
};