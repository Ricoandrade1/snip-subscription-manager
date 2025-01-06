import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./member-form/schema";

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
                field.onChange(date);
              }}
              className={`h-10 ${disabled ? 'bg-gray-100' : ''}`}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}