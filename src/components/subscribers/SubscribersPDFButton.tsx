import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from "sonner";
import { Subscriber } from "./types";
import { formatSubscriberData } from "./pdf/formatters";
import { tableHeaders, tableConfig } from "./pdf/pdfConfig";

interface SubscribersPDFButtonProps {
  subscribers: Subscriber[];
}

export function SubscribersPDFButton({ subscribers }: SubscribersPDFButtonProps) {
  const generatePDF = () => {
    try {
      const doc = new jsPDF();
      
      // Add header with styling
      doc.setFontSize(20);
      doc.text("Relatório de Assinantes", 14, 22);
      
      doc.setFontSize(11);
      doc.text(`Data de emissão: ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR })}`, 14, 32);
      doc.text(`Total de assinantes: ${subscribers.length}`, 14, 42);

      // Transform data and generate table
      const tableData = subscribers.map(formatSubscriberData);

      // Add table with styling
      autoTable(doc, {
        head: [tableHeaders],
        body: tableData,
        ...tableConfig
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