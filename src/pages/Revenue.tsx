import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PaymentHistoryTable } from "@/components/PaymentHistoryTable";
import { useMemberContext } from "@/contexts/MemberContext";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Payment } from "@/contexts/types";

export default function Revenue() {
  const { members } = useMemberContext();
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
          
          if (payload.eventType === 'INSERT') {
            setPayments(current => [...current, payload.new as Payment]);
            toast.success('Novo pagamento registrado');
          }
          
          if (payload.eventType === 'UPDATE') {
            setPayments(current => 
              current.map(payment => 
                payment.id === payload.new.id ? payload.new as Payment : payment
              )
            );
            toast.success('Pagamento atualizado');
          }
          
          if (payload.eventType === 'DELETE') {
            setPayments(current => 
              current.filter(payment => payment.id !== payload.old.id)
            );
            toast.success('Pagamento removido');
          }
        }
      )
      .subscribe();

    fetchPayments();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchPayments = async () => {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Erro ao carregar pagamentos');
      return;
    }

    setPayments(data || []);
  };

  const getPaymentsByPlan = () => {
    const planPayments: Record<string, Payment> = {
      Basic: { 
        id: 'basic-summary',
        memberName: "Basic",
        plan: "Basic",
        amount: 0,
        date: new Date().toISOString(),
        status: "paid"
      },
      Classic: {
        id: 'classic-summary',
        memberName: "Classic",
        plan: "Classic",
        amount: 0,
        date: new Date().toISOString(),
        status: "paid"
      },
      Business: {
        id: 'business-summary',
        memberName: "Business",
        plan: "Business",
        amount: 0,
        date: new Date().toISOString(),
        status: "paid"
      },
    };

    members.forEach((member) => {
      const plan = member.plan;
      if (plan && planPayments[plan]) {
        planPayments[plan].amount += 30; // Default amount, should be fetched from plans table
      }
    });

    return Object.values(planPayments);
  };

  const getMonthlyPayments = (): Payment[] => {
    return members.map((member) => ({
      id: member.id,
      memberName: member.name,
      plan: member.plan,
      amount: 30, // Default amount, should be fetched from plans table
      date: member.payment_date || new Date().toISOString(),
      dueDate: member.due_date,
      status: member.payment_date ? "paid" : "pending"
    }));
  };

  const getYearlyPayments = (): Payment[] => {
    const yearlyTotal = members.reduce((acc) => acc + 30 * 12, 0);

    return [{
      id: 'yearly-summary',
      memberName: "Total Anual",
      plan: "Basic",
      amount: yearlyTotal,
      date: format(new Date(), "yyyy", { locale: ptBR }),
      status: "paid"
    }];
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Receita</h1>
        </div>

        <Tabs defaultValue="monthly" className="space-y-6">
          <TabsList>
            <TabsTrigger value="monthly">Mensal</TabsTrigger>
            <TabsTrigger value="yearly">Anual</TabsTrigger>
            <TabsTrigger value="by-plan">Por Plano</TabsTrigger>
          </TabsList>

          <TabsContent value="monthly" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Receita Mensal</CardTitle>
              </CardHeader>
              <CardContent>
                <PaymentHistoryTable payments={getMonthlyPayments()} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="yearly" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Receita Anual</CardTitle>
              </CardHeader>
              <CardContent>
                <PaymentHistoryTable payments={getYearlyPayments()} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="by-plan" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Receita por Plano</CardTitle>
              </CardHeader>
              <CardContent>
                <PaymentHistoryTable payments={getPaymentsByPlan()} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}