import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Payment } from "@/contexts/types";
import { toast } from "sonner";

interface PaymentWithRelations {
  id: string;
  amount: number;
  status: string;
  payment_date: string;
  receipt_url: string | null;
  created_at: string | null;
  member_id: string | null;
  member: {
    name: string;
    plan: {
      title: string;
    } | null;
  } | null;
}

export function usePayments() {
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    const channel = supabase
      .channel('payments-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'payments'
        },
        (payload) => {
          console.log('Payment change received:', payload);
          fetchPayments();
        }
      )
      .subscribe();

    fetchPayments();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchPayments = async () => {
    const { data: paymentsData, error } = await supabase
      .from('payments')
      .select(`
        *,
        member:members (
          name,
          plan:plans (
            title
          )
        )
      `);

    if (error) {
      console.error('Error fetching payments:', error);
      toast.error('Erro ao carregar pagamentos');
      return;
    }

    const formattedPayments: Payment[] = (paymentsData as PaymentWithRelations[] || []).map(payment => ({
      id: payment.id,
      memberName: payment.member?.name || '',
      plan: (payment.member?.plan?.title as "Basic" | "Classic" | "Business") || "Basic",
      amount: payment.amount,
      date: payment.payment_date,
      status: payment.status as "paid" | "pending" | "overdue",
      member_id: payment.member_id,
      receipt_url: payment.receipt_url,
      created_at: payment.created_at,
      payment_date: payment.payment_date
    }));

    setPayments(formattedPayments);
  };

  return { payments };
}