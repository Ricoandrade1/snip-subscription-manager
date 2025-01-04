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
        name="debitDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Data de Débito</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}