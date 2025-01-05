import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PaymentSummary } from "./PaymentSummary";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { Payment } from "@/contexts/types";
import { addDays, isBefore, isAfter } from "date-fns";

interface RevenueMonthlyProps {
  payments: Payment[];
}

export function RevenueMonthly({ payments }: RevenueMonthlyProps) {
  const generatePDF = () => {
    // TODO: Implement PDF generation
    console.log("Generating PDF...");
  };

  const today = new Date();
  const twoDaysFromNow = addDays(today, 2);

  const paidPayments = payments.filter(p => p.status === 'paid');
  const overduePayments = payments.filter(p => p.status === 'overdue');
  const pendingPayments = payments.filter(p => {
    const paymentDate = new Date(p.payment_date);
    return p.status === 'pending' && isAfter(paymentDate, today) && isBefore(paymentDate, twoDaysFromNow);
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-barber-gold">Receita Mensal</h2>
        <Button onClick={generatePDF} variant="outline">
          <FileDown className="mr-2 h-4 w-4" />
          Gerar Relatório
        </Button>
      </div>

      <Tabs defaultValue="paid" className="space-y-4">
        <TabsList className="bg-barber-gray">
          <TabsTrigger value="paid" className="text-barber-light">Pagos</TabsTrigger>
          <TabsTrigger value="overdue" className="text-barber-light">Atrasados</TabsTrigger>
          <TabsTrigger value="pending" className="text-barber-light">Pendentes até 2 dias</TabsTrigger>
        </TabsList>

        <TabsContent value="paid">
          <PaymentSummary title="Pagamentos Realizados" payments={paidPayments} />
        </TabsContent>

        <TabsContent value="overdue">
          <PaymentSummary title="Pagamentos Atrasados" payments={overduePayments} />
        </TabsContent>

        <TabsContent value="pending">
          <PaymentSummary title="Pagamentos Pendentes" payments={pendingPayments} />
        </TabsContent>
      </Tabs>
    </div>
  );
}