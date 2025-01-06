import { Subscriber, FilterState } from "../types/subscriber";

export function sortSubscribers(subscribers: Subscriber[], filters: FilterState): Subscriber[] {
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
}