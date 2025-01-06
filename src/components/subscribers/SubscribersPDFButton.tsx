import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from "sonner";
import { Subscriber } from "./types";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface SubscribersPDFButtonProps {
  subscribers: Subscriber[];
}

const FIELD_OPTIONS = [
  { id: 'name', label: 'Nome' },
  { id: 'nickname', label: 'Apelido' },
  { id: 'phone', label: 'Telefone' },
  { id: 'nif', label: 'NIF' },
  { id: 'plan', label: 'Plano' },
  { id: 'payment_date', label: 'Data Pagamento' },
  { id: 'bank_name', label: 'Banco' },
  { id: 'iban', label: 'IBAN' },
  { id: 'status', label: 'Status' },
  { id: 'created_at', label: 'Data de Cadastro' },
  { id: 'due_date', label: 'Data de Vencimento' }
];

export function SubscribersPDFButton({ subscribers }: SubscribersPDFButtonProps) {
  const [selectedFields, setSelectedFields] = useState<string[]>(['name', 'phone', 'nif', 'iban', 'plan', 'status']);

  const formatDate = (date: string | null | undefined) => {
    if (!date) return '-';
    return format(new Date(date), 'dd/MM/yyyy', { locale: ptBR });
  };

  const generatePDF = () => {
    try {
      if (selectedFields.length === 0) {
        toast.error("Selecione pelo menos um campo para exportar");
        return;
      }

      const doc = new jsPDF();
      
      // Add header with styling
      doc.setFontSize(20);
      doc.text("Relatório de Assinantes", 14, 22);
      
      doc.setFontSize(11);
      doc.text(`Data de emissão: ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR })}`, 14, 32);
      doc.text(`Total de assinantes: ${subscribers.length}`, 14, 42);

      // Prepare headers and data based on selected fields
      const headers = selectedFields.map(field => {
        const option = FIELD_OPTIONS.find(opt => opt.id === field);
        return option?.label || field;
      });

      const tableData = subscribers.map((subscriber, index) => {
        return selectedFields.map(field => {
          switch (field) {
            case 'name':
              return subscriber.name;
            case 'nickname':
              return subscriber.nickname || '-';
            case 'phone':
              return subscriber.phone || '-';
            case 'nif':
              return subscriber.nif || '-';
            case 'plan':
              return subscriber.plan;
            case 'payment_date':
              return formatDate(subscriber.payment_date);
            case 'bank_name':
              return subscriber.bank_name || '-';
            case 'iban':
              return subscriber.iban || '-';
            case 'status':
              return subscriber.status;
            case 'created_at':
              return formatDate(subscriber.created_at);
            case 'due_date':
              return formatDate(subscriber.due_date);
            default:
              return '-';
          }
        });
      });

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
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className="bg-barber-black text-barber-light hover:bg-barber-gold hover:text-black"
        >
          <FileDown className="mr-2 h-4 w-4" />
          Exportar PDF ({subscribers.length})
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <h4 className="font-medium leading-none">Selecione os campos para exportar</h4>
          <div className="grid grid-cols-2 gap-4">
            {FIELD_OPTIONS.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox
                  id={option.id}
                  checked={selectedFields.includes(option.id)}
                  onCheckedChange={(checked) => {
                    setSelectedFields(old => 
                      checked 
                        ? [...old, option.id]
                        : old.filter(field => field !== option.id)
                    );
                  }}
                />
                <Label htmlFor={option.id}>{option.label}</Label>
              </div>
            ))}
          </div>
          <Button 
            onClick={generatePDF}
            className="w-full bg-barber-black text-barber-light hover:bg-barber-gold hover:text-black"
          >
            Gerar PDF com {subscribers.length} registros
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}