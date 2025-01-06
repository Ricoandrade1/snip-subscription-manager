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
    
    // Se a data de pagamento é no futuro
    if (isAfter(paymentDate, today)) {
      return 'pago';
    }
    
    // Se a data de pagamento está dentro dos últimos 30 dias
    if (isAfter(paymentDate, thirtyDaysAgo)) {
      return 'pago';
    }
    
    // Se a data de pagamento é mais antiga que 30 dias
    return 'cancelado';
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
                
                // Atualiza o status automaticamente com base na data
                if (date) {
                  const status = calculateStatus(date);
                  console.log('Data selecionada:', date);
                  console.log('Status calculado:', status);
                  form.setValue('status', status);
                } else {
                  form.setValue('status', 'cancelado');
                }
              }}
              className={`h-10 ${disabled ? 'bg-gray-100' : ''}`}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}