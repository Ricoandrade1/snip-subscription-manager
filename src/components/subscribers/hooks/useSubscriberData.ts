import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Subscriber, SubscriberStats } from "../types/subscriber";
import { toast } from "sonner";

export function useSubscriberData(planFilter?: "Basic" | "Classic" | "Business") {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<SubscriberStats>({
    totalSubscribers: 0,
    activeSubscribers: 0,
    overdueSubscribers: 0,
    pendingSubscribers: 0,
    monthlyRevenue: 0,
  });

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
          status: member.status as "pago" | "cancelado" | "pendente",
          bank_name: member.bank_name,
          iban: member.iban,
          due_date: member.due_date,
          last_plan_change: member.last_plan_change,
          price: member.plans?.price || 0
        }));

      setSubscribers(formattedSubscribers);
      calculateStats(formattedSubscribers);
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      toast.error('Erro ao carregar assinantes');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (subscribersList: Subscriber[]) => {
    const stats = subscribersList.reduce((acc, subscriber) => {
      // Calcula a receita mensal apenas para assinantes com status "pago"
      const monthlyRevenue = subscriber.status === 'pago' ? subscriber.price : 0;
      
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

    setStats(stats);
  };

  useEffect(() => {
    fetchSubscribers();
  }, [planFilter]);

  return {
    subscribers,
    isLoading,
    stats,
    refetch: fetchSubscribers,
  };
}