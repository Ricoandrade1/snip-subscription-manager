import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Tables = {
  plans: {
    id: string;
    title: string;
    price: number;
    features: string[];
    created_at: string;
  };
  members: {
    id: string;
    name: string;
    nickname: string | null;
    phone: string;
    nif: string | null;
    birth_date: string;
    passport: string | null;
    citizen_card: string | null;
    bi: string | null;
    bank: string;
    iban: string;
    debit_date: string;
    plan_id: string;
    created_at: string;
  };
  payments: {
    id: string;
    member_id: string;
    amount: number;
    status: 'paid' | 'pending' | 'overdue';
    payment_date: string;
    receipt_url: string | null;
    created_at: string;
  };
  visits: {
    id: string;
    member_id: string;
    service: string;
    barber: string;
    visit_date: string;
    created_at: string;
  };
};