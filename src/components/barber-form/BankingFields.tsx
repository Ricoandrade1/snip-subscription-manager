import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface BankingFieldsProps {
  form: UseFormReturn<any>;
}

export function BankingFields({ form }: BankingFieldsProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="bankName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Banco</FormLabel>
            <FormControl>
              <Input placeholder="Nome do Banco" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="iban"
        render={({ field }) => (
          <FormItem>
            <FormLabel>IBAN</FormLabel>
            <FormControl>
              <Input placeholder="PT50..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="commissionRate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Taxa de Comissão (%)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                min="0"
                max="100"
                step="1"
                {...field}
                onChange={e => field.onChange(parseFloat(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}