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
      const headers = ['Nome', 'Telefone', 'NIF', 'IBAN', 'Plano', 'Status'];

      const tableData = subscribers.map(subscriber => [
        subscriber.name,
        subscriber.phone || '-',
        subscriber.nif || '-',
        subscriber.iban || '-',
        subscriber.plan,
        subscriber.status
      ]);

      // Add table with improved styling for better print layout
      autoTable(doc, {
        head: [headers],
        body: tableData,
        startY: 50,
        theme: 'grid',
        styles: {
          fontSize: 9,
          cellPadding: 3,
          lineColor: [200, 200, 200],
          lineWidth: 0.1,
        },
        headStyles: {
          fillColor: [51, 51, 51],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          halign: 'center',
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
        columnStyles: {
          0: { cellWidth: 'auto' },
          1: { cellWidth: 'auto' },
          2: { cellWidth: 'auto' },
        },
        margin: { top: 10, right: 10, bottom: 10, left: 10 },
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
      variant="outline" 
      className="bg-barber-black text-barber-light hover:bg-barber-gold hover:text-black"
    >
      <FileDown className="mr-2 h-4 w-4" />
      Exportar PDF ({subscribers.length})
    </Button>
  );
}