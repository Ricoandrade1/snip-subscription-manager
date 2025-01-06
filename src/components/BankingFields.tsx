import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { SubscriberFormData } from "./SubscriberForm";

interface BankingFieldsProps {
  form: UseFormReturn<SubscriberFormData>;
}

export function BankingFields({ form }: BankingFieldsProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="bankName"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-barber-light">Nome do Banco</FormLabel>
            <FormControl>
              <Input 
                placeholder="Nome do Banco" 
                {...field}
                className="bg-barber-gray border-barber-gold/20 focus:border-barber-gold"
              />
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
            <FormLabel className="text-barber-light">IBAN</FormLabel>
            <FormControl>
              <Input 
                placeholder="PT50..." 
                {...field}
                className="bg-barber-gray border-barber-gold/20 focus:border-barber-gold"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}