import { useMemberContext } from "@/contexts/MemberContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PaymentStatusChart } from "@/components/PaymentStatusChart";
import { PaymentHistoryTable } from "@/components/PaymentHistoryTable";
import { MonthlyRevenueChart } from "@/components/MonthlyRevenueChart";

export default function PaymentReports() {
  const { members } = useMemberContext();

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-barber-gold">
            Relatórios de Pagamento
          </h1>
          <p className="text-barber-light/60">
            Visualize e analise os pagamentos dos membros
          </p>
        </header>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full justify-start bg-barber-gray">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
            <TabsTrigger value="revenue">Receita</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-barber-gray border-barber-gold/20">
                <CardHeader>
                  <CardTitle>Status dos Pagamentos</CardTitle>
                  <CardDescription>
                    Distribuição dos status de pagamento
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PaymentStatusChart />
                </CardContent>
              </Card>

              <Card className="bg-barber-gray border-barber-gold/20">
                <CardHeader>
                  <CardTitle>Próximos Vencimentos</CardTitle>
                  <CardDescription>
                    Pagamentos com vencimento nos próximos 7 dias
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PaymentHistoryTable
                    payments={members
                      .filter(
                        (member) =>
                          new Date(member.nextPaymentDue || "") <=
                          new Date(
                            Date.now() + 7 * 24 * 60 * 60 * 1000
                          )
                      )
                      .map((member) => ({
                        memberName: member.name,
                        plan: member.plan,
                        dueDate: member.nextPaymentDue || "",
                      }))}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <Card className="bg-barber-gray border-barber-gold/20">
              <CardHeader>
                <CardTitle>Histórico de Pagamentos</CardTitle>
                <CardDescription>
                  Todos os pagamentos registrados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PaymentHistoryTable
                  payments={members
                    .flatMap((member) =>
                      (member.paymentHistory || []).map((payment) => ({
                        memberName: member.name,
                        plan: member.plan,
                        amount: payment.amount,
                        date: payment.date,
                        status: payment.status,
                      }))
                    )
                    .sort(
                      (a, b) =>
                        new Date(b.date).getTime() -
                        new Date(a.date).getTime()
                    )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="revenue" className="mt-6">
            <Card className="bg-barber-gray border-barber-gold/20">
              <CardHeader>
                <CardTitle>Receita Mensal</CardTitle>
                <CardDescription>
                  Análise da receita ao longo do tempo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MonthlyRevenueChart />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}