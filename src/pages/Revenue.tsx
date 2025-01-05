import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMemberContext } from "@/contexts/MemberContext";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Payment } from "@/contexts/types";
import { PaymentSummary } from "@/components/revenue/PaymentSummary";
import { usePayments } from "@/components/revenue/usePayments";

export default function Revenue() {
  const { members } = useMemberContext();
  const { payments } = usePayments();

  const getPaymentsByPlan = () => {
    const planPayments: Record<string, Payment> = {
      Basic: { 
        id: 'basic-summary',
        memberName: "Basic",
        plan: "Basic",
        amount: members.filter(m => m.plan === "Basic").length * 30,
        date: new Date().toISOString(),
        status: "paid"
      },
      Classic: {
        id: 'classic-summary',
        memberName: "Classic",
        plan: "Classic",
        amount: members.filter(m => m.plan === "Classic").length * 40,
        date: new Date().toISOString(),
        status: "paid"
      },
      Business: {
        id: 'business-summary',
        memberName: "Business",
        plan: "Business",
        amount: members.filter(m => m.plan === "Business").length * 50,
        date: new Date().toISOString(),
        status: "paid"
      },
    };

    return Object.values(planPayments);
  };

  const getMonthlyPayments = (): Payment[] => {
    return members.map((member) => ({
      id: member.id,
      memberName: member.name,
      plan: member.plan,
      amount: member.plan === "Basic" ? 30 : member.plan === "Classic" ? 40 : 50,
      date: member.payment_date || new Date().toISOString(),
      dueDate: member.due_date,
      status: member.payment_date ? "paid" : "pending"
    }));
  };

  const getYearlyPayments = (): Payment[] => {
    const yearlyTotal = members.reduce((acc, member) => {
      const monthlyAmount = member.plan === "Basic" ? 30 : member.plan === "Classic" ? 40 : 50;
      return acc + (monthlyAmount * 12);
    }, 0);

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

          <TabsContent value="monthly">
            <PaymentSummary title="Receita Mensal" payments={getMonthlyPayments()} />
          </TabsContent>

          <TabsContent value="yearly">
            <PaymentSummary title="Receita Anual" payments={getYearlyPayments()} />
          </TabsContent>

          <TabsContent value="by-plan">
            <PaymentSummary title="Receita por Plano" payments={getPaymentsByPlan()} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}