export type SubscriberStatus = 'active' | 'overdue' | 'cancelled';

export interface Subscriber {
  id: string;
  name: string;
  nickname: string | null;
  phone: string | null;
  nif: string | null;
  plan: "Basic" | "Classic" | "Business";
  plan_id: number | null;
  status: SubscriberStatus;
  created_at?: string;
  payment_date?: string | null;
}

export interface FilterState {
  name: string;
  phone: string;
  nif: string;
  status: SubscriberStatus | 'all';
}