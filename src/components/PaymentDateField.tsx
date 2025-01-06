import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./member-form/schema";
import { isAfter, isBefore, parseISO, addDays } from "date-fns";

interface PaymentDateFieldProps {
  form: UseFormReturn<FormValues>;
  name?: keyof FormValues;
  label?: string;
}

export function PaymentDateField({ 
  form, 
  name = "payment_date",
  label = "Data de Pagamento" 
}: PaymentDateFieldProps) {
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
              value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
              onChange={(e) => {
                const date = new Date(e.target.value);
                console.log('Data selecionada:', date);
                field.onChange(date);
                
                // Atualiza o status automaticamente com base na data
                const today = new Date();
                const nextPaymentDate = addDays(date, 30); // Assume 30 days payment cycle
                
                let status: 'active' | 'inactive' | 'pending';
                
                if (isAfter(date, today)) {
                  status = 'active'; // Payment is in the future
                } else if (isBefore(today, nextPaymentDate)) {
                  status = 'pending'; // Within grace period
                } else {
                  status = 'inactive'; // Payment overdue
                }
                
                form.setValue('status', status);
              }}
              className="h-10"
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}