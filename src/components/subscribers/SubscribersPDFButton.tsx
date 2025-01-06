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

interface FieldOption {
  id: keyof Subscriber | 'payment_date' | 'bank_name' | 'iban';
  label: string;
}

const FIELD_OPTIONS: FieldOption[] = [
  { id: 'name', label: 'Nome' },
  { id: 'nickname', label: 'Apelido' },
  { id: 'phone', label: 'Telefone' },
  { id: 'nif', label: 'NIF' },
  { id: 'plan', label: 'Plano' },
  { id: 'payment_date', label: 'Data Pagamento' },
  { id: 'bank_name', label: 'Banco' },
  { id: 'iban', label: 'IBAN' },
  { id: 'created_at', label: 'Data de Cadastro' },
  { id: 'due_date', label: 'Data de Vencimento' },
  { id: 'last_plan_change', label: 'Última Mudança de Plano' }
];

export function SubscribersPDFButton({ subscribers }: SubscribersPDFButtonProps) {
  const [selectedFields, setSelectedFields] = useState<string[]>(['name', 'phone', 'plan', 'payment_date']);

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
      
      // Add header
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

      const tableData = subscribers.map(subscriber => {
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
            case 'created_at':
              return formatDate(subscriber.created_at);
            case 'due_date':
              return formatDate(subscriber.due_date);
            case 'last_plan_change':
              return formatDate(subscriber.last_plan_change);
            default:
              return '-';
          }
        });
      });

      // Add table
      autoTable(doc, {
        head: [headers],
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
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className="bg-barber-black text-barber-light hover:bg-barber-gold hover:text-black"
        >
          <FileDown className="mr-2 h-4 w-4" />
          Exportar PDF {subscribers.length > 0 && `(${subscribers.length})`}
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
            Gerar PDF
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}