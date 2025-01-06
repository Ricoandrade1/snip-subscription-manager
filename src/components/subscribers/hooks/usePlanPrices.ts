import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Plan {
  id: number;
  title: string;
  price: number;
}

export function usePlanPrices() {
  const { data: plans, isLoading } = useQuery({
    queryKey: ['plans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('plans')
        .select('id, title, price')
        .order('id');

      if (error) {
        console.error('Error fetching plans:', error);
        throw error;
      }

      return data as Plan[];
    },
  });

  const getPlanPrice = (planTitle: string): number => {
    const plan = plans?.find(p => p.title === planTitle);
    return plan?.price || 0;
  };

  return {
    plans,
    isLoading,
    getPlanPrice,
  };
}