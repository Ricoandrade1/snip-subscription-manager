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

  const generatePDF = () => {
    try {
      const doc = new jsPDF();
      
      // Add header
      doc.setFontSize(20);
      doc.text("Relatório de Assinantes", 14, 22);
      
      doc.setFontSize(11);
      doc.text(`Data de emissão: ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR })}`, 14, 32);
      doc.text(`Total de assinantes: ${subscribers.length}`, 14, 42);

      // Prepare data for table
      const tableData = subscribers.map(subscriber => [
        subscriber.name,
        subscriber.phone || '-',
        subscriber.nif || '-',
        subscriber.plan,
        formatStatus(subscriber.status),
        subscriber.payment_date ? format(new Date(subscriber.payment_date), 'dd/MM/yyyy', { locale: ptBR }) : '-',
        subscriber.bank_name || '-',
        subscriber.iban || '-'
      ]);

      // Add table
      autoTable(doc, {
        head: [['Nome', 'Telefone', 'NIF', 'Plano', 'Status', 'Data Pagamento', 'Banco', 'IBAN']],
        body: tableData,
        startY: 50,
        theme: 'grid',
        styles: {
          fontSize: 8,
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
      doc.save(`relatorio-assinantes-${format(new Date(), 'dd-MM-yyyy')}.pdf`);
      toast.success("Relatório gerado com sucesso!");
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast.error("Erro ao gerar relatório");
    }
  };

  return (
    <Button 
      onClick={generatePDF} 
      variant="outline" 
      className="bg-barber-black text-barber-light hover:bg-barber-gold hover:text-black"
    >
      <FileDown className="mr-2 h-4 w-4" />
      Exportar PDF {subscribers.length > 0 && `(${subscribers.length})`}
    </Button>
  );
}