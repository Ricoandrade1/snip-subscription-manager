import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMemberContext } from "@/contexts/MemberContext";
import { format, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { RevenueInvoices } from "@/components/revenue/RevenueInvoices";
import { RevenueMonthly } from "@/components/revenue/RevenueMonthly";
import { RevenueYearly } from "@/components/revenue/RevenueYearly";
import { RevenuePlanForecast } from "@/components/revenue/RevenuePlanForecast";
import { usePayments } from "@/components/revenue/usePayments";

export default function Revenue() {
  const { members } = useMemberContext();
  const { payments } = usePayments();

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-barber-gold">Receita</h1>
        </div>

        <Tabs defaultValue="invoices" className="space-y-6">
          <TabsList className="bg-barber-gray">
            <TabsTrigger value="invoices" className="text-barber-light">Fatura</TabsTrigger>
            <TabsTrigger value="monthly" className="text-barber-light">Mensal</TabsTrigger>
            <TabsTrigger value="yearly" className="text-barber-light">Anual</TabsTrigger>
            <TabsTrigger value="by-plan" className="text-barber-light">Por Plano</TabsTrigger>
          </TabsList>

          <TabsContent value="invoices">
            <RevenueInvoices payments={payments} />
          </TabsContent>

          <TabsContent value="monthly">
            <RevenueMonthly payments={payments} />
          </TabsContent>

          <TabsContent value="yearly">
            <RevenueYearly payments={payments} />
          </TabsContent>

          <TabsContent value="by-plan">
            <RevenuePlanForecast members={members} payments={payments} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}