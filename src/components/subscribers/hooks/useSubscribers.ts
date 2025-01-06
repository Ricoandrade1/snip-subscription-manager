import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Subscriber, SubscriberStats } from "../types/subscriber";
import { UseSubscribersProps } from "../types/subscriber-hooks";
import { useSubscribersFilters } from "./useSubscribersFilters";
import { calculateSubscriberStats } from "./useSubscribersStats";
import { sortSubscribers } from "../utils/sortSubscribers";
import { toast } from "sonner";

export function useSubscribers({ planFilter, statusFilter = 'all' }: UseSubscribersProps) {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<SubscriberStats>({
    totalSubscribers: 0,
    activeSubscribers: 0,
    overdueSubscribers: 0,
    pendingSubscribers: 0,
    monthlyRevenue: 0,
  });
  
  const { filters, handleFilterChange } = useSubscribersFilters();

  const fetchSubscribers = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching subscribers...');
      
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

      console.log('Raw data from database:', data);

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
          last_plan_change: member.last_plan_change
        }));

      console.log('Formatted subscribers:', formattedSubscribers);
      setSubscribers(formattedSubscribers);
      
      const calculatedStats = await calculateSubscriberStats(formattedSubscribers);
      console.log('Calculated stats:', calculatedStats);
      setStats(calculatedStats);
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      toast.error('Erro ao carregar assinantes');
    } finally {
      setIsLoading(false);
    }
  };

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('members-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'members'
        },
        (payload) => {
          console.log('Real-time update received:', payload);
          fetchSubscribers(); // Refresh the list when changes occur
        }
      )
      .subscribe();

    // Initial fetch
    fetchSubscribers();

    // Cleanup subscription
    return () => {
      supabase.removeChannel(channel);
    };
  }, [planFilter, statusFilter]);

  const filteredSubscribers = sortSubscribers(
    subscribers.filter((subscriber) => {
      const matchName = subscriber.name.toLowerCase().includes(filters.name.toLowerCase());
      const matchPhone = !filters.phone || (subscriber.phone && subscriber.phone.toLowerCase().includes(filters.phone.toLowerCase()));
      const matchNif = !filters.nif || (subscriber.nif && subscriber.nif.toLowerCase().includes(filters.nif.toLowerCase()));
      const matchPlan = filters.plan === 'all' || subscriber.plan === filters.plan;
      const matchStatus = filters.status === 'all' || subscriber.status === filters.status;

      let matchStatusFilter = true;
      if (statusFilter !== 'all') {
        switch (statusFilter) {
          case 'active':
            matchStatusFilter = subscriber.status === 'pago';
            break;
          case 'pending':
            matchStatusFilter = subscriber.status === 'pendente';
            break;
          case 'overdue':
            matchStatusFilter = subscriber.status === 'cancelado';
            break;
          case 'total':
            matchStatusFilter = true;
            break;
          case 'revenue':
            matchStatusFilter = subscriber.status === 'pago';
            break;
          default:
            matchStatusFilter = true;
        }
      }

      return matchName && matchPhone && matchNif && matchPlan && matchStatus && matchStatusFilter;
    }),
    filters
  );

  return {
    subscribers,
    isLoading,
    filters,
    handleFilterChange,
    filteredSubscribers,
    stats,
    refetch: fetchSubscribers,
  };
}