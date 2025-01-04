import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MonthlyRevenueChart } from "@/components/MonthlyRevenueChart";
import { PaymentStatusChart } from "@/components/PaymentStatusChart";
import { PaymentHistoryTable } from "@/components/PaymentHistoryTable";
import { useMemberContext } from "@/contexts/MemberContext";

export default function Revenue() {
  const { members } = useMemberContext();

  const recentPayments = members.flatMap((member) =>
    (member.paymentHistory || []).map((payment) => ({
      memberName: member.name,
      plan: member.plan,
      amount: payment.amount,
      date: payment.date,
      status: payment.status,
    }))
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  .slice(0, 10);

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-barber-gold">Receitas</h1>
          <p className="text-barber-light/60">
            Acompanhe as receitas e status de pagamentos
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Receita Mensal</CardTitle>
            </CardHeader>
            <CardContent>
              <MonthlyRevenueChart />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status dos Pagamentos</CardTitle>
            </CardHeader>
            <CardContent>
              <PaymentStatusChart />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Histórico de Pagamentos Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <PaymentHistoryTable payments={recentPayments} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}