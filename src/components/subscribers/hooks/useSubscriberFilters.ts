import { useState } from "react";
import { Subscriber, FilterState } from "../types";

export function useSubscriberFilters(subscribers: Subscriber[], statusFilter: string = 'all') {
  const [filters, setFilters] = useState<FilterState>({
    name: "",
    phone: "",
    nif: "",
    plan: "all",
    status: "all",
    sortBy: "name",
    sortOrder: "asc",
  });

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
    filters,
    handleFilterChange,
    filteredSubscribers,
  };
}