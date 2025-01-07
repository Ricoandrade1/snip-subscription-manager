import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function usePlanPrices() {
  const [planPrices, setPlanPrices] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchPlanPrices = async () => {
      console.log('Buscando preços dos planos...');
      
      const { data: plans, error } = await supabase
        .from('plans')
        .select('title, price');

      if (error) {
        console.error('Erro ao buscar preços dos planos:', error);
        return;
      }

      const prices = plans.reduce((acc: Record<string, number>, plan) => {
        acc[plan.title] = Number(plan.price);
        return acc;
      }, {});

      console.log('Preços dos planos obtidos:', prices);
      setPlanPrices(prices);
    };

    fetchPlanPrices();
  }, []);

  return planPrices;
}