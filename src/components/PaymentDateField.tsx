import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { SubscriberFormData } from "./SubscriberForm";

interface PaymentDateFieldProps {
  form: UseFormReturn<SubscriberFormData>;
}

export function PaymentDateField({ form }: PaymentDateFieldProps) {
  return (
    <FormField
      control={form.control}
      name="payment_date"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Data de Pagamento</FormLabel>
          <FormControl>
            <Input
              type="date"
              {...field}
              value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
              onChange={(e) => {
                const date = e.target.value ? new Date(e.target.value) : null;
                field.onChange(date);
              }}
              className="h-10"
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}