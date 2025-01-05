import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PaymentSummary } from "./PaymentSummary";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { Payment } from "@/contexts/types";

interface RevenueInvoicesProps {
  payments: Payment[];
}

export function RevenueInvoices({ payments }: RevenueInvoicesProps) {
  const generatePDF = () => {
    // TODO: Implement PDF generation
    console.log("Generating PDF...");
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-barber-gold">Faturas</h2>
        <Button onClick={generatePDF} variant="outline">
          <FileDown className="mr-2 h-4 w-4" />
          Gerar Relatório
        </Button>
      </div>

      <Tabs defaultValue="budget" className="space-y-4">
        <TabsList className="bg-barber-gray">
          <TabsTrigger value="budget" className="text-barber-light">Orçamento</TabsTrigger>
          <TabsTrigger value="issued" className="text-barber-light">Emitidas</TabsTrigger>
          <TabsTrigger value="due" className="text-barber-light">A Vencer</TabsTrigger>
          <TabsTrigger value="recurring" className="text-barber-light">Recorrentes</TabsTrigger>
        </TabsList>

        <TabsContent value="budget">
          <PaymentSummary title="Orçamentos" payments={payments.filter(p => p.status === 'pending')} />
        </TabsContent>

        <TabsContent value="issued">
          <PaymentSummary title="Faturas Emitidas" payments={payments.filter(p => p.status === 'paid')} />
        </TabsContent>

        <TabsContent value="due">
          <PaymentSummary title="Faturas a Vencer" payments={payments.filter(p => p.status === 'pending')} />
        </TabsContent>

        <TabsContent value="recurring">
          <PaymentSummary title="Faturas Recorrentes" payments={payments.filter(p => p.status === 'paid')} />
        </TabsContent>
      </Tabs>
    </div>
  );
}