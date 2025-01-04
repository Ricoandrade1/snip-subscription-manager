import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ykrhqjqwlzlhvzqvqksx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrcmhxanF3bHpsaHZ6cXZxa3N4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA2ODY5ODcsImV4cCI6MjAyNjI2Mjk4N30.vxjVPQCVjVj9EYwGgLiPNvuqVQHBqrZ0Kj0nuNt7QoY';

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