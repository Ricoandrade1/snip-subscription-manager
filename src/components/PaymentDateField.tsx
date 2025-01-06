import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./member-form/schema";
import { MemberStatus } from "@/contexts/types";

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
                
                // Força a atualização do status para 'pago' quando uma data é selecionada
                form.setValue('status', newStatus, {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true
                });
              }}
              className={`h-10 ${disabled ? 'bg-gray-100' : ''}`}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}