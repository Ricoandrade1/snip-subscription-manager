import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Subscriber, FilterState } from "./types";
import { toast } from "sonner";

interface UseSubscribersProps {
  planFilter?: "Basic" | "Classic" | "Business";
}

export function useSubscribers({ planFilter }: UseSubscribersProps) {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    name: "",
    phone: "",
    nif: "",
    status: "all",
  });

  useEffect(() => {
    fetchSubscribers();
  }, [planFilter]);

  const fetchSubscribers = async () => {
    try {
      setIsLoading(true);
      let query = supabase
        .from('members')
        .select(`
          *,
          plans (
            id,
            title
          )
        `);

      if (planFilter) {
        query = query.eq('plans.title', planFilter);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      const formattedSubscribers: Subscriber[] = data.map(member => ({
        id: member.id,
        name: member.name,
        nickname: member.nickname,
        phone: member.phone,
        nif: member.nif,
        plan: member.plans.title as "Basic" | "Classic" | "Business",
        plan_id: member.plan_id,
        status: member.status as 'active' | 'overdue' | 'cancelled',
        created_at: member.created_at,
        payment_date: member.payment_date,
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

  const filteredSubscribers = subscribers.filter((subscriber) => {
    const matchName = subscriber.name.toLowerCase().includes(filters.name.toLowerCase());
    const matchPhone = !filters.phone || (subscriber.phone && subscriber.phone.toLowerCase().includes(filters.phone.toLowerCase()));
    const matchNif = !filters.nif || (subscriber.nif && subscriber.nif.toLowerCase().includes(filters.nif.toLowerCase()));
    const matchStatus = filters.status === 'all' || subscriber.status === filters.status;

    return matchName && matchPhone && matchNif && matchStatus;
  });

  return {
    subscribers,
    isLoading,
    filters,
    handleFilterChange,
    filteredSubscribers,
    refetch: fetchSubscribers,
  };
}