import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Subscriber, SubscriberStats } from "../types";
import { calculateSubscriberStats } from "./useSubscriberStats";
import { toast } from "sonner";

interface UseSubscriberDataProps {
  planFilter?: "Basic" | "Classic" | "Business";
  statusFilter?: string;
}

export function useSubscriberData({ planFilter, statusFilter = 'all' }: UseSubscriberDataProps) {
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
          last_plan_change: member.last_plan_change
        }));

      setSubscribers(formattedSubscribers);
      const calculatedStats = await calculateSubscriberStats(formattedSubscribers);
      setStats(calculatedStats);
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      toast.error('Erro ao carregar assinantes');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, [planFilter, statusFilter]);

  // Set up real-time subscription
  useEffect(() => {
    console.log('Setting up real-time subscription for members table');
    const channel = supabase
      .channel('members-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'members'
        },
        async (payload) => {
          console.log('Real-time update received:', payload);
          await fetchSubscribers(); // Refresh the entire list
          
          // Show appropriate toast message based on the event
          switch (payload.eventType) {
            case 'INSERT':
              toast.success('Novo assinante adicionado');
              break;
            case 'UPDATE':
              toast.success('Assinante atualizado');
              break;
            case 'DELETE':
              toast.success('Assinante removido');
              break;
          }
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    return () => {
      console.log('Cleaning up real-time subscription');
      supabase.removeChannel(channel);
    };
  }, [planFilter, statusFilter]); // Re-subscribe when filters change

  return {
    subscribers,
    isLoading,
    stats,
    refetch: fetchSubscribers,
  };
}