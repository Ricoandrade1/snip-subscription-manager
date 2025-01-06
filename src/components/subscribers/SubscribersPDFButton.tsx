import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from "sonner";
import { Subscriber } from "./types";

interface SubscribersPDFButtonProps {
  subscribers: Subscriber[];
}

export function SubscribersPDFButton({ subscribers }: SubscribersPDFButtonProps) {
  const formatStatus = (status: string) => {
    const statusMap: Record<string, string> = {
      pago: "Pago",
      pendente: "Pendente",
      cancelado: "Cancelado"
    };
    return statusMap[status] || status;
  };

  const formatDate = (date: string | null | undefined) => {
    if (!date) return '-';
    return format(new Date(date), 'dd/MM/yyyy', { locale: ptBR });
  };

  const generatePDF = () => {
    try {
      const doc = new jsPDF();
      
      // Add header with styling
      doc.setFontSize(20);
      doc.text("Relatório de Assinantes", 14, 22);
      
      doc.setFontSize(11);
      doc.text(`Data de emissão: ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR })}`, 14, 32);
      doc.text(`Total de assinantes: ${subscribers.length}`, 14, 42);

      // Define headers and data
      const headers = [
        'Nome', 
        'Telefone', 
        'NIF', 
        'Plano', 
        'Data Pagamento',
        'Próximo Pagamento',
        'Status'
      ];

      const tableData = subscribers.map(subscriber => {
        let nextPaymentDate = '-';
        if (subscriber.payment_date) {
          const date = new Date(subscriber.payment_date);
          date.setMonth(date.getMonth() + 1);
          nextPaymentDate = format(date, 'dd/MM/yyyy', { locale: ptBR });
        }

        return [
          subscriber.name || '-',
          subscriber.phone || '-',
          subscriber.nif || '-',
          subscriber.plan || '-',
          formatDate(subscriber.payment_date),
          nextPaymentDate,
          formatStatus(subscriber.status)
        ];
      });

      // Add table with improved styling
      autoTable(doc, {
        head: [headers],
        body: tableData,
        startY: 50,
        theme: 'grid',
        styles: {
          fontSize: 8,
          cellPadding: 2,
          lineColor: [200, 200, 200],
          lineWidth: 0.1,
        },
        headStyles: {
          fillColor: [51, 51, 51],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          halign: 'center',
        },
        columnStyles: {
          0: { cellWidth: 40 }, // Nome
          1: { cellWidth: 25 }, // Telefone
          2: { cellWidth: 20 }, // NIF
          3: { cellWidth: 20 }, // Plano
          4: { cellWidth: 25 }, // Data Pagamento
          5: { cellWidth: 25 }, // Próximo Pagamento
          6: { cellWidth: 20 }, // Status
        },
        margin: { top: 10 },
      });

      // Save PDF with formatted name
      doc.save(`relatorio-assinantes-${format(new Date(), 'dd-MM-yyyy-HH-mm')}.pdf`);
      toast.success("Relatório gerado com sucesso!");
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast.error("Erro ao gerar relatório");
    }
  };

  return (
    <Button 
      onClick={generatePDF}
      size="lg"
      className="bg-barber-gold hover:bg-barber-gold/90 text-black font-semibold shadow-lg transition-all duration-200 ease-in-out transform hover:scale-105"
    >
      <FileDown className="mr-2 h-5 w-5" />
      Exportar Resultados ({subscribers.length})
    </Button>
  );
}