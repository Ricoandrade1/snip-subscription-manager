import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Subscriber, FilterState } from "./types";
import { toast } from "sonner";

interface UseSubscribersProps {
  planFilter?: "Basic" | "Classic" | "Business";
  statusFilter?: string;
}

interface SubscriberStats {
  totalSubscribers: number;
  activeSubscribers: number;
  overdueSubscribers: number;
  monthlyRevenue: number;
}

export function useSubscribers({ planFilter, statusFilter = 'all' }: UseSubscribersProps) {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<SubscriberStats>({
    totalSubscribers: 0,
    activeSubscribers: 0,
    overdueSubscribers: 0,
    monthlyRevenue: 0,
  });
  const [filters, setFilters] = useState<FilterState>({
    name: "",
    phone: "",
    nif: "",
    status: "all",
    plan: "all",
  });

  useEffect(() => {
    fetchSubscribers();
  }, [planFilter, statusFilter]);

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
          status: member.status as 'pago' | 'atrasado' | 'cancelado',
          created_at: member.created_at,
          payment_date: member.payment_date,
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
    const stats = subscribersList.reduce((acc, subscriber) => ({
      totalSubscribers: acc.totalSubscribers + 1,
      activeSubscribers: acc.activeSubscribers + (subscriber.status === 'pago' ? 1 : 0),
      overdueSubscribers: acc.overdueSubscribers + (subscriber.status === 'atrasado' ? 1 : 0),
      monthlyRevenue: acc.monthlyRevenue + (subscriber.status === 'pago' ? 50 : 0), // Assuming fixed price of 50
    }), {
      totalSubscribers: 0,
      activeSubscribers: 0,
      overdueSubscribers: 0,
      monthlyRevenue: 0,
    });

    setStats(stats);
  };

  const handleFilterChange = (field: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const filteredSubscribers = subscribers.filter((subscriber) => {
    const matchName = subscriber.name.toLowerCase().includes(filters.name.toLowerCase());
    const matchPhone = !filters.phone || (subscriber.phone && subscriber.phone.toLowerCase().includes(filters.phone.toLowerCase()));
    const matchNif = !filters.nif || (subscriber.nif && subscriber.nif.toLowerCase().includes(filters.nif.toLowerCase()));
    const matchPlan = filters.plan === 'all' || subscriber.plan === filters.plan;
    
    let matchStatus = true;
    if (statusFilter !== 'all') {
      switch (statusFilter) {
        case 'active':
          matchStatus = subscriber.status === 'pago';
          break;
        case 'overdue':
          matchStatus = subscriber.status === 'atrasado';
          break;
        case 'total':
          matchStatus = true;
          break;
        case 'revenue':
          matchStatus = subscriber.status === 'pago';
          break;
        default:
          matchStatus = true;
      }
    }

    return matchName && matchPhone && matchNif && matchStatus && matchPlan;
  });

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