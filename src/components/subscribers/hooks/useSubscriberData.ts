import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Subscriber, SubscriberStatus } from "../types/subscriber";
import { toast } from "sonner";

const normalizeStatus = (status: string): SubscriberStatus => {
  switch (status.toLowerCase()) {
    case 'pago':
    case 'active':
      return 'pago';
    case 'cancelado':
    case 'inactive':
      return 'cancelado';
    case 'pendente':
    case 'pending':
      return 'pendente';
    default:
      return 'pendente';
  }
};

export function useSubscriberData(planFilter?: "Basic" | "Classic" | "Business") {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSubscribers = async () => {
    try {
      setIsLoading(true);
      let query = supabase
        .from('members')
        .select(`
          *,
          plans (
            id,
            title,
            price
          )
        `);

      if (planFilter) {
        query = query.eq('plans.title', planFilter);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      console.log('Dados brutos dos assinantes:', data);

      const formattedSubscribers: Subscriber[] = data
        .filter(member => member.plans)
        .map(member => ({
          id: member.id,
          name: member.name,
          nickname: member.nickname,
          phone: member.phone,
          nif: member.nif,
          plan: member.plans?.title as "Basic" | "Classic" | "Business",
          plan_id: member.plan_id,
          created_at: member.created_at,
          payment_date: member.payment_date,
          status: normalizeStatus(member.status),
          bank_name: member.bank_name,
          iban: member.iban,
          due_date: member.due_date,
          last_plan_change: member.last_plan_change
        }));

      console.log('Assinantes formatados:', formattedSubscribers);
      setSubscribers(formattedSubscribers);
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      toast.error('Erro ao carregar assinantes');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, [planFilter]);

  return {
    subscribers,
    isLoading,
    refetch: fetchSubscribers
  };
}