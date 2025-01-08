import { useState } from 'react';
import { FilterState, Subscriber } from '../types/subscriber.types';

export function useSubscriberFilters() {
  const [filters, setFilters] = useState<FilterState>({
    name: '',
    phone: '',
    nif: '',
    plan: 'all',
    status: 'all',
    sortBy: 'name',
    sortOrder: 'asc',
  });

  const handleFilterChange = (field: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const filterSubscribers = (subscribers: Subscriber[]) => {
    return subscribers.filter((subscriber) => {
      const matchName = subscriber.name.toLowerCase().includes(filters.name.toLowerCase());
      const matchPhone = !filters.phone || (subscriber.phone && subscriber.phone.includes(filters.phone));
      const matchNif = !filters.nif || (subscriber.nif && subscriber.nif.includes(filters.nif));
      const matchPlan = filters.plan === 'all' || subscriber.plan === filters.plan;
      const matchStatus = filters.status === 'all' || subscriber.status === filters.status;

      return matchName && matchPhone && matchNif && matchPlan && matchStatus;
    });
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

  return {
    filters,
    handleFilterChange,
    filterSubscribers,
    sortSubscribers,
  };
}