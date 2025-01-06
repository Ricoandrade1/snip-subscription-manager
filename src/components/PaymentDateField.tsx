import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./member-form/schema";
import { isAfter, parseISO } from "date-fns";

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
                const status = isAfter(date, today) ? 'pago' : 'atrasado';
                form.setValue('status', status as any);
              }}
              className="h-10"
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}