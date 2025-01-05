import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PaymentSummary } from "./PaymentSummary";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { Payment } from "@/contexts/types";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from "sonner";

interface RevenueInvoicesProps {
  payments: Payment[];
}

export function RevenueInvoices({ payments }: RevenueInvoicesProps) {
  const generatePDF = () => {
    try {
      const doc = new jsPDF();
      
      // Add header
      doc.setFontSize(20);
      doc.text("Relatório de Faturas", 14, 22);
      
      doc.setFontSize(11);
      doc.text(`Data de emissão: ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR })}`, 14, 32);

      // Prepare data for table
      const tableData = payments.map(payment => [
        payment.memberName,
        payment.plan,
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'EUR' }).format(payment.amount),
        format(new Date(payment.date), 'dd/MM/yyyy', { locale: ptBR }),
        payment.status === 'paid' ? 'Pago' : payment.status === 'pending' ? 'Pendente' : 'Atrasado'
      ]);

      // Add table
      autoTable(doc, {
        head: [['Cliente', 'Plano', 'Valor', 'Data', 'Status']],
        body: tableData,
        startY: 40,
        theme: 'grid',
        styles: {
          fontSize: 10,
          cellPadding: 5,
        },
        headStyles: {
          fillColor: [0, 0, 0],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
      });

      // Save PDF
      doc.save(`relatorio-faturas-${format(new Date(), 'dd-MM-yyyy')}.pdf`);
      toast.success("Relatório gerado com sucesso!");
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast.error("Erro ao gerar relatório");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-barber-gold">Faturas</h2>
        <Button onClick={generatePDF} variant="outline" className="bg-barber-black text-barber-light hover:bg-barber-gold hover:text-black">
          <FileDown className="mr-2 h-4 w-4" />
          Gerar Relatório
        </Button>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList className="bg-barber-gray w-full justify-start">
          <TabsTrigger value="pending" className="text-barber-light">
            Orçamento ({payments.filter(p => p.status === 'pending').length})
          </TabsTrigger>
          <TabsTrigger value="paid" className="text-barber-light">
            Emitidas ({payments.filter(p => p.status === 'paid').length})
          </TabsTrigger>
          <TabsTrigger value="due" className="text-barber-light">
            A Vencer ({payments.filter(p => p.status === 'pending').length})
          </TabsTrigger>
          <TabsTrigger value="recurring" className="text-barber-light">
            Recorrentes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <PaymentSummary 
            title="Orçamentos" 
            payments={payments.filter(p => p.status === 'pending')} 
          />
        </TabsContent>

        <TabsContent value="paid">
          <PaymentSummary 
            title="Faturas Emitidas" 
            payments={payments.filter(p => p.status === 'paid')} 
          />
        </TabsContent>

        <TabsContent value="due">
          <PaymentSummary 
            title="Faturas a Vencer" 
            payments={payments.filter(p => p.status === 'pending')} 
          />
        </TabsContent>

        <TabsContent value="recurring">
          <PaymentSummary 
            title="Faturas Recorrentes" 
            payments={payments.filter(p => p.status === 'paid')} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}