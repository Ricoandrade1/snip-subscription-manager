import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./member-form/schema";
import { MemberStatus } from "@/contexts/types";
import { addDays, isBefore, isAfter } from "date-fns";

interface PaymentDateFieldProps {
  form: UseFormReturn<FormValues>;
  name?: keyof FormValues;
  label?: string;
  disabled?: boolean;
}

export function PaymentDateField({ 
  form, 
  name = "payment_date",
  label = "Data de Pagamento",
  disabled = false
}: PaymentDateFieldProps) {
  const calculateStatus = (paymentDate: Date | null): MemberStatus => {
    if (!paymentDate) return 'cancelado';
    
    const today = new Date();
    const thirtyDaysAgo = addDays(today, -30);
    const paymentDateObj = new Date(paymentDate);
    
    // Se a data de pagamento é no futuro ou hoje, status é pago
    if (isAfter(paymentDateObj, today) || paymentDateObj.toDateString() === today.toDateString()) {
      return 'pago';
    }
    
    // Se a data de pagamento está dentro dos últimos 30 dias (inclusive), status é pago
    if (!isBefore(paymentDateObj, thirtyDaysAgo)) {
      return 'pago';
    }
    
    // Se a data de pagamento é mais antiga que 30 dias, status é pendente
    return 'pendente';
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              type="date"
              {...field}
              disabled={disabled}
              value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
              onChange={(e) => {
                const date = e.target.value ? new Date(e.target.value) : null;
                
                // Atualiza o valor do campo
                field.onChange(date);
                
                // Se uma data foi selecionada, define o status como 'pago'
                // Se a data foi removida, define como 'cancelado'
                const newStatus = date ? 'pago' : 'cancelado';
                console.log('Data selecionada:', date);
                console.log('Status calculado:', newStatus);
                form.setValue('status', newStatus);
              }}
              className={`h-10 ${disabled ? 'bg-gray-100' : ''}`}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}