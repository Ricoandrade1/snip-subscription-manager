import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { SubscriberFormData } from "./SubscriberForm";

interface BankingFieldsProps {
  form: UseFormReturn<SubscriberFormData>;
}

export function BankingFields({ form }: BankingFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="bank"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm">Banco</FormLabel>
            <FormControl>
              <Input placeholder="Nome do Banco" {...field} className="h-8" />
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
            <FormLabel className="text-sm">IBAN</FormLabel>
            <FormControl>
              <Input placeholder="PT50..." {...field} className="h-8" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="debitDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm">Data de Débito</FormLabel>
            <FormControl>
              <Input type="date" {...field} className="h-8" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}