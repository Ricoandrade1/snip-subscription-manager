import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Subscriber, SubscriberStats } from '../types/subscriber.types';
import { toast } from 'sonner';

const PLAN_PRICES = {
  Basic: 30,
  Classic: 40,
  Business: 50
};

export function useSubscriberData() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<SubscriberStats>({
    totalSubscribers: 0,
    activeSubscribers: 0,
    overdueSubscribers: 0,
    pendingSubscribers: 0,
    monthlyRevenue: 0,
  });

  const calculateStats = (subscribersList: Subscriber[]) => {
    const stats = subscribersList.reduce((acc, subscriber) => {
      let monthlyRevenue = 0;
      if (subscriber.status === 'pago') {
        monthlyRevenue = PLAN_PRICES[subscriber.plan];
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

    setStats(stats);
  };

  const fetchSubscribers = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('members')
        .select(`
          *,
          plans (
            id,
            title,
            price
          )
        `);

      if (error) throw error;

      const formattedSubscribers = data
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
          status: member.status,
          bank_name: member.bank_name,
          iban: member.iban,
          due_date: member.due_date,
          last_plan_change: member.last_plan_change
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

  useEffect(() => {
    fetchSubscribers();
  }, []);

  return {
    subscribers,
    isLoading,
    stats,
    refetch: fetchSubscribers,
  };
}