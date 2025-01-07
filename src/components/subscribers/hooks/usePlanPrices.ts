import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function usePlanPrices() {
  const [planPrices, setPlanPrices] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchPlanPrices = async () => {
      console.log('Buscando preços dos planos do banco de dados...');
      
      const { data: plans, error } = await supabase
        .from('plans')
        .select('title, price');

      if (error) {
        console.error('Erro ao buscar preços dos planos:', error);
        return;
      }

      console.log('Dados dos planos retornados:', plans);

      const prices = plans.reduce((acc: Record<string, number>, plan) => {
        acc[plan.title] = Number(plan.price);
        return acc;
      }, {});

      console.log('Preços dos planos processados:', prices);
      setPlanPrices(prices);
    };

    fetchPlanPrices();
  }, []);

  return planPrices;
}