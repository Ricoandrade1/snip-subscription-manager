import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Subscriber, SubscriberStatus, FilterState } from "../types";
import { toast } from "sonner";
import { useSubscriberStats } from "./useSubscriberStats";

interface UseSubscribersProps {
  planFilter?: "Basic" | "Classic" | "Business";
  statusFilter?: string;
}

export function useSubscribers({ planFilter, statusFilter = 'all' }: UseSubscribersProps) {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    name: "",
    phone: "",
    nif: "",
    plan: "all",
    status: "all",
    sortBy: "name",
    sortOrder: "asc",
  });

  const stats = useSubscriberStats(subscribers);

  useEffect(() => {
    fetchSubscribers();
  }, [planFilter, statusFilter]);

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
          status: normalizeStatus(member.status),
          bank_name: member.bank_name,
          iban: member.iban,
          due_date: member.due_date,
          last_plan_change: member.last_plan_change
        }));

      setSubscribers(formattedSubscribers);
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      toast.error('Erro ao carregar assinantes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (field: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const sortSubscribers = (subscribers: Subscriber[]) => {
    return [...subscribers].sort((a, b) => {
      const sortOrder = filters.sortOrder === 'asc' ? 1 : -1;
      
      switch (filters.sortBy) {
        case 'name':
          return sortOrder * a.name.localeCompare(b.name);
        case 'payment_date':
          if (!a.payment_date && !b.payment_date) return 0;
          if (!a.payment_date) return sortOrder;
          if (!b.payment_date) return -sortOrder;
          return sortOrder * (new Date(a.payment_date).getTime() - new Date(b.payment_date).getTime());
        case 'plan':
          return sortOrder * a.plan.localeCompare(b.plan);
        default:
          return 0;
      }
    });
  };

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
    })
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