export type SubscriberStatus = 'pago' | 'cancelado' | 'pendente';

export interface Subscriber {
  id: string;
  name: string;
  nickname: string | null;
  phone: string | null;
  nif: string | null;
  plan: "Basic" | "Classic" | "Business";
  plan_id: number | null;
  created_at: string;
  payment_date: string | null;
  status: SubscriberStatus;
  bank_name: string | null;
  iban: string | null;
  due_date: string | null;
  last_plan_change: string | null;
}

export interface SubscriberStats {
  totalSubscribers: number;
  activeSubscribers: number;
  overdueSubscribers: number;
  pendingSubscribers: number;
  monthlyRevenue: number;
}

export interface FilterState {
  name: string;
  phone: string;
  nif: string;
  plan: string;
  status: string;
  sortBy: 'name' | 'payment_date' | 'plan';
  sortOrder: 'asc' | 'desc';
}