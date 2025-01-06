export type SubscriberStatus = "pago" | "cancelado" | "pendente";

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

export interface SubscriberStats {
  totalSubscribers: number;
  activeSubscribers: number;
  overdueSubscribers: number;
  monthlyRevenue: number;
}

export interface FilterState {
  name: string;
  phone: string;
  nif: string;
  status: string;
  plan: string;
  sortBy: "name" | "payment_date" | "plan";
  sortOrder: "asc" | "desc";
}