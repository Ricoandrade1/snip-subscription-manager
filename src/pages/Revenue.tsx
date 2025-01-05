import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PaymentHistoryTable } from "@/components/PaymentHistoryTable";
import { useMemberContext } from "@/contexts/MemberContext";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Revenue() {
  const { members } = useMemberContext();

  // Calcular pagamentos por plano
  const getPaymentsByPlan = () => {
    const planPayments = {
      Basic: { memberName: "Basic", plan: "Basic", amount: 0 },
      Classic: { memberName: "Classic", plan: "Classic", amount: 0 },
      Business: { memberName: "Business", plan: "Business", amount: 0 },
    };

    members.forEach((member) => {
      const plan = member.plan as keyof typeof planPayments;
      if (plan && planPayments[plan]) {
        planPayments[plan].amount! += member.plans?.price || 0;
      }
    });

    return Object.values(planPayments);
  };

  // Calcular pagamentos mensais
  const getMonthlyPayments = () => {
    return members.map((member) => ({
      memberName: member.name,
      plan: member.plan,
      amount: member.plans?.price,
      date: member.payment_date,
      dueDate: member.due_date,
      status: member.payment_date ? "paid" : "pending",
    }));
  };

  // Calcular pagamentos anuais
  const getYearlyPayments = () => {
    const yearlyTotal = members.reduce((acc, member) => {
      return acc + (member.plans?.price || 0) * 12;
    }, 0);

    return [{
      memberName: "Total Anual",
      plan: "Todos os Planos",
      amount: yearlyTotal,
      date: format(new Date(), "yyyy", { locale: ptBR }),
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